  const titulo     = document.querySelector('.historia-title');
  const lineaTitulo = titulo;          // usamos el ::after del mismo título
  const imagenBloque = document.querySelector('.hero-imagen-bloque');

  // Estado inicial
  gsap.set(titulo, { opacity: 0, scale: 0.18 });
  gsap.set(imagenBloque, { opacity: 0, y: 30 });

  // Timeline de entrada (se dispara automáticamente al cargar la página)
  gsap.timeline({ delay: 0.3 })

    // 1. Título aparece pequeño al centro
    .to(titulo, {
      opacity: 1,
      duration: 0.5,
      ease: 'power2.out'
    })

    // 2. Crece al tamaño centrado
    .to(titulo, {
      scale: 1,
      duration: 1.0,
      ease: 'expo.out'
    }, '-=0.1')

    // 3. Se queda quieto ~1.2s
    .to(titulo, { duration: 1.2 })

    // 4. Sube y se hace grande
    .to(titulo, {
      fontSize: () => `${Math.min(window.innerWidth * 0.16, 190)}px`,
      y: () => -(window.innerHeight * 0.32),
      duration: 1.1,
      ease: 'power3.inOut'
    })

    // 5. Línea bajo el título
    .to(titulo, {
      '--line-scale': 1,   // no aplica directo al ::after, usamos clase
      duration: 0,
      onStart: () => titulo.classList.add('linea-activa')
    }, '-=0.1')

    // 6. Aparece la primera imagen con descripción
    .to(imagenBloque, {
      opacity: 1,
      y: 0,
      duration: 0.9,
      ease: 'power3.out'
    }, '-=0.2');

      gsap.registerPlugin(ScrollTrigger);

  /* ── Smooth scroll con Lenis ── */
  const lenis = new Lenis({
    duration: 1.4,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smooth: true,
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  // Conectamos Lenis con ScrollTrigger
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  /* ── Animación de entrada del título (igual que antes) ── */
  gsap.set(titulo, { opacity: 0, scale: 0.18 });
  gsap.set(imagenBloque, { opacity: 0, y: 30 });

  gsap.timeline({ delay: 0.3 })
    .to(titulo, { opacity: 1, duration: 0.5, ease: 'power2.out' })
    .to(titulo, { scale: 1, duration: 1.0, ease: 'expo.out' }, '-=0.1')
    .to(titulo, { duration: 1.2 })
    .to(titulo, {
      fontSize: () => `${Math.min(window.innerWidth * 0.16, 190)}px`,
      y: () => -(window.innerHeight * 0.32),
      duration: 1.1,
      ease: 'power3.inOut'
    })
    .to(titulo, {
      duration: 0,
      onStart: () => titulo.classList.add('linea-activa')
    }, '-=0.1')
    .to(imagenBloque, {
      opacity: 1,
      y: 0,
      duration: 0.9,
      ease: 'power3.out'
    }, '-=0.2');

  /* ── Scroll: las 3 imágenes aparecen una a una ── */
  document.querySelectorAll('.imagen-seccion-inner').forEach((bloque) => {

    // El bloque completo sube y aparece
    gsap.to(bloque, {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: bloque,
        start: 'top 80%',
        toggleActions: 'play none none reverse'
      }
    });

    // La foto hace reveal de abajo hacia arriba
    const img = bloque.querySelector('.img-historia');
    gsap.to(img, {
      scale: 1,
      duration: 1.3,
      ease: 'power4.out',
      scrollTrigger: {
        trigger: bloque,
        start: 'top 78%',
        toggleActions: 'play none none reverse'
      }
    });

    // El texto aparece con delay
    const texto = bloque.querySelector('.img-descripcion p');
    gsap.from(texto, {
      opacity: 0,
      y: 20,
      duration: 0.8,
      ease: 'power2.out',
      delay: 0.3,
      scrollTrigger: {
        trigger: bloque,
        start: 'top 78%',
        toggleActions: 'play none none reverse'
      }
    });
  });

  // ── Drawer / hamburguesa ──
const hamburger     = document.getElementById('hamburger');
const drawer        = document.getElementById('drawer');
const drawerOverlay = document.getElementById('drawer-overlay');
const drawerClose   = document.getElementById('drawer-close');

hamburger.addEventListener('click', () => {
  drawer.classList.add('active');
  drawerOverlay.classList.add('active');
});

drawerClose.addEventListener('click', cerrarDrawer);
drawerOverlay.addEventListener('click', cerrarDrawer);

function cerrarDrawer() {
  drawer.classList.remove('active');
  drawerOverlay.classList.remove('active');
}

gsap.to('.taller-deco', {
  yPercent: -20,
  ease: 'none',
  scrollTrigger: {
    trigger: '.hero',
    start: 'top top',
    end: 'bottom top',
    scrub: 1.5
  }
});

// Estado inicial
gsap.set('.taller-deco', { clipPath: 'inset(0% 0% 100% 0%)' });

// Clip reveal de arriba hacia abajo
gsap.to('.taller-deco', {
  clipPath: 'inset(0% 0% 0% 0%)',
  duration: 1.8,
  ease: 'power4.out',
  delay: 0.5
});

// Parallax con el mouse
window.addEventListener('mousemove', (e) => {
  const x = (e.clientX / window.innerWidth - 0.5) * 20;
  const y = (e.clientY / window.innerHeight - 0.5) * 20;

  gsap.to('.taller-deco', {
    x: x,
    y: y,
    duration: 1.2,
    ease: 'power2.out'
  });
});

gsap.set('.iglesia-deco', { clipPath: 'inset(0% 100% 0% 0%)' });

gsap.to('.iglesia-deco', {
  clipPath: 'inset(0% 0% 0% 0%)',
  duration: 1.8,
  ease: 'power4.out',
  scrollTrigger: {
    trigger: '.iglesia-deco-wrapper',
    start: 'top 80%',
    toggleActions: 'play none none reverse'
  }
});