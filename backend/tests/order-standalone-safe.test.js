const test = require('node:test');
const assert = require('node:assert/strict');
const mongoose = require('mongoose');

const orderController = require('../src/controllers/orderController');
const Cart = require('../src/models/Cart');
const Product = require('../src/models/Product');
const Order = require('../src/models/Order');

test('createOrder does not depend on MongoDB transactions for standalone compatibility', async () => {
  const originalStartSession = mongoose.startSession;
  const originalFindOne = Cart.findOne;
  const originalFindById = Product.findById;
  const originalUpdateOne = Product.updateOne;
  const originalOrderCreate = Order.create;
  const originalFindOneAndUpdate = Cart.findOneAndUpdate;
  const originalPopulate = Order.populate;

  try {
    mongoose.startSession = () => {
      throw new Error('Standalone MongoDB should not require transactions');
    };

    const cartQuery = {
      populate() {
        return this;
      },
      session() {
        return this;
      },
    };

    Object.assign(cartQuery, {
      items: [
        {
          product: {
            _id: 'product-1',
            name: 'Velora Tee',
            stock: 10,
            variants: [{ size: 'M', color: 'Black', stock: 5 }],
          },
          quantity: 1,
          price: 120,
          size: 'M',
          color: 'Black',
        },
      ],
    });

    Cart.findOne = () => cartQuery;
    Product.findById = async () => ({
      _id: 'product-1',
      name: 'Velora Tee',
      stock: 10,
      variants: [{ size: 'M', color: 'Black', stock: 5 }],
    });
    Product.updateOne = async () => ({ modifiedCount: 1 });
    Order.create = async (payload) => {
      const order = {
        ...payload,
        _id: 'order-1',
        populate: async function populate() {
          this.orderItems = payload.orderItems.map((item) => ({
            ...item,
            product: { _id: item.product, name: 'Velora Tee' },
          }));
          return this;
        },
      };

      return order;
    };
    Cart.findOneAndUpdate = async () => ({ ok: 1 });
    Order.populate = async (doc) => doc;

    const req = {
      user: { _id: 'user-1' },
      body: { shippingAddress: { street: 'Main', city: 'Dubai', state: 'Dubai', country: 'UAE', zipCode: '0000' }, paymentMethod: 'COD' },
    };

    const res = {
      statusCode: 200,
      payload: null,
      status(code) {
        this.statusCode = code;
        return this;
      },
      json(payload) {
        this.payload = payload;
        return payload;
      },
    };

    await orderController.createOrder(req, res);

    assert.equal(res.statusCode, 201);
    assert.equal(res.payload.success, true);
    assert.equal(res.payload.data.paymentMethod, 'COD');
    assert.equal(res.payload.data.orderStatus, 'PENDING');
  } finally {
    mongoose.startSession = originalStartSession;
    Cart.findOne = originalFindOne;
    Product.findById = originalFindById;
    Product.updateOne = originalUpdateOne;
    Order.create = originalOrderCreate;
    Cart.findOneAndUpdate = originalFindOneAndUpdate;
    Order.populate = originalPopulate;
  }
});
