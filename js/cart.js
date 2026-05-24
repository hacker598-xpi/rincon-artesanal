class Cart {
  constructor() {
    this.key = 'elrincon_cart';
    this.items = this.load();
  }

  load() {
    const stored = localStorage.getItem(this.key);
    return stored ? JSON.parse(stored) : [];
  }

  save() {
    localStorage.setItem(this.key, JSON.stringify(this.items));
    window.dispatchEvent(new CustomEvent('cart-updated'));
  }

  add(product, quantity = 1) {
    const existing = this.items.find(item => item.id === product.id);
    if (existing) {
      existing.quantity += quantity;
    } else {
      this.items.push({ ...product, quantity });
    }
    this.save();
    this.updateCartCount();
  }

  remove(productId) {
    this.items = this.items.filter(item => item.id !== productId);
    this.save();
    this.updateCartCount();
  }

  updateQuantity(productId, quantity) {
    const item = this.items.find(i => i.id === productId);
    if (item) {
      item.quantity = Math.max(1, quantity);
      this.save();
      this.updateCartCount();
    }
  }

  getTotal() {
    return this.items.reduce((sum, item) => {
      let price = item.price;
      const tier = CONFIG.discounts.tiers.find(t => item.quantity >= t.minQty);
      if (tier) price = price * (1 - tier.discount);
      return sum + (price * item.quantity);
    }, 0);
  }

  clear() {
    this.items = [];
    this.save();
    this.updateCartCount();
  }

  updateCartCount() {
    const countEl = document.getElementById('cart-count');
    if (countEl) {
      const total = this.items.reduce((s, i) => s + i.quantity, 0);
      countEl.textContent = total;
      countEl.style.display = total > 0 ? 'flex' : 'none';
    }
  }
}

window.cart = new Cart();
