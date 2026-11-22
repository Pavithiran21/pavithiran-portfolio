# Pavithiran Ramaraj · Portfolio

[![CI](https://github.com/Pavithiran21/pavithiran-portfolio/actions/workflows/ci.yml/badge.svg)](https://github.com/Pavithiran21/pavithiran-portfolio/actions/workflows/ci.yml)

**Live: [pavithiranramaraj.vercel.app](https://pavithiranramaraj.vercel.app/)**

My portfolio: who I am, where I've worked, and the eight full-stack apps I've built, each running live with its code on GitHub. The apps turn onto the screen of a 3D laptop or monitor as you scroll, one step at a time.

**React 19 · Vite 8 · plain CSS 3D transforms · Canvas 2D · Playwright · GitHub Actions · Vercel**

## What's on the page

- **Hero:** name, role and real numbers (8 live apps, 278 Playwright tests, CI on every repo), with three devices showing a different app every few seconds.
- **About, Experience, Projects, Certifications, Education, Contact:** each is a sticky 3D scroll scene. A rail of steps sits on the left, a device in the middle makes one full 360° turn between steps (the content swaps while its back faces you), and an info panel sits on the right.
- **Projects:** for each app, the problem it solves, what was hard, the stack, a live demo, the code, and its screenshots full size.
- **Skills:** five groups, each tile showing how many of the eight apps use that skill.

## How the motion works

- **One scroll loop** ([src/motion/engine.js](src/motion/engine.js)). Everything that moves with the scroll registers a job, and the jobs run once per animation frame in a fixed order. They write transforms straight onto DOM nodes, so React re-renders only when a scene moves to a new step, never per frame.
- **Scroll scenes** ([src/components/ScrollScene.jsx](src/components/ScrollScene.jsx)). The step comes from how far you are through a tall sticky section. Near each step boundary the device turns 0 → −180° and then 180 → 0°. The turn eases in and out, and the slow pan eases to zero at the boundary, so nothing jumps while the back is showing.
- **Section fold** ([src/motion/page.js](src/motion/page.js)). The section you leave tilts back and sinks, and the next heading stands up from lying back. Both movements combine into one transform, so a short section can fold while it is still standing up.
- **Background** ([src/components/NetBackground.jsx](src/components/NetBackground.jsx)). A canvas network of nodes and packets, capped at 55 nodes and about 30 frames a second. It pauses while you scroll or click and while the tab is hidden.
- **Every screen size.** Phones keep the 3D, with the device on top and the panel under it. Screens under 560 px tall show stacked blocks that half-spin into view, and the nav becomes a bottom tab bar under 960 px. **Reduced motion** gets still, stacked blocks.

## Run it

```bash
npm install
npm run dev        # http://localhost:5180
npm run build      # production build in dist/
npm run preview    # serve the build on http://localhost:4180
```

## Tests

Playwright runs against the production build on six screen sizes: 1920×1080, 1280×720, an 820 px tablet, a 390 px phone, a 320×568 phone and an 844×390 landscape phone.

```bash
npx playwright install chromium   # once
npm test
BASE_URL=https://pavithiranramaraj.vercel.app npm test   # the same suite against the live site
```

The suite checks:
- no console errors, and every image and logo loads
- nothing sticks out sideways
- every pinned panel fits its screen
- all reading text is whole and at least 12 px
- the nav links and the highlight that marks the current section
- each app's live demo and GitHub links
- the screenshot viewer, including the keyboard
- the 360° turn and its back face, and the section fold
- every contact link
- the reduced-motion layout, alt text and visible keyboard focus

GitHub Actions runs lint, build and the whole suite on every push.

## Project layout

```
src/
  content.js        everything the page says (profile, experience, projects, skills...)
  motion/           the scroll loop, the active section and page-wide motion
  components/       ScrollScene, devices, the small app screens, nav, lightbox, background
  sections/         one file per section
  styles/site.css   all styles
public/             screenshots, logos, favicon, share image
tests/              Playwright specs
```

**Resume:** `public/Pavithiran_Ramaraj_Resume.pdf`. Every Resume button opens it in a new tab. To update it, replace that file (same name) and push; Vercel redeploys. When you export a new version, set the PDF's Title ("Pavithiran Ramaraj – Resume") and Author: the browser tab shows the Title. Keep the experience bullets in `src/content.js` word for word the same as the PDF.

## Credits

Tech logos from [devicon](https://devicon.dev) (MIT). Fonts: Plus Jakarta Sans and JetBrains Mono (SIL Open Font License), self-hosted through Fontsource.

## License

Copyright (c) 2026 R.Pavithiran. All rights reserved. The source is public so you can read it and see how it is built. Please ask before copying, reusing or redistributing it.
