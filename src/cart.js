// A shopping cart that keeps its money in whole pence. Floats are how a 0.1
// plus 0.2 order ends up one penny out, so nothing here ever holds one.

export class Cart {
  #lines = new Map();
  #discount = 0;

  /** Add `quantity` of an item priced at `pricePence`. Re-adding sums the quantity. */
  add(sku, pricePence, quantity = 1) {
    if (!Number.isInteger(pricePence) || pricePence < 0) {
      throw new RangeError(`price for ${sku} must be a whole number of pence`);
    }
    if (!Number.isInteger(quantity) || quantity < 1) {
      throw new RangeError(`quantity for ${sku} must be a positive whole number`);
    }
    const line = this.#lines.get(sku);
    if (line && line.pricePence !== pricePence) {
      throw new Error(`${sku} is already in the cart at a different price`);
    }
    this.#lines.set(sku, { pricePence, quantity: (line?.quantity ?? 0) + quantity });
    return this;
  }

  remove(sku) {
    this.#lines.delete(sku);
    return this;
  }

  /** Take a percentage off the whole cart, 0 to 100. A second call replaces the first. */
  applyDiscount(percent) {
    if (!Number.isInteger(percent) || percent < 0 || percent > 100) {
      throw new RangeError('a discount is a whole percentage from 0 to 100');
    }
    this.#discount = percent;
    return this;
  }

  get itemCount() {
    let n = 0;
    for (const { quantity } of this.#lines.values()) n += quantity;
    return n;
  }

  get subtotalPence() {
    let sum = 0;
    for (const { pricePence, quantity } of this.#lines.values()) sum += pricePence * quantity;
    return sum;
  }

  /** The total after the discount, rounded to the nearest penny, halves up. */
  get totalPence() {
    const off = Math.round((this.subtotalPence * this.#discount) / 100);
    return this.subtotalPence - off;
  }
}

/** Format pence as pounds, for display only: 1999 becomes "£19.99". */
export function formatPounds(pence) {
  const sign = pence < 0 ? '-' : '';
  const abs = Math.abs(pence);
  return `${sign}£${Math.floor(abs / 100)}.${String(abs % 100).padStart(2, '0')}`;
}
