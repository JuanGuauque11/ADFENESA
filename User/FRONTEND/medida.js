// ══════════════════════════════════════
//  A LA MEDIDA — Envío de formulario
//  Conecta con el backend Node.js
//  y guarda los datos en MongoDB
// ══════════════════════════════════════
const btnEnviar = document.getElementById('btn-enviar');

btnEnviar.addEventListener('click', async () => {
  const nombre   = document.getElementById('nombre').value.trim();
  const email    = document.getElementById('email').value.trim();
  const telefono = document.getElementById('telefono').value.trim();


  // Validación de formato de email
function emailValido(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
}

  // Validación básica
if (!nombre || !email || !telefono) {
  alert('Por favor completa todos los campos.');
  return;
}

if (!emailValido(email)) {
  alert('Por favor ingresá un email válido. Ej: nombre@dominio.com');
  return;
}

  // Deshabilitar botón mientras se envía
  btnEnviar.disabled = true;
  btnEnviar.textContent = 'Enviando...';

  try {
    const response = await fetch('https://adfenesa-backend.onrender.com/api/contacto', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, email, telefono })
    });

    const data = await response.json();

    if (response.ok) {
      btnEnviar.textContent = '¡Enviado!';
      // Limpiar campos
      document.getElementById('nombre').value   = '';
      document.getElementById('email').value    = '';
      document.getElementById('telefono').value = '';
    } else {
      alert('Error: ' + data.error);
      btnEnviar.textContent = 'Enviar';
    }
  } catch (error) {
    alert('No se pudo conectar con el servidor.');
    btnEnviar.textContent = 'Enviar';
  } finally {
    btnEnviar.disabled = false;
  }
});