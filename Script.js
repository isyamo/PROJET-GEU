(function () {
    'use strict';

    /* ── Wait for DOM ── */
    function initGeuCarousel() {
      const slides   = Array.from(document.querySelectorAll('.geu-carousel-item'));
      const dots     = Array.from(document.querySelectorAll('.geu-dot'));
      const counter  = document.getElementById('geuSlideCounter');
      const TOTAL    = slides.length;
      let   current  = 0;
      let   autoTimer;

      if (!slides.length) return; // nothing to do

      function goTo(idx) {
        slides[current].classList.remove('active');
        dots[current].classList.remove('active');

        current = ((idx % TOTAL) + TOTAL) % TOTAL;

        slides[current].classList.add('active');
        dots[current].classList.add('active');

        if (counter) {
          counter.innerHTML =
            '<span>' + String(current + 1).padStart(2, '0') + '</span> / 0' + TOTAL;
        }

        resetAuto();
      }

      function resetAuto() {
        clearInterval(autoTimer);
        autoTimer = setInterval(() => goTo(current + 1), 5500);
      }

      /* Arrow buttons */
      const btnPrev = document.getElementById('geuBtnPrev');
      const btnNext = document.getElementById('geuBtnNext');
      if (btnPrev) btnPrev.addEventListener('click', () => goTo(current - 1));
      if (btnNext) btnNext.addEventListener('click', () => goTo(current + 1));

      /* Dots */
      dots.forEach((dot, i) => dot.addEventListener('click', () => goTo(i)));

      /* Keyboard */
      document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') goTo(current + 1);
        if (e.key === 'ArrowLeft')  goTo(current - 1);
      });

      /* Touch / swipe */
      let touchX = 0;
      const frame = document.getElementById('geuOvalFrame');
      if (frame) {
        frame.addEventListener('touchstart', (e) => { touchX = e.touches[0].clientX; });
        frame.addEventListener('touchend',   (e) => {
          const dx = e.changedTouches[0].clientX - touchX;
          if (Math.abs(dx) > 40) goTo(current + (dx < 0 ? 1 : -1));
        });
      }

      /* GSAP entrance animations (only if GSAP is loaded) */
      if (typeof gsap !== 'undefined') {
        gsap.from('.geu-section-head', {
          opacity: 0, y: -30, duration: 0.9, ease: 'power3.out', delay: 0.1
        });
        gsap.from('.geu-oval-frame', {
          opacity: 0, y: 60, scale: 0.95, duration: 1.3, ease: 'power3.out', delay: 0.25
        });
        gsap.from('.geu-ctrl-btn', {
          opacity: 0, x: (i) => i === 0 ? -20 : 20,
          duration: 0.8, ease: 'power2.out', delay: 0.6, stagger: 0
        });
        gsap.from('.geu-dots-wrap', {
          opacity: 0, y: 10, duration: 0.7, ease: 'power2.out', delay: 0.8
        });
      }

      resetAuto();
    }

    /* Run after DOM is ready */
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initGeuCarousel);
    } else {
      initGeuCarousel();
    }
  })();

