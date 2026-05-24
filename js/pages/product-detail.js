document.addEventListener('DOMContentLoaded', () => {
    const pageContainer = document.getElementById('product-page');
    if (!pageContainer) return;

    const isInPages = window.location.pathname.includes('/pages/');
    const basePath = isInPages ? '../' : '';

    const params = new URLSearchParams(window.location.search);
    const id = parseInt(params.get('id'));
    const product = CONFIG.products.find(p => p.id === id);

    if (!product) {
        pageContainer.innerHTML = `
            <div class="product-not-found">
                <svg width="96" height="96" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2">
                    <circle cx="12" cy="12" r="10"/><path d="M16 16s-1.5-2-4-2-4 2-4 2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/>
                </svg>
                <h2>Producto no encontrado</h2>
                <p>La pieza que buscas no está en nuestro catálogo. Prueba con otro producto.</p>
                <a href="products.html" class="btn btn-primary btn-lg">Ver catálogo</a>
            </div>
        `;
        return;
    }

    const images = product.images || [product.image];
    const mainImagePath = basePath + images[0];

    const relatedProducts = CONFIG.products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);

    pageContainer.innerHTML = `
        <div class="product-detail-layout reveal">
            <!-- Galería -->
            <div class="gallery-container">
                <div class="main-image-wrapper" id="main-image-wrapper">
                    <img id="main-image" src="${mainImagePath}" alt="${product.name}">
                    <span class="zoom-hint">Acerca el mouse para hacer zoom</span>
                </div>
                ${images.length > 1 ? `
                <div class="gallery-thumbs" id="gallery-thumbs">
                    ${images.map((img, i) => `
                        <div class="gallery-thumb ${i === 0 ? 'active' : ''}" data-index="${i}">
                            <img src="${basePath + img}" alt="${product.name} - Vista ${i+1}">
                        </div>
                    `).join('')}
                </div>` : ''}
            </div>

            <div class="product-info-panel">
                <div class="product-breadcrumb">
                    <a href="products.html">Productos</a> &rarr; ${product.category.charAt(0).toUpperCase() + product.category.slice(1)}
                </div>
                <h1 id="product-name">${product.name}</h1>
                <span class="product-category-tag">${product.style.charAt(0).toUpperCase() + product.style.slice(1)}</span>
                <div class="product-rating">
                    ★★★★★ <span>(12 valoraciones)</span>
                </div>
                <div class="product-price-section">
                    <span class="current-price"><span class="price-currency">$</span>${product.price} <small>CUP</small></span>
                    <div class="discount-info">
                        <h4>Descuentos por volumen</h4>
                        <ul id="discount-info">
                            ${CONFIG.discounts.tiers.map(t => `<li>${t.minQty}+ unidades: ${t.discount*100}% dto.</li>`).join('')}
                        </ul>
                    </div>
                </div>
                <p class="product-description" id="product-desc">${product.description}</p>

                <div class="stock-status ${product.inStock ? 'in-stock' : 'out-of-stock'}">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        ${product.inStock ? '<polyline points="20 6 9 17 4 12"/>' : '<circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>'}
                    </svg>
                    ${product.inStock ? 'Disponible' : 'Agotado'}
                </div>

                ${product.inStock ? `
                <div class="quantity-section">
                    <label for="quantity">Cantidad:</label>
                    <div class="quantity-control">
                        <button class="quantity-btn" id="qty-minus">−</button>
                        <input type="number" id="quantity" class="quantity-input" value="1" min="1" max="20">
                        <button class="quantity-btn" id="qty-plus">+</button>
                    </div>
                </div>
                <button id="add-to-cart" class="btn btn-primary btn-block">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
                    Añadir al carrito
                </button>
                ` : `
                <button class="btn btn-block" disabled>Producto agotado</button>
                `}
            </div>
        </div>

        <div class="product-extended reveal">
            <div class="extended-card">
                <h2>Descripción</h2>
                <p>${product.description} Esta pieza ha sido elaborada completamente a mano por nuestro maestro alfarero Luis Manuel, utilizando barro de la región y técnicas tradicionales cubanas. Cada detalle ha sido cuidado para ofrecerte una obra única que aporta calidez y autenticidad a cualquier espacio. El acabado ${product.style} combina perfectamente con ambientes ${product.category}, y su tamaño ${product.size} la hace ideal para el uso previsto. Gracias al horneado en horno de leña, la pieza adquiere una resistencia excepcional y esos matices naturales que solo el fuego puede otorgar.</p>
            </div>
            <div class="extended-card">
                <h2>Especificaciones</h2>
                <div class="specs-grid">
                    <div class="spec-item"><span class="spec-label">Material</span><span class="spec-value">Barro cocido</span></div>
                    <div class="spec-item"><span class="spec-label">Estilo</span><span class="spec-value">${product.style.charAt(0).toUpperCase() + product.style.slice(1)}</span></div>
                    <div class="spec-item"><span class="spec-label">Categoría</span><span class="spec-value">${product.category.charAt(0).toUpperCase() + product.category.slice(1)}</span></div>
                    <div class="spec-item"><span class="spec-label">Tamaño</span><span class="spec-value">${product.size.charAt(0).toUpperCase() + product.size.slice(1)}</span></div>
                    <div class="spec-item"><span class="spec-label">Origen</span><span class="spec-value">La Habana, Cuba</span></div>
                    <div class="spec-item"><span class="spec-label">Garantía</span><span class="spec-value">Calidad artesanal</span></div>
                </div>
            </div>
        </div>

        ${relatedProducts.length > 0 ? `
        <div class="related-products reveal">
            <h2>También te puede interesar</h2>
            <div class="related-grid">
                ${relatedProducts.map(rp => `
                    <div class="product-card">
                        <div class="image-wrapper">
                            <img src="${basePath + rp.image}" alt="${rp.name}" loading="lazy">
                        </div>
                        <div class="product-info">
                            <h3>${rp.name}</h3>
                            <p>${rp.description}</p>
                            <span class="price">$${rp.price} CUP</span>
                            <a href="product-detail.html?id=${rp.id}" class="btn btn-primary">Ver</a>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>` : ''}

        <div class="product-extended reveal">
            <div class="product-testimonial">
                <div class="testimonial-avatar">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 4-7 8-7s8 3 8 7"/></svg>
                </div>
                <div class="testimonial-content">
                    <p>"Compré esta pieza y quedé maravillada. La calidad es excepcional y combina perfecto en mi sala. Definitivamente volveré a comprar."</p>
                    <span class="testimonial-author">— Claudia M., La Habana</span>
                </div>
            </div>
            <div class="product-testimonial">
                <div class="testimonial-avatar">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 4-7 8-7s8 3 8 7"/></svg>
                </div>
                <div class="testimonial-content">
                    <p>"El diseño superó mis expectativas. Además, el envío llegó rápido y en perfecto estado. ¡Totalmente recomendado!"</p>
                    <span class="testimonial-author">— Fernando G., Matanzas</span>
                </div>
            </div>
        </div>
    `;

    if (product.inStock) {
        const qtyInput = document.getElementById('quantity');
        const qtyMinus = document.getElementById('qty-minus');
        const qtyPlus = document.getElementById('qty-plus');
        const addToCartBtn = document.getElementById('add-to-cart');

        qtyMinus.addEventListener('click', () => {
            let val = parseInt(qtyInput.value) || 1;
            if (val > 1) qtyInput.value = --val;
        });
        qtyPlus.addEventListener('click', () => {
            let val = parseInt(qtyInput.value) || 1;
            qtyInput.value = ++val;
        });
        qtyInput.addEventListener('change', () => {
            let val = parseInt(qtyInput.value);
            if (isNaN(val) || val < 1) qtyInput.value = 1;
        });

        addToCartBtn.addEventListener('click', () => {
            const qty = parseInt(qtyInput.value) || 1;
            cart.add(product, qty);
            alert(`"${product.name}" añadido al carrito (${qty} uds.)`);
        });
    }

    const thumbs = document.querySelectorAll('.gallery-thumb');
    const mainImg = document.getElementById('main-image');
    if (thumbs.length > 0) {
        thumbs.forEach(thumb => {
            thumb.addEventListener('click', () => {
                const index = parseInt(thumb.getAttribute('data-index'));
                const newSrc = basePath + images[index];
                mainImg.src = newSrc;
                document.querySelectorAll('.gallery-thumb').forEach(t => t.classList.remove('active'));
                thumb.classList.add('active');
            });
        });
    }

    const revealElements = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    revealElements.forEach(el => observer.observe(el));
});
