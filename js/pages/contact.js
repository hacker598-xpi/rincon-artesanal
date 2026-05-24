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
            faqItems.forEach(i => i.classList.remove('active'));
            if (!isActive) {
                item.classList.add('active');
                question.setAttribute('aria-expanded', 'true');
            } else {
                question.setAttribute('aria-expanded', 'false');
            }
        });
    });

    const form = document.getElementById('contact-form');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');
    const phoneInput = document.getElementById('phone');
    const subjectInput = document.getElementById('subject');

    function validateField(input, condition) {
        const group = input.closest('.form-group');
        if (!condition) {
            group.classList.add('error');
        } else {
            group.classList.remove('error');
        }
    }

    nameInput.addEventListener('input', () => validateField(nameInput, nameInput.value.trim() !== ''));
    emailInput.addEventListener('input', () => {
        const val = emailInput.value.trim();
        const isValid = val === '' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
        validateField(emailInput, isValid);
    });
    messageInput.addEventListener('input', () => validateField(messageInput, messageInput.value.trim() !== ''));

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        let isValid = true;

        if (!nameInput.value.trim()) {
            validateField(nameInput, false);
            isValid = false;
        }
        if (!messageInput.value.trim()) {
            validateField(messageInput, false);
            isValid = false;
        }
        if (emailInput.value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value.trim())) {
            validateField(emailInput, false);
            isValid = false;
        }

        if (!isValid) return;

        const nombre = nameInput.value.trim();
        const email = emailInput.value.trim() || 'No especificado';
        const telefono = phoneInput.value.trim() || 'No especificado';
        const asunto = subjectInput.value.trim() || 'Consulta desde la web';
        const mensaje = messageInput.value.trim();

        const textoWhatsApp = `Hola, soy ${nombre}.\n\n` +
            `📧 Correo: ${email}\n` +
            `📞 Teléfono: ${telefono}\n` +
            `📝 Asunto: ${asunto}\n\n` +
            `💬 Mensaje:\n${mensaje}`;

        const phoneNumber = window.CONFIG ? CONFIG.phone : '+5356252842';
        const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(textoWhatsApp)}`;

        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Enviando...';
        submitBtn.disabled = true;

        setTimeout(() => {
            window.open(url, '_blank');
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            form.reset();
            document.querySelectorAll('.form-group.error').forEach(g => g.classList.remove('error'));
        }, 600);
    });

    document.querySelectorAll('.form-group input, .form-group textarea').forEach(input => {
        input.addEventListener('input', () => {
            input.closest('.form-group').classList.remove('error');
        });
    });
});
