document.addEventListener('DOMContentLoaded', () => {
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    revealElements.forEach(el => revealObserver.observe(el));

    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            if (!isActive) {
                item.classList.add('active');
                question.setAttribute('aria-expanded', 'true');
            } else {
                item.classList.remove('active');
                question.setAttribute('aria-expanded', 'false');
            }
        });
    });

    const searchInput = document.getElementById('faq-search-input');
    const noResults = document.getElementById('faq-no-results');
    const faqListItems = document.querySelectorAll('.faq-list .faq-item');

    searchInput.addEventListener('input', () => {
        const query = searchInput.value.trim().toLowerCase();
        let visibleCount = 0;
        faqListItems.forEach(item => {
            const questionText = item.querySelector('.faq-question span').textContent.toLowerCase();
            const answerText = item.querySelector('.faq-answer').textContent.toLowerCase();
            if (query === '' || questionText.includes(query) || answerText.includes(query)) {
                item.classList.remove('hidden-by-search');
                visibleCount++;
            } else {
                item.classList.add('hidden-by-search');
            }
        });
        noResults.style.display = visibleCount === 0 ? 'block' : 'none';
    });

    const catButtons = document.querySelectorAll('.cat-btn');
    catButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            catButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const cat = btn.getAttribute('data-cat');
            faqListItems.forEach(item => {
                if (cat === 'all' || item.getAttribute('data-cat') === cat) {
                    item.classList.remove('hidden-by-search');
                } else {
                    item.classList.add('hidden-by-search');
                }
            });
            searchInput.value = '';
            noResults.style.display = 'none';
        });
    });
});
