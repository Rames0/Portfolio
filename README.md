# Ramesh Maharjan Portfolio

The production portfolio is a Next.js 16 / React 19 application in `src/`. Its homepage now brings the cinematic 3D experience from the standalone [`3D/`](3D/) prototype into the main app. The prototype remains in the repository as the visual reference; the Next.js homepage is the production entry point.

The homepage includes a skippable CSS 3D cube intro, a Three.js particle field with floating geometry and a torus-knot hero core, 3D portrait and card interactions, scroll-driven perspective, flip cards, and a draggable technology sphere. Reduced-motion settings bypass the intro and disable animated WebGL. The production features remain available: six linked projects, an interactive architecture console, resume PDF generation, theme toggle, mobile navigation, analytics, and the contact form.

## Run locally

```bash
npm install
npm run dev
```

Open <http://localhost:3000>. Add `?skip` or `?static` to bypass the intro. Use the **3D On/Off** control in the header to choose animation; `?motion=on` explicitly enables the WebGL scene even when the device requests reduced motion, while `?motion=off` disables it. Without an explicit choice, the page respects the device setting. Configure EmailJS with the variables in [`.env.example`](.env.example); without them, the contact form opens a prepared email in the visitor's email app.

## Checks

```bash
npm run typecheck
npm run lint:3d
npm run build
```

`npm run lint` checks the entire existing `src/` tree. It currently reports formatting issues in unrelated files; `lint:3d` checks the files changed for this integration.

The implementation brief used for the 3D port is in [`MASTER_PROMPT_3D.md`](MASTER_PROMPT_3D.md). The Next.js homepage is [`src/app/page.tsx`](src/app/page.tsx), and the integrated 3D styles are in [`src/app/portfolio-3d.css`](src/app/portfolio-3d.css).
