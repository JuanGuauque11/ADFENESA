/* ============================================================
   historia.js  –  versión limpia y corregida
   ============================================================ */

// 1. Registrar plugins PRIMERO, antes de cualquier otra cosa
gsap.registerPlugin(ScrollTrigger);

// 2. Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', () => {

  /* ── Selectores ── */
  const titulo       = document.querySelector('.historia-title');
  const imagenBloque = document.querySelector('.hero-imagen-bloque');

  // Verificación de seguridad: si los elementos no existen, no continuar
  if (!titulo || !imagenBloque) {
    console.warn('historia.js: No se encontraron los elementos .historia-title o .hero-imagen-bloque');
    return;
  }

  /* ── Smooth scroll con Lenis ── */
  const lenis = new Lenis({
    duration: 1.4,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smooth: true,
  });

  // Conectar Lenis con ScrollTrigger
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  /* ── Estado inicial ── */
  gsap.set(titulo,       { opacity: 0, scale: 0.18 });
  gsap.set(imagenBloque, { opacity: 0, y: 30 });

  /* ── Timeline de entrada del título (una sola vez) ── */
  gsap.timeline({ delay: 0.3 })

    // 1. Título aparece pequeño al centro
    .to(titulo, {
      opacity: 1,
      duration: 0.5,
      ease: 'power2.out'
    })

    // 2. Crece al tamaño normal
    .to(titulo, {
      scale: 1,
      duration: 1.0,
      ease: 'expo.out'
    }, '-=0.1')

    // 3. Pausa visual
    .to(titulo, { duration: 1.2 })

    // 4. Sube y se hace grande
    .to(titulo, {
      fontSize: () => `${Math.min(window.innerWidth * 0.16, 190)}px`,
      y: () => -(window.innerHeight * 0.32),
      duration: 1.1,
      ease: 'power3.inOut'
    })

    // 5. Activa la línea decorativa bajo el título
    .to(titulo, {
      duration: 0,
      onStart: () => titulo.classList.add('linea-activa')
    }, '-=0.1')

    // 6. Aparece la imagen hero
    .to(imagenBloque, {
      opacity: 1,
      y: 0,
      duration: 0.9,
      ease: 'power3.out'
    }, '-=0.2');

  /* ── Scroll: las imágenes de sección aparecen una a una ── */
  document.querySelectorAll('.imagen-seccion-inner').forEach((bloque) => {

    // Estado inicial del bloque
    gsap.set(bloque, { opacity: 0, y: 50 });

    const img   = bloque.querySelector('.img-historia');
    const texto = bloque.querySelector('.img-descripcion p');

    if (img) gsap.set(img, { scale: 1.1 });

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

    // La foto hace un ligero zoom hacia afuera
    if (img) {
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
    }

    // El texto aparece con delay
    if (texto) {
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
    }
  });

  /* ── Drawer / hamburguesa ── */
  const hamburger     = document.getElementById('hamburger');
  const drawer        = document.getElementById('drawer');
  const drawerOverlay = document.getElementById('drawer-overlay');
  const drawerClose   = document.getElementById('drawer-close');

  if (hamburger && drawer && drawerOverlay && drawerClose) {
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
  }

  /* ── Imagen taller-deco: reveal + parallax ── */
  const tallerDeco = document.querySelector('.taller-deco');

  if (tallerDeco) {
    // Estado inicial: oculta con clip
    gsap.set(tallerDeco, { clipPath: 'inset(0% 0% 100% 0%)' });

    // Reveal de arriba hacia abajo al cargar
    gsap.to(tallerDeco, {
      clipPath: 'inset(0% 0% 0% 0%)',
      duration: 1.8,
      ease: 'power4.out',
      delay: 0.5
    });

    // Parallax con scroll
    gsap.to(tallerDeco, {
      yPercent: -20,
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 1.5
      }
    });

    // Parallax con el mouse
    window.addEventListener('mousemove', (e) => {
      const x = (e.clientX / window.innerWidth  - 0.5) * 20;
      const y = (e.clientY / window.innerHeight - 0.5) * 20;

      gsap.to(tallerDeco, {
        x,
        y,
        duration: 1.2,
        ease: 'power2.out'
      });
    });
  }

  /* ── Imagen iglesia-deco: reveal lateral ── */
  const iglesiaDeco = document.querySelector('.iglesia-deco');

  if (iglesiaDeco) {
    gsap.set(iglesiaDeco, { clipPath: 'inset(0% 100% 0% 0%)' });

    gsap.to(iglesiaDeco, {
      clipPath: 'inset(0% 0% 0% 0%)',
      duration: 1.8,
      ease: 'power4.out',
      scrollTrigger: {
        trigger: '.iglesia-deco-wrapper',
        start: 'top 80%',
        toggleActions: 'play none none reverse'
      }
    });
  }

}); // fin DOMContentLoaded