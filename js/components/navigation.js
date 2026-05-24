document.addEventListener('DOMContentLoaded', async () => {
    const isInPagesFolder = window.location.pathname.includes('/pages/');

    const includeBase = isInPagesFolder ? '../' : '';

    async function loadInclude(id, url) {
        try {
            const resp = await fetch(includeBase + url);
            if (resp.ok) {
                document.getElementById(id).innerHTML = await resp.text();
            }
        } catch (e) {
            console.warn('No se pudo cargar ' + includeBase + url);
        }
    }

    await loadInclude('site-header', 'includes/header.html');
    await loadInclude('site-footer', 'includes/footer.html');

function setActiveNavLink() {
    const currentPath = window.location.pathname;
    const currentFile = currentPath.substring(currentPath.lastIndexOf('/') + 1) || 'index.html';

    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.classList.remove('active');

        const href = link.getAttribute('href');
        if (!href) return;

        let linkFile = href;
        if (linkFile.startsWith('../')) linkFile = linkFile.substring(3);
        if (linkFile.startsWith('pages/')) linkFile = linkFile.substring(6);
        linkFile = linkFile.split('?')[0].split('#')[0];

        if (linkFile === currentFile || 
            (linkFile === 'index.html' && (currentFile === '' || currentFile === '/' || currentFile === 'index.html'))) {
            link.classList.add('active');
        }
    });
}

    if (isInPagesFolder) {
        const header = document.getElementById('site-header');
        if (header) {
            const headerLinks = header.querySelectorAll('.nav-link');
            headerLinks.forEach(link => {
                const originalHref = link.getAttribute('href');
                if (!originalHref) return;
                if (originalHref.startsWith('pages/') || originalHref === 'index.html') {
                    link.setAttribute('href', '../' + originalHref);
                }
            });
            const brandLink = header.querySelector('.header-brand');
            if (brandLink && brandLink.getAttribute('href') === 'index.html') {
                brandLink.setAttribute('href', '../index.html');
            }
            const cartLink = header.querySelector('.header-cart');
            if (cartLink && cartLink.getAttribute('href') === 'pages/cart.html') {
                cartLink.setAttribute('href', '../pages/cart.html');
            }
        }

        const footer = document.getElementById('site-footer');
        if (footer) {
            const footerLinks = footer.querySelectorAll('a');
            footerLinks.forEach(link => {
                const originalHref = link.getAttribute('href');
                if (!originalHref) return;
                if (originalHref.startsWith('pages/') || originalHref === 'index.html') {
                    link.setAttribute('href', '../' + originalHref);
                }
                if (originalHref === 'sitemap.xml') {
                    link.setAttribute('href', '../' + originalHref);
                }
            });
        }
    }

    setActiveNavLink();

    const hamburger = document.querySelector('.header-hamburger');
    const navMenu = document.querySelector('.header-nav');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            const isOpen = navMenu.classList.toggle('open');
            hamburger.setAttribute('aria-expanded', isOpen);
            
            document.body.style.overflow = isOpen ? 'hidden' : '';
        });

        navMenu.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('open');
                hamburger.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            });
        });

        document.addEventListener('click', (e) => {
            if (!navMenu.contains(e.target) && !hamburger.contains(e.target) && navMenu.classList.contains('open')) {
                navMenu.classList.remove('open');
                hamburger.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            }
        });
    }

    const siteHeader = document.querySelector('.site-header');
    if (siteHeader) {
        const handleScroll = () => {
            if (window.scrollY > 20) {
                siteHeader.classList.add('scrolled');
            } else {
                siteHeader.classList.remove('scrolled');
            }
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
    }

    if (window.cart && typeof window.cart.updateCartCount === 'function') {
        window.cart.updateCartCount();
    }

    window.addEventListener('cart-updated', () => {
        if (window.cart && typeof window.cart.updateCartCount === 'function') {
            window.cart.updateCartCount();
        }
    });

    if (typeof initThemeIcon === 'function') {
        initThemeIcon();
    }
});
