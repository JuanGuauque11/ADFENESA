// ═══════════════════════════════════════════════════════
//  ADFENESA — Login Admin
//  Maneja la autenticación con Firebase Auth
// ═══════════════════════════════════════════════════════

import { auth } from "./firebase-config.js";
import {
  signInWithEmailAndPassword,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

// Si ya hay sesión activa → redirigir al dashboard
onAuthStateChanged(auth, (user) => {
  if (user) {
    window.location.href = "./pages/dashboard.html";
  }
});

// ── Elementos del DOM ──
const inputEmail    = document.getElementById("email");
const inputPassword = document.getElementById("password");
const btnLogin      = document.getElementById("btn-login");
const btnLoginText  = document.getElementById("btn-login-text");
const btnLoginLoader= document.getElementById("btn-login-loader");
const loginError    = document.getElementById("login-error");
const loginErrorMsg = document.getElementById("login-error-msg");
const togglePassword= document.getElementById("toggle-password");
const iconEye       = document.getElementById("icon-eye");
const iconEyeOff    = document.getElementById("icon-eye-off");

// ── Toggle ver contraseña ──
togglePassword.addEventListener("click", () => {
  const esPassword = inputPassword.type === "password";
  inputPassword.type = esPassword ? "text" : "password";
  iconEye.classList.toggle("hidden", esPassword);
  iconEyeOff.classList.toggle("hidden", !esPassword);
});

// ── Submit con Enter ──
inputPassword.addEventListener("keydown", (e) => {
  if (e.key === "Enter") handleLogin();
});

inputEmail.addEventListener("keydown", (e) => {
  if (e.key === "Enter") handleLogin();
});

// ── Botón login ──
btnLogin.addEventListener("click", handleLogin);

// ── Control de intentos ──
let intentosFallidos = 0;
const MAX_INTENTOS = 5;
const BLOQUEO_MS = 5 * 60 * 1000;

function verificarBloqueo() {
  const bloqueoHasta = localStorage.getItem('bloqueoHasta');
  if (bloqueoHasta && Date.now() < parseInt(bloqueoHasta)) {
    const minutos = Math.ceil((parseInt(bloqueoHasta) - Date.now()) / 60000);
    mostrarError(`Demasiados intentos. Esperá ${minutos} minuto(s).`);
    btnLogin.disabled = true;
    return true;
  }
  btnLogin.disabled = false;
  return false;
}

async function handleLogin() {
  if (verificarBloqueo()) return;

  const email    = inputEmail.value.trim();
  const password = inputPassword.value;

  loginError.classList.add("hidden");

  if (!email || !password) {
    mostrarError("Completa el correo y la contraseña.");
    return;
  }

  setLoading(true);

  try {
    await signInWithEmailAndPassword(auth, email, password);
    intentosFallidos = 0;
    localStorage.removeItem('bloqueoHasta');
  } catch (error) {
    setLoading(false);
    intentosFallidos++;

    if (intentosFallidos >= MAX_INTENTOS) {
      localStorage.setItem('bloqueoHasta', Date.now() + BLOQUEO_MS);
      mostrarError('Demasiados intentos fallidos. Bloqueado por 5 minutos.');
      btnLogin.disabled = true;
      return;
    }

    const restantes = MAX_INTENTOS - intentosFallidos;
    const msg = mensajeDeError(error.code);
    mostrarError(`${msg} Te quedan ${restantes} intento(s).`);
  }
}

function setLoading(loading) {
  btnLogin.disabled = loading;
  btnLoginText.classList.toggle("hidden", loading);
  btnLoginLoader.classList.toggle("hidden", !loading);
}

function mostrarError(mensaje) {
  loginErrorMsg.textContent = mensaje;
  loginError.classList.remove("hidden");
  inputPassword.value = "";
  inputPassword.focus();
}

function mensajeDeError(code) {
  const errores = {
    "auth/user-not-found":      "No existe una cuenta con ese correo.",
    "auth/wrong-password":      "Contraseña incorrecta.",
    "auth/invalid-credential":  "Correo o contraseña incorrectos.",
    "auth/invalid-email":       "El formato del correo no es válido.",
    "auth/too-many-requests":   "Demasiados intentos. Intenta de nuevo más tarde.",
    "auth/network-request-failed": "Error de red. Verifica tu conexión."
  };
  return errores[code] || "Ocurrió un error inesperado. Intenta de nuevo.";
}
