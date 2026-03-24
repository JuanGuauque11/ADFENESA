// ══════════════════════════════════════
//  SCROLL SUAVE — Lenis
// ══════════════════════════════════════
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true,
  smoothTouch: false,
});

// Loop de animación necesario para que Lenis funcione
function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

let scrollTimeout;

// ══════════════════════════════════════
//  HERO — Animación imagen modelo
// ══════════════════════════════════════
window.addEventListener('load', () => {
  gsap.fromTo('.modelo',
    { opacity: 0, y: 80 },
    { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out', delay: 0.6 }
  );
});

// ══════════════════════════════════════
//  HERO — Animación textos auxiliares
//  .aux     → "100% Artesanal" (entra desde la izquierda)
//  .aux-2   → "Descubre"       (entra desde la derecha)
// ══════════════════════════════════════
gsap.fromTo('.aux',
  { opacity: 0, x: -60 },
  { opacity: 1, x: 0, duration: 0.5, ease: 'power3.out', delay: 1.5 }
);

gsap.fromTo('.aux-2',
  { opacity: 0, x: 60 },
  { opacity: 1, x: 0, duration: 0.5, ease: 'power3.out', delay: 1.5 }
);