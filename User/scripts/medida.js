// ══════════════════════════════════════
//  A LA MEDIDA — Envío de formulario
// ══════════════════════════════════════

const DOMINIOS_VALIDOS = [
  'gmail.com', 'googlemail.com',
  'hotmail.com', 'hotmail.es', 'hotmail.co',
  'outlook.com', 'outlook.es',
  'live.com', 'live.es',
  'yahoo.com', 'yahoo.es', 'yahoo.co',
  'icloud.com', 'me.com', 'mac.com',
  'protonmail.com', 'proton.me',
  'tutanota.com',
  'gmx.com', 'gmx.es',
  'mail.com',
  'aol.com'
];

function emailValido(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!regex.test(email)) return false;

  const dominio = email.split('@')[1].toLowerCase();
  return DOMINIOS_VALIDOS.includes(dominio);
}

const btnEnviar = document.getElementById('btn-enviar');

btnEnviar.addEventListener('click', async () => {
  const nombre   = document.getElementById('nombre').value.trim();
  const email    = document.getElementById('email').value.trim();
  const telefono = document.getElementById('telefono').value.trim();

  if (!nombre || !email || !telefono) {
    alert('Por favor completa todos los campos.');
    return;
  }

  if (!emailValido(email)) {
    alert('Por favor ingresá un email válido. Ej: nombre@dominio.com');
    return;
  }

  btnEnviar.disabled = true;
  btnEnviar.textContent = 'Enviando...';

  try {
    const response = await fetch('https://adfenesa.onrender.com/api/contacto', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, email, telefono })
    });

    const data = await response.json();

    if (response.ok) {
      btnEnviar.textContent = '¡Enviado!';
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