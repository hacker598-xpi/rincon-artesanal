function realizarPedido() {
  const phoneInput = document.getElementById('order-phone');
  const phone = phoneInput.value.trim();
  if (!phone.match(/^\+53\d{8}$/)) {
    alert('Ingrese un número válido de teléfono cubano (+53XXXXXXXX).');
    return;
  }

  const pedido = {
    telefono: phone,
    fecha: new Date().toISOString().split('T')[0],
    productos: cart.items.map(item => {
      const tier = CONFIG.discounts.tiers.find(t => item.quantity >= t.minQty);
      const precioUnitario = tier ? item.price * (1 - tier.discount) : item.price;
      return {
        nombre: item.name,
        cantidad: item.quantity,
        precio_unitario: precioUnitario,
        subtotal: precioUnitario * item.quantity
      };
    }),
    total_pagar: cart.getTotal(),
    moneda: CONFIG.currency
  };

  const mensaje = `Hola, deseo realizar el siguiente pedido:\n\n` +
    pedido.productos.map(p => `- ${p.nombre} x${p.cantidad}: $${p.subtotal}`).join('\n') +
    `\n\nTotal: $${pedido.total_pagar} ${pedido.moneda}\nTeléfono: ${pedido.telefono}\nFecha: ${pedido.fecha}`;

  window.open(`https://wa.me/${CONFIG.phone}?text=${encodeURIComponent(mensaje)}`, '_blank');

  const smsLink = `sms:${CONFIG.phone}?body=${encodeURIComponent(mensaje)}`;
  const a = document.createElement('a');
  a.href = smsLink;
  a.click();

  cart.clear();
  alert('Pedido enviado. ¡Gracias!');
  const modal = document.getElementById('order-modal');
  if (modal) modal.style.display = 'none';
  window.location.href = 'products.html';
}
