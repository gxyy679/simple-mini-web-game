# PIXELVERSE

An interactive pixel-art × ASCII educational platform. Four learning zones,
twelve lessons, flashcards, quizzes, drag-and-drop matching, and terminal
mini-challenges — all built with plain HTML, CSS, and JavaScript.

## Running it

No build step, no server required.

1. Unzip the project if you haven't already.
2. Open `index.html` directly in any modern browser (double-click it, or
   right-click → Open With → your browser).

Everything — layout, pixel-art icons, animations, and the four zones — is
self-contained in this folder.

## Project structure

```
pixelverse/
├── index.html          the whole app shell (nav, hero, 5 views)
├── css/
│   └── style.css        theme tokens, layout, components, animations
├── js/
│   └── script.js         content data, progress system, activities
├── assets/
│   ├── pixel-art/        optional: drop in real sprite/illustration files here
│   ├── icons/            optional: drop in real icon files here
│   ├── audio/            optional: sound effects (none required — see below)
│   └── video/            optional: embedded clips (none required — see below)
└── README.md
```

## How the pixel art works

Every icon and the hero landscape (mountains, trees, clouds, grass) is drawn
with inline SVG `<rect>` elements rather than bitmap images. That keeps every
edge perfectly crisp at any screen size — no blur, no stretching, and no
missing-image states, with zero external image files to manage. If you'd
rather use hand-drawn pixel-art sprites instead, drop PNGs into
`assets/pixel-art/` and swap the relevant `renderIcon()` calls in
`js/script.js` for `<img>` tags — just keep `image-rendering: pixelated` on
them (already defined for `.picon img` usage if you add it).

## Progress system

- All progress (XP, level, completed lessons, badges) is saved to
  `localStorage` under the key `pixelverse_progress_v1`. Nothing is sent
  anywhere — there is no backend.
- Theme choice (dark/light) is saved under `pixelverse_theme_v1`.
- "Reset save file" on the Achievements page clears progress for this
  browser only.

## Audio / video

The brief calls for optional multimedia support. No `.mp3`/`.mp4` files are
bundled, so none of the current lessons require them — the site is fully
functional without anything in `assets/audio/` or `assets/video/`. To add a
clip to a lesson, drop the file into the matching folder and add a native
`<audio controls>` or `<video controls>` tag inside that lesson's reading
block in `js/script.js`; the surrounding layout already handles missing
media gracefully since nothing currently depends on it.

## Extending content

All educational content lives in the `ZONES` array at the top of
`js/script.js`. Each lesson is one object with a `type` of `quiz`,
`flashcard`, `dragdrop`, or `terminal`, plus the data that activity type
needs. Add a new lesson object to a zone's `lessons` array and it
automatically appears in that zone's lesson list — no other wiring required.
Badges work the same way: add an entry to the `BADGES` array with a `test(progress)`
function.

## Browser support

Vanilla ES6+, CSS custom properties, and `color-mix()` are used throughout.
Any evergreen browser from the last few years (Chrome, Firefox, Safari,
Edge) works. No frameworks, no build tools, no dependencies.
