// ═══════════════════════════════════════════════════════
//  ADFENESA — Auth Guard
//  Incluir en TODAS las páginas protegidas del admin.
//  Redirige al login si el usuario no está autenticado.
// ═══════════════════════════════════════════════════════

import { auth } from "./firebase-config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

// Bloquear contenido hasta verificar sesión
document.body.style.visibility = "hidden";

onAuthStateChanged(auth, (user) => {
  if (!user) {
    // Sin sesión → redirigir al login
    window.location.replace("./login.html");
  } else {
    // Con sesión → mostrar contenido
    document.body.style.visibility = "visible";
  }
});
