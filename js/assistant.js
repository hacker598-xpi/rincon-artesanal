let assistantActive = false;
let respuestas = {};
let paso = 0;

const preguntas = [
    {
        pregunta: '¿Qué tipo de planta o uso le quieres dar?',
        opciones: ['Interior', 'Exterior', 'Suculenta', 'Bonsái'],
        campo: 'category'
    },
    {
        pregunta: '¿Qué estilo prefieres?',
        opciones: ['Rústico', 'Moderno', 'Minimalista', 'Colorido'],
        campo: 'style'
    },
    {
        pregunta: '¿Qué tamaño necesitas?',
        opciones: ['Pequeño', 'Mediano', 'Grande'],
        campo: 'size'
    }
];

function startAssistant() {
    const container = document.getElementById('assistant-content');
    if (!container) return;

    assistantActive = true;
    const grid = document.getElementById('all-products');
    if (grid) grid.style.display = 'none';

    const btn = document.getElementById('start-assistant');
    if (btn) {
        const span = btn.querySelector('#assistant-btn-text');
        if (span) span.textContent = '❌ Salir del asistente';
    }

    container.style.display = 'flex';
    container.innerHTML = '';
    respuestas = {};
    paso = 0;
    mostrarPregunta();
}

function closeAssistant() {
    assistantActive = false;
    const container = document.getElementById('assistant-content');
    if (container) {
        container.style.display = 'none';
        container.innerHTML = '';
    }

    const grid = document.getElementById('all-products');
    if (grid) grid.style.display = '';

    const btn = document.getElementById('start-assistant');
    if (btn) {
        const span = btn.querySelector('#assistant-btn-text');
        if (span) span.textContent = 'Asistente de selección';
    }
}

function mostrarPregunta() {
    if (paso >= preguntas.length) {
        mostrarResultados();
        return;
    }
    const q = preguntas[paso];
    const cont = document.getElementById('assistant-content');
    if (!cont) return;
    cont.innerHTML = `<h3>${q.pregunta}</h3>`;
    q.opciones.forEach(op => {
        const btn = document.createElement('button');
        btn.className = 'btn btn-outline assistant-option';
        btn.textContent = op;
        btn.onclick = () => {
            respuestas[q.campo] = op.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
            paso++;
            mostrarPregunta();
        };
        cont.appendChild(btn);
    });
    const salirBtn = document.createElement('button');
    salirBtn.className = 'btn btn-outline';
    salirBtn.textContent = '↩ Volver al catálogo';
    salirBtn.onclick = closeAssistant;
    cont.appendChild(document.createElement('br'));
    cont.appendChild(salirBtn);
}

function mostrarResultados() {
    const isInPages = window.location.pathname.includes('/pages/');
    const basePath = isInPages ? '../' : '';

    const filtrados = CONFIG.products.filter(p => {
        return (!respuestas.category || p.category === respuestas.category) &&
               (!respuestas.style || p.style === respuestas.style) &&
               (!respuestas.size || p.size === respuestas.size) &&
               p.inStock;
    });
    const cont = document.getElementById('assistant-content');
    if (!cont) return;
    if (filtrados.length === 0) {
        cont.innerHTML = '<p>No encontramos piezas exactas, pero te sugerimos revisar nuestro catálogo completo.</p>';
    } else {
        cont.innerHTML = filtrados.map(p => `
            <div class="product-card">
                <div class="image-wrapper">
                    <img src="${basePath}${p.image}" alt="${p.name}">
                </div>
                <div class="product-info">
                    <h3>${p.name}</h3>
                    <p>${p.description}</p>
                    <span class="price">$${p.price} CUP</span>
                    <button class="btn btn-primary" onclick="addToCartFromAssistant(${p.id})">Añadir al carrito</button>
                </div>
            </div>
        `).join('');
    }
    const volverBtn = document.createElement('button');
    volverBtn.className = 'btn btn-outline';
    volverBtn.textContent = '↩ Ver todo el catálogo';
    volverBtn.onclick = closeAssistant;
    cont.appendChild(document.createElement('br'));
    cont.appendChild(volverBtn);
}

function addToCartFromAssistant(id) {
    const product = CONFIG.products.find(p => p.id === id);
    if (product) cart.add(product, 1);
    alert('Producto añadido al carrito');
}
