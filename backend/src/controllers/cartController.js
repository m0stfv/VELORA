const Cart = require('../models/Cart');
const Product = require('../models/Product');
const { calculateShipping } = require('../utils/shipping');

const sameVariant = (item, productId, size = '', color = '') =>
  item.product.toString() === productId.toString() &&
  (item.size || '') === (size || '') &&
  (item.color || '') === (color || '');

const getAvailableStock = (product, size = '', color = '') => {
  if (Array.isArray(product.variants) && product.variants.length > 0) {
    const matched = product.variants.find(
      (variant) =>
        String(variant.size || '').toLowerCase() === String(size || '').toLowerCase() &&
        String(variant.color || '').toLowerCase() === String(color || '').toLowerCase()
    );
    return matched ? Number(matched.stock || 0) : 0;
  }
  return Number(product.stock || 0);
};

const formatCart = async (cart) => {
  const items = cart?.items || [];
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingCost = await calculateShipping(subtotal);
  return {
    items,
    subtotal,
    shippingCost,
    total: subtotal + shippingCost,
  };
};

const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate('items.product');

    if (!cart) {
      return res.status(200).json({
        success: true,
        message: 'Cart fetched successfully',
        data: await formatCart(null),
      });
    }

    res.status(200).json({
      success: true,
      message: 'Cart fetched successfully',
      data: await formatCart(cart),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch cart',
    });
  }
};

const addToCart = async (req, res) => {
  try {
    const { productId, quantity, size = '', color = '' } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    const availableStock = getAvailableStock(product, size, color);
    if (availableStock < quantity) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient stock for the selected size and color',
      });
    }

    if (product.sizes?.length && !product.sizes.includes(size)) {
      return res.status(400).json({
        success: false,
        message: 'Please choose a size',
      });
    }

    let cart = await Cart.findOne({ user: req.user._id });
    const line = {
      product: productId,
      quantity,
      price: product.discountPrice || product.price,
      size,
      color,
    };

    if (!cart) {
      cart = await Cart.create({
        user: req.user._id,
        items: [line],
      });
    } else {
      const existingItem = cart.items.find((item) => sameVariant(item, productId, size, color));

      if (existingItem) {
        const newQuantity = existingItem.quantity + quantity;
        const availableStock = getAvailableStock(product, size, color);
        if (availableStock < newQuantity) {
          return res.status(400).json({
            success: false,
            message: 'Insufficient stock for the selected size and color',
          });
        }
        existingItem.quantity = newQuantity;
      } else {
        cart.items.push(line);
      }

      await cart.save();
    }

    await cart.populate('items.product');

    res.status(201).json({
      success: true,
      message: 'Product added to cart',
      data: await formatCart(cart),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to add to cart',
    });
  }
};

const updateCartItem = async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity, size = '', color = '' } = req.body;

    if (quantity < 1) {
      return res.status(400).json({
        success: false,
        message: 'Quantity must be at least 1',
      });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    const availableStock = getAvailableStock(product, size, color);
    if (availableStock < quantity) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient stock for the selected size and color',
      });
    }

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found',
      });
    }

    const item = cart.items.find((item) => sameVariant(item, productId, size, color));

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Product not in cart',
      });
    }

    item.quantity = quantity;
    await cart.save();
    await cart.populate('items.product');

    res.status(200).json({
      success: true,
      message: 'Cart item updated',
      data: await formatCart(cart),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update cart',
    });
  }
};

const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;
    const { size = '', color = '' } = req.query;

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found',
      });
    }

    cart.items = cart.items.filter((item) => !sameVariant(item, productId, size, color));
    await cart.save();
    await cart.populate('items.product');

    res.status(200).json({
      success: true,
      message: 'Product removed from cart',
      data: await formatCart(cart),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to remove from cart',
    });
  }
};

const clearCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found',
      });
    }

    cart.items = [];
    await cart.save();

    res.status(200).json({
      success: true,
      message: 'Cart cleared',
      data: await formatCart(cart),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to clear cart',
    });
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
};
