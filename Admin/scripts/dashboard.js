// ═══════════════════════════════════════════════════════
//  ADFENESA — Dashboard Admin
//  CRUD completo de productos + subida de imágenes
// ═══════════════════════════════════════════════════════

import { db, storage, auth } from "./firebase-config.js";
import {
  collection, addDoc, updateDoc, deleteDoc,
  doc, onSnapshot, serverTimestamp, query, orderBy
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import {
  ref, uploadBytesResumable, getDownloadURL, deleteObject
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";
import { signOut } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

// ════════════════════════════════════════
//  ESTADO GLOBAL
// ════════════════════════════════════════
let productos       = [];          // lista completa de Firestore
let productoEditandoId  = null;    // ID del producto en edición (null = nuevo)
let imagenArchivoSeleccionado = null; // File del input
let imagenUrlActual   = null;      // URL imagen al editar
let imagenPathActual  = null;      // Path Storage al editar
let productoEliminandoId   = null; // ID al confirmar eliminar
let productoEliminandoNombre = ""; // Nombre para mostrar en modal

// ════════════════════════════════════════
//  REFERENCIAS DOM
// ════════════════════════════════════════
const tablaBody            = document.getElementById("tabla-body");
const tablaVacia           = document.getElementById("tabla-vacia");
const tablaLoading         = document.getElementById("tabla-loading");

const statTotal            = document.getElementById("stat-total");
const statDisponibles      = document.getElementById("stat-disponibles");
const statCategorias       = document.getElementById("stat-categorias");

const filtroBuscar         = document.getElementById("filtro-buscar");
const filtroCategoria      = document.getElementById("filtro-categoria");

const btnNuevo             = document.getElementById("btn-nuevo-producto");
const btnLogout            = document.getElementById("btn-logout");

// Modal producto
const modalOverlay         = document.getElementById("modal-overlay");
const modalTitulo          = document.getElementById("modal-titulo");
const modalClose           = document.getElementById("modal-close");
const btnCancelar          = document.getElementById("btn-cancelar");
const btnGuardar           = document.getElementById("btn-guardar");
const btnGuardarText       = document.getElementById("btn-guardar-text");
const btnGuardarLoader     = document.getElementById("btn-guardar-loader");

const uploadArea           = document.getElementById("upload-area");
const inputImagen          = document.getElementById("input-imagen");
const uploadPlaceholder    = document.getElementById("upload-placeholder");
const uploadPreview        = document.getElementById("upload-preview");
const uploadProgress       = document.getElementById("upload-progress");
const previewImg           = document.getElementById("preview-img");
const uploadChange         = document.getElementById("upload-change");
const progressFill         = document.getElementById("progress-fill");
const progressLabel        = document.getElementById("progress-label");

const campoNombre          = document.getElementById("campo-nombre");
const campoPrecio          = document.getElementById("campo-precio");
const campoCategoria       = document.getElementById("campo-categoria");
const campoDescripcion     = document.getElementById("campo-descripcion");
const campoDisponible      = document.getElementById("campo-disponible");
const campoDestacado       = document.getElementById("campo-destacado");
const charCount            = document.getElementById("char-count");

const errorImagen          = document.getElementById("error-imagen");
const errorNombre          = document.getElementById("error-nombre");
const errorPrecio          = document.getElementById("error-precio");
const errorCategoria       = document.getElementById("error-categoria");

// Modal eliminar
const modalEliminarOverlay = document.getElementById("modal-eliminar-overlay");
const confirmarNombre      = document.getElementById("confirmar-nombre-producto");
const btnCancelarEliminar  = document.getElementById("btn-cancelar-eliminar");
const btnConfirmarEliminar = document.getElementById("btn-confirmar-eliminar");
const btnEliminarText      = document.getElementById("btn-eliminar-text");
const btnEliminarLoader    = document.getElementById("btn-eliminar-loader");

const toastContainer       = document.getElementById("toast-container");

// ════════════════════════════════════════
//  FIRESTORE — Escucha en tiempo real
// ════════════════════════════════════════
const productosRef = collection(db, "productos");
const q = query(productosRef, orderBy("createdAt", "desc"));

tablaLoading.classList.remove("hidden");

onSnapshot(q, (snapshot) => {
  productos = [];
  snapshot.forEach((d) => productos.push({ id: d.id, ...d.data() }));
  tablaLoading.classList.add("hidden");
  actualizarStats();
  renderizarTabla(filtrar());
});

// ════════════════════════════════════════
//  FILTROS
// ════════════════════════════════════════
filtroBuscar.addEventListener("input",     () => renderizarTabla(filtrar()));
filtroCategoria.addEventListener("change", () => renderizarTabla(filtrar()));

function filtrar() {
  const texto = filtroBuscar.value.toLowerCase().trim();
  const cat   = filtroCategoria.value;
  return productos.filter((p) => {
    const coincideTexto = !texto ||
      p.nombre?.toLowerCase().includes(texto) ||
      p.descripcion?.toLowerCase().includes(texto);
    const coincideCat = !cat || p.categoria === cat;
    return coincideTexto && coincideCat;
  });
}

// ════════════════════════════════════════
//  STATS
// ════════════════════════════════════════
function actualizarStats() {
  statTotal.textContent       = productos.length;
  statDisponibles.textContent = productos.filter((p) => p.disponible).length;
  const cats = new Set(productos.map((p) => p.categoria).filter(Boolean));
  statCategorias.textContent  = cats.size;
}

// ════════════════════════════════════════
//  RENDERIZAR TABLA
// ════════════════════════════════════════
function renderizarTabla(lista) {
  tablaBody.innerHTML = "";

  if (lista.length === 0) {
    tablaVacia.classList.remove("hidden");
    return;
  }
  tablaVacia.classList.add("hidden");

  lista.forEach((producto) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>
        ${producto.imagenUrl
          ? `<img class="tabla-img" src="${producto.imagenUrl}" alt="${producto.nombre}" loading="lazy" />`
          : `<div class="tabla-img-placeholder">
               <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                 <rect x="3" y="3" width="18" height="18" rx="2"/>
                 <circle cx="8.5" cy="8.5" r="1.5"/>
                 <polyline points="21 15 16 10 5 21"/>
               </svg>
             </div>`
        }
      </td>
      <td><span class="tabla-nombre">${producto.nombre || "—"}</span></td>
      <td><span class="badge-categoria">${producto.categoria || "—"}</span></td>
      <td class="tabla-precio">${formatearPrecio(producto.precio)}</td>
      <td>
        <span class="badge-estado ${producto.disponible ? "disponible" : "no-disponible"}">
          ${producto.disponible ? "Disponible" : "Oculto"}
        </span>
      </td>
      <td>
        <div class="acciones-grupo">
          <button class="btn-editar" data-id="${producto.id}">
            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            EDITAR
          </button>
          <button class="btn-eliminar-fila" data-id="${producto.id}" data-nombre="${producto.nombre}">
            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/></svg>
            ELIMINAR
          </button>
        </div>
      </td>
    `;
    tablaBody.appendChild(tr);
  });

  // Eventos acciones
  tablaBody.querySelectorAll(".btn-editar").forEach((btn) => {
    btn.addEventListener("click", () => abrirModalEditar(btn.dataset.id));
  });
  tablaBody.querySelectorAll(".btn-eliminar-fila").forEach((btn) => {
    btn.addEventListener("click", () => abrirModalEliminar(btn.dataset.id, btn.dataset.nombre));
  });
}

function formatearPrecio(valor) {
  if (!valor && valor !== 0) return "—";
  return "$ " + Number(valor).toLocaleString("es-CO");
}

// ════════════════════════════════════════
//  MODAL PRODUCTO — Abrir / Cerrar
// ════════════════════════════════════════
btnNuevo.addEventListener("click", abrirModalNuevo);
btnCancelar.addEventListener("click", cerrarModal);
modalClose.addEventListener("click", cerrarModal);
modalOverlay.addEventListener("click", (e) => {
  if (e.target === modalOverlay) cerrarModal();
});

function abrirModalNuevo() {
  productoEditandoId      = null;
  imagenArchivoSeleccionado = null;
  imagenUrlActual         = null;
  imagenPathActual        = null;
  modalTitulo.textContent = "Nuevo producto";
  limpiarFormulario();
  abrirModal();
}

function abrirModalEditar(id) {
  const producto = productos.find((p) => p.id === id);
  if (!producto) return;

  productoEditandoId        = id;
  imagenArchivoSeleccionado = null;
  imagenUrlActual           = producto.imagenUrl  || null;
  imagenPathActual          = producto.imagenPath || null;
  modalTitulo.textContent   = "Editar producto";

  limpiarFormulario();

  campoNombre.value      = producto.nombre      || "";
  campoPrecio.value      = producto.precio      || "";
  campoCategoria.value   = producto.categoria   || "";
  campoDescripcion.value = producto.descripcion || "";
  campoDisponible.checked = producto.disponible !== false;
  campoDestacado.checked  = producto.destacado  === true;
  charCount.textContent  = `${campoDescripcion.value.length} / 600`;

  // Mostrar imagen actual si existe
  if (imagenUrlActual) {
    previewImg.src = imagenUrlActual;
    uploadPlaceholder.classList.add("hidden");
    uploadPreview.classList.remove("hidden");
  }

  abrirModal();
}

function abrirModal() {
  modalOverlay.classList.remove("hidden");
  document.body.style.overflow = "hidden";
  setTimeout(() => campoNombre.focus(), 100);
}

function cerrarModal() {
  modalOverlay.classList.add("hidden");
  document.body.style.overflow = "";
  limpiarFormulario();
}

function limpiarFormulario() {
  campoNombre.value      = "";
  campoPrecio.value      = "";
  campoCategoria.value   = "";
  campoDescripcion.value = "";
  campoDisponible.checked = true;
  campoDestacado.checked  = false;
  charCount.textContent  = "0 / 600";
  inputImagen.value      = "";

  uploadPlaceholder.classList.remove("hidden");
  uploadPreview.classList.add("hidden");
  uploadProgress.classList.add("hidden");
  progressFill.style.width = "0%";

  [errorImagen, errorNombre, errorPrecio, errorCategoria].forEach((e) =>
    e.classList.add("hidden")
  );
}

// ── Contador caracteres descripción ──
campoDescripcion.addEventListener("input", () => {
  charCount.textContent = `${campoDescripcion.value.length} / 600`;
});

// ════════════════════════════════════════
//  UPLOAD IMAGEN — Vista previa
// ════════════════════════════════════════
uploadArea.addEventListener("dragover", (e) => {
  e.preventDefault();
  uploadArea.classList.add("drag-over");
});

uploadArea.addEventListener("dragleave", () => {
  uploadArea.classList.remove("drag-over");
});

uploadArea.addEventListener("drop", (e) => {
  e.preventDefault();
  uploadArea.classList.remove("drag-over");
  const file = e.dataTransfer.files[0];
  if (file) procesarArchivoImagen(file);
});

inputImagen.addEventListener("change", () => {
  const file = inputImagen.files[0];
  if (file) procesarArchivoImagen(file);
});

uploadChange.addEventListener("click", (e) => {
  e.stopPropagation();
  inputImagen.click();
});

function procesarArchivoImagen(file) {
  // Validar tipo
  const tiposPermitidos = ["image/jpeg", "image/png", "image/webp"];
  if (!tiposPermitidos.includes(file.type)) {
    mostrarToast("Formato no válido. Usa JPG, PNG o WEBP.", "error");
    return;
  }
  // Validar tamaño (5 MB)
  if (file.size > 5 * 1024 * 1024) {
    mostrarToast("La imagen supera los 5 MB.", "error");
    return;
  }

  imagenArchivoSeleccionado = file;
  errorImagen.classList.add("hidden");

  // Vista previa local
  const reader = new FileReader();
  reader.onload = (e) => {
    previewImg.src = e.target.result;
    uploadPlaceholder.classList.add("hidden");
    uploadPreview.classList.remove("hidden");
    uploadProgress.classList.add("hidden");
  };
  reader.readAsDataURL(file);
}

// ════════════════════════════════════════
//  SUBIR IMAGEN A FIREBASE STORAGE
// ════════════════════════════════════════
function subirImagen(archivo, nombreProducto) {
  return new Promise((resolve, reject) => {
    const timestamp = Date.now();
    const ext       = archivo.name.split(".").pop();
    const slug      = nombreProducto.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    const path      = `productos/${slug}-${timestamp}.${ext}`;
    const storageRef = ref(storage, path);
    const task       = uploadBytesResumable(storageRef, archivo);

    uploadPreview.classList.add("hidden");
    uploadProgress.classList.remove("hidden");

    task.on(
      "state_changed",
      (snapshot) => {
        const pct = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        progressFill.style.width = `${pct}%`;
        progressLabel.textContent = `Subiendo... ${pct}%`;
      },
      (error) => reject(error),
      async () => {
        const url = await getDownloadURL(task.snapshot.ref);
        resolve({ url, path });
      }
    );
  });
}

// ════════════════════════════════════════
//  GUARDAR PRODUCTO (crear / editar)
// ════════════════════════════════════════
btnGuardar.addEventListener("click", guardarProducto);

async function guardarProducto() {
  if (!validarFormulario()) return;

  setGuardando(true);

  try {
    let imagenUrl  = imagenUrlActual  || null;
    let imagenPath = imagenPathActual || null;

    // Subir imagen nueva si se seleccionó
    if (imagenArchivoSeleccionado) {
      const resultado = await subirImagen(
        imagenArchivoSeleccionado,
        campoNombre.value.trim()
      );
      imagenUrl  = resultado.url;
      imagenPath = resultado.path;
    }

    const datos = {
      nombre:      campoNombre.value.trim(),
      precio:      parseFloat(campoPrecio.value),
      categoria:   campoCategoria.value,
      descripcion: campoDescripcion.value.trim(),
      disponible:  campoDisponible.checked,
      destacado:   campoDestacado.checked,
      imagenUrl,
      imagenPath,
    };

    if (productoEditandoId) {
      // EDITAR
      await updateDoc(doc(db, "productos", productoEditandoId), {
        ...datos,
        updatedAt: serverTimestamp()
      });
      mostrarToast("Producto actualizado correctamente.");
    } else {
      // CREAR
      await addDoc(collection(db, "productos"), {
        ...datos,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      mostrarToast("Producto agregado al catálogo.");
    }

    cerrarModal();
  } catch (error) {
    console.error("Error al guardar:", error);
    mostrarToast("Error al guardar el producto. Intenta de nuevo.", "error");
  } finally {
    setGuardando(false);
  }
}

function setGuardando(loading) {
  btnGuardar.disabled = loading;
  btnGuardarText.classList.toggle("hidden", loading);
  btnGuardarLoader.classList.toggle("hidden", !loading);
}

function validarFormulario() {
  let valido = true;

  // Imagen solo obligatoria en productos nuevos
  if (!productoEditandoId && !imagenArchivoSeleccionado) {
    errorImagen.classList.remove("hidden");
    valido = false;
  } else {
    errorImagen.classList.add("hidden");
  }

  if (!campoNombre.value.trim()) {
    errorNombre.classList.remove("hidden");
    valido = false;
  } else {
    errorNombre.classList.add("hidden");
  }

  if (!campoPrecio.value || parseFloat(campoPrecio.value) < 0) {
    errorPrecio.classList.remove("hidden");
    valido = false;
  } else {
    errorPrecio.classList.add("hidden");
  }

  if (!campoCategoria.value) {
    errorCategoria.classList.remove("hidden");
    valido = false;
  } else {
    errorCategoria.classList.add("hidden");
  }

  return valido;
}

// ════════════════════════════════════════
//  MODAL ELIMINAR
// ════════════════════════════════════════
function abrirModalEliminar(id, nombre) {
  productoEliminandoId     = id;
  productoEliminandoNombre = nombre;
  confirmarNombre.textContent = nombre;
  modalEliminarOverlay.classList.remove("hidden");
  document.body.style.overflow = "hidden";
}

function cerrarModalEliminar() {
  modalEliminarOverlay.classList.add("hidden");
  document.body.style.overflow = "";
  productoEliminandoId = null;
}

btnCancelarEliminar.addEventListener("click", cerrarModalEliminar);
modalEliminarOverlay.addEventListener("click", (e) => {
  if (e.target === modalEliminarOverlay) cerrarModalEliminar();
});

btnConfirmarEliminar.addEventListener("click", async () => {
  if (!productoEliminandoId) return;

  btnConfirmarEliminar.disabled = true;
  btnEliminarText.classList.add("hidden");
  btnEliminarLoader.classList.remove("hidden");

  try {
    const producto = productos.find((p) => p.id === productoEliminandoId);

    // Eliminar imagen de Storage si existe
    if (producto?.imagenPath) {
      try {
        await deleteObject(ref(storage, producto.imagenPath));
      } catch {
        // Si la imagen ya no existe en Storage, continuar igual
      }
    }

    // Eliminar documento de Firestore
    await deleteDoc(doc(db, "productos", productoEliminandoId));
    mostrarToast(`"${productoEliminandoNombre}" eliminado del catálogo.`);
    cerrarModalEliminar();
  } catch (error) {
    console.error("Error al eliminar:", error);
    mostrarToast("Error al eliminar el producto.", "error");
  } finally {
    btnConfirmarEliminar.disabled = false;
    btnEliminarText.classList.remove("hidden");
    btnEliminarLoader.classList.add("hidden");
  }
});

// ════════════════════════════════════════
//  LOGOUT
// ════════════════════════════════════════
btnLogout.addEventListener("click", async () => {
  await signOut(auth);
  window.location.href = "./index.html";
});

// ════════════════════════════════════════
//  TOAST NOTIFICATIONS
// ════════════════════════════════════════
function mostrarToast(mensaje, tipo = "success") {
  const toast = document.createElement("div");
  toast.className = `toast ${tipo === "error" ? "toast-error" : ""}`;

  const icono = tipo === "error"
    ? `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#e07060" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`
    : `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="${getComputedStyle(document.documentElement).getPropertyValue('--color-gold')}" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>`;

  toast.innerHTML = `${icono} ${mensaje}`;
  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.classList.add("toast-out");
    toast.addEventListener("animationend", () => toast.remove());
  }, 3500);
}

// ════════════════════════════════════════
//  TECLADO — cerrar modales con Escape
// ════════════════════════════════════════
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    if (!modalOverlay.classList.contains("hidden")) cerrarModal();
    if (!modalEliminarOverlay.classList.contains("hidden")) cerrarModalEliminar();
  }
});
