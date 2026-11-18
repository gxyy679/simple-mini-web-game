/* =========================================================
   PIXELVERSE — Interactive Learning World
   Vanilla JS. No frameworks, no backend. LocalStorage only.
   ========================================================= */
'use strict';

/* ---------------------------------------------------------
   1. CONTENT DATA
   --------------------------------------------------------- */
const ZONES = [
  {
    id: 'fundamentals',
    icon: 'monitor',
    title: 'Computer Fundamentals',
    tagline: 'Hardware, software, and how machines actually talk to each other.',
    lessons: [
      {
        id: 'hw-vs-sw',
        title: 'Hardware vs. Software',
        type: 'quiz',
        reading: [
          'Every computer is built from two layers that depend on each other. Hardware is the physical part you can touch — the processor, memory, keyboard, and screen. Software is the set of instructions that tells that hardware what to do.',
          'Without software, hardware is just an inert collection of circuits. Without hardware, software has nothing to run on. Operating systems like Windows, macOS, and Linux sit in between, managing how programs use the hardware underneath them.'
        ],
        quiz: [
          { q: 'Which of these is an example of hardware?', options: ['Web browser', 'Keyboard', 'Spreadsheet app', 'Operating system'], answer: 'Keyboard' },
          { q: 'What is the main job of an operating system?', options: ['Display ads', 'Manage hardware and run programs', 'Connect to Wi-Fi only', 'Store photos'], answer: 'Manage hardware and run programs' },
          { q: "True or false: software can run with no hardware at all.", options: ['True', 'False'], answer: 'False' }
        ]
      },
      {
        id: 'io-devices',
        title: 'Input & Output Devices',
        type: 'dragdrop',
        reading: [
          'Computers constantly move information in and out. Input devices send information into the computer — keyboards, mice, microphones, scanners. Output devices send information back out to you — monitors, speakers, printers.',
          'Sorting devices by their role helps you understand how a computer actually communicates with the world around it. Sort the tiles below into the correct bucket.'
        ],
        dragdrop: {
          buckets: [{ id: 'input', label: 'INPUT' }, { id: 'output', label: 'OUTPUT' }],
          items: [
            { label: 'Keyboard', bucket: 'input' },
            { label: 'Microphone', bucket: 'input' },
            { label: 'Scanner', bucket: 'input' },
            { label: 'Monitor', bucket: 'output' },
            { label: 'Speaker', bucket: 'output' },
            { label: 'Printer', bucket: 'output' }
          ]
        }
      },
      {
        id: 'binary-data',
        title: 'Binary & Data',
        type: 'flashcard',
        reading: [
          'Computers store everything — text, images, sound — as binary: long strings of 0s and 1s. Each 0 or 1 is a bit, and eight bits grouped together make a byte.',
          'Bigger files just mean more bytes. Flip through the flashcards below to learn the core vocabulary.'
        ],
        flashcards: [
          { front: 'Bit', back: 'The smallest unit of data in computing — a single 0 or 1.' },
          { front: 'Byte', back: 'A group of 8 bits. Enough to represent one character of text.' },
          { front: 'Binary', back: 'A number system using only two digits: 0 and 1.' },
          { front: 'Kilobyte (KB)', back: 'About 1,000 bytes — roughly one page of plain text.' },
          { front: 'Megabyte (MB)', back: 'About 1 million bytes — roughly one minute of MP3 audio.' }
        ]
      }
    ]
  },
  {
    id: 'programming',
    icon: 'code',
    title: 'Programming',
    tagline: 'Logic, loops, and problem-solving — one line at a time.',
    lessons: [
      {
        id: 'algorithms',
        title: 'What is an Algorithm?',
        type: 'flashcard',
        reading: [
          'An algorithm is a sequence of steps that solves a problem — like a recipe. Give a computer an algorithm and the right ingredients, and it produces the same result every time.',
          'Good algorithms are precise: no step is left to guesswork. Review the vocabulary below.'
        ],
        flashcards: [
          { front: 'Algorithm', back: 'A step-by-step set of instructions for solving a problem.' },
          { front: 'Pseudocode', back: 'Plain-language notes that sketch an algorithm before real code is written.' },
          { front: 'Input', back: 'The data an algorithm receives before it starts working.' },
          { front: 'Output', back: 'The result an algorithm produces after it finishes.' },
          { front: 'Efficiency', back: 'How quickly, and with how little memory, an algorithm solves a problem.' }
        ]
      },
      {
        id: 'variables',
        title: 'Variables & Data Types',
        type: 'quiz',
        reading: [
          'A variable is a labeled container for a value that can change while a program runs. Giving data a clear name — like score or userName — makes code far easier to read.',
          'Every variable also has a data type: numbers, text (strings), and true/false values (booleans) are the three you will meet first.'
        ],
        quiz: [
          { q: 'What does a variable do?', options: ['Deletes data permanently', 'Stores a value that can change', 'Only stores images', 'Runs the whole program'], answer: 'Stores a value that can change' },
          { q: 'Which of these is a "string" data type?', options: ['42', 'true', '"Hello"', '3.14'], answer: '"Hello"' },
          { q: 'Which data type represents only true or false?', options: ['Integer', 'Boolean', 'String', 'Array'], answer: 'Boolean' }
        ]
      },
      {
        id: 'loops-conditionals',
        title: 'Loops & Conditionals',
        type: 'dragdrop',
        reading: [
          'Conditionals let a program make decisions: "if this is true, do that — otherwise, do something else." Loops let a program repeat an action without copy-pasting the same code over and over.',
          'Match each concept below to what it actually does.'
        ],
        dragdrop: {
          buckets: [{ id: 'decision', label: 'MAKES A DECISION' }, { id: 'repeat', label: 'REPEATS AN ACTION' }],
          items: [
            { label: 'if statement', bucket: 'decision' },
            { label: 'else statement', bucket: 'decision' },
            { label: 'for loop', bucket: 'repeat' },
            { label: 'while loop', bucket: 'repeat' }
          ]
        }
      }
    ]
  },
  {
    id: 'webdev',
    icon: 'browser',
    title: 'Web Development',
    tagline: 'How HTML, CSS, and JavaScript combine into the sites you use daily.',
    lessons: [
      {
        id: 'html-basics',
        title: 'HTML Basics',
        type: 'terminal',
        reading: [
          'HTML (HyperText Markup Language) is the skeleton of every webpage. Tags tell the browser what each piece of content is — a heading, a paragraph, an image.',
          'Tags usually come in pairs: an opening tag and a closing tag wrap around content. Try the terminal challenges below.'
        ],
        terminal: [
          { prompt: 'Type the tag that defines the single biggest heading on a page.', accept: ['<h1>'] },
          { prompt: 'Type the tag used to create a hyperlink.', accept: ['<a>'] },
          { prompt: 'Type the tag used to insert an image.', accept: ['<img>'] }
        ]
      },
      {
        id: 'css-styling',
        title: 'CSS & Styling',
        type: 'quiz',
        reading: [
          'CSS (Cascading Style Sheets) controls how HTML looks — color, spacing, layout, fonts, and animation. Without it, every page would be plain text on a white background.',
          'CSS rules target elements with selectors, then apply properties. "Cascading" means more specific rules can override more general ones.'
        ],
        quiz: [
          { q: 'What does CSS control?', options: ['Page structure only', 'Visual presentation and layout', 'Server logic', 'Database storage'], answer: 'Visual presentation and layout' },
          { q: 'Which property changes text color?', options: ['background', 'color', 'padding', 'display'], answer: 'color' },
          { q: 'What does "cascading" refer to in CSS?', options: ['Rules load from a server', 'More specific rules can override general ones', 'Pages scroll automatically', 'Colors fade over time'], answer: 'More specific rules can override general ones' }
        ]
      },
      {
        id: 'js-interactivity',
        title: 'JavaScript Interactivity',
        type: 'dragdrop',
        reading: [
          'JavaScript is what makes a webpage respond to you — clicking a button, validating a form, updating content without reloading the page.',
          'It listens for events, like a click, and runs a function in response. Match each snippet to what it is actually doing.'
        ],
        dragdrop: {
          buckets: [{ id: 'event', label: 'HANDLES AN EVENT' }, { id: 'variable', label: 'STORES DATA' }],
          items: [
            { label: "addEventListener('click', fn)", bucket: 'event' },
            { label: 'Button press opens a menu', bucket: 'event' },
            { label: 'let total = 0;', bucket: 'variable' },
            { label: 'const name = "Ava";', bucket: 'variable' }
          ]
        }
      }
    ]
  },
  {
    id: 'multimedia',
    icon: 'palette',
    title: 'Multimedia & Interactive Design',
    tagline: 'Images, audio, video, and animation, combined into one experience.',
    lessons: [
      {
        id: 'image-basics',
        title: 'Digital Image Basics',
        type: 'flashcard',
        reading: [
          'Digital images are made of pixels — tiny colored squares arranged in a grid. The more pixels packed into an image, the higher its resolution and the more detail it can show.',
          'Common formats trade off quality and file size differently. These flashcards cover the essentials.'
        ],
        flashcards: [
          { front: 'Pixel', back: 'The smallest single point of color in a digital image.' },
          { front: 'Resolution', back: 'The number of pixels in an image, usually given as width × height.' },
          { front: 'JPEG', back: 'A compressed image format good for photos, with some quality loss.' },
          { front: 'PNG', back: 'An image format that supports transparency — great for icons and graphics.' },
          { front: 'Vector graphic', back: 'An image built from math-based shapes instead of pixels — scales without blurring.' }
        ]
      },
      {
        id: 'audio-video',
        title: 'Audio & Video on the Web',
        type: 'terminal',
        reading: [
          'Modern browsers can play audio and video natively, no plugins required.',
          'Both support an attribute that adds play, pause, and volume controls automatically. Try the challenges below.'
        ],
        terminal: [
          { prompt: 'Type the HTML tag used to embed a video.', accept: ['<video>'] },
          { prompt: 'Type the attribute that adds play/pause controls to a player.', accept: ['controls'] }
        ]
      },
      {
        id: 'animation-principles',
        title: 'Animation Principles',
        type: 'quiz',
        reading: [
          "Good animation isn't about motion for its own sake — it's about showing what changed. Easing, gradual acceleration and deceleration, makes movement feel natural instead of robotic.",
          'On the web, CSS transitions and keyframe animations can move, fade, or resize elements smoothly, as long as they are used with restraint.'
        ],
        quiz: [
          { q: 'What is "easing" in animation?', options: ['Making colors brighter', 'Gradual acceleration and deceleration of movement', 'Removing an element instantly', 'Adding sound effects'], answer: 'Gradual acceleration and deceleration of movement' },
          { q: 'Which CSS feature defines multi-step animations?', options: ['@keyframes', '@media', '@import', '@font-face'], answer: '@keyframes' },
          { q: 'Why should web animation be used with restraint?', options: ['It always slows down the server', 'Excess motion can hurt usability and accessibility', 'Browsers block more than one animation', 'It increases file size to infinity'], answer: 'Excess motion can hurt usability and accessibility' }
        ]
      }
    ]
  }
];

const BADGES = [
  { id: 'first-steps', title: 'First Steps', icon: 'star', desc: 'Complete your first lesson.', test: p => p.completedLessons.length >= 1 },
  { id: 'zone-explorer', title: 'Zone Explorer', icon: 'badge', desc: 'Finish every lesson in one zone.', test: p => ZONES.some(z => z.lessons.every(l => p.completedLessons.includes(l.id))) },
  { id: 'quiz-whiz', title: 'Quiz Whiz', icon: 'star', desc: 'Score 100% on any quiz.', test: p => Object.values(p.quizScores || {}).some(s => s.correct === s.total) },
  { id: 'world-wanderer', title: 'World Wanderer', icon: 'badge', desc: 'Complete a lesson in every zone.', test: p => ZONES.every(z => z.lessons.some(l => p.completedLessons.includes(l.id))) },
  { id: 'pixel-master', title: 'Pixel Master', icon: 'trophy', desc: 'Complete every lesson in PIXELVERSE.', test: p => p.completedLessons.length >= totalLessons() },
  { id: 'level-5', title: 'Level 5', icon: 'trophy', desc: 'Reach level 5.', test: p => levelFromXP(p.xp) >= 5 }
];

/* ---------------------------------------------------------
   2. PIXEL ICONS (rect-based inline SVG — always crisp)
   --------------------------------------------------------- */
const ICONS = {
  home: [[3,11,9,9,'var(--icon-mint)'],[5,7,14,2,'var(--icon-mint)'],[7,5,10,2,'var(--icon-mint)'],[17,11,4,9,'var(--icon-mint)'],[9,14,4,6,'var(--ink)']],
  map: [[3,5,5,15,'var(--icon-mint)'],[9,3,6,17,'var(--ink)'],[16,5,5,15,'var(--icon-mint)'],[5,8,2,2,'var(--ink)'],[18,14,2,2,'var(--ink)']],
  medal: [[8,3,8,3,'var(--icon-mint)'],[6,6,12,9,'var(--icon-mint)'],[9,9,6,4,'var(--ink)'],[8,15,4,7,'var(--icon-mint)'],[12,15,4,7,'var(--icon-mint)']],
  cursor: [[5,3,4,4,'var(--icon-mint)'],[5,7,4,4,'var(--icon-mint)'],[5,11,4,4,'var(--icon-mint)'],[9,15,4,4,'var(--icon-mint)'],[13,17,3,4,'var(--ink)']],
  eye: [[3,10,4,4,'var(--icon-mint)'],[6,7,4,3,'var(--icon-mint)'],[6,14,4,3,'var(--icon-mint)'],[10,5,4,3,'var(--icon-mint)'],[10,16,4,3,'var(--icon-mint)'],[14,7,4,3,'var(--icon-mint)'],[14,14,4,3,'var(--icon-mint)'],[18,10,3,4,'var(--icon-mint)'],[10,10,4,4,'var(--ink)']],
  toggle: [[3,8,18,8,'var(--ink)'],[5,10,6,4,'var(--icon-mint)'],[13,10,6,4,'var(--muted-gray)']],
  speed: [[3,5,7,3,'var(--icon-mint)'],[3,10,13,3,'var(--icon-mint)'],[3,15,18,3,'var(--icon-mint)'],[18,4,3,5,'var(--ink)']],
  animate: [[4,4,6,6,'var(--icon-mint)'],[14,4,6,6,'var(--ink)'],[4,14,6,6,'var(--ink)'],[14,14,6,6,'var(--icon-mint)']],
  effects: [[4,4,5,5,'var(--icon-mint)'],[15,4,5,5,'var(--ink)'],[4,15,5,5,'var(--ink)'],[15,15,5,5,'var(--icon-mint)'],[10,10,4,4,'var(--icon-mint)']],
  design: [[3,4,17,16,'var(--ink)'],[5,6,13,12,'var(--icon-mint)'],[7,15,10,1,'var(--ink)'],[15,8,2,5,'var(--ink)']],
  cube: [[5,4,14,3,'var(--icon-mint)'],[3,7,18,12,'var(--ink)'],[6,10,12,6,'var(--icon-mint)'],[10,7,4,12,'var(--ink)'],[5,19,14,2,'var(--icon-mint)']],
  gamepad: [[4,8,16,9,'var(--ink)'],[7,10,2,5,'var(--icon-mint)'],[5,12,6,2,'var(--icon-mint)'],[15,10,2,2,'var(--icon-mint)'],[18,13,2,2,'var(--icon-mint)']],
  signal: [[3,16,4,4,'var(--icon-mint)'],[9,12,4,8,'var(--icon-mint)'],[15,8,4,12,'var(--icon-mint)'],[21,4,2,16,'var(--icon-mint)']],
  clock: [[8,3,8,2,'var(--icon-mint)'],[5,5,3,3,'var(--icon-mint)'],[3,8,2,8,'var(--icon-mint)'],[5,16,3,3,'var(--icon-mint)'],[8,19,8,2,'var(--icon-mint)'],[16,16,3,3,'var(--icon-mint)'],[19,8,2,8,'var(--icon-mint)'],[16,5,3,3,'var(--icon-mint)'],[11,7,2,6,'var(--ink)'],[11,12,6,2,'var(--ink)']],
  record: [[8,3,8,4,'var(--icon-mint)'],[5,7,14,10,'var(--icon-mint)'],[8,17,8,4,'var(--icon-mint)'],[10,10,4,4,'var(--ink)']],
  monitor: [[3,3,18,13,'var(--ink)'],[5,5,14,9,'var(--cream)'],[9,7,6,5,'var(--icon-mint)'],[9,17,6,2,'var(--ink)'],[7,19,10,2,'var(--ink)']],
  code: [[6,6,3,3,'var(--icon-mint)'],[3,9,3,3,'var(--icon-mint)'],[6,12,3,3,'var(--icon-mint)'],[15,6,3,3,'var(--icon-mint)'],[18,9,3,3,'var(--icon-mint)'],[15,12,3,3,'var(--icon-mint)'],[13,15,2,2,'var(--icon-mint)'],[11,11,2,2,'var(--icon-mint)'],[15,9,2,2,'var(--icon-mint)']],
  browser: [[2,4,20,16,'var(--ink)'],[3,5,18,3,'var(--muted-gray)'],[4,6,2,2,'var(--icon-mint)'],[8,6,2,2,'var(--icon-mint)'],[12,6,2,2,'var(--icon-mint)'],[4,10,16,9,'var(--cream)']],
  palette: [[4,4,16,14,'var(--ink)'],[6,6,12,10,'var(--cream)'],[8,8,3,3,'var(--icon-mint)'],[13,8,3,3,'var(--icon-mint)'],[8,12,3,3,'var(--muted-gray)'],[13,12,3,3,'var(--deep-green)']],
  book: [[3,5,8,15,'var(--icon-mint)'],[13,5,8,15,'var(--icon-mint)'],[11,5,2,15,'var(--ink)'],[5,8,5,2,'var(--ink)'],[5,11,5,2,'var(--ink)'],[14,8,5,2,'var(--ink)'],[14,11,5,2,'var(--ink)']],
  flashcard: [[4,3,16,18,'var(--ink)'],[6,5,12,14,'var(--cream)'],[14,5,4,4,'var(--muted-gray)']],
  quiz: [[3,3,18,18,'var(--ink)'],[5,5,14,14,'var(--cream)'],[9,7,6,3,'var(--icon-mint)'],[13,10,2,3,'var(--icon-mint)'],[11,14,2,2,'var(--icon-mint)']],
  puzzle: [[3,3,8,8,'var(--icon-mint)'],[13,3,8,8,'var(--icon-mint)'],[3,13,8,8,'var(--icon-mint)'],[13,13,8,8,'var(--icon-mint)'],[10,10,4,4,'var(--ink)']],
  terminal: [[2,4,20,16,'var(--ink)'],[4,6,16,12,'var(--midnight)'],[6,10,2,2,'var(--icon-mint)'],[9,10,2,2,'var(--icon-mint)'],[6,13,6,2,'var(--icon-mint)']],
  badge: [[8,2,8,8,'var(--icon-mint)'],[6,9,12,8,'var(--icon-mint)'],[8,16,2,6,'var(--ink)'],[14,16,2,6,'var(--ink)']],
  star: [[11,2,2,2,'var(--icon-mint)'],[9,4,6,2,'var(--icon-mint)'],[7,6,10,2,'var(--icon-mint)'],[5,8,14,2,'var(--icon-mint)'],[7,10,10,2,'var(--icon-mint)'],[8,12,2,2,'var(--icon-mint)'],[14,12,2,2,'var(--icon-mint)'],[6,14,3,2,'var(--icon-mint)'],[15,14,3,2,'var(--icon-mint)']],
  trophy: [[8,2,8,8,'var(--icon-mint)'],[4,3,4,3,'var(--icon-mint)'],[16,3,4,3,'var(--icon-mint)'],[10,10,4,4,'var(--ink)'],[7,15,10,2,'var(--ink)'],[9,17,6,2,'var(--ink)']],
  check: [[18,5,2,2,'var(--icon-mint)'],[16,7,2,2,'var(--icon-mint)'],[14,9,2,2,'var(--icon-mint)'],[12,11,2,2,'var(--icon-mint)'],[10,13,2,2,'var(--icon-mint)'],[6,9,2,2,'var(--icon-mint)'],[8,11,2,2,'var(--icon-mint)']],
  lock: [[8,10,8,9,'var(--muted-gray)'],[9,4,6,7,'var(--muted-gray)'],[11,13,2,3,'var(--ink)']]
};

function renderIcon(name, size) {
  const rects = ICONS[name] || [];
  const s = size || 24;
  const body = rects.map(r => `<rect x="${r[0]}" y="${r[1]}" width="${r[2]}" height="${r[3]}" fill="${r[4]}"></rect>`).join('');
  return `<svg class="picon" viewBox="0 0 24 24" width="${s}" height="${s}" aria-hidden="true">${body}</svg>`;
}

/* ---------------------------------------------------------
   3. PROGRESS / LOCALSTORAGE
   --------------------------------------------------------- */
const STORAGE_KEY = 'pixelverse_progress_v1';
const THEME_KEY = 'pixelverse_theme_v1';
let ambientMotionInitialized = false;
let ambientVideos = [];

function defaultProgress() {
  return { xp: 0, completedLessons: [], badges: [], quizScores: {} };
}
function loadProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultProgress();
    const parsed = JSON.parse(raw);
    return Object.assign(defaultProgress(), parsed);
  } catch (e) {
    console.warn('Saved progress could not be read; using a temporary empty save.', e);
    return defaultProgress();
  }
}
function saveProgress(p) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(p)); }
  catch (e) { console.warn('Progress could not be saved in this browser.', e); }
}
function totalLessons() { return ZONES.reduce((n, z) => n + z.lessons.length, 0); }
function levelFromXP(xp) { return Math.floor(xp / 150) + 1; }
function xpForLevel(level) { return (level - 1) * 150; }

function findLesson(lessonId) {
  for (const z of ZONES) {
    const l = z.lessons.find(l => l.id === lessonId);
    if (l) return { zone: z, lesson: l };
  }
  return null;
}

function completeLesson(lessonId, bonusXP, meta) {
  const progress = loadProgress();
  const already = progress.completedLessons.includes(lessonId);
  const base = 40;
  const gained = already ? 5 : base + (bonusXP || 0);
  progress.xp += gained;
  if (!already) progress.completedLessons.push(lessonId);
  if (meta && meta.type === 'quiz' && meta.score) progress.quizScores[lessonId] = meta.score;
  const newBadges = checkBadges(progress);
  saveProgress(progress);
  refreshChrome();
  return { progress, gained, newBadges };
}

function checkBadges(progress) {
  const unlocked = [];
  BADGES.forEach(b => {
    if (!progress.badges.includes(b.id) && b.test(progress)) {
      progress.badges.push(b.id);
      unlocked.push(b);
    }
  });
  return unlocked;
}

/* ---------------------------------------------------------
   4. THEME
   --------------------------------------------------------- */
function setTheme(theme, persist = true) {
  const normalizedTheme = theme === 'dark' ? 'dark' : 'light';
  const root = document.documentElement;
  const themeChanged = root.getAttribute('data-theme') !== normalizedTheme;
  if (themeChanged) root.setAttribute('data-theme', normalizedTheme);
  if (persist) {
    try { localStorage.setItem(THEME_KEY, normalizedTheme); }
    catch (error) { console.warn('Theme preference could not be saved in this browser.', error); }
  }
  const toggle = document.getElementById('themeToggle');
  if (toggle) {
    const isDark = normalizedTheme === 'dark';
    toggle.checked = isDark;
    toggle.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
  }
  if (themeChanged && ambientMotionInitialized) syncAmbientVideo();
}
function initTheme() {
  let saved = null;
  try { saved = localStorage.getItem(THEME_KEY); }
  catch (error) { console.warn('Saved theme could not be read; using the system preference.', error); }
  if (saved === 'dark' || saved === 'light') { setTheme(saved, false); return; }
  const prefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
  setTheme(prefersLight ? 'light' : 'dark', false);
}

/* ---------------------------------------------------------
   5. NAVIGATION
   --------------------------------------------------------- */
let currentZoneId = null;
let currentLessonId = null;
let viewTransitionTimer = 0;
const viewTransitionDuration = 620;

function showView(name) {
  const views = Array.from(document.querySelectorAll('.view'));
  const nextView = views.find(view => view.dataset.view === name);
  if (!nextView) return;

  const currentView = document.querySelector('.view.active:not(.is-leaving)')
    || document.querySelector('.view.active');
  window.clearTimeout(viewTransitionTimer);
  viewTransitionTimer = 0;

  views.filter(view => view.classList.contains('is-leaving')).forEach(view => {
    view.classList.remove('active', 'is-leaving');
  });

  if (currentView && currentView !== nextView
    && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    currentView.classList.add('is-leaving');
    nextView.classList.add('active');
    viewTransitionTimer = window.setTimeout(() => {
      currentView.classList.remove('active', 'is-leaving');
      viewTransitionTimer = 0;
    }, viewTransitionDuration);
  } else {
    views.forEach(view => {
      view.classList.toggle('active', view === nextView);
      view.classList.remove('is-leaving');
    });
  }

  document.querySelectorAll('.nav-link[data-nav]').forEach(button => {
    const active = button.dataset.nav === name;
    button.classList.toggle('is-active', active);
    if (active) button.setAttribute('aria-current', 'page');
    else button.removeAttribute('aria-current');
  });
  document.getElementById('main').scrollTo({ top: 0, behavior: 'smooth' });
  if (name === 'zones') renderZonesGrid();
  if (name === 'achievements') renderAchievements();
  if (name === 'home') renderHeroStats();
}

function initScrollReveals() {
  const main = document.getElementById('main');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (!('IntersectionObserver' in window) || reduceMotion.matches) return () => {};

  const selector = [
    '#view-zones .section-head > *',
    '.intro-grid > .intro-card',
    '.zones-grid > .zone-card',
    '#zone-detail-content > .zone-header',
    '#zone-detail-content .lesson-list > .lesson-card',
    '#lesson-content > .lesson-header',
    '#lesson-content > .lesson-reading',
    '#lesson-content > .activity-wrap',
    '#view-achievements .section-label',
    '#view-achievements > .profile-card',
    '#view-achievements .badges-grid > .badge-card',
  ].join(', ');
  const observed = new WeakSet();
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      entry.target.classList.toggle('motion-is-visible', entry.isIntersecting);
    });
  }, { root: main, threshold: 0.12, rootMargin: '0px 0px -5% 0px' });

  const revealElements = nodes => {
    nodes.forEach(node => {
      if (!(node instanceof Element)) return;
      const elements = [];
      if (node.matches(selector)) elements.push(node);
      elements.push(...node.querySelectorAll(selector));
      elements.forEach(element => {
        if (observed.has(element)) return;
        observed.add(element);
        element.classList.add('motion-reveal');
        revealObserver.observe(element);
      });
    });
  };

  revealElements([main]);
  const contentObserver = new MutationObserver(mutations => {
    mutations.forEach(mutation => revealElements(Array.from(mutation.addedNodes)));
  });
  contentObserver.observe(main, { childList: true, subtree: true });

  return () => {
    contentObserver.disconnect();
    revealObserver.disconnect();
  };
}

/* ---------------------------------------------------------
   6. RENDERING
   --------------------------------------------------------- */
function zoneProgressCount(zone, progress) {
  return zone.lessons.filter(l => progress.completedLessons.includes(l.id)).length;
}

function renderHeroStats() {
  const progress = loadProgress();
  const done = progress.completedLessons.length;
  const el = document.getElementById('hero-stats');
  el.innerHTML = `
    <div class="stat-block">${renderIcon('map', 16)}<span class="stat-num">${ZONES.length}</span><span class="stat-label">ZONES</span></div>
    <div class="stat-block">${renderIcon('code', 16)}<span class="stat-num">${totalLessons()}</span><span class="stat-label">CHALLENGES</span></div>
    <div class="stat-block">${renderIcon('check', 16)}<span class="stat-num">${done}/${totalLessons()}</span><span class="stat-label">COMPLETE</span></div>
    <div class="stat-block">${renderIcon('star', 16)}<span class="stat-num">LV.${levelFromXP(progress.xp)}</span><span class="stat-label">YOUR LEVEL</span></div>
  `;
}

function renderZonesGrid() {
  const progress = loadProgress();
  const grid = document.getElementById('zones-grid');
  grid.innerHTML = ZONES.map(z => {
    const done = zoneProgressCount(z, progress);
    const pct = Math.round((done / z.lessons.length) * 100);
    return `
      <article class="zone-card">
        <div class="zone-card-icon">${renderIcon(z.icon, 40)}</div>
        <h3 class="zone-card-title">${z.title}</h3>
        <p class="zone-card-tag">${z.tagline}</p>
        <div class="xp-bar-track small"><div class="xp-bar-fill" style="width:${pct}%"></div></div>
        <div class="zone-card-meta">${done} / ${z.lessons.length} lessons complete</div>
        <button type="button" class="btn btn-primary zone-enter-btn" data-zone="${z.id}">Enter zone</button>
      </article>
    `;
  }).join('');
  grid.querySelectorAll('.zone-enter-btn').forEach(btn => {
    btn.addEventListener('click', () => openZone(btn.dataset.zone));
  });
}

function openZone(zoneId) {
  currentZoneId = zoneId;
  renderZoneDetail(zoneId);
  showView('zone');
}

function renderZoneDetail(zoneId) {
  const zone = ZONES.find(z => z.id === zoneId);
  const progress = loadProgress();
  const wrap = document.getElementById('zone-detail-content');
  const typeIcon = { quiz: 'quiz', flashcard: 'flashcard', dragdrop: 'puzzle', terminal: 'terminal' };
  const typeLabel = { quiz: 'QUIZ', flashcard: 'FLASHCARDS', dragdrop: 'DRAG & DROP', terminal: 'TERMINAL' };
  wrap.innerHTML = `
    <div class="zone-header">
      <div class="zone-header-icon">${renderIcon(zone.icon, 56)}</div>
      <div>
        <h1 class="page-title">${zone.title.toUpperCase()}</h1>
        <p class="page-sub">${zone.tagline}</p>
      </div>
    </div>
    <div class="lesson-list">
      ${zone.lessons.map((l, i) => {
        const done = progress.completedLessons.includes(l.id);
        return `
        <button type="button" class="lesson-card${done ? ' is-done' : ''}" data-lesson="${l.id}">
          <span class="lesson-card-index">${String(i + 1).padStart(2, '0')}</span>
          <span class="lesson-card-icon">${renderIcon(typeIcon[l.type], 28)}</span>
          <span class="lesson-card-body">
            <span class="lesson-card-title">${l.title}</span>
            <span class="lesson-card-type mono-label">${typeLabel[l.type]}</span>
          </span>
          <span class="lesson-card-status">${done ? renderIcon('check', 22) : ''}</span>
        </button>`;
      }).join('')}
    </div>
  `;
  wrap.querySelectorAll('.lesson-card').forEach(btn => {
    btn.addEventListener('click', () => openLesson(btn.dataset.lesson));
  });
}

function openLesson(lessonId) {
  const found = findLesson(lessonId);
  if (!found) return;
  currentZoneId = found.zone.id;
  currentLessonId = lessonId;
  const { zone, lesson } = found;
  const progress = loadProgress();
  const done = progress.completedLessons.includes(lesson.id);
  const container = document.getElementById('lesson-content');
  container.innerHTML = `
    <div class="lesson-header">
      <span class="mono-label">${zone.title.toUpperCase()} // LESSON</span>
      <h1 class="page-title">${lesson.title}</h1>
      ${done ? '<span class="done-pill">✓ Completed — replay anytime</span>' : ''}
    </div>
    <div class="lesson-reading">
      ${lesson.reading.map(p => `<p>${p}</p>`).join('')}
    </div>
    <div class="ascii-divider small" aria-hidden="true">░▒▓ ▓▒░ ░▒▓ ▓▒░ ░▒▓ ▓▒░ ░▒▓ ▓▒░</div>
    <div class="activity-wrap" id="activity-wrap">
      <div class="activity-body"></div>
    </div>
  `;
  document.getElementById('lesson-back-btn').onclick = () => { renderZoneDetail(zone.id); showView('zone'); };

  const activityContainer = document.getElementById('activity-wrap');
  if (lesson.type === 'quiz') initQuiz(activityContainer, lesson);
  else if (lesson.type === 'flashcard') initFlashcards(activityContainer, lesson);
  else if (lesson.type === 'dragdrop') initDragDrop(activityContainer, lesson);
  else if (lesson.type === 'terminal') initTerminal(activityContainer, lesson);

  showView('lesson');
}

function renderActivityDone(container, lesson, message, result) {
  container.innerHTML = `
    <div class="activity-done">
      <div class="activity-done-icon">${renderIcon('trophy', 48)}</div>
      <h3>LESSON COMPLETE</h3>
      <p>${message}</p>
      <button type="button" class="btn btn-primary" id="activity-back">Back to zone</button>
    </div>
  `;
  container.querySelector('#activity-back').addEventListener('click', () => {
    renderZoneDetail(currentZoneId);
    showView('zone');
  });
  showToast(`+${result.gained} XP — ${lesson.title} complete`, 'xp');
  (result.newBadges || []).forEach(b => showToast(`Achievement unlocked: ${b.title}`, 'badge'));
}

function renderAchievements() {
  const progress = loadProgress();
  const level = levelFromXP(progress.xp);
  const into = progress.xp - xpForLevel(level);
  document.getElementById('profile-level').textContent = `LV.${level}`;
  document.getElementById('profile-xp-fill').style.width = `${Math.min(100, Math.round((into / 150) * 100))}%`;
  document.getElementById('profile-xp-text').textContent = `${into} / 150 XP toward level ${level + 1} · ${progress.xp} XP total`;
  document.getElementById('xp-pill-text').textContent = `LV.${level}`;

  const grid = document.getElementById('badges-grid');
  grid.innerHTML = BADGES.map(b => {
    const unlocked = progress.badges.includes(b.id);
    return `
      <div class="badge-card${unlocked ? ' is-unlocked' : ' is-locked'}">
        <div class="badge-card-icon">${renderIcon(unlocked ? b.icon : 'lock', 32)}</div>
        <div class="badge-card-title">${b.title}</div>
        <div class="badge-card-desc">${b.desc}</div>
      </div>
    `;
  }).join('');
}

function refreshChrome() {
  const progress = loadProgress();
  document.getElementById('xp-pill-text').textContent = `LV.${levelFromXP(progress.xp)}`;
  const activeView = document.querySelector('.view.active');
  if (activeView && activeView.dataset.view === 'zones') renderZonesGrid();
  if (activeView && activeView.dataset.view === 'achievements') renderAchievements();
  if (activeView && activeView.dataset.view === 'home') renderHeroStats();
}

/* ---------------------------------------------------------
   7. ACTIVITIES
   --------------------------------------------------------- */
function initQuiz(container, lesson) {
  let idx = 0, correct = 0;
  const qs = lesson.quiz;
  renderQuestion();

  function renderQuestion() {
    const q = qs[idx];
    const body = container.querySelector('.activity-body');
    body.innerHTML = `
      <div class="quiz-progress mono-label">QUESTION ${idx + 1} / ${qs.length}</div>
      <p class="quiz-question">${q.q}</p>
      <div class="quiz-options" role="radiogroup"></div>
    `;
    const opts = body.querySelector('.quiz-options');
    q.options.forEach(opt => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'quiz-option';
      b.textContent = opt;
      b.addEventListener('click', () => selectAnswer(opt, b));
      opts.appendChild(b);
    });
  }

  function selectAnswer(opt, btn) {
    const q = qs[idx];
    const allBtns = btn.parentElement.querySelectorAll('.quiz-option');
    allBtns.forEach(b => (b.disabled = true));
    if (opt === q.answer) { btn.classList.add('is-correct'); correct++; }
    else {
      btn.classList.add('is-wrong');
      allBtns.forEach(b => { if (b.textContent === q.answer) b.classList.add('is-correct'); });
    }
    setTimeout(() => { idx++; if (idx < qs.length) renderQuestion(); else finish(); }, 300);
  }

  function finish() {
    const bonus = Math.round((correct / qs.length) * 30);
    const result = completeLesson(lesson.id, bonus, { type: 'quiz', score: { correct, total: qs.length } });
    renderActivityDone(container, lesson, `You scored ${correct} / ${qs.length}.`, result);
  }
}

function initFlashcards(container, lesson) {
  let idx = 0;
  const reviewed = new Set();
  render();

  function render() {
    const c = lesson.flashcards[idx];
    reviewed.add(idx);
    const body = container.querySelector('.activity-body');
    body.innerHTML = `
      <div class="quiz-progress mono-label">CARD ${idx + 1} / ${lesson.flashcards.length} · tap to flip</div>
      <button type="button" class="flashcard" id="fc-card" aria-label="Flip flashcard">
        <span class="flashcard-inner">
          <span class="flashcard-face flashcard-front">${c.front}</span>
          <span class="flashcard-face flashcard-back">${c.back}</span>
        </span>
      </button>
      <div class="flashcard-nav">
        <button type="button" class="btn btn-ghost" id="fc-prev" ${idx === 0 ? 'disabled' : ''}>&lt; Prev</button>
        <button type="button" class="btn btn-primary" id="fc-next">${idx === lesson.flashcards.length - 1 ? 'Finish' : 'Next >'}</button>
      </div>
    `;
    body.querySelector('#fc-card').addEventListener('click', e => e.currentTarget.classList.toggle('is-flipped'));
    body.querySelector('#fc-prev').addEventListener('click', () => { idx = Math.max(0, idx - 1); render(); });
    body.querySelector('#fc-next').addEventListener('click', () => {
      if (idx < lesson.flashcards.length - 1) { idx++; render(); } else finish();
    });
  }

  function finish() {
    const bonus = reviewed.size >= lesson.flashcards.length ? 30 : 15;
    const result = completeLesson(lesson.id, bonus, { type: 'flashcard' });
    renderActivityDone(container, lesson, `You reviewed ${reviewed.size} / ${lesson.flashcards.length} cards.`, result);
  }
}

function initDragDrop(container, lesson) {
  const items = lesson.dragdrop.items.map((it, i) => ({ ...it, uid: 'it' + i, placed: null }));
  let selectedUid = null;
  render();

  function render() {
    const body = container.querySelector('.activity-body');
    body.innerHTML = `
      <p class="activity-hint">Tap a tile, then tap its bucket — or drag it on desktop.</p>
      <div class="dd-tiles" id="dd-tiles"></div>
      <div class="dd-buckets" id="dd-buckets"></div>
      <button type="button" class="btn btn-primary" id="dd-check" style="display:none;">Check answers</button>
    `;
    const tilesWrap = body.querySelector('#dd-tiles');
    items.filter(it => !it.placed).forEach(it => {
      const t = document.createElement('button');
      t.type = 'button';
      t.className = 'dd-tile' + (selectedUid === it.uid ? ' is-selected' : '');
      t.textContent = it.label;
      t.draggable = true;
      t.addEventListener('click', () => { selectedUid = selectedUid === it.uid ? null : it.uid; render(); });
      t.addEventListener('dragstart', e => e.dataTransfer.setData('text/plain', it.uid));
      tilesWrap.appendChild(t);
    });
    const bucketsWrap = body.querySelector('#dd-buckets');
    lesson.dragdrop.buckets.forEach(b => {
      const col = document.createElement('div');
      col.className = 'dd-bucket';
      col.innerHTML = `<div class="dd-bucket-label mono-label">${b.label}</div><div class="dd-bucket-slot"></div>`;
      const slot = col.querySelector('.dd-bucket-slot');
      items.filter(it => it.placed === b.id).forEach(it => {
        const chip = document.createElement('span');
        chip.className = 'dd-chip';
        chip.textContent = it.label;
        slot.appendChild(chip);
      });
      col.addEventListener('click', () => { if (selectedUid) place(selectedUid, b.id); });
      col.addEventListener('dragover', e => e.preventDefault());
      col.addEventListener('drop', e => { e.preventDefault(); const uid = e.dataTransfer.getData('text/plain'); if (uid) place(uid, b.id); });
      bucketsWrap.appendChild(col);
    });
    const checkBtn = body.querySelector('#dd-check');
    if (items.every(it => it.placed)) {
      checkBtn.style.display = 'inline-flex';
      checkBtn.addEventListener('click', finish);
    }
  }

  function place(uid, bucketId) {
    const it = items.find(i => i.uid === uid);
    if (it) { it.placed = bucketId; selectedUid = null; render(); }
  }

  function finish() {
    const correctCount = items.filter(it => it.placed === it.bucket).length;
    const allCorrect = correctCount === items.length;
    if (!allCorrect) {
      items.forEach(it => { if (it.placed !== it.bucket) it.placed = null; });
      render();
      showToast(`${correctCount} / ${items.length} correct — fix the rest and check again.`, 'info');
      return;
    }
    const bonus = 30;
    const result = completeLesson(lesson.id, bonus, { type: 'dragdrop' });
    renderActivityDone(container, lesson, 'Every tile matched correctly.', result);
  }
}

function initTerminal(container, lesson) {
  let idx = 0;
  render();

  function render() {
    const ch = lesson.terminal[idx];
    const body = container.querySelector('.activity-body');
    body.innerHTML = `
      <div class="quiz-progress mono-label">CHALLENGE ${idx + 1} / ${lesson.terminal.length}</div>
      <div class="terminal-box">
        <pre class="terminal-log" id="term-log">&gt; ${ch.prompt}</pre>
        <div class="terminal-input-row">
          <span class="terminal-caret">&gt;</span>
          <input type="text" id="term-input" class="terminal-input" autocomplete="off" spellcheck="false" aria-label="Type your answer">
          <span class="blinking-cursor">_</span>
        </div>
        <button type="button" class="btn btn-primary" id="term-submit">Run</button>
      </div>
    `;
    const input = body.querySelector('#term-input');
    input.focus();
    input.addEventListener('keydown', e => { if (e.key === 'Enter') submit(); });
    body.querySelector('#term-submit').addEventListener('click', submit);

    function submit() {
      const val = input.value.trim().toLowerCase();
      const ok = ch.accept.some(a => a.toLowerCase() === val);
      const log = body.querySelector('#term-log');
      if (ok) {
        log.textContent += `\n> ${val}\nOK.`;
        input.disabled = true;
        setTimeout(() => { idx++; if (idx < lesson.terminal.length) render(); else finish(); }, 250);
      } else {
        log.textContent += `\n> ${val || '(empty)'}\nERROR: not recognized. Try again.`;
        input.value = '';
        input.focus();
      }
    }
  }

  function finish() {
    const bonus = 30;
    const result = completeLesson(lesson.id, bonus, { type: 'terminal' });
    renderActivityDone(container, lesson, 'All terminal challenges solved.', result);
  }
}

/* ---------------------------------------------------------
   8. TOASTS
   --------------------------------------------------------- */
function showToast(message, kind) {
  const host = document.getElementById('toast-container');
  const el = document.createElement('div');
  el.className = `toast toast-${kind || 'info'}`;
  const icon = kind === 'badge' ? 'star' : kind === 'xp' ? 'check' : 'badge';
  el.innerHTML = `${renderIcon(icon, 20)}<span>${message}</span>`;
  host.appendChild(el);
  requestAnimationFrame(() => el.classList.add('is-visible'));
  setTimeout(() => {
    el.classList.remove('is-visible');
    setTimeout(() => el.remove(), 400);
  }, 3600);
}

/* ---------------------------------------------------------
   9. HERO FX — ascii typing, particles, pixel scape, parallax
   --------------------------------------------------------- */
function typeAsciiBoot() {
  const lines = [
    '[ PIXELVERSE OS v2.4 ]',
    '> BOOTING LEARNING ENGINE...',
    '> LOADING WORLD DATA... OK',
    '> SYNCING LOCAL SAVE FILE... OK',
    '> WELCOME, EXPLORER_'
  ];
  const el = document.getElementById('ascii-boot-text');
  let li = 0, ci = 0;
  el.textContent = '';
  function tick() {
    if (li >= lines.length) return;
    const line = lines[li];
    if (ci <= line.length) {
      el.textContent = lines.slice(0, li).join('\n') + (li > 0 ? '\n' : '') + line.slice(0, ci);
      ci++;
      setTimeout(tick, 18);
    } else {
      li++; ci = 0;
      setTimeout(tick, 220);
    }
  }
  tick();
}

/* Keep the existing particle effect lighter on small or constrained devices. */
function buildParticles() {
  const field = document.getElementById('particle-field');
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  const constrained = navigator.deviceMemory <= 4
    || navigator.hardwareConcurrency <= 4
    || Boolean(connection && connection.saveData);
  const count = window.innerWidth < 600 ? (constrained ? 4 : 7) : (constrained ? 10 : 20);
  if (field.children.length) return;
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    p.style.left = Math.random() * 100 + 'vw';
    p.style.animationDuration = (8 + Math.random() * 10) + 's';
    p.style.animationDelay = (Math.random() * 10) + 's';
    p.style.opacity = (0.25 + Math.random() * 0.45).toFixed(2);
    field.appendChild(p);
  }
}

/* Pause CSS particle motion when the hero is outside the scrollport or the tab is hidden. */
function initParticleMotion() {
  const field = document.getElementById('particle-field');
  const hero = document.querySelector('.hero');
  if (!field || !hero) return () => {};
  const main = document.getElementById('main');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let heroVisible = false;
  const syncMotion = () => {
    if (!reduceMotion.matches && !field.children.length) buildParticles();
    field.classList.toggle('imx-particles-paused', document.hidden || !heroVisible || reduceMotion.matches);
  };
  const observer = 'IntersectionObserver' in window
    ? new IntersectionObserver(entries => {
      heroVisible = entries.some(entry => entry.isIntersecting);
      syncMotion();
    }, { root: main, threshold: 0 })
    : null;
  if (observer) observer.observe(hero);
  const onVisibilityChange = () => syncMotion();
  const onMotionChange = () => syncMotion();
  document.addEventListener('visibilitychange', onVisibilityChange);
  reduceMotion.addEventListener('change', onMotionChange);
  if (!observer) heroVisible = true;
  syncMotion();
  return () => {
    if (observer) observer.disconnect();
    document.removeEventListener('visibilitychange', onVisibilityChange);
    reduceMotion.removeEventListener('change', onMotionChange);
  };
}

function buildHeroScape() {
  const svgNS = 'http://www.w3.org/2000/svg';
  const treesG = document.getElementById('layer-trees');
  for (let x = 20; x < 1200; x += 68) {
    const h = 26 + ((x / 7) % 18);
    const trunk = document.createElementNS(svgNS, 'rect');
    trunk.setAttribute('x', x); trunk.setAttribute('y', 372 - h * 0.3);
    trunk.setAttribute('width', 4); trunk.setAttribute('height', h * 0.3);
    treesG.appendChild(trunk);
    const canopy = document.createElementNS(svgNS, 'rect');
    canopy.setAttribute('x', x - 8); canopy.setAttribute('y', 372 - h);
    canopy.setAttribute('width', 20); canopy.setAttribute('height', h * 0.75);
    treesG.appendChild(canopy);
  }
  const cloudsG = document.getElementById('layer-clouds');
  [[120, 60], [430, 40], [760, 70], [1020, 45]].forEach(([x, y], i) => {
    const g = document.createElementNS(svgNS, 'g');
    g.setAttribute('class', 'cloud cloud-' + i);
    [[0,0,28,8],[8,-6,20,8],[20,0,24,8]].forEach(([dx,dy,w,h]) => {
      const r = document.createElementNS(svgNS, 'rect');
      r.setAttribute('x', x+dx); r.setAttribute('y', y+dy);
      r.setAttribute('width', w); r.setAttribute('height', h);
      g.appendChild(r);
    });
    cloudsG.appendChild(g);
  });
}

function initParallax() {
  const hero = document.querySelector('.hero');
  if (!hero || getComputedStyle(hero.querySelector('.hero-scape')).display === 'none') return;
  const far = document.getElementById('layer-far');
  const mid = document.getElementById('layer-mid');
  const trees = document.getElementById('layer-trees');
  let pointerX = 0;
  let framePending = false;
  hero.addEventListener('pointermove', e => {
    pointerX = e.clientX;
    if (framePending) return;
    framePending = true;
    requestAnimationFrame(() => {
      const rect = hero.getBoundingClientRect();
      const dx = (pointerX - rect.left - rect.width / 2) / rect.width;
      far.style.transform = `translateX(${dx * -6}px)`;
      mid.style.transform = `translateX(${dx * -12}px)`;
      trees.style.transform = `translateX(${dx * -20}px)`;
      framePending = false;
    });
  }, { passive: true });
  hero.addEventListener('pointerleave', () => {
    far.style.transform = '';
    mid.style.transform = '';
    trees.style.transform = '';
  }, { passive: true });
}

function syncAmbientVideo() {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (document.hidden || reduceMotion.matches) {
    ambientVideos.forEach(video => video.pause());
    return;
  }

  const theme = document.documentElement.getAttribute('data-theme');
  const activeVideo = ambientVideos.find(video => video.dataset.themeVideo === theme);
  if (!activeVideo) return;

  ambientVideos.forEach(video => {
    if (video !== activeVideo) {
      video.pause();
      video.preload = 'none';
    }
  });

  activeVideo.preload = 'auto';
  if (activeVideo.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
    revealAmbientVideo(activeVideo);
  }
  if (activeVideo.paused) {
    activeVideo.play().catch(error => {
      if (error.name !== 'AbortError') {
        console.warn('Ambient background video could not start:', error);
      }
    });
  }
}

function revealAmbientVideo(video) {
  if (
    document.hidden ||
    window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
    document.documentElement.getAttribute('data-theme') !== video.dataset.themeVideo
  ) return;

  video.classList.add('is-visible');
  ambientVideos.forEach(otherVideo => {
    if (otherVideo !== video) otherVideo.classList.remove('is-visible');
  });
}

function initAmbientMotion() {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  ambientVideos = Array.from(document.querySelectorAll('.background-video'));
  ambientVideos.forEach(video => {
    video.preload = 'none';
    video.addEventListener('loadeddata', () => revealAmbientVideo(video));
    video.addEventListener('playing', () => revealAmbientVideo(video));
    video.addEventListener('error', () => {
      if (document.documentElement.getAttribute('data-theme') === video.dataset.themeVideo) {
        console.warn(`Ambient ${video.dataset.themeVideo} background video could not load.`);
      }
    });
  });
  ambientMotionInitialized = true;

  const syncMotion = () => {
    document.body.classList.toggle('is-page-hidden', document.hidden);
    syncAmbientVideo();
  };

  reduceMotion.addEventListener('change', syncMotion);
  document.addEventListener('visibilitychange', syncMotion, { passive: true });
  syncMotion();
}

function initScrollIndicator() {
  const main = document.getElementById('main');
  let hideTimer = 0;
  const updateIndicator = () => {
    const scrollableHeight = main.scrollHeight - main.clientHeight;
    if (scrollableHeight <= 0) return;

    const thumbHeight = Math.max(24, main.clientHeight * main.clientHeight / main.scrollHeight);
    const thumbRange = main.clientHeight - thumbHeight;
    const scrollRatio = main.scrollTop / scrollableHeight;
    const mainTop = main.getBoundingClientRect().top;
    main.style.setProperty('--scroll-indicator-top', `${mainTop + thumbRange * scrollRatio}px`);
    main.style.setProperty('--scroll-indicator-height', `${thumbHeight}px`);
  };
  const onScroll = () => {
    updateIndicator();
    main.classList.add('is-scrolling');
    window.clearTimeout(hideTimer);
    hideTimer = window.setTimeout(() => {
      main.classList.remove('is-scrolling');
      hideTimer = 0;
    }, 700);
  };
  const onResize = () => {
    if (main.classList.contains('is-scrolling')) updateIndicator();
  };
  main.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onResize, { passive: true });

  return () => {
    main.removeEventListener('scroll', onScroll);
    window.removeEventListener('resize', onResize);
    window.clearTimeout(hideTimer);
    main.classList.remove('is-scrolling');
    main.style.removeProperty('--scroll-indicator-top');
    main.style.removeProperty('--scroll-indicator-height');
  };
}

let heroTitleAnimationStarted = false;
let heroTitleAnimationPending = false;
let heroTitleInteractionCleanup = null;

function finishHeroTitleAnimation() {
  if (heroTitleInteractionCleanup) {
    heroTitleInteractionCleanup();
    heroTitleInteractionCleanup = null;
  }

  const title = document.querySelector('.hero-title');
  title?.querySelector('.hero-title-pixels')?.remove();
  title?.classList.remove('is-assembling');
  if (title) {
    delete title.dataset.heroAnimationPhase;
    delete title.dataset.heroParticleCount;
  }
}

function initHeroTitleAnimation() {
  const title = document.querySelector('.hero-title');
  const lines = title ? Array.from(title.querySelectorAll('.hero-title-line')) : [];
  const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (!title || !lines.length || motionPreference.matches || heroTitleAnimationStarted || heroTitleAnimationPending) return;

  heroTitleAnimationPending = true;
  const begin = async () => {
    const titleStyle = getComputedStyle(title);
    const fontFamily = titleStyle.fontFamily.split(',')[0].trim().replace(/^['"]|['"]$/g, '');
    const fontSize = Number.parseFloat(titleStyle.fontSize) || 16;
    const fontRequest = `${titleStyle.fontWeight} ${fontSize}px "${fontFamily}"`;
    const sampleText = lines.map(line => line.textContent).join(' ');
    let loadedFaces;
    try {
      loadedFaces = await document.fonts.load(fontRequest, sampleText);
    } catch (error) {
      heroTitleAnimationPending = false;
      console.warn(`Hero title animation skipped because "${fontFamily}" could not be loaded.`, error);
      return;
    }
    const requiredFontLoaded = loadedFaces.some(face =>
      face.family.replace(/^['"]|['"]$/g, '').toLowerCase() === fontFamily.toLowerCase() &&
      face.status === 'loaded',
    );
    if (!requiredFontLoaded || !document.fonts.check(fontRequest, sampleText)) {
      heroTitleAnimationPending = false;
      console.warn(`Hero title animation skipped because the "${fontFamily}" font is unavailable.`);
      return;
    }

    if (motionPreference.matches || !title.isConnected || heroTitleAnimationStarted) {
      heroTitleAnimationPending = false;
      return;
    }

    const bounds = title.getBoundingClientRect();
    if (!bounds.width || !bounds.height) {
      heroTitleAnimationPending = false;
      return;
    }

    heroTitleAnimationStarted = true;
    heroTitleAnimationPending = false;
    const paddingX = 180;
    const paddingY = 180;
    const dropDistance = 0;
    const width = Math.ceil(title.clientWidth + paddingX * 2);
    const height = Math.ceil(title.clientHeight + dropDistance + paddingY * 2);
    const ratio = Math.min(2, window.devicePixelRatio || 1);
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (!context) {
      heroTitleAnimationStarted = false;
      return;
    }

    canvas.className = 'hero-title-pixels';
    canvas.setAttribute('aria-hidden', 'true');
    canvas.style.left = `${-paddingX}px`;
    canvas.style.width = `${width}px`;
    canvas.style.setProperty('--hero-title-canvas-top', `${-dropDistance - paddingY}px`);
    canvas.style.setProperty('--hero-title-canvas-height', `${height}px`);
    canvas.width = Math.ceil(width * ratio);
    canvas.height = Math.ceil(height * ratio);
    context.scale(ratio, ratio);

    const texture = document.createElement('canvas');
    texture.width = canvas.width;
    texture.height = canvas.height;
    const textureContext = texture.getContext('2d', { willReadFrequently: true });
    if (!textureContext) {
      heroTitleAnimationStarted = false;
      return;
    }
    textureContext.scale(ratio, ratio);

    const lineDetails = lines.map((line, lineIndex) => {
      const rect = line.getBoundingClientRect();
      const style = getComputedStyle(line);
      const fontSize = Number.parseFloat(style.fontSize) || 16;
      const lineHeight = Number.parseFloat(style.lineHeight) || fontSize;
      const leading = Math.max(0, (lineHeight - fontSize) / 2);
      return {
        line,
        lineIndex,
        style,
        width: rect.width,
        x: paddingX + rect.left - bounds.left,
        y: dropDistance + paddingY + rect.top - bounds.top + leading,
      };
    });
    const pixelPatternCanvas = document.createElement('canvas');
    pixelPatternCanvas.width = 8;
    pixelPatternCanvas.height = 8;
    const pixelPatternContext = pixelPatternCanvas.getContext('2d');
    let pixelPattern = null;
    const shadowPattern = /((?:rgba?\([^)]*\)|#[\da-f]+|[a-z]+)\s+)?(-?\d+(?:\.\d+)?)px\s+(-?\d+(?:\.\d+)?)px\s+(-?\d+(?:\.\d+)?)px(?:\s+((?:rgba?\([^)]*\)|#[\da-f]+|[a-z]+)))?/gi;
    let titleColor = '';
    let textShadows = [];
    let textureStyleKey = '';
    const drawLine = (target, item, x = item.x, y = item.y, color = titleColor, shadow = null) => {
      target.save();
      target.font = item.style.font;
      target.textBaseline = 'top';
      target.textAlign = 'left';
      if ('letterSpacing' in target) target.letterSpacing = item.style.letterSpacing;
      const measuredWidth = target.measureText(item.line.textContent).width;
      const scaleX = measuredWidth > 0 ? item.width / measuredWidth : 1;
      target.translate(x, y);
      target.scale(scaleX, 1);
      target.shadowColor = 'transparent';
      target.shadowBlur = 0;
      target.shadowOffsetX = 0;
      target.shadowOffsetY = 0;
      if (shadow) {
        target.shadowColor = shadow.color;
        target.shadowBlur = shadow.blur;
        target.shadowOffsetX = shadow.x / scaleX;
        target.shadowOffsetY = shadow.y;
      }
      target.fillStyle = color;
      target.fillText(item.line.textContent, 0, 0);
      if (!shadow && pixelPattern) {
        target.globalCompositeOperation = 'source-atop';
        target.fillStyle = pixelPattern;
        target.fillText(item.line.textContent, 0, 0);
      }
      target.restore();
    };

    const refreshTexture = () => {
      const currentTitleStyle = getComputedStyle(title);
      const styleKey = [
        document.documentElement.dataset.theme,
        currentTitleStyle.color,
        currentTitleStyle.textShadow,
        currentTitleStyle.getPropertyValue('--type-pixel-highlight'),
        currentTitleStyle.getPropertyValue('--type-pixel-shadow'),
      ].join('|');
      if (styleKey === textureStyleKey) return;

      titleColor = currentTitleStyle.color;
      textShadows = Array.from(currentTitleStyle.textShadow.matchAll(shadowPattern), match => ({
        color: match[1] || match[5] || 'transparent',
        x: Number(match[2]),
        y: Number(match[3]),
        blur: Number(match[4]),
      }));
      if (pixelPatternContext) {
        pixelPatternContext.clearRect(0, 0, pixelPatternCanvas.width, pixelPatternCanvas.height);
        pixelPatternContext.fillStyle = currentTitleStyle.getPropertyValue('--type-pixel-highlight').trim()
          || 'rgb(235 255 238 / 25%)';
        pixelPatternContext.fillRect(1, 1, 2, 1);
        pixelPatternContext.fillRect(5, 3, 1, 2);
        pixelPatternContext.fillStyle = currentTitleStyle.getPropertyValue('--type-pixel-shadow').trim()
          || 'rgb(17 49 29 / 20%)';
        pixelPatternContext.fillRect(3, 5, 2, 1);
        pixelPatternContext.fillRect(7, 0, 1, 2);
        pixelPattern = textureContext.createPattern(pixelPatternCanvas, 'repeat');
      }

      textureContext.clearRect(0, 0, texture.width, texture.height);
      lineDetails.forEach(item => {
        textShadows.forEach(shadow => {
          drawLine(textureContext, item, item.x, item.y, titleColor, shadow);
        });
        drawLine(textureContext, item);
      });
      textureStyleKey = styleKey;
    };
    refreshTexture();

    const texturePixels = textureContext.getImageData(0, 0, texture.width, texture.height).data;
    const cellSize = 7;
    const cellPixels = Math.max(1, Math.round(cellSize * ratio));
    const fragments = [];
    const actions = title.closest('.hero-content')?.querySelector('.hero-actions');
    const actionsRect = actions?.getBoundingClientRect();
    const maxDown = actionsRect
      ? Math.max(36, Math.min(132, actionsRect.top - bounds.bottom - 12))
      : 72;
    for (let py = 0; py < texture.height; py += cellPixels) {
      for (let px = 0; px < texture.width; px += cellPixels) {
        const sourceWidth = Math.min(cellPixels, texture.width - px);
        const sourceHeight = Math.min(cellPixels, texture.height - py);
        let visible = false;
        for (let y = py; y < py + sourceHeight && !visible; y += 1) {
          for (let x = px; x < px + sourceWidth; x += 1) {
            if (texturePixels[(y * texture.width + x) * 4 + 3] > 24) {
              visible = true;
              break;
            }
          }
        }
        if (!visible) continue;

        const x = px / ratio;
        const y = py / ratio;
        const dx = x + sourceWidth / ratio / 2 - (paddingX + title.clientWidth / 2);
        const dy = y + sourceHeight / ratio / 2 - (dropDistance + paddingY + title.clientHeight / 2);
        const seed = Math.imul(px + 1, 73856093) ^ Math.imul(py + 1, 19349663);
        let randomState = seed >>> 0;
        const random = () => {
          randomState = (Math.imul(randomState, 1664525) + 1013904223) >>> 0;
          return randomState / 4294967296;
        };
        const angle = Math.atan2(dy, dx) + (random() - .5) * .9;
        const distance = 38 + random() * 122;
        const scatterTime = .7;
        const desiredX = Math.cos(angle) * distance;
        const desiredY = Math.max(-132, Math.min(maxDown, Math.sin(angle) * distance + (random() - .5) * 26));
        const gravity = 360;
        const tileCenterY = y + sourceHeight / ratio / 2;
        const item = lineDetails.reduce((closest, detail) => {
          const center = detail.y + (Number.parseFloat(detail.style.lineHeight) || 16) / 2;
          return Math.abs(center - tileCenterY) < Math.abs(
            closest.y + (Number.parseFloat(closest.style.lineHeight) || 16) / 2 - tileCenterY,
          )
            ? detail
            : closest;
        }, lineDetails[0]);
        const lineIndex = item ? item.lineIndex : 0;
        fragments.push({
          x,
          y,
          width: sourceWidth / ratio,
          height: sourceHeight / ratio,
          sourceX: px,
          sourceY: py,
          sourceWidth,
          sourceHeight,
          lineIndex,
          velocityX: desiredX / scatterTime,
          velocityY: (desiredY - .5 * gravity * scatterTime * scatterTime) / scatterTime,
          gravity,
          scatterRotation: (random() - .5) * Math.PI * 1.7,
          scatterAngularVelocity: (random() - .5) * 8,
          rebuildDelay: random() * .08,
          glitchSeed: random(),
          glitchOffset: (random() - .5) * 7,
        });
      }
    }

    if (!fragments.length) {
      heroTitleAnimationStarted = false;
      return;
    }

    const drawFragment = (fragment, x, y, rotation, alpha = 1, scale = 1) => {
      context.save();
      context.globalAlpha = alpha;
      context.translate(x + fragment.width / 2, y + fragment.height / 2);
      context.rotate(rotation);
      const fragmentWidth = fragment.width * scale;
      const fragmentHeight = fragment.height * scale;
      context.drawImage(
        texture,
        fragment.sourceX, fragment.sourceY, fragment.sourceWidth, fragment.sourceHeight,
        -fragmentWidth / 2, -fragmentHeight / 2, fragmentWidth, fragmentHeight,
      );
      context.restore();
    };

    let clickAnimationFrame = 0;
    let clickAnimationActive = false;
    let clickAnimationCleanup = null;
    let clickThemeObserver = null;
    const stopClickAnimation = () => {
      if (clickAnimationFrame) {
        window.cancelAnimationFrame(clickAnimationFrame);
        clickAnimationFrame = 0;
      }
      if (clickAnimationCleanup) {
        clickAnimationCleanup();
        clickAnimationCleanup = null;
      }
      clickThemeObserver?.disconnect();
      clickThemeObserver = null;
      canvas.remove();
      title.classList.remove('is-assembling');
      delete title.dataset.heroParticleCount;
      clickAnimationActive = false;
    };
    const playClickAnimation = () => {
      if (
        clickAnimationActive ||
        motionPreference.matches ||
        !title.isConnected
      ) return;

      refreshTexture();
      clickAnimationActive = true;
      title.classList.add('is-assembling');
      title.dataset.heroParticleCount = String(fragments.length);
      title.appendChild(canvas);
      const reduceMotionChange = event => {
        if (event.matches) stopClickAnimation();
      };
      motionPreference.addEventListener('change', reduceMotionChange);
      clickAnimationCleanup = () => {
        motionPreference.removeEventListener('change', reduceMotionChange);
      };
      clickThemeObserver = new MutationObserver(refreshTexture);
      clickThemeObserver.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['data-theme'],
      });

      const scatterDuration = .36;
      const scatterTime = .42;
      const rebuildDuration = .48;
      const lineStagger = .055;
      const totalDuration = scatterDuration + 2 * lineStagger + .08 + rebuildDuration;
      let elapsed = 0;
      let previousFrame = 0;
      const drawClickAnimation = now => {
        if (!previousFrame) previousFrame = now;
        elapsed = Math.min(totalDuration, elapsed + Math.min(.05, Math.max(0, (now - previousFrame) / 1000)));
        previousFrame = now;
        context.clearRect(0, 0, width, height);

        fragments.forEach(fragment => {
          const lineStart = scatterDuration + fragment.lineIndex * lineStagger + fragment.rebuildDelay;
          if (elapsed < scatterDuration) {
            const progress = elapsed / scatterDuration;
            const eased = 1 - Math.pow(1 - progress, 3);
            const flightTime = scatterTime * eased;
            const x = fragment.x + fragment.velocityX * flightTime;
            const y = fragment.y + fragment.velocityY * flightTime +
              .5 * fragment.gravity * flightTime * flightTime;
            drawFragment(
              fragment, x, y, fragment.scatterAngularVelocity * flightTime,
              1 - .35 * progress, 1 - .18 * progress,
            );
            return;
          }

          const progress = Math.max(0, Math.min(1, (elapsed - lineStart) / rebuildDuration));
          const eased = 1 - Math.pow(1 - progress, 3);
          const scatteredX = fragment.x + fragment.velocityX * scatterTime;
          const scatteredY = fragment.y + fragment.velocityY * scatterTime +
            .5 * fragment.gravity * scatterTime * scatterTime;
          const scatteredRotation = fragment.scatterAngularVelocity * scatterTime;
          const x = scatteredX + (fragment.x - scatteredX) * eased;
          const y = scatteredY + (fragment.y - scatteredY) * eased;
          drawFragment(
            fragment, x, y, scatteredRotation * (1 - eased),
            .65 + .35 * eased, .82 + .18 * eased,
          );
        });

        if (elapsed < totalDuration) {
          clickAnimationFrame = window.requestAnimationFrame(drawClickAnimation);
        } else {
          stopClickAnimation();
        }
      };
      clickAnimationFrame = window.requestAnimationFrame(drawClickAnimation);
    };
    const onTitleKeydown = event => {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      event.preventDefault();
      if (!event.repeat) playClickAnimation();
    };
    const onResize = () => {
      if (heroTitleInteractionCleanup) {
        heroTitleInteractionCleanup();
        heroTitleInteractionCleanup = null;
      }
      heroTitleAnimationStarted = false;
      initHeroTitleAnimation();
    };
    title.addEventListener('click', playClickAnimation);
    title.addEventListener('keydown', onTitleKeydown);
    window.addEventListener('resize', onResize, { once: true });
    heroTitleInteractionCleanup = () => {
      title.removeEventListener('click', playClickAnimation);
      title.removeEventListener('keydown', onTitleKeydown);
      window.removeEventListener('resize', onResize);
      stopClickAnimation();
    };

  };

  void begin();
}

/* ---------------------------------------------------------
   10. INIT
   --------------------------------------------------------- */
function init() {
  initTheme();
  const cleanupScrollIndicator = initScrollIndicator();
  const cleanupScrollReveals = initScrollReveals();
  document.getElementById('themeToggle').addEventListener('change', event => {
    setTheme(event.currentTarget.checked ? 'dark' : 'light');
  });

  document.querySelectorAll('[data-nav]').forEach(btn => {
    btn.addEventListener('click', () => showView(btn.dataset.nav));
  });
  initAmbientMotion();

  document.getElementById('reset-progress-btn').addEventListener('click', () => {
    if (window.confirm('Reset your PIXELVERSE save file? This clears all XP, completed lessons, and badges on this device.')) {
      try { localStorage.removeItem(STORAGE_KEY); }
      catch (error) {
        console.warn('Progress could not be removed from this browser.', error);
        showToast('Save file could not be reset.', 'error');
        return;
      }
      refreshChrome();
      renderAchievements();
      showToast('Save file reset.', 'info');
    }
  });

  if (getComputedStyle(document.querySelector('.hero-scape')).display !== 'none') {
    buildHeroScape();
    initParallax();
  }
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) buildParticles();
  const cleanupParticleMotion = initParticleMotion();
  const cleanupParticleOnPageHide = event => {
    if (event.persisted) return;
    finishHeroTitleAnimation();
    window.clearTimeout(viewTransitionTimer);
    viewTransitionTimer = 0;
    cleanupParticleMotion();
    cleanupScrollIndicator();
    cleanupScrollReveals();
    window.removeEventListener('pagehide', cleanupParticleOnPageHide);
  };
  window.addEventListener('pagehide', cleanupParticleOnPageHide);
  if (getComputedStyle(document.querySelector('.ascii-panel')).display !== 'none') typeAsciiBoot();

  renderHeroStats();
  renderZonesGrid();
  renderAchievements();
  refreshChrome();
  initHeroTitleAnimation();
}

document.addEventListener('DOMContentLoaded', init);
