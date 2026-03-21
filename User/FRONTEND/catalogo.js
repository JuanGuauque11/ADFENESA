// ═══════════════════════════════════════════════════════
//  ADFENESA — Catálogo público
//  Lee productos de Firestore en tiempo real
// ═══════════════════════════════════════════════════════

import { initializeApp }  from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, query, where, orderBy, onSnapshot }
  from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey:            "AIzaSyCZPl84R2Ciro66lVqtWNf15eLVLJ_MuAM",
  authDomain:        "adfenesa.firebaseapp.com",
  projectId:         "adfenesa",
  storageBucket:     "adfenesa.firebasestorage.app",
  messagingSenderId: "25019401094",
  appId:             "1:25019401094:web:88773517b7865391b36207"
};

const app = initializeApp(firebaseConfig);
const db  = getFirestore(app);

// ── Número WhatsApp ADFENESA ──
const WHATSAPP = "573124595145"; 

// ── Estado ──
let todosLosProductos = [];
let categoriaActiva   = "";

// ── DOM ──
const productosGrid    = document.getElementById("productos-grid");
const estadoCargando   = document.getElementById("estado-cargando");
const estadoVacio      = document.getElementById("estado-vacio");
const filtroBtns       = document.querySelectorAll(".filtro-btn");
const modalOverlay     = document.getElementById("modal-overlay");
const modalCerrar      = document.getElementById("modal-cerrar");
const modalImg         = document.getElementById("modal-img");
const modalCategoria   = document.getElementById("modal-categoria");
const modalNombre      = document.getElementById("modal-nombre");
const modalPrecio      = document.getElementById("modal-precio");
const modalDescripcion = document.getElementById("modal-descripcion");
const btnWhatsapp      = document.getElementById("btn-whatsapp");

// ════════════════════════════════════════
//  FIRESTORE — Escucha en tiempo real
//  Solo productos disponibles
// ════════════════════════════════════════
const q = query(
  collection(db, "productos"),
  where("disponible", "==", true),
  orderBy("createdAt", "desc")
);

onSnapshot(q, (snapshot) => {
  todosLosProductos = [];
  snapshot.forEach((doc) => {
    todosLosProductos.push({ id: doc.id, ...doc.data() });
  });
  estadoCargando.classList.add("hidden");
  renderizarProductos(filtrarPorCategoria());
}, (error) => {
  console.error("Error Firestore:", error);
  estadoCargando.classList.add("hidden");
});

// ════════════════════════════════════════
//  FILTROS
// ════════════════════════════════════════
filtroBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    filtroBtns.forEach((b) => b.classList.remove("activo"));
    btn.classList.add("activo");
    categoriaActiva = btn.dataset.categoria;
    renderizarProductos(filtrarPorCategoria());
  });
});

function filtrarPorCategoria() {
  if (!categoriaActiva) return todosLosProductos;
  return todosLosProductos.filter((p) => p.categoria === categoriaActiva);
}

// ════════════════════════════════════════
//  RENDERIZAR GRILLA
// ════════════════════════════════════════
function renderizarProductos(lista) {
  productosGrid.innerHTML = "";

  if (lista.length === 0) {
    estadoVacio.classList.remove("hidden");
    return;
  }
  estadoVacio.classList.add("hidden");

  lista.forEach((producto, i) => {
    const card = document.createElement("div");
    card.className = "producto-card";
    card.style.animationDelay = `${i * 60}ms`;

    card.innerHTML = `
      <div class="card-img-wrapper">
        ${producto.imagenUrl
          ? `<img class="card-img" src="${producto.imagenUrl}" alt="${producto.nombre}" loading="lazy" />`
          : `<div class="card-sin-img">
               <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
                 <rect x="3" y="3" width="18" height="18" rx="2"/>
                 <circle cx="8.5" cy="8.5" r="1.5"/>
                 <polyline points="21 15 16 10 5 21"/>
               </svg>
             </div>`
        }
        ${producto.destacado ? `<span class="card-destacado">DESTACADO</span>` : ""}
      </div>
      <div class="card-body">
        <span class="card-categoria">${producto.categoria || ""}</span>
        <h3 class="card-nombre">${producto.nombre}</h3>
        <p class="card-precio">${formatearPrecio(producto.precio)}</p>
        <span class="card-ver">Ver detalle →</span>
      </div>
    `;

    card.addEventListener("click", () => abrirModal(producto));
    productosGrid.appendChild(card);
  });
}

function formatearPrecio(valor) {
  if (!valor && valor !== 0) return "";
  return "$ " + Number(valor).toLocaleString("es-CO");
}

// ════════════════════════════════════════
//  MODAL DETALLE
// ════════════════════════════════════════
function abrirModal(producto) {
  modalImg.src                    = producto.imagenUrl || "";
  modalImg.alt                    = producto.nombre;
  modalCategoria.textContent      = producto.categoria || "";
  modalNombre.textContent         = producto.nombre;
  modalPrecio.textContent         = formatearPrecio(producto.precio);
  modalDescripcion.textContent    = producto.descripcion || "Producto artesanal hecho a mano con lana natural.";

  const mensaje = encodeURIComponent(
    `Hola, estoy interesado/a en el producto: *${producto.nombre}* (${formatearPrecio(producto.precio)}). ¿Tienen disponibilidad?`
  );
  btnWhatsapp.href = `https://wa.me/${WHATSAPP}?text=${mensaje}`;

  modalOverlay.classList.remove("hidden");
  document.body.style.overflow = "hidden";
}

function cerrarModal() {
  modalOverlay.classList.add("hidden");
  document.body.style.overflow = "";
  modalImg.src = "";
}

modalCerrar.addEventListener("click", cerrarModal);
modalOverlay.addEventListener("click", (e) => {
  if (e.target === modalOverlay) cerrarModal();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") cerrarModal();
});