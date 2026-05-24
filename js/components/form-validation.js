document.addEventListener('submit', function(e) {
  const form = e.target.closest('.contact-form');
  if (!form) return;
  e.preventDefault();
  alert('Gracias por tu mensaje. Te contactaremos pronto.');
  form.reset();
});
