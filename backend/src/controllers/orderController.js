const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const { calculateShipping } = require('../utils/shipping');
const StoreSettings = require('../models/StoreSettings');

const getAvailableStock = (product, size = '', color = '') => {
  if (Array.isArray(product.variants) && product.variants.length > 0) {
    const variant = product.variants.find(
      (item) =>
        String(item.size || '').toLowerCase() === String(size || '').toLowerCase() &&
        String(item.color || '').toLowerCase() === String(color || '').toLowerCase()
    );
    return variant ? Number(variant.stock || 0) : 0;
  }
  return Number(product.stock || 0);
};

const reduceProductStock = async (product, quantity, size = '', color = '') => {
  const normalizedQuantity = Number(quantity || 0);

  if (!product || normalizedQuantity <= 0) {
    throw new Error('Invalid product quantity');
  }

  const variantMatch = Array.isArray(product.variants) && product.variants.length > 0
    ? product.variants.find(
        (variant) =>
          String(variant.size || '').toLowerCase() === String(size || '').toLowerCase() &&
          String(variant.color || '').toLowerCase() === String(color || '').toLowerCase()
      )
    : null;

  if (variantMatch) {
    const currentStock = Number(variantMatch.stock || 0);
    if (currentStock < normalizedQuantity) {
      throw new Error(`Insufficient stock for ${product.name}`);
    }

    const result = await Product.updateOne(
      {
        _id: product._id,
        variants: {
          $elemMatch: {
            size: variantMatch.size,
            color: variantMatch.color,
            stock: { $gte: normalizedQuantity },
          },
        },
      },
      { $inc: { 'variants.$.stock': -normalizedQuantity } }
    );

    if (result.modifiedCount !== 1) {
      throw new Error(`Insufficient stock for ${product.name}`);
    }

    return;
  }

  const currentStock = Number(product.stock || 0);
  if (currentStock < normalizedQuantity) {
    throw new Error(`Insufficient stock for ${product.name}`);
  }

  const result = await Product.updateOne(
    { _id: product._id, stock: { $gte: normalizedQuantity } },
    { $inc: { stock: -normalizedQuantity } }
  );

  if (result.modifiedCount !== 1) {
    throw new Error(`Insufficient stock for ${product.name}`);
  }
};

const restoreProductStock = async (product, quantity, size = '', color = '') => {
  const normalizedQuantity = Number(quantity || 0);

  if (!product || normalizedQuantity <= 0) {
    return;
  }

  if (Array.isArray(product.variants) && product.variants.length > 0) {
    const matchedVariant = product.variants.find(
      (variant) =>
        String(variant.size || '').toLowerCase() === String(size || '').toLowerCase() &&
        String(variant.color || '').toLowerCase() === String(color || '').toLowerCase()
    );

    if (matchedVariant) {
      await Product.updateOne(
        { _id: product._id, 'variants.size': matchedVariant.size, 'variants.color': matchedVariant.color },
        { $inc: { 'variants.$.stock': normalizedQuantity } }
      );
      return;
    }
  }

  await Product.updateOne(
    { _id: product._id },
    { $inc: { stock: normalizedQuantity } }
  );
};

// CREATE order
const createOrder = async (req, res) => {
  try {
    const { shippingAddress, paymentMethod } = req.body;
    const normalizedPaymentMethod = paymentMethod || 'COD';
    let storeSettings = {};
    try {
      storeSettings = (await StoreSettings.findOne({ key: 'default' }).lean()) || {};
    } catch (error) {
      storeSettings = {};
    }

    if (normalizedPaymentMethod === 'COD' && storeSettings?.codEnabled === false) {
      return res.status(400).json({ success: false, message: 'Cash on delivery is currently unavailable' });
    }

    if (normalizedPaymentMethod !== 'COD') {
      return res.status(400).json({
        success: false,
        message: 'Only Cash on Delivery is supported.',
      });
    }

    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Cart is empty',
      });
    }

    for (const item of cart.items) {
      const product = item.product;
      if (!product) {
        throw new Error(`Product not found for selected item`);
      }

      const availableStock = getAvailableStock(product, item.size, item.color);
      if (availableStock < item.quantity) {
        throw new Error(`Insufficient stock for ${product.name}`);
      }
    }

    const deductedItems = [];

    try {
      for (const item of cart.items) {
        const product = item.product;
        await reduceProductStock(product, item.quantity, item.size, item.color);
        deductedItems.push({ product, quantity: item.quantity, size: item.size || '', color: item.color || '' });
      }

      const orderItems = cart.items.map((item) => ({
        product: item.product._id,
        quantity: item.quantity,
        price: item.price,
        size: item.size || '',
        color: item.color || '',
      }));

      const subtotal = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const shippingCost = await calculateShipping(subtotal);
      const totalPrice = subtotal + shippingCost;

      const order = await Order.create({
        user: req.user._id,
        orderItems,
        shippingAddress,
        paymentMethod: 'COD',
        paymentStatus: 'PENDING',
        orderStatus: 'PENDING',
        subtotal,
        shippingCost,
        totalPrice,
      });

      await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] });
      await order.populate('orderItems.product');

      res.status(201).json({
        success: true,
        message: 'Order placed successfully',
        data: order,
      });
    } catch (error) {
      for (const item of deductedItems.reverse()) {
        await restoreProductStock(item.product, item.quantity, item.size, item.color);
      }

      throw error;
    }
  } catch (error) {
    if (error.message === 'Cart is empty' || error.message.includes('Insufficient stock') || error.message.includes('Product not found')) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create order',
    });
  }
};

// GET user's orders
const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('orderItems.product')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: 'Orders fetched successfully',
      data: orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch orders',
    });
  }
};

// GET single order
const getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('orderItems.product');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    // Check if order belongs to user (unless user is admin)
    if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        message: 'Access denied',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Order fetched successfully',
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch order',
    });
  }
};

// UPDATE order status (Admin only)
const updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus, paymentStatus } = req.body;

    let order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    if (orderStatus) {
      order.orderStatus = orderStatus;
    }

    if (paymentStatus) {
      order.paymentStatus = paymentStatus;
    }

    await order.save();

    res.status(200).json({
      success: true,
      message: 'Order status updated',
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update order status',
    });
  }
};

// GET all orders (Admin only)
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email')
      .populate('orderItems.product')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: 'All orders fetched successfully',
      data: orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch orders',
    });
  }
};

module.exports = {
  createOrder,
  getUserOrders,
  getOrder,
  updateOrderStatus,
  getAllOrders,
};
