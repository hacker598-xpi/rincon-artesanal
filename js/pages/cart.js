document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('cart-container');
    const isInPages = window.location.pathname.includes('/pages/');
    const basePath = isInPages ? '../' : '';

    const staticReveals = document.querySelectorAll('.reveal');
    const staticObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                staticObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    staticReveals.forEach(el => staticObserver.observe(el));

    function renderCart() {
        if (!window.cart || cart.items.length === 0) {
            container.innerHTML = `
                <div class="cart-empty">
                    <svg width="96" height="96" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" aria-hidden="true">
                        <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                    </svg>
                    <h2>Tu carrito está vacío</h2>
                    <p>Parece que aún no has añadido ninguna pieza artesanal.</p>
                    <a href="products.html" class="btn btn-primary btn-lg">Explorar catálogo</a>
                </div>
            `;
            return;
        }

        const itemsHtml = cart.items.map((item, index) => {
            const tier = CONFIG.discounts.tiers.find(t => item.quantity >= t.minQty);
            const unitPrice = tier ? item.price * (1 - tier.discount) : item.price;
            const subtotal = unitPrice * item.quantity;
            const imagePath = item.image ? `${basePath}${item.image}` : '';

            return `
                <div class="cart-item-card" data-index="${index}">
                    <div class="cart-item-image">
                        <img src="${imagePath}" alt="${item.name}" loading="lazy" onerror="this.style.display='none'">
                    </div>
                    <div class="cart-item-details">
                        <h3>${item.name}</h3>
                        <div class="cart-item-meta">
                            <span class="unit-price">$${unitPrice.toFixed(2)} CUP / u.</span>
                            ${tier ? `<span class="summary-discount">-${(tier.discount * 100).toFixed(0)}% por volumen</span>` : ''}
                        </div>
                        <div class="cart-item-actions">
                            <div class="quantity-control">
                                <button class="quantity-btn" onclick="changeQuantity(${item.id}, ${item.quantity - 1})">−</button>
                                <input type="number" class="quantity-input" value="${item.quantity}" min="1" 
                                       onchange="changeQuantity(${item.id}, this.value)" 
                                       onkeydown="if(event.key==='Enter'){changeQuantity(${item.id}, this.value)}">
                                <button class="quantity-btn" onclick="changeQuantity(${item.id}, ${item.quantity + 1})">+</button>
                            </div>
                            <button class="btn-remove" title="Eliminar" onclick="removeItem(${item.id})">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
                            </button>
                        </div>
                    </div>
                    <div class="item-subtotal">$${subtotal.toFixed(2)}</div>
                </div>
            `;
        }).join('');

        const subtotalSinDescuento = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const totalPagar = cart.getTotal();
        const descuentoAplicado = subtotalSinDescuento - totalPagar;

        container.innerHTML = `
            <div class="cart-layout">
                <div class="cart-items-list">
                    ${itemsHtml}
                </div>
                <aside class="cart-summary">
                    <h2>Resumen del pedido</h2>
                    <div class="summary-row">
                        <span>Subtotal (${cart.items.reduce((s, i) => s + i.quantity, 0)} artículos)</span>
                        <span>$${subtotalSinDescuento.toFixed(2)}</span>
                    </div>
                    ${descuentoAplicado > 0 ? `
                        <div class="summary-row summary-discount">
                            <span>Descuento por volumen</span>
                            <span>-$${descuentoAplicado.toFixed(2)}</span>
                        </div>
                    ` : ''}
                    <div class="summary-row total">
                        <span>Total a pagar</span>
                        <span>$${totalPagar.toFixed(2)} CUP</span>
                    </div>
                    <button id="checkout-btn" class="btn btn-primary btn-block">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right:0.5rem;"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                        Realizar pedido por WhatsApp y SMS
                    </button>
                    <p class="summary-note">Recibirás un mensaje directo para confirmar tu pedido.</p>
                </aside>
            </div>
        `;

        const checkoutBtn = document.getElementById('checkout-btn');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => {
                if (cart.items.length === 0) return alert('Carrito vacío');
                openModal('order-modal');
            });
        }
    }

    window.changeQuantity = function(id, newQty) {
        newQty = parseInt(newQty) || 1;
        if (newQty < 1) newQty = 1;
        cart.updateQuantity(id, newQty);
        renderCart();
    };

    window.removeItem = function(id) {
        const card = document.querySelector(`.cart-item-card[data-index]`);
        if (card) {
            const allCards = document.querySelectorAll('.cart-item-card');
            allCards.forEach(c => {
                if (c.querySelector('.btn-remove') && c.querySelector('.btn-remove').onclick && 
                    c.querySelector('.btn-remove').getAttribute('onclick') && 
                    c.querySelector('.btn-remove').getAttribute('onclick').includes(id)) {
                    c.classList.add('removing');
                    setTimeout(() => {
                        cart.remove(id);
                        renderCart();
                    }, 300);
                }
            });
            if (!document.querySelector('.cart-item-card.removing')) {
                cart.remove(id);
                renderCart();
            }
        } else {
            cart.remove(id);
            renderCart();
        }
    };

    renderCart();

    if (window.cart && typeof window.cart.updateCartCount === 'function') {
        window.cart.updateCartCount();
    }
});
