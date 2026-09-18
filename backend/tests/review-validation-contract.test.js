const test = require('node:test');
const assert = require('node:assert/strict');
const { validationResult } = require('express-validator');
const { validateReview, handleValidationErrors } = require('../src/middleware/validation');

test('review validation returns the real backend validation message instead of a generic string', async () => {
  const req = {
    body: {
      rating: 0,
      comment: 'short',
    },
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

  const next = () => {};

  await validateReview[0](req, res, next);
  await validateReview[1](req, res, next);

  const errors = validationResult(req);
  assert.equal(errors.isEmpty(), false);

  handleValidationErrors(req, res, next);

  assert.equal(res.statusCode, 400);
  assert.equal(res.payload.success, false);
  assert.match(res.payload.message, /Rating must be between 1 and 5|Comment must be at least 10 characters/);
  assert.ok(Array.isArray(res.payload.errors));
  assert.ok(res.payload.errors.length >= 1);
});
