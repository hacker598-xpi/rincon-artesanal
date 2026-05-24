const CONFIG = {
  phone: '+5356252842',
  email: 'example@gmail.com',
  social: {
    instagram: 'https://instagram.com/elrinconartesanal',
    facebook: 'https://facebook.com/elrinconartesanal'
  },
  currency: 'CUP',
  discounts: {
    tiers: [
      { minQty: 5, discount: 0.10 },
      { minQty: 10, discount: 0.15 }
    ]
  },
  products: [
    {
      id: 1,
      name: 'Maceta de barro clásica',
      description: 'Ideal para interiores, con acabado rústico. Diámetro 20 cm.',
      price: 450,
      image: 'assets/images/products/maceta-clasica.webp',
      category: 'interior',
      style: 'rústico',
      size: 'mediano',
      inStock: true,
      featured: true
    },
    {
      id: 2,
      name: 'Jarrón minimalista',
      description: 'Diseño limpio para espacios modernos. Alto 30 cm.',
      price: 680,
      image: 'assets/images/products/jarron-minimalista.webp',
      category: 'interior',
      style: 'moderno',
      size: 'mediano',
      inStock: true,
      featured: true
    },
    {
      id: 3,
      name: 'Plato decorativo rústico',
      description: 'Perfecto como centro de mesa. 35 cm de diámetro.',
      price: 320,
      image: 'assets/images/products/plato-rustico.jpg',
      category: 'interior',
      style: 'rústico',
      size: 'grande',
      inStock: true,
      featured: false
    },
    {
      id: 4,
      name: 'Macetón para exteriores',
      description: 'Gran resistencia, con orificio de drenaje. 40 cm alto.',
      price: 950,
      image: 'assets/images/products/maceton-exterior.webp',
      category: 'exterior',
      style: 'rústico',
      size: 'grande',
      inStock: true,
      featured: true
    },
    {
      id: 5,
      name: 'Bonsái bowl bajo',
      description: 'Escaso, ideal para bonsáis. 15 cm diámetro.',
      price: 280,
      image: 'assets/images/products/bonsai-bowl.jpg',
      category: 'bonsái',
      style: 'minimalista',
      size: 'pequeño',
      inStock: false,
      featured: false
    },
    {
      id: 6,
      name: 'Maceta suculenta colorida',
      description: 'Pieza pequeña con esmalte azul/verde. 10 cm.',
      price: 190,
      image: 'assets/images/products/maceta-suculenta.jpg',
      category: 'suculenta',
      style: 'colorido',
      size: 'pequeño',
      inStock: true,
      featured: false
    },
    {
      id: 7,
      name: 'Conjunto de 3 macetas rústicas',
      description: 'Pack ahorro: tres macetas de distintos tamaños.',
      price: 850,
      image: 'assets/images/products/pack-rustico.webp',
      category: 'interior',
      style: 'rústico',
      size: 'mediano',
      inStock: true,
      featured: true
    },
    {
      id: 8,
      name: 'Fuente de barro artesanal',
      description: 'Fuente de agua decorativa, 50 cm diámetro.',
      price: 1500,
      image: 'assets/images/products/fuente.jpg',
      category: 'exterior',
      style: 'rústico',
      size: 'grande',
      inStock: true,
      featured: false
    }
  ]
};
window.CONFIG = CONFIG;
