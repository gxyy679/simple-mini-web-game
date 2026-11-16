(() => {
  'use strict';

  const root = document.querySelector('.imx-content');
  if (!root) return;

  /* Track listeners, timers, and observers so the enhancement module can fully dispose on pagehide. */
  const disposers = [];
  const activeObservers = new Set();
  const pendingTimers = new Set();
  let activeModuleState = null;

  function listen(target, type, callback, options) {
    target.addEventListener(type, callback, options);
    const dispose = () => {
      target.removeEventListener(type, callback, options);
      const index = disposers.indexOf(dispose);
      if (index !== -1) disposers.splice(index, 1);
    };
    disposers.push(dispose);
    if (activeModuleState) activeModuleState.disposers.push(dispose);
  }

  function observe(observer, target) {
    activeObservers.add(observer);
    if (activeModuleState) activeModuleState.observers.add(observer);
    observer.observe(target);
    return observer;
  }

  function onDestroy(callback) {
    if (activeModuleState) activeModuleState.cleanups.push(callback);
    else disposers.push(callback);
  }

  /* Each section owns its listeners, observers, and animation cleanup callbacks. */
  function createSectionModule(setup) {
    const state = { disposers: [], observers: new Set(), cleanups: [] };
    let initialized = false;
    return {
      init() {
        if (initialized) return;
        initialized = true;
        const previous = activeModuleState;
        activeModuleState = state;
        try {
          setup();
        } catch (error) {
          this.destroy();
          throw error;
        } finally {
          activeModuleState = previous;
        }
      },
      destroy() {
        if (!initialized) return;
        initialized = false;
        state.cleanups.splice(0).reverse().forEach(cleanup => cleanup());
        state.disposers.splice(0).reverse().forEach(dispose => dispose());
        state.observers.forEach(observer => {
          observer.disconnect();
          activeObservers.delete(observer);
        });
        state.observers.clear();
      }
    };
  }

  function schedule(callback, delay) {
    const timer = window.setTimeout(() => {
      pendingTimers.delete(timer);
      callback();
    }, delay);
    pendingTimers.add(timer);
    return timer;
  }

  function clearScheduled(timer) {
    if (timer === undefined) return;
    window.clearTimeout(timer);
    pendingTimers.delete(timer);
  }

  /* Shared helpers keep canvas coordinates logical and refresh backing buffers only on size changes. */
  const canvasSurfaces = new WeakMap();
  const canvasRefreshers = [];

  function refreshCanvasSurface(canvas, context, surface, onResize) {
    const width = Math.max(1, canvas.clientWidth);
    const height = Math.max(1, canvas.clientHeight);
    const ratio = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
    if (surface.width === width && surface.height === height && surface.ratio === ratio) return;
    surface.width = width;
    surface.height = height;
    surface.ratio = ratio;
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    onResize();
  }

  function observeCanvas(canvas, context, onResize) {
    const surface = { width: 0, height: 0, ratio: 0 };
    canvasSurfaces.set(canvas, surface);
    const refresh = () => refreshCanvasSurface(canvas, context, surface, onResize);
    refresh();
    const observer = 'ResizeObserver' in window ? observe(new ResizeObserver(refresh), canvas) : null;
    canvasRefreshers.push(refresh);
    return () => {
      if (observer) observer.disconnect();
      const index = canvasRefreshers.indexOf(refresh);
      if (index !== -1) canvasRefreshers.splice(index, 1);
    };
  }

  function canvasPoint(canvas, event) {
    return { x: event.offsetX, y: event.offsetY };
  }

  /* The module's init/destroy boundary prevents retained page listeners and animation work. */
  function init() {
  const main = document.getElementById('main');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const sections = Array.from(root.querySelectorAll('.imx-section'));
  const modules = [];
  const initModule = module => {
    modules.push(module);
    module.init();
  };
  const isCanvasActive = canvas => canvas.matches(':hover') || canvas === document.activeElement;

  /* Section navigation and one-time reveals are isolated from the existing SPA navigation. */
  const navigationModule = createSectionModule(() => {
  if ('IntersectionObserver' in window) {
    const revealObserver = observe(new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('imx-is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { root: main, threshold: 0.06 }), sections[0]);
    sections.slice(1).forEach(section => revealObserver.observe(section));

  } else {
    sections.forEach(section => section.classList.add('imx-is-visible'));
  }
  });
  initModule(navigationModule);

  /* Lab controls update only their own cards and feedback regions. */
  const labModule = createSectionModule(() => {
  const clickButton = document.getElementById('imx-click-button');
  const clickCount = document.getElementById('imx-click-count');
  const toast = document.getElementById('imx-click-toast');
  const clickAnnouncement = document.getElementById('imx-click-announcement');
  let clicks = 0;
  let toastTimer;
  let clickAnnouncementTimer;
  listen(clickButton, 'click', event => {
    clicks += 1;
    clickCount.textContent = String(clicks);
    if (!reducedMotion.matches) {
      const bounds = clickButton.getBoundingClientRect();
      const ripple = document.createElement('span');
      ripple.className = 'imx-ripple';
      const pointX = event.detail === 0 ? bounds.width / 2 : Math.max(0, Math.min(bounds.width, event.clientX - bounds.left));
      const pointY = event.detail === 0 ? bounds.height / 2 : Math.max(0, Math.min(bounds.height, event.clientY - bounds.top));
      ripple.style.left = `${pointX}px`;
      ripple.style.top = `${pointY}px`;
      clickButton.appendChild(ripple);
      listen(ripple, 'animationend', () => ripple.remove(), { once: true });
      schedule(() => ripple.remove(), 650);
    }
    toast.textContent = 'Click registered';
    clearScheduled(toastTimer);
    toastTimer = schedule(() => { toast.textContent = ''; }, 1800);
    clearScheduled(clickAnnouncementTimer);
    clickAnnouncementTimer = schedule(() => {
      clickAnnouncement.textContent = `Click registered. Total clicks: ${clicks}.`;
    }, 500);
  });

  const tiltPanel = document.getElementById('imx-tilt-panel');
  let tiltFrame = 0;
  let pendingPointer = null;
  listen(tiltPanel, 'pointermove', event => {
    if (reducedMotion.matches || event.pointerType === 'touch') return;
    pendingPointer = { x: event.clientX, y: event.clientY };
    if (tiltFrame) return;
    tiltFrame = requestAnimationFrame(() => {
      tiltFrame = 0;
      if (!pendingPointer) return;
      const pointer = pendingPointer;
      pendingPointer = null;
      const bounds = tiltPanel.getBoundingClientRect();
      const pointerX = Math.max(-1, Math.min(1, ((pointer.x - bounds.left) / Math.max(1, bounds.width) - 0.5) * 2));
      const pointerY = Math.max(-1, Math.min(1, ((pointer.y - bounds.top) / Math.max(1, bounds.height) - 0.5) * 2));
      tiltPanel.style.setProperty('--imx-tilt-x', `${-pointerY * 18}deg`);
      tiltPanel.style.setProperty('--imx-tilt-y', `${pointerX * 20}deg`);
      tiltPanel.style.setProperty('--imx-pointer-x', `${(pointerX + 1) * 50}%`);
      tiltPanel.style.setProperty('--imx-pointer-y', `${(pointerY + 1) * 50}%`);
      tiltPanel.style.setProperty('--imx-shadow-x', `${-pointerX * 8}px`);
      tiltPanel.style.setProperty('--imx-shadow-y', `${-pointerY * 8}px`);
    });
  });
  const resetTilt = () => {
    if (tiltFrame) cancelAnimationFrame(tiltFrame);
    tiltFrame = 0;
    pendingPointer = null;
    tiltPanel.style.setProperty('--imx-tilt-x', '0deg');
    tiltPanel.style.setProperty('--imx-tilt-y', '0deg');
    tiltPanel.style.setProperty('--imx-pointer-x', '50%');
    tiltPanel.style.setProperty('--imx-pointer-y', '50%');
    tiltPanel.style.setProperty('--imx-shadow-x', '0px');
    tiltPanel.style.setProperty('--imx-shadow-y', '0px');
  };
  listen(tiltPanel, 'pointerleave', resetTilt);
  listen(tiltPanel, 'blur', resetTilt);
  listen(reducedMotion, 'change', () => {
    if (reducedMotion.matches) resetTilt();
  });

  const lightsSwitch = document.getElementById('imx-lights-switch');
  const lightsLabel = document.getElementById('imx-lights-label');
  listen(lightsSwitch, 'click', () => {
    const on = lightsSwitch.getAttribute('aria-checked') !== 'true';
    lightsSwitch.setAttribute('aria-checked', String(on));
    lightsSwitch.setAttribute('aria-label', on ? 'Turn lights off' : 'Turn lights on');
    lightsLabel.textContent = `Lights ${on ? 'on' : 'off'}`;
    lightsSwitch.closest('.imx-state-card').classList.toggle('imx-lights-on', on);
  });

  const orbSpeed = document.getElementById('imx-orb-speed');
  const orbTrack = root.querySelector('.imx-orb-track');
  const orb = orbTrack.querySelector('.imx-orb');
  const speedValue = document.getElementById('imx-speed-value');
  let orbDuration = Number(orbSpeed.value);
  function updateOrbDistance() {
    const trackStyle = getComputedStyle(orbTrack);
    const horizontalPadding = parseFloat(trackStyle.paddingLeft) + parseFloat(trackStyle.paddingRight);
    const distance = Math.max(0, orbTrack.clientWidth - horizontalPadding - orb.offsetWidth);
    orbTrack.style.setProperty('--imx-orb-distance', `${distance}px`);
  }
  if ('ResizeObserver' in window) {
    observe(new ResizeObserver(updateOrbDistance), orbTrack);
  } else {
    listen(window, 'resize', updateOrbDistance, { passive: true });
  }
  function updateOrbSpeed() {
    const duration = Number(orbSpeed.value);
    const previousAnimation = orb.getAnimations()[0];
    const previousTime = previousAnimation && previousAnimation.currentTime;
    orbTrack.style.setProperty('--imx-orb-duration', `${duration}s`);
    const animation = orb.getAnimations()[0];
    if (animation && typeof previousTime === 'number' && orbDuration > 0) {
      animation.currentTime = previousTime * duration / orbDuration;
    }
    speedValue.textContent = duration.toFixed(1);
    orbDuration = duration;
  }
  updateOrbDistance();
  listen(orbSpeed, 'input', updateOrbSpeed);
  updateOrbSpeed();

  });
  initModule(labModule);

  /* Tool disclosure and tab keyboard interaction share a separate bounded module. */
  const toolsModule = createSectionModule(() => {
  root.querySelectorAll('.imx-tool-button').forEach(button => {
    listen(button, 'click', () => {
      const expanded = button.getAttribute('aria-expanded') === 'true';
      button.setAttribute('aria-expanded', String(!expanded));
      document.getElementById(button.getAttribute('aria-controls')).hidden = expanded;
    });
  });

  const tabData = [
    ['objects', 'Game objects', 'Objects are the characters, props, and effects that make up a game world.', 'Choose a shape and click the stage to add an object.'],
    ['scenes', 'Scenes', 'Scenes are the spaces or screens that organize a game, such as a menu, level, or finish screen.', 'Add objects, then reset the stage to start a fresh scene.'],
    ['assets', 'Assets', 'Assets are the visual, audio, and data resources a game uses.', 'Choose a circle, square, or triangle before placing it.'],
    ['physics', 'Physics', 'Physics simulates movement, gravity, and collisions between game objects.', 'Add objects and turn on Physics to see them fall and bounce.'],
    ['animation', 'Animation', 'Animation changes an object over time to make a world feel alive.', 'Turn on Animation to rotate and pulse the shapes.'],
    ['input', 'User input', 'Input lets players control a game with a keyboard, pointer, or touch.', 'Turn on Input, focus or hover the stage, then use arrow keys.'],
    ['logic', 'Game logic', 'Game logic defines rules and outcomes in response to events.', 'Turn on Logic and move the player into an object to collect it.']
  ];
  const tabs = Array.from(root.querySelectorAll('.imx-tab'));
  const tabPanel = document.getElementById('imx-tab-panel');
  const topicTitle = document.getElementById('imx-topic-title');
  const topicCopy = document.getElementById('imx-topic-copy');
  const tryHint = tabPanel.querySelector('.imx-try-hint');

  function selectTab(index, moveFocus) {
    const [key, title, copy, hint] = tabData[index];
    tabs.forEach((tab, tabIndex) => {
      const selected = tabIndex === index;
      tab.setAttribute('aria-selected', String(selected));
      tab.tabIndex = selected ? 0 : -1;
    });
    tabPanel.setAttribute('aria-labelledby', `imx-tab-${key}`);
    topicTitle.textContent = title;
    topicCopy.textContent = copy;
    tryHint.innerHTML = `<strong>Try it:</strong> ${hint}`;
    if (moveFocus) tabs[index].focus();
  }
  tabs.forEach((tab, index) => {
    listen(tab, 'click', () => selectTab(index, false));
    listen(tab, 'keydown', event => {
      let nextIndex = index;
      if (event.key === 'ArrowRight') nextIndex = (index + 1) % tabs.length;
      else if (event.key === 'ArrowLeft') nextIndex = (index - 1 + tabs.length) % tabs.length;
      else if (event.key === 'Home') nextIndex = 0;
      else if (event.key === 'End') nextIndex = tabs.length - 1;
      else return;
      event.preventDefault();
      selectTab(nextIndex, true);
    });
  });

  });
  initModule(toolsModule);

  /* The engine stage owns its input, resize, and visibility lifecycles. */
  const engineModule = createSectionModule(() => {
  const engineSection = document.getElementById('imx-engine');
  const engineCanvas = document.getElementById('imx-engine-canvas');
  const engineContext = engineCanvas.getContext('2d');
  const engineObjects = [];
  const engineReadout = document.getElementById('imx-stage-readout');
  const physicsControl = document.getElementById('imx-physics');
  const animationControl = document.getElementById('imx-animation');
  const inputControl = document.getElementById('imx-input');
  const logicControl = document.getElementById('imx-logic');
  const shapeControl = document.getElementById('imx-asset-shape');
  let collected = 0;
  let engineVisible = false;
  let engineFrame = 0;
  let engineLastTime = 0;
  let engineWidth = 0;
  let engineHeight = 0;
  const player = { x: 0, y: 0, radius: 11 };
  const pressedKeys = new Set();
  const engineReducedQuery = reducedMotion;
  let enginePointer = null;

  function drawShape(context, object, pulse) {
    const radius = object.radius * (pulse || 1);
    context.save();
    context.translate(object.x, object.y);
    if (animationControl.checked && !engineReducedQuery.matches) context.rotate(object.rotation);
    context.fillStyle = object.color;
    context.shadowColor = object.color;
    context.shadowBlur = 12;
    context.beginPath();
    if (object.shape === 'square') {
      context.rect(-radius, -radius, radius * 2, radius * 2);
    } else if (object.shape === 'triangle') {
      context.moveTo(0, -radius);
      context.lineTo(radius, radius);
      context.lineTo(-radius, radius);
      context.closePath();
    } else {
      context.arc(0, 0, radius, 0, Math.PI * 2);
    }
    context.fill();
    context.restore();
  }

  function updateEngineReadout() {
    engineReadout.textContent = `Objects: ${engineObjects.length} · Collected: ${collected}`;
  }

  function drawEngine() {
    const surface = canvasSurfaces.get(engineCanvas);
    engineWidth = surface ? surface.width : engineCanvas.clientWidth;
    engineHeight = surface ? surface.height : engineCanvas.clientHeight;
    const context = engineContext;
    context.clearRect(0, 0, engineWidth, engineHeight);
    context.save();
    context.strokeStyle = 'rgba(155, 255, 192, 0.08)';
    context.lineWidth = 1;
    for (let x = 20; x < engineWidth; x += 32) {
      context.beginPath(); context.moveTo(x, 0); context.lineTo(x, engineHeight); context.stroke();
    }
    for (let y = 20; y < engineHeight; y += 32) {
      context.beginPath(); context.moveTo(0, y); context.lineTo(engineWidth, y); context.stroke();
    }
    context.restore();
    const pulse = animationControl.checked && !engineReducedQuery.matches ? 1 + Math.sin(performance.now() / 210) * 0.08 : 1;
    for (let index = 0; index < engineObjects.length; index += 1) {
      drawShape(context, engineObjects[index], pulse);
    }
    if (inputControl.checked) {
      context.beginPath();
      context.fillStyle = '#fff';
      context.shadowColor = '#fff';
      context.shadowBlur = 15;
      context.arc(player.x, player.y, player.radius, 0, Math.PI * 2);
      context.fill();
      context.shadowBlur = 0;
      context.fillStyle = '#17231c';
      context.font = '10px sans-serif';
      context.textAlign = 'center';
      context.textBaseline = 'middle';
      context.fillText('P', player.x, player.y);
    }
  }

  /* Observe displayed stage size and cap its high-DPI backing buffer at 2x. */
  const disconnectEngineCanvasResize = observeCanvas(engineCanvas, engineContext, drawEngine);

  function collectOverlapping() {
    if (!inputControl.checked || !logicControl.checked) return;
    let collectedNow = 0;
    for (let index = engineObjects.length - 1; index >= 0; index -= 1) {
      const object = engineObjects[index];
      if (Math.hypot(object.x - player.x, object.y - player.y) < object.radius + player.radius) {
        engineObjects.splice(index, 1);
        collected += 1;
        collectedNow += 1;
      }
    }
    if (collectedNow) updateEngineReadout();
  }

  function stopEngineLoop() {
    if (engineFrame) cancelAnimationFrame(engineFrame);
    engineFrame = 0;
    engineLastTime = 0;
  }
  onDestroy(stopEngineLoop);
  onDestroy(disconnectEngineCanvasResize);

  function shouldAnimateEngine() {
    let physicsActive = false;
    if (physicsControl.checked) {
      for (let index = 0; index < engineObjects.length; index += 1) {
        const object = engineObjects[index];
        if (object.velocityY !== 0 || object.y + object.radius < engineHeight - 0.5) {
          physicsActive = true;
          break;
        }
      }
    }
    const animationActive = animationControl.checked && engineObjects.length > 0;
    return physicsActive || animationActive
      || (inputControl.checked && (Boolean(enginePointer) || pressedKeys.size > 0));
  }

  function engineStep(time) {
    if (!engineVisible || document.hidden || engineReducedQuery.matches || !shouldAnimateEngine()) {
      engineFrame = 0;
      drawEngine();
      return;
    }
    const delta = Math.min(0.04, engineLastTime ? (time - engineLastTime) / 1000 : 0);
    engineLastTime = time;
    if (physicsControl.checked) {
      for (let index = 0; index < engineObjects.length; index += 1) {
        const object = engineObjects[index];
        if (object.y + object.radius >= engineHeight - 0.5 && object.velocityY === 0) continue;
        object.velocityY += 300 * delta;
        object.y += object.velocityY * delta;
        if (object.y + object.radius > engineHeight) {
          object.y = engineHeight - object.radius;
          object.velocityY *= -0.72;
          if (Math.abs(object.velocityY) < 24) object.velocityY = 0;
        }
      }
    }
    if (inputControl.checked) {
      const step = 210 * delta;
      if (pressedKeys.has('ArrowLeft')) player.x -= step;
      if (pressedKeys.has('ArrowRight')) player.x += step;
      if (pressedKeys.has('ArrowUp')) player.y -= step;
      if (pressedKeys.has('ArrowDown')) player.y += step;
      if (enginePointer) {
        const distance = Math.hypot(enginePointer.x - player.x, enginePointer.y - player.y);
        if (distance < 1) {
          player.x = enginePointer.x;
          player.y = enginePointer.y;
          enginePointer = null;
        } else {
          player.x += (enginePointer.x - player.x) * Math.min(1, delta * 9);
          player.y += (enginePointer.y - player.y) * Math.min(1, delta * 9);
        }
      }
      player.x = Math.max(player.radius, Math.min(engineWidth - player.radius, player.x));
      player.y = Math.max(player.radius, Math.min(engineHeight - player.radius, player.y));
      collectOverlapping();
    }
    if (animationControl.checked) {
      for (let index = 0; index < engineObjects.length; index += 1) {
        engineObjects[index].rotation += delta * 1.15;
      }
    }
    drawEngine();
    engineFrame = requestAnimationFrame(engineStep);
  }

  function startEngineLoop() {
    if (!engineVisible || document.hidden || engineFrame) return;
    if (engineReducedQuery.matches || !shouldAnimateEngine()) {
      drawEngine();
      return;
    }
    engineFrame = requestAnimationFrame(engineStep);
  }

  function addEngineObject(event) {
    if (engineObjects.length >= 25) return;
    const point = canvasPoint(engineCanvas, event);
    const x = Math.max(14, Math.min(engineWidth - 14, point.x));
    const y = Math.max(14, Math.min(engineHeight - 14, point.y));
    const object = {
      x,
      y,
      radius: 9 + Math.random() * 5,
      shape: shapeControl.value,
      color: ['#65d879', '#55c5ff', '#ffd166', '#d2a7ff'][engineObjects.length % 4],
      velocityY: 0,
      rotation: 0
    };
    engineObjects.push(object);
    updateEngineReadout();
    startEngineLoop();
    drawEngine();
  }

  listen(engineCanvas, 'click', addEngineObject);
  listen(engineCanvas, 'pointermove', event => {
    if (!inputControl.checked) return;
    enginePointer = canvasPoint(engineCanvas, event);
    if (!engineFrame) {
      player.x = enginePointer.x;
      player.y = enginePointer.y;
      collectOverlapping();
      drawEngine();
    }
    startEngineLoop();
  });
  listen(engineCanvas, 'pointerleave', () => { enginePointer = null; });

  [physicsControl, animationControl, inputControl, logicControl].forEach(control => {
    listen(control, 'change', () => {
      if (inputControl.checked && player.x === 0 && player.y === 0) {
        player.x = engineWidth / 2 || engineCanvas.clientWidth / 2;
        player.y = engineHeight / 2 || engineCanvas.clientHeight / 2;
      }
      if (!inputControl.checked) enginePointer = null;
      stopEngineLoop();
      startEngineLoop();
      drawEngine();
    });
  });

  listen(document.getElementById('imx-stage-reset'), 'click', () => {
    engineObjects.length = 0;
    collected = 0;
    player.x = engineWidth / 2 || engineCanvas.clientWidth / 2;
    player.y = engineHeight / 2 || engineCanvas.clientHeight / 2;
    updateEngineReadout();
    drawEngine();
  });

  listen(engineCanvas, 'focus', drawEngine);
  listen(engineCanvas, 'blur', () => pressedKeys.clear());
  if ('IntersectionObserver' in window) {
    observe(new IntersectionObserver(entries => {
      engineVisible = entries[0].isIntersecting;
      if (engineVisible && !document.hidden) {
        drawEngine();
        startEngineLoop();
      } else {
        stopEngineLoop();
      }
    }, { root: main, threshold: 0.05 }), engineSection);
  } else {
    engineVisible = true;
    drawEngine();
  }

  listen(document, 'keydown', event => {
    if (!inputControl.checked || !isCanvasActive(engineCanvas)) return;
    if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) {
      event.preventDefault();
      enginePointer = null;
      pressedKeys.add(event.key);
      if (engineReducedQuery.matches) {
        const amount = 18;
        if (event.key === 'ArrowLeft') player.x -= amount;
        if (event.key === 'ArrowRight') player.x += amount;
        if (event.key === 'ArrowUp') player.y -= amount;
        if (event.key === 'ArrowDown') player.y += amount;
        player.x = Math.max(player.radius, Math.min(engineWidth - player.radius, player.x));
        player.y = Math.max(player.radius, Math.min(engineHeight - player.radius, player.y));
        collectOverlapping();
        drawEngine();
      }
      startEngineLoop();
    }
  });
  listen(document, 'keyup', event => { pressedKeys.delete(event.key); });
  listen(window, 'blur', () => pressedKeys.clear());
  listen(document, 'visibilitychange', () => {
    pressedKeys.clear();
    if (document.hidden) stopEngineLoop();
    else startEngineLoop();
  });

  });
  initModule(engineModule);

  /* The signal game owns its bounded item pool, controls, and tab-visibility lifecycle. */
  const gameModule = createSectionModule(() => {
  const gameCanvas = document.getElementById('imx-game-canvas');
  const gameContext = gameCanvas.getContext('2d');
  const gameScoreNode = document.getElementById('imx-game-score');
  const gameFeedbackOverlay = document.getElementById('imx-game-feedback');
  const gameCelebration = document.getElementById('imx-game-celebration');
  const gameCelebrationSpeech = gameCelebration.querySelector('.imx-game-speech');
  const gameTimeNode = document.getElementById('imx-game-time');
  const gameBestNode = document.getElementById('imx-game-best');
  const gameAnnouncement = document.getElementById('imx-game-announcement');
  const gameOverlay = document.getElementById('imx-game-overlay');
  const gameOverlayTitle = document.getElementById('imx-game-overlay-title');
  const gameOverlayCopy = document.getElementById('imx-game-overlay-copy');
  const gameStartButton = document.getElementById('imx-game-start');
  const gameSection = document.getElementById('imx-game');
  const bestKey = 'pixelverse_signal_best_v1';
  let gameVisible = false;
  let gameRunning = false;
  let gameFrame = 0;
  let gameLastTime = 0;
  let elapsedTime = 0;
  let spawnElapsed = 0;
  let gameAnnouncementTimer;
  let gameCelebrationTimer;
  let gameScore = 0;
  let consecutivePositiveScores = 0;
  let consecutiveNegativeScores = 0;
  let gameBest = 0;
  let gameWidth = 0;
  let gameHeight = 0;
  let gameBackground = null;
  let gameBackgroundHeight = 0;
  let platformGlowUntil = 0;
  let gameItems = [];
  const gameFeedbackAnimations = new Map();
  const paddle = { x: 0, width: 82, height: 13, y: 0 };
  const gameKeys = new Set();
  listen(window, 'blur', () => gameKeys.clear());

  function animateGameFeedback(target, keyframes, duration) {
    gameFeedbackAnimations.get(target)?.cancel();
    const animation = target.animate(keyframes, { duration, easing: 'ease-out' });
    gameFeedbackAnimations.set(target, animation);
    animation.onfinish = () => {
      if (gameFeedbackAnimations.get(target) === animation) gameFeedbackAnimations.delete(target);
    };
  }

  function triggerGameFeedback(positive) {
    const feedbackColor = getComputedStyle(document.documentElement)
      .getPropertyValue(positive ? '--imx-game-feedback-positive' : '--imx-game-feedback-negative').trim();
    const reduced = reducedMotion.matches;
    gameFeedbackOverlay.dataset.tone = positive ? 'positive' : 'negative';
    animateGameFeedback(gameFeedbackOverlay, [
      { opacity: 0 },
      { opacity: reduced ? 0.32 : 0.62, offset: 0.18 },
      { opacity: 0 }
    ], reduced ? 420 : 620);
    animateGameFeedback(gameScoreNode, [
      { color: getComputedStyle(gameScoreNode).color, textShadow: 'none', transform: 'scale(1)' },
      { color: feedbackColor, textShadow: `0 0 ${reduced ? 7 : 14}px ${feedbackColor}`, transform: `scale(${reduced ? 1.06 : 1.18})`, offset: 0.28 },
      { color: getComputedStyle(gameScoreNode).color, textShadow: 'none', transform: 'scale(1)' }
    ], reduced ? 420 : 620);
    if (!positive) {
      animateGameFeedback(gameCanvas, reduced
        ? [{ transform: 'translateX(0)' }, { transform: 'translateX(-1px)' }, { transform: 'translateX(1px)' }, { transform: 'translateX(0)' }]
        : [{ transform: 'translateX(0)' }, { transform: 'translateX(-5px)' }, { transform: 'translateX(4px)' }, { transform: 'translateX(-3px)' }, { transform: 'translateX(2px)' }, { transform: 'translateX(0)' }], reduced ? 220 : 300);
    }
  }

  function celebrateScoreStreak(tone, message) {
    clearScheduled(gameCelebrationTimer);
    gameCelebration.classList.remove('is-celebrating');
    gameCelebration.dataset.tone = tone;
    gameCelebrationSpeech.textContent = message;
    void gameCelebration.offsetWidth;
    gameCelebration.classList.add('is-celebrating');
    gameCelebrationTimer = schedule(() => {
      gameCelebration.classList.remove('is-celebrating');
      gameCelebrationTimer = undefined;
    }, reducedMotion.matches ? 1600 : 2400);
  }

  onDestroy(() => {
    gameFeedbackAnimations.forEach(animation => animation.cancel());
    gameFeedbackAnimations.clear();
    clearScheduled(gameCelebrationTimer);
    gameCelebration.classList.remove('is-celebrating');
  });

  try {
    const storedBest = Number(localStorage.getItem(bestKey));
    if (Number.isFinite(storedBest) && storedBest > 0) gameBest = storedBest;
  } catch (error) {
    console.warn('Signal game best score could not be read.', error);
  }
  gameBestNode.textContent = String(gameBest);

  /* Debounce score announcements so rapid catches do not flood screen readers. */
  function announceGame(message) {
    clearScheduled(gameAnnouncementTimer);
    gameAnnouncementTimer = schedule(() => {
      gameAnnouncement.textContent = message;
    }, 650);
  }

  function drawGame() {
    const surface = canvasSurfaces.get(gameCanvas);
    gameWidth = surface ? surface.width : gameCanvas.clientWidth;
    gameHeight = surface ? surface.height : gameCanvas.clientHeight;
    paddle.y = gameHeight - 28;
    paddle.x = Math.max(paddle.width / 2, Math.min(gameWidth - paddle.width / 2, paddle.x || gameWidth / 2));
    const context = gameContext;
    context.clearRect(0, 0, gameWidth, gameHeight);
    if (!gameBackground || gameBackgroundHeight !== gameHeight) {
      gameBackground = context.createLinearGradient(0, 0, 0, gameHeight);
      gameBackground.addColorStop(0, '#14251d');
      gameBackground.addColorStop(1, '#09100c');
      gameBackgroundHeight = gameHeight;
    }
    context.fillStyle = gameBackground;
    context.fillRect(0, 0, gameWidth, gameHeight);
    context.save();
    context.strokeStyle = 'rgba(155, 255, 192, 0.06)';
    context.lineWidth = 1;
    for (let y = 24; y < gameHeight; y += 32) {
      context.beginPath(); context.moveTo(0, y); context.lineTo(gameWidth, y); context.stroke();
    }
    context.restore();
    for (let index = 0; index < gameItems.length; index += 1) {
      const item = gameItems[index];
      context.beginPath();
      context.fillStyle = item.kind === 'signal' ? '#55c5ff' : '#f06b68';
      context.shadowColor = context.fillStyle;
      context.shadowBlur = 14;
      context.arc(item.x, item.y, item.radius, 0, Math.PI * 2);
      context.fill();
      context.shadowBlur = 0;
      context.fillStyle = '#08110d';
      context.font = '700 11px sans-serif';
      context.textAlign = 'center';
      context.textBaseline = 'middle';
      context.fillText(item.kind === 'signal' ? '+' : '!', item.x, item.y);
    }
    context.fillStyle = '#f2f0dc';
    const glowRemaining = Math.max(0, platformGlowUntil - performance.now());
    const glowProgress = 1 - glowRemaining / 620;
    const glowPulse = reducedMotion.matches ? (glowRemaining > 0 ? 1 : 0) : Math.sin(Math.PI * glowProgress);
    context.shadowColor = glowRemaining > 0 ? `rgba(161, 254, 160, ${0.55 + glowPulse * 0.4})` : '#9bffc0';
    context.shadowBlur = 14 + glowPulse * 24;
    context.beginPath();
    context.roundRect(paddle.x - paddle.width / 2, paddle.y, paddle.width, paddle.height, 7);
    context.fill();
    context.shadowBlur = 0;
  }

  /* Observe the game canvas dimensions and redraw on resize without measuring during animation frames. */
  const disconnectGameCanvasResize = observeCanvas(gameCanvas, gameContext, drawGame);
  onDestroy(disconnectGameCanvasResize);
  onDestroy(() => {
    if (gameFrame) cancelAnimationFrame(gameFrame);
    gameFrame = 0;
  });

  function endGame() {
    gameRunning = false;
    if (gameFrame) cancelAnimationFrame(gameFrame);
    gameFrame = 0;
    if (gameScore > gameBest) {
      gameBest = gameScore;
      gameBestNode.textContent = String(gameBest);
      try {
        localStorage.setItem(bestKey, String(gameBest));
      } catch (error) {
        console.warn('Signal game best score could not be saved.', error);
      }
    }
    gameOverlayTitle.textContent = 'Time is up!';
    gameOverlayCopy.textContent = `You scored ${gameScore}. Best score: ${gameBest}.`;
    announceGame(`Time is up. You scored ${gameScore}. Best score: ${gameBest}.`);
    gameStartButton.textContent = 'Play again';
    gameOverlay.hidden = false;
    drawGame();
  }

  function spawnGameItem() {
    if (gameItems.length >= 64) return;
    gameItems.push({
      x: 18 + Math.random() * Math.max(1, gameWidth - 36),
      y: -14,
      radius: 11,
      kind: Math.random() < 0.68 ? 'signal' : 'glitch'
    });
  }

  function gameStep(time) {
    if (!gameVisible || document.hidden || !gameRunning) {
      gameFrame = 0;
      return;
    }
    const delta = Math.min(0.05, gameLastTime ? (time - gameLastTime) / 1000 : 0);
    gameLastTime = time;
    elapsedTime += delta;
    spawnElapsed += delta;
    if (spawnElapsed >= Math.max(0.3, 0.68 - elapsedTime * 0.009)) {
      spawnElapsed = 0;
      spawnGameItem();
    }
    const speed = 105 + elapsedTime * 8;
    if (gameKeys.has('ArrowLeft')) paddle.x -= 300 * delta;
    if (gameKeys.has('ArrowRight')) paddle.x += 300 * delta;
    paddle.x = Math.max(paddle.width / 2, Math.min(gameWidth - paddle.width / 2, paddle.x));
    for (let index = gameItems.length - 1; index >= 0; index -= 1) {
      const item = gameItems[index];
      item.y += speed * delta;
      if (item.y + item.radius >= paddle.y && item.y - item.radius <= paddle.y + paddle.height
        && Math.abs(item.x - paddle.x) <= paddle.width / 2 + item.radius) {
        const positive = item.kind === 'signal';
        if (positive) platformGlowUntil = performance.now() + 620;
        consecutivePositiveScores = positive ? consecutivePositiveScores + 1 : 0;
        consecutiveNegativeScores = positive ? 0 : consecutiveNegativeScores + 1;
        gameScore += item.kind === 'signal' ? 1 : -2;
        gameScoreNode.textContent = String(gameScore);
        triggerGameFeedback(positive);
        if (consecutivePositiveScores === 4) {
          celebrateScoreStreak('positive', 'Nice one lods!');
        } else if (consecutiveNegativeScores === 2) {
          celebrateScoreStreak('negative', 'Hustisyaaa...mamaaaa....');
        }
        announceGame(`Score ${gameScore}.`);
        gameItems.splice(index, 1);
      } else if (item.y >= gameHeight + item.radius) {
        consecutivePositiveScores = 0;
        consecutiveNegativeScores = 0;
        gameItems.splice(index, 1);
      }
    }
    gameTimeNode.textContent = String(Math.max(0, Math.ceil(30 - elapsedTime)));
    drawGame();
    if (elapsedTime >= 30) {
      endGame();
      return;
    }
    gameFrame = requestAnimationFrame(gameStep);
  }

  function startGame() {
    clearScheduled(gameCelebrationTimer);
    gameCelebrationTimer = undefined;
    gameCelebration.classList.remove('is-celebrating');
    gameItems = [];
    gameScore = 0;
    consecutivePositiveScores = 0;
    consecutiveNegativeScores = 0;
    elapsedTime = 0;
    spawnElapsed = 0;
    gameLastTime = 0;
    gameScoreNode.textContent = '0';
    gameTimeNode.textContent = '30';
    gameOverlay.hidden = true;
    gameRunning = true;
    drawGame();
    if (gameVisible && !document.hidden && !gameFrame) gameFrame = requestAnimationFrame(gameStep);
  }

  listen(gameStartButton, 'click', startGame);
  listen(gameCanvas, 'pointerdown', event => {
    const point = canvasPoint(gameCanvas, event);
    paddle.x = point.x;
    gameCanvas.classList.add('imx-is-dragging');
    if (event.pointerType !== 'mouse') gameCanvas.setPointerCapture(event.pointerId);
    drawGame();
  });
  const endGamePointerDrag = () => gameCanvas.classList.remove('imx-is-dragging');
  listen(gameCanvas, 'pointerup', endGamePointerDrag);
  listen(gameCanvas, 'pointercancel', endGamePointerDrag);
  listen(gameCanvas, 'lostpointercapture', endGamePointerDrag);
  listen(gameCanvas, 'blur', () => gameKeys.clear());
  listen(gameCanvas, 'pointermove', event => {
    if (event.pointerType !== 'mouse' && event.buttons === 0) return;
    paddle.x = canvasPoint(gameCanvas, event).x;
    drawGame();
  });
  listen(document, 'keydown', event => {
    if (!gameRunning || !isCanvasActive(gameCanvas)) return;
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      gameKeys.add(event.key);
      if (gameVisible && !gameFrame) gameFrame = requestAnimationFrame(gameStep);
    }
  });
  listen(document, 'keyup', event => { gameKeys.delete(event.key); });
  listen(window, 'blur', () => gameKeys.clear());

  if ('IntersectionObserver' in window) {
    observe(new IntersectionObserver(entries => {
      gameVisible = entries[0].isIntersecting;
      if (gameVisible && !document.hidden && gameRunning && !gameFrame) {
        gameLastTime = 0;
        gameFrame = requestAnimationFrame(gameStep);
      } else if (!gameVisible && gameFrame) {
        cancelAnimationFrame(gameFrame);
        gameFrame = 0;
        gameLastTime = 0;
      }
    }, { root: main, threshold: 0.05 }), gameSection);
  } else {
    gameVisible = true;
  }
  drawGame();

  /* Suspend the game loop and clear held keys when the page is backgrounded. */
  listen(document, 'visibilitychange', () => {
    gameKeys.clear();
    if (document.hidden) {
      if (gameFrame) cancelAnimationFrame(gameFrame);
      gameFrame = 0;
      gameLastTime = 0;
    } else {
      if (gameVisible && gameRunning && !gameFrame) gameFrame = requestAnimationFrame(gameStep);
    }
  });

  /* ResizeObserver handles element resizes; this refresh also catches device-pixel-ratio changes. */
  listen(window, 'resize', () => {
    canvasRefreshers.forEach(refresh => refresh());
  }, { passive: true });

  });
  initModule(gameModule);

  /* All four modules are initialized successfully before reveal effects can hide their content. */
  root.classList.add('imx-reveal-ready');
  return function destroy() {
    modules.slice().reverse().forEach(module => module.destroy());
    pendingTimers.forEach(timer => window.clearTimeout(timer));
    pendingTimers.clear();
    disposers.splice(0).reverse().forEach(dispose => dispose());
    activeObservers.forEach(observer => observer.disconnect());
    activeObservers.clear();
    canvasRefreshers.length = 0;
    root.classList.remove('imx-reveal-ready');
  };
  }

  const destroy = init();
  const onPageHide = event => {
    if (event.persisted) return;
    destroy();
    window.removeEventListener('pagehide', onPageHide);
  };
  window.addEventListener('pagehide', onPageHide);
})();
