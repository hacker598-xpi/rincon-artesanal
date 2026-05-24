function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);

    const existing = document.querySelector('link[data-theme-link]');
    if (existing) {
        const currentHref = existing.getAttribute('href');
        const basePath = currentHref.substring(0, currentHref.lastIndexOf('/') + 1);
        existing.href = basePath + theme + '.css';
    }

    const toggle = document.getElementById('theme-toggle');
    if (toggle) {
        if (toggle.textContent && (toggle.textContent.includes('☀️') || toggle.textContent.includes('🌙'))) {
            toggle.textContent = theme === 'dark' ? '☀️' : '🌙';
        }
    }
}

document.addEventListener('click', (e) => {
    const themeBtn = e.target.closest('#theme-toggle');
    if (themeBtn) {
        const current = localStorage.getItem('theme') || 'dark';
        applyTheme(current === 'dark' ? 'light' : 'dark');
    }
});

function initThemeIcon() {
    const saved = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', saved);
    
    const toggle = document.getElementById('theme-toggle');
    if (toggle) {
        if (toggle.textContent && (toggle.textContent.includes('☀️') || toggle.textContent.includes('🌙'))) {
            toggle.textContent = saved === 'dark' ? '☀️' : '🌙';
        }
    }
}
