# آژانس تبلیغاتی (Criito): Persian homepage

A Persian, right-to-left agency homepage built with **React, TypeScript, Vite and Framer Motion**, plus the existing sign-in page at `/auth`. The design follows the owner's mockup: a violet-lit classical statue with orbit rings and clouds, in a darker palette, with a dark and a light theme.

No backend is included. The consultation form validates in the browser and says plainly that nothing is sent.

## Start locally

Node.js 20.19+ and npm.

```bash
npm ci
npm run dev
```

## Production build

```bash
npm run build
npm run preview
```

Deploy the contents of `dist/` to any static host.

## Page, in order

1. Header: logo placeholder, nav pill whose indicator follows the section in view, theme toggle, sign-in link, consultation button, mobile menu, reading-progress line.
2. Hero: three headline slides (01/02/03) with a progress timer and a pause button; statue with rings that pass in front of and behind it; pointer and scroll parallax; drifting clouds.
3. About: glass card overlapping the hero, expandable "چطور کار می‌کنیم؟", image revealed with a slanted frame.
4. Services: six cards; each icon has its own hover motion; a card opens to a description and a button that opens the form with that service preselected.
5. Statistics: built in `Statistics.tsx` but **commented out in `App.tsx`** until real figures replace the placeholders in `content.ts` (`metrics`).
6. Portfolio: carousel with buttons, drag, swipe and keyboard. Photos are temporary and labelled «تصویر موقت».
7. Closing call to action with a sphere whose rings turn with scroll.
8. Footer with photo credits.

Testimonials were removed until real ones exist.

## Themes

Dark is the default. The toggle switches to light with a circular reveal (View Transitions API, with a plain fallback) and the choice is saved in `localStorage` under `theme`. An inline script in `index.html` applies it before first paint. The `/auth` page keeps its own dark palette in both themes.

Colors live as CSS variables at the top of `src/styles/global.css` (`:root` / `[data-theme="light"]`).

## Fonts

- **Estedad** (Persian), `@fontsource-variable/estedad`, OFL.
- **Outfit** (Latin), `@fontsource-variable/outfit`, OFL. Applied to any element with `lang="en"`.

## Content to replace before launch

All in `src/data/content.ts` unless noted:

- **Logo**: `Brand` in `src/components/Shared.tsx` shows a «لوگو» placeholder.
- **Blog**: the nav item shows «به‌زودی» until it has a link (`navigation`).
- **Social profiles**: `socials[].url` is empty, so icons show as «به‌زودی». Add URLs and they become links.
- **Portfolio**: `projects` uses temporary Unsplash photos.
- **Statistics**: `metrics` are the mockup's figures, marked `[REAL DATA]`.
- **Form**: `ConsultationDialog` in `Contact.tsx` has a `TODO` where a real submission goes.
- **About text**: the expandable paragraph in `Introduction.tsx` is draft copy.

## Motion and accessibility

- Every looping motion in the hero (slide timer, ring lights, clouds) stops with the pause button.
- With `prefers-reduced-motion: reduce`, there is no autoplay, parallax or looping, and content appears in place.
- Native `<dialog>` with Escape, visible labels and text error messages, keyboard-operable carousel and menu, skip link, visible focus in both themes.

## Tests

```bash
npm run dev
# in another terminal
npm run test:e2e
```

Optional: `BASE_URL`, `CHROMIUM_PATH` (path to a local Chrome) and `PROXY` (if remote images need one). The suite checks overflow at 320-1440px in both themes, clicks through every control, runs axe WCAG A/AA scans and writes `qa/test-results.json` plus screenshots.

## Backup

The previous version of `src`, `index.html`, `tests`, `qa` and `public/fonts` is in `_backup/2026-11-03-before-redesign/`. Delete it once it is no longer needed.
