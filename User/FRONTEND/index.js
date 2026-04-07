// ══════════════════════════════════════
//  DETECCIÓN MÓVIL
// ══════════════════════════════════════
const isMobile = () => window.innerWidth <= 768;

// ══════════════════════════════════════
//  SCROLL SUAVE — Lenis
// ══════════════════════════════════════
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true,
  smoothTouch: false,
});

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// ══════════════════════════════════════
//  HERO — Imagen modelo
// ══════════════════════════════════════
window.addEventListener('load', () => {
  gsap.fromTo('.modelo',
    { opacity: 0, y: 80 },
    { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out', delay: 0.6 }
  );
});

// ══════════════════════════════════════
//  HERO — Textos auxiliares
// ══════════════════════════════════════
if (isMobile()) {
  gsap.fromTo('.aux',
    { opacity: 0, y: 30 },
    { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out', delay: 1.5 }
  );
  gsap.fromTo('.aux-2',
    { opacity: 0, y: 30 },
    { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out', delay: 1.8 }
  );
} else {
  gsap.fromTo('.aux',
    { opacity: 0, x: -60 },
    { opacity: 1, x: 0, duration: 0.5, ease: 'power3.out', delay: 1.5 }
  );
  gsap.fromTo('.aux-2',
    { opacity: 0, x: 60 },
    { opacity: 1, x: 0, duration: 0.5, ease: 'power3.out', delay: 1.5 }
  );

// ══════════════════════════════════════
//  HERO — Parallax cursor (solo desktop)
// ══════════════════════════════════════
if (!isMobile()) {
  document.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth  - 0.5) * 10;
    const y = (e.clientY / window.innerHeight - 0.5) * 10;
    gsap.to('.modelo', { x, y, duration: 0.8, ease: 'power2.out' });
  });
}

// ══════════════════════════════════════
//  HISTORIA — Título
// ══════════════════════════════════════
gsap.registerPlugin(ScrollTrigger);

gsap.set('.title-historia', { y: '100%' });

ScrollTrigger.create({
  trigger: '.title-historia',
  start: 'top 90%',
  toggleActions: 'play none none reset',
  onEnter: () => gsap.to('.title-historia', { y: '0%', duration: 1, ease: 'power3.out' }),
  onLeaveBack: () => gsap.set('.title-historia', { y: '100%' })
});

// ══════════════════════════════════════
//  HISTORIA — Imágenes
//  Móvil:   cartas que se lanzan al centro
//  Desktop: pin + scrub
// ══════════════════════════════════════
if (isMobile()) {
  gsap.set('.hilandera',  { opacity: 0, scale: 0.8, rotation: -12, x: -40, y: 20 });
  gsap.set('.segundo',    { opacity: 0, scale: 0.8, rotation:   8, x:  30, y: -10 });
  gsap.set('.hijo',       { opacity: 0, scale: 0.8, rotation:  -5, x: -20, y:  30 });
  gsap.set('.padre-hijo', { opacity: 0, scale: 0.8, rotation:  10, x:  25, y: -20 });

  const tlMobile = gsap.timeline({
    scrollTrigger: {
      trigger: '.historia-hero',
      start: 'top top',
      end: '+=350%',
      scrub: 0.3,
      pin: true,
    }
  });

  tlMobile
    .to('.hilandera',  { opacity: 1, scale: 1, rotation: -8, x: 0, y: 0, duration: 0.7, ease: 'back.out(1.4)' })
    .to('.segundo',    { opacity: 1, scale: 1, rotation:  5, x: 0, y: 0, duration: 0.7, ease: 'back.out(1.4)' })
    .to('.hijo',       { opacity: 1, scale: 1, rotation: -4, x: 0, y: 0, duration: 0.7, ease: 'back.out(1.4)' })
    .to('.padre-hijo', { opacity: 1, scale: 1, rotation:  6, x: 0, y: 0, duration: 0.7, ease: 'back.out(1.4)' });

} else {
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

  tl.to('.hilandera',  { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' })
    .to('.segundo',    { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' })
    .to('.hijo',       { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' })
    .to('.padre-hijo', { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' });
}

// ══════════════════════════════════════
//  HISTORIA — Texto descripción
// ══════════════════════════════════════
const descripcion = document.querySelector('.descripcion-historia');

const htmlDesc = descripcion.innerHTML
  .replace(/(<br\s*\/?>)/gi, ' |BR| ')
  .trim()
  .split(/\s+/)
  .map(token => token === '|BR|'
    ? '<br>'
    : token.length > 0
      ? `<span class="palabra">${token}</span>`
      : '')
  .join(' ');

descripcion.innerHTML = htmlDesc;

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
//  HISTORIA — Cabeza de oveja (solo desktop)
// ══════════════════════════════════════
if (!isMobile()) {
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
}

// ══════════════════════════════════════
//  CATÁLOGO — Cards (solo desktop)
// ══════════════════════════════════════
if (!isMobile()) {
  gsap.set('.card-cat', { opacity: 0, y: 60 });

  ScrollTrigger.create({
    trigger: '.cards-catalogo',
    start: 'top 80%',
    onEnter: () => {
      gsap.to('.card-cat', {
        opacity: 1, y: 0, duration: 0.7,
        ease: 'power3.out', stagger: 0.2
      });
    }
  });
}

// ══════════════════════════════════════
//  CATÁLOGO — Título
// ══════════════════════════════════════
gsap.set('.title-cat', { y: '100%' });

ScrollTrigger.create({
  trigger: '.title-cat',
  start: 'top 90%',
  toggleActions: 'play none none reset',
  onEnter: () => gsap.to('.title-cat', { y: '0%', duration: 1, ease: 'power3.out' }),
  onLeaveBack: () => gsap.set('.title-cat', { y: '100%' })
});

// ══════════════════════════════════════
//  CATÁLOGO — "Hecho en nobsa"
// ══════════════════════════════════════
const made = document.querySelector('.made');
made.innerHTML = 'Hecho en nobsa'.split(' ').map(w =>
  `<span class="word-wrap" style="display:inline-block;overflow:hidden;vertical-align:bottom;margin-right:14px">
    <span class="wd-made" style="display:inline-block">${w}</span>
  </span>`
).join('');

gsap.set('.wd-made', { y: 60, opacity: 0, filter: 'blur(8px)' });

gsap.to('.wd-made', {
  y: 0, opacity: 1, filter: 'blur(0px)',
  duration: 0.9, ease: 'power3.out', stagger: 0.18,
  scrollTrigger: {
    trigger: '.made',
    start: 'top 95%',
    toggleActions: 'play none none reverse'
  }
});

// ══════════════════════════════════════
//  PROCESOS — Título
// ══════════════════════════════════════
gsap.set('.title-pro', { y: '100%' });

ScrollTrigger.create({
  trigger: '.title-pro',
  start: 'top 90%',
  toggleActions: 'play none none reset',
  onEnter: () => gsap.to('.title-pro', { y: '0%', duration: 1, ease: 'power3.out' }),
  onLeaveBack: () => gsap.set('.title-pro', { y: '100%' })
});

// ══════════════════════════════════════
//  PROCESOS — Cards (solo desktop)
// ══════════════════════════════════════
if (!isMobile()) {
  gsap.set('.card-pro', { opacity: 0, y: 60 });

  ScrollTrigger.create({
    trigger: '.cards-pro',
    start: 'top 80%',
    onEnter: () => {
      gsap.to('.card-pro', {
        opacity: 1, y: 0, duration: 0.7,
        ease: 'power3.out', stagger: 0.2
      });
    }
  });
}

// ══════════════════════════════════════
//  PROCESOS — Texto descripción
// ══════════════════════════════════════
const proMade = document.querySelector('.pro-made');
proMade.innerHTML = 'Todos nuestros procesos son 100% artesanales y a mano.'.split(' ').map(w =>
  `<span class="word-wrap" style="display:inline-block;overflow:hidden;vertical-align:bottom;margin-right:14px">
    <span class="wd-pro" style="display:inline-block">${w}</span>
  </span>`
).join('');

gsap.set('.wd-pro', { y: 60, opacity: 0, filter: 'blur(8px)' });

gsap.to('.wd-pro', {
  y: 0, opacity: 1, filter: 'blur(0px)',
  duration: 0.9, ease: 'power3.out', stagger: 0.18,
  scrollTrigger: {
    trigger: '.pro-made',
    start: 'top 95%',
    toggleActions: 'play none none reverse'
  }
});

// ══════════════════════════════════════
//  NAVBAR — Menú hamburguesa
// ══════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {
  const hamburgerBtn    = document.getElementById('hamburger');
  const drawerEl        = document.getElementById('drawer');
  const drawerOverlayEl = document.getElementById('drawer-overlay');
  const drawerCloseBtn  = document.getElementById('drawer-close');

  function cerrarDrawer() {
    drawerEl.classList.remove('active');
    drawerOverlayEl.classList.remove('active');
    document.body.style.overflow = '';
  }

  hamburgerBtn.addEventListener('click', () => {
    drawerEl.classList.add('active');
    drawerOverlayEl.classList.add('active');
    document.body.style.overflow = 'hidden';
  });

  drawerCloseBtn.addEventListener('click', cerrarDrawer);
  drawerOverlayEl.addEventListener('click', cerrarDrawer);

  document.querySelectorAll('.drawer-link').forEach(link => {
    link.addEventListener('click', cerrarDrawer);
  });
});
}