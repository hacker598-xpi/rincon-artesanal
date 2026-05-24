document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('all-products');
    const noResults = document.getElementById('no-results');
    const clearFiltersBtn = document.getElementById('clear-filters');
    const clearFiltersEmptyBtn = document.getElementById('clear-filters-empty');
    const searchInput = document.getElementById('search-input');
    const filterCategory = document.getElementById('filter-category');
    const filterStyle = document.getElementById('filter-style');
    const filterSize = document.getElementById('filter-size');
    const sortOrder = document.getElementById('sort-order');
    const resultsCount = document.getElementById('results-count');

    if (!container || !window.CONFIG || !window.CONFIG.products) {
        if (container) container.innerHTML = '<p>Error: no se pudo cargar la información de productos.</p>';
        return;
    }

    const productos = window.CONFIG.products;
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

    function populateFilters() {
        const categories = [...new Set(productos.map(p => p.category))];
        const styles = [...new Set(productos.map(p => p.style))];
        const sizes = [...new Set(productos.map(p => p.size))];

        populateSelect(filterCategory, categories);
        populateSelect(filterStyle, styles);
        populateSelect(filterSize, sizes);
    }

    function populateSelect(selectEl, options) {
        const defaultOption = selectEl.querySelector('option[value=""]');
        selectEl.innerHTML = '';
        if (defaultOption) selectEl.appendChild(defaultOption.cloneNode(true));
        else {
            const opt = document.createElement('option');
            opt.value = '';
            opt.textContent = 'Todos';
            selectEl.appendChild(opt);
        }
        options.sort().forEach(value => {
            const opt = document.createElement('option');
            opt.value = value;
            opt.textContent = value.charAt(0).toUpperCase() + value.slice(1);
            selectEl.appendChild(opt);
        });
    }

    function getFilteredProducts() {
        let filtered = [...productos];

        const searchTerm = searchInput.value.trim().toLowerCase();
        if (searchTerm) {
            filtered = filtered.filter(p =>
                p.name.toLowerCase().includes(searchTerm) ||
                p.description.toLowerCase().includes(searchTerm) ||
                (p.category && p.category.toLowerCase().includes(searchTerm)) ||
                (p.style && p.style.toLowerCase().includes(searchTerm))
            );
        }

        const cat = filterCategory.value;
        if (cat) filtered = filtered.filter(p => p.category === cat);

        const sty = filterStyle.value;
        if (sty) filtered = filtered.filter(p => p.style === sty);

        const siz = filterSize.value;
        if (siz) filtered = filtered.filter(p => p.size === siz);

        const sort = sortOrder.value;
        switch (sort) {
            case 'price-asc':
                filtered.sort((a, b) => a.price - b.price);
                break;
            case 'price-desc':
                filtered.sort((a, b) => b.price - a.price);
                break;
            case 'name-asc':
                filtered.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'name-desc':
                filtered.sort((a, b) => b.name.localeCompare(a.name));
                break;
            case 'default':
            default:
                filtered.sort((a, b) => {
                    if (a.featured && !b.featured) return -1;
                    if (!a.featured && b.featured) return 1;
                    return a.price - b.price;
                });
                break;
        }

        return filtered;
    }

    function renderProducts() {
        const filtered = getFilteredProducts();
        resultsCount.textContent = `${filtered.length} pieza${filtered.length !== 1 ? 's' : ''}`;

        if (filtered.length === 0) {
            container.innerHTML = '';
            container.style.display = 'none';
            noResults.style.display = 'block';
            return;
        }

        noResults.style.display = 'none';
        container.style.display = 'grid';

        container.innerHTML = filtered.map(p => `
            <div class="product-card ${!p.inStock ? 'out-of-stock' : ''} reveal">
                <div class="image-wrapper">
                    <img src="${basePath}${p.image}" alt="${p.name}" loading="lazy">
                    ${p.inStock ? `
                        <button class="quick-add" title="Añadir al carrito" onclick="event.stopPropagation(); addToCartFromPage(${p.id})">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
                        </button>
                    ` : ''}
                </div>
                <div class="product-info">
                    <h3>${p.name}</h3>
                    <p>${p.description}</p>
                    <span class="price">$${p.price} CUP</span>
                    <a href="product-detail.html?id=${p.id}" class="btn btn-primary">Ver detalle</a>
                </div>
            </div>
        `).join('');

        observeRevealItems();
    }

    function observeRevealItems() {
        const revealItems = document.querySelectorAll('.products-grid .reveal');
        const cardObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    cardObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        revealItems.forEach(el => cardObserver.observe(el));
    }

    function clearAllFilters() {
        searchInput.value = '';
        filterCategory.value = '';
        filterStyle.value = '';
        filterSize.value = '';
        sortOrder.value = 'default';
        renderProducts();
    }

    window.addToCartFromPage = function(id) {
        const product = productos.find(p => p.id === id);
        if (product && product.inStock && window.cart) {
            cart.add(product, 1);
            alert('Producto añadido al carrito');
        }
    };

    window.toggleAssistant = function() {
        if (assistantActive) {
            closeAssistant();
            container.style.display = 'grid';
            renderProducts();
        } else {
            container.style.display = 'none';
            noResults.style.display = 'none';
            startAssistant();
        }
    };

    const originalCloseAssistant = window.closeAssistant;
    window.closeAssistant = function() {
        if (originalCloseAssistant) originalCloseAssistant();
        container.style.display = 'grid';
        renderProducts();
    };

    searchInput.addEventListener('input', renderProducts);
    filterCategory.addEventListener('change', renderProducts);
    filterStyle.addEventListener('change', renderProducts);
    filterSize.addEventListener('change', renderProducts);
    sortOrder.addEventListener('change', renderProducts);
    clearFiltersBtn.addEventListener('click', clearAllFilters);
    clearFiltersEmptyBtn.addEventListener('click', clearAllFilters);

    populateFilters();
    renderProducts();
});
