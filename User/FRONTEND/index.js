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

// ══════════════════════════════════════
//  HISTORIA — Imágenes controladas por scroll
//  Cada scroll revela una imagen nueva
//  La sección se fija mientras aparecen
// ══════════════════════════════════════
gsap.registerPlugin(ScrollTrigger);

gsap.set(['.hilandera', '.segundo', '.hijo', '.padre-hijo'], { opacity: 0, y: 60 });

const tl = gsap.timeline({
  scrollTrigger: {
    trigger: '.historia-hero',
    start: 'top top',
    end: '+=400%',
    scrub: 0.1,
    pin: true,
    snap: 1 / 3,
  }
});

tl.to('.hilandera',     { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' })
  .to('.segundo',   { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' })
  .to('.hijo',       { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' })
  .to('.padre-hijo', { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' });

// ══════════════════════════════════════
//  HERO — Efecto parallax con cursor
//  La imagen sigue el cursor en toda la ventana
// ══════════════════════════════════════
document.addEventListener('mousemove', (e) => {
  const x = (e.clientX / window.innerWidth  - 0.5) * 10;
  const y = (e.clientY / window.innerHeight - 0.5) * 10;

  gsap.to('.modelo', {
    x: x,
    y: y,
    duration: 0.8,
    ease: 'power2.out'
  });
});

// ══════════════════════════════════════
//  HISTORIA — Animación texto descripción
//  Las palabras cambian de opaco a #5C1200
//  conforme se hace scroll
// ══════════════════════════════════════
const descripcion = document.querySelector('.descripcion-historia');

const html = descripcion.innerHTML
  .replace(/(<br\s*\/?>)/gi, ' |BR| ')
  .trim()
  .split(/\s+/)
  .map(token => token === '|BR|'
    ? '<br>'
    : token.length > 0
      ? `<span class="palabra">${token}</span>`
      : '')
  .join(' ');

descripcion.innerHTML = html;

gsap.set('.palabra', { color: 'rgba(92, 18, 0, 0.15)' });

gsap.to('.palabra', {
  color: '#5C1200',
  stagger: 0.1,
  scrollTrigger: {
    trigger: '.descripcion-historia',
    start: 'top 80%',
    end: 'bottom 20%',
    scrub: 1,
  }
});

// ══════════════════════════════════════
//  HISTORIA — Animación cabeza de oveja
//  Entra desde la derecha al hacer scroll
// ══════════════════════════════════════
gsap.fromTo('.cabeza-oveja',
  { opacity: 0, x: 60 },
  { opacity: 1, x: 0, duration: 10, ease: 'power3.out',
    scrollTrigger: {
      trigger: '.cabeza-oveja',
      start: 'top 90%',
      toggleActions: 'play none none reverse'
    }
  }
);