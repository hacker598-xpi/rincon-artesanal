document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('featured-list');
    if (container && window.CONFIG && window.CONFIG.products) {
        const featured = CONFIG.products.filter(p => p.featured && p.inStock);
        container.innerHTML = featured.map(p => `
            <div class="product-card">
                <div class="image-wrapper">
                    <img src="${p.image}" alt="${p.name}" loading="lazy">
                </div>
                <div class="product-info">
                    <h3>${p.name}</h3>
                    <p>${p.description}</p>
                    <span class="price">$${p.price} CUP</span>
                    <a href="pages/product-detail.html?id=${p.id}" class="btn btn-primary">Ver</a>
                </div>
            </div>
        `).join('');
    }

    const revealElements = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });
    revealElements.forEach(el => observer.observe(el));

    const statNumbers = document.querySelectorAll('.stat-number[data-target]');
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.getAttribute('data-target'));
                const suffix = el.nextElementSibling;
                const duration = 2000;
                const step = target / (duration / 16);
                let current = 0;

const updateCounter = () => {
    current += step;
    if (current >= target) {
        el.textContent = target;
        if (suffix && suffix.classList.contains('stat-suffix')) {
            suffix.style.opacity = '1';
        }
        const statItem = el.closest('.stat-item');
        if (statItem) {
            const plusEl = statItem.querySelector('.stat-plus');
            if (plusEl) {
                plusEl.style.opacity = '1';
            }
        }
        return;
    }
    el.textContent = Math.floor(current);
    requestAnimationFrame(updateCounter);
};
                updateCounter();
                statsObserver.unobserve(el);
            }
        });
    }, { threshold: 0.5 });
    statNumbers.forEach(el => statsObserver.observe(el));

    const track = document.getElementById('testimonials-track');
    const dots = document.querySelectorAll('.testimonial-dot');
    const cards = document.querySelectorAll('.testimonial-card');
    let currentIndex = 0;
    const totalSlides = cards.length;

    function goToSlide(index) {
        cards.forEach((card, i) => {
            card.classList.toggle('active', i === index);
        });
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
        currentIndex = index;
    }

    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            const index = parseInt(dot.getAttribute('data-index'));
            goToSlide(index);
            resetAutoSlide();
        });
    });

    let autoSlideInterval = setInterval(() => {
        const next = (currentIndex + 1) % totalSlides;
        goToSlide(next);
    }, 5000);

    function resetAutoSlide() {
        clearInterval(autoSlideInterval);
        autoSlideInterval = setInterval(() => {
            const next = (currentIndex + 1) % totalSlides;
            goToSlide(next);
        }, 5000);
    }

    let touchStartX = 0;
    track.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    track.addEventListener('touchend', (e) => {
        const touchEndX = e.changedTouches[0].screenX;
        const diff = touchStartX - touchEndX;
        if (Math.abs(diff) > 50) {
            if (diff > 0 && currentIndex < totalSlides - 1) {
                goToSlide(currentIndex + 1);
            } else if (diff < 0 && currentIndex > 0) {
                goToSlide(currentIndex - 1);
            }
            resetAutoSlide();
        }
    });
});
