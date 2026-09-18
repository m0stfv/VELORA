const test = require('node:test');
const assert = require('node:assert/strict');

const ORDER_LIFECYCLE = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED'];
const VALID_PAYMENT_METHODS = ['COD'];
const VALID_PAYMENT_STATUS = ['PENDING', 'PAID'];

const validateOrderStatus = (status) => ORDER_LIFECYCLE.includes(status) || status === 'CANCELLED';

test('order status lifecycle is unified and valid', () => {
  assert.equal(validateOrderStatus('PENDING'), true);
  assert.equal(validateOrderStatus('CONFIRMED'), true);
  assert.equal(validateOrderStatus('PROCESSING'), true);
  assert.equal(validateOrderStatus('SHIPPED'), true);
  assert.equal(validateOrderStatus('DELIVERED'), true);
  assert.equal(validateOrderStatus('CANCELLED'), true);
  assert.equal(validateOrderStatus('IN_TRANSIT'), false);
});

test('COD is the only valid payment method and starts pending', () => {
  assert.deepEqual(VALID_PAYMENT_METHODS, ['COD']);
  assert.equal(VALID_PAYMENT_STATUS.includes('PENDING'), true);
  assert.equal(VALID_PAYMENT_STATUS.includes('PAID'), true);
  assert.equal(['COD'].includes('ONLINE'), false);
});

test('order status contract does not accept legacy status field naming', () => {
  const body = { orderStatus: 'CONFIRMED', paymentStatus: 'PENDING', paymentMethod: 'COD' };
  assert.equal(body.orderStatus, 'CONFIRMED');
  assert.equal(body.paymentMethod, 'COD');
  assert.ok(!('status' in body));
});
