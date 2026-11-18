/* =========================================================
   PIXELVERSE — PREMIUM MOTION CONTROLLER
   Load AFTER js/script.js and js/interactivity.js.

   1. Page transitions  — wraps the global showView() synchronously.
   2. Scroll reveals    — one IntersectionObserver; elements replay every
      time they re-enter, and arrive from above when scrolling up.
   3. Parallax          — hero content + section headers, rAF-throttled,
      transform-only.
   Nothing here touches existing markup, listeners or logic; it only
   tags elements with classes/data attributes and adds CSS variables.
   ========================================================= */
(function () {
  'use strict';

  const root = document.documentElement;
  const main = document.getElementById('main');
  if (!main) return;

  const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  const reduced = () => motionQuery.matches;
  const supported = 'IntersectionObserver' in window;

  /* ---------------------------------------------------------
     Reveal rules: [selector, kind, baseDelayMs, staggerMs, maxStaggerSteps]
     kind → text (lift + de-blur) | rise (lift + scale) | pane (lift) | fade
     Stagger is the element's index among its siblings for that rule.
     --------------------------------------------------------- */
  const RULES = [
    // Home / hero (hero title is left alone: it has its own pixel-assemble animation)
    ['.hero-eyebrow', 'text', 120],
    ['.hero-sub', 'text', 520],
    ['.hero-actions', 'rise', 680],
    ['.hero-stats', 'rise', 820],
    ['.ascii-divider', 'fade', 0],
    ['.intro-card', 'rise', 0, 40, 3],

    // Home / interactivity sections (section shells keep their existing imx-reveal)
    ['.imx-section-head > *', 'text', 0, 30, 3],
    ['.imx-lab-grid > *', 'rise', 30, 30, 4],
    ['.imx-tools-grid > *', 'rise', 30, 30, 6],
    ['.imx-tabs', 'rise', 0],
    ['.imx-engine-layout > *', 'pane', 30, 30, 2],
    ['.imx-game-stats', 'rise', 0],
    ['.imx-game-shell', 'pane', 30],
    ['.imx-game-note', 'text', 0],

    // Zones + shared page headers
    ['.section-head', 'rise', 0],
    ['.zones-grid > *', 'rise', 40, 40, 4],

    // Zone detail
    ['.btn-back', 'fade', 0],
    ['.zone-header', 'rise', 30],
    ['.lesson-list > *', 'rise', 40, 40, 6],

    // Lesson
    ['.lesson-header > *', 'text', 30, 30, 3],
    ['.lesson-reading > *', 'text', 40, 30, 5],
    ['.activity-wrap', 'pane', 30],

    // Achievements
    ['.profile-card', 'rise', 40],
    ['.section-label', 'text', 0],
    ['.badges-grid > *', 'rise', 30, 30, 7],
    ['.btn-danger', 'rise', 0],
    ['.ascii-footer-art', 'fade', 0],
    ['.site-footer', 'fade', 0]
  ];

  let io = null;
  let hasNavigated = false;

  function markViewReveal(el) {
    el.style.setProperty('--mx-from-opacity', '0.5');
    el.classList.add('mx-view-change', 'mx-visible');
    const clearViewReveal = event => {
      if (event.target !== el || !event.animationName.startsWith('mx-')) return;
      el.classList.remove('mx-view-change');
      el.style.removeProperty('--mx-from-opacity');
      el.removeEventListener('animationend', clearViewReveal);
    };
    el.addEventListener('animationend', clearViewReveal);
  }

  function createObserver() {
    io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        const el = entry.target;
        const rect = entry.boundingClientRect;
        const tall = rect.height > (entry.rootBounds ? entry.rootBounds.height * 0.9 : 800);
        const enough = entry.intersectionRatio >= 0.14 || (tall && entry.intersectionRatio >= 0.02);

        if (entry.isIntersecting && enough) {
          el.classList.add('mx-visible');
        } else if (!entry.isIntersecting) {
          // Fully out of view → reset so it can play again on re-entry.
          // Remember which side it left from (display:none views report a 0-height rect).
          const leftAbove = rect.height > 0 && entry.rootBounds && rect.bottom <= entry.rootBounds.top;
          el.classList.toggle('mx-above', !!leftAbove);
          el.classList.remove('mx-visible');
        }
      });
    }, { root: main, rootMargin: '0px 0px -6% 0px', threshold: [0, 0.02, 0.14] });
  }

  function scan(scope) {
    if (!io || reduced()) return;
    const activeView = hasNavigated ? document.querySelector('.view.active') : null;
    const viewport = activeView ? main.getBoundingClientRect() : null;
    RULES.forEach(([selector, kind, base, step, cap]) => {
      const groups = new Map();
      scope.querySelectorAll(selector).forEach(el => {
        if (el.classList.contains('mx')) return;
        const parent = el.parentElement;
        const index = groups.get(parent) || 0;
        groups.set(parent, index + 1);
        const staggerIndex = Math.min(index, cap === undefined ? 4 : cap);
        const delay = (base || 0) + staggerIndex * (step || 0);
        const navigationDelay = Math.min(base || 0, 60) + staggerIndex * Math.min(step || 0, 50);
        el.classList.add('mx');
        el.dataset.mx = kind;
        el.dataset.mxNavigationDelay = navigationDelay + 'ms';
        el.style.setProperty('--mx-d', delay + 'ms');
        if (activeView && activeView.contains(el)) {
          const rect = el.getBoundingClientRect();
          if (rect.height > 0 && rect.bottom > viewport.top && rect.top < viewport.bottom) {
            el.style.setProperty('--mx-d', navigationDelay + 'ms');
            markViewReveal(el);
          }
        }
        io.observe(el);
      });
    });
  }

  /* Re-tag content that script.js re-renders. childList only (no subtree), so
     quiz / flashcard / terminal updates inside a lesson never retrigger reveals. */
  function watchDynamicContainers() {
    let queued = false;
    const mutationObserver = new MutationObserver(() => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(() => { queued = false; scan(document); });
    });
    ['zones-grid', 'zone-detail-content', 'lesson-content', 'badges-grid'].forEach(id => {
      const node = document.getElementById(id);
      if (node) mutationObserver.observe(node, { childList: true });
    });
  }

  /* ---------------------------------------------------------
     Page transitions: wrap the existing global showView().
     --------------------------------------------------------- */
  function prepareViewReveals(view) {
    if (!view || reduced()) return;
    const viewport = main.getBoundingClientRect();
    const reveals = Array.from(view.querySelectorAll('.mx')).map(el => {
      const rect = el.getBoundingClientRect();
      return {
        el,
        inViewport: rect.height > 0 && rect.bottom > viewport.top && rect.top < viewport.bottom
      };
    });

    reveals.forEach(({ el }) => {
      el.style.setProperty('--mx-d', el.dataset.mxNavigationDelay || '0ms');
      el.classList.remove('mx-view-change');
      el.style.removeProperty('--mx-from-opacity');
      el.classList.remove('mx-visible');
    });
    void view.offsetWidth;

    reveals.filter(reveal => reveal.inViewport).forEach(({ el }) => {
      markViewReveal(el);
    });
  }

  function wrapShowView() {
    const original = window.showView;
    if (typeof original !== 'function') return;

    window.showView = function (name) {
      const current = document.querySelector('.view.active');
      if (reduced() || !current || current.dataset.view === name) {
        return original.call(window, name);
      }
      const nextView = Array.from(document.querySelectorAll('.view'))
        .find(view => view.dataset.view === name);
      main.style.scrollBehavior = 'auto';
      main.scrollTop = 0;
      root.style.setProperty('--mx-bd', '0ms');
      let viewToReveal = null;
      const originalScrollTo = main.scrollTo;
      main.scrollTo = function (options) {
        if (options && options.top === 0) return;
        return originalScrollTo.apply(this, arguments);
      };
      if (nextView) {
        current.classList.remove('active', 'is-leaving');
        nextView.classList.add('active');
      }
      try {
        original.call(window, name);
        if (nextView) {
          nextView.classList.add('active');
          nextView.classList.remove('is-leaving');
          hasNavigated = true;
          viewToReveal = nextView;
        }
      } finally {
        main.scrollTo = originalScrollTo;
        main.style.scrollBehavior = '';
      }
      if (viewToReveal) {
        requestAnimationFrame(() => {
          if (viewToReveal.classList.contains('active')) prepareViewReveals(viewToReveal);
        });
      }
    };
  }

  /* ---------------------------------------------------------
     Parallax + scroll state (single rAF-throttled passive listener)
     --------------------------------------------------------- */
  function initScrollEffects() {
    const topbar = document.querySelector('.topbar');
    const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
    let ticking = false;
    let heroDirty = false;

    function update() {
      ticking = false;
      if (topbar) topbar.classList.toggle('mx-scrolled', main.scrollTop > 12);

      const home = document.getElementById('view-home');
      if (!home || !home.classList.contains('active') || reduced()) {
        clearHero();
        return;
      }

      const mainRect = main.getBoundingClientRect();

      // Hero content drifts down slower than the page and dissolves as it leaves.
      const hero = home.querySelector('.hero');
      const heroContent = hero && hero.querySelector('.hero-content');
      if (hero && heroContent) {
        const heroRect = hero.getBoundingClientRect();
        const progress = clamp((mainRect.top - heroRect.top) / Math.max(1, heroRect.height), 0, 1);
        if (progress > 0.001) {
          heroDirty = true;
          heroContent.style.transform = `translate3d(0, ${(progress * 64).toFixed(1)}px, 0) scale(${(1 - progress * 0.05).toFixed(4)})`;
          heroContent.style.opacity = String(clamp(1 - progress * 1.2, 0, 1).toFixed(3));
        } else {
          clearHero();
        }
      }

      // Section headers lag slightly behind their section for a layered feel.
      home.querySelectorAll('.imx-section').forEach(section => {
        const head = section.querySelector('.imx-section-head');
        if (!head) return;
        const rect = section.getBoundingClientRect();
        if (rect.bottom < mainRect.top - 120 || rect.top > mainRect.bottom + 120) return;
        const offset = rect.top - mainRect.top - mainRect.height * 0.35;
        head.style.transform = `translate3d(0, ${clamp(-offset * 0.07, -36, 36).toFixed(1)}px, 0)`;
      });
    }

    function clearHero() {
      if (!heroDirty) return;
      heroDirty = false;
      const heroContent = document.querySelector('.hero-content');
      if (heroContent) { heroContent.style.transform = ''; heroContent.style.opacity = ''; }
    }

    main.addEventListener('scroll', () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    }, { passive: true });
    window.addEventListener('resize', () => requestAnimationFrame(update), { passive: true });
    update();
  }

  /* ---------------------------------------------------------
     Boot
     --------------------------------------------------------- */
  function syncMotionPreference() {
    if (reduced() || !supported) {
      root.classList.remove('mx-on');
      return;
    }
    if (!io) createObserver();
    scan(document);
    root.classList.add('mx-on');
  }

  wrapShowView();
  initScrollEffects();
  if (supported) {
    syncMotionPreference();
    watchDynamicContainers();
  }
  const onPreferenceChange = () => syncMotionPreference();
  if (motionQuery.addEventListener) motionQuery.addEventListener('change', onPreferenceChange);
  else if (motionQuery.addListener) motionQuery.addListener(onPreferenceChange);
})();
