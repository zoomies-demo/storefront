import assert from 'node:assert/strict';
import test from 'node:test';
import { Cart, formatPounds } from './cart.js';

test('re-adding an item sums its quantity rather than adding a second line', () => {
  const cart = new Cart().add('mug', 799).add('mug', 799, 2);
  assert.equal(cart.itemCount, 3);
  assert.equal(cart.subtotalPence, 2397);
});

test('the same item at two prices is refused rather than quietly repriced', () => {
  const cart = new Cart().add('mug', 799);
  assert.throws(() => cart.add('mug', 899), /different price/);
});

test('money is whole pence, so a fractional price is refused', () => {
  assert.throws(() => new Cart().add('mug', 7.99), RangeError);
});

test('a discount rounds to the nearest penny, halves up', () => {
  // 10% of 1005p is 100.5p, which rounds up to 101p off.
  const cart = new Cart().add('print', 1005).applyDiscount(10);
  assert.equal(cart.totalPence, 904);
});

test('a second discount replaces the first instead of stacking', () => {
  const cart = new Cart().add('mug', 1000).applyDiscount(50).applyDiscount(10);
  assert.equal(cart.totalPence, 900);
});

test('removing the last line leaves an empty cart worth nothing', () => {
  const cart = new Cart().add('mug', 799).remove('mug');
  assert.equal(cart.itemCount, 0);
  assert.equal(cart.totalPence, 0);
});

test('prices format as pounds with two digits of pence', () => {
  assert.equal(formatPounds(1999), '£19.99');
  assert.equal(formatPounds(5), '£0.05');
  assert.equal(formatPounds(-250), '-£2.50');
});
