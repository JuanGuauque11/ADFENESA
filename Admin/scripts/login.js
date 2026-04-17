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

async function handleLogin() {
  const email    = inputEmail.value.trim();
  const password = inputPassword.value;

  // Ocultar error previo
  loginError.classList.add("hidden");

  // Validaciones básicas
  if (!email || !password) {
    mostrarError("Completa el correo y la contraseña.");
    return;
  }

  // Estado de carga
  setLoading(true);

  try {
    await signInWithEmailAndPassword(auth, email, password);
    // onAuthStateChanged detectará el cambio y redirigirá automáticamente
  } catch (error) {
    setLoading(false);
    const msg = mensajeDeError(error.code);
    mostrarError(msg);
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
