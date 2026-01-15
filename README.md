# Project Thrive — static website

Financial literacy NGO site built with **plain HTML, CSS, and JavaScript** (no React/Next). Lilac theme, smooth scrolling (Lenis), scroll reveals (GSAP), and a lightweight **Three.js** hero on the home page.

## Run locally (port **3333**)

Ports **3000** and **5050** are avoided on purpose.

```bash
npm install
npm run dev
```

Open **http://localhost:3333** — the `serve` package serves the `site/` folder.

## Assets

Camp and community photos under `site/images/` were **downloaded from the live site** (`projectthrive.in` / `lovable-uploads/`). Re-run if the upstream filenames change:

```bash
node tools/download-pt-images.mjs
```


```
site/
  index.html          # Home
  about.html
  impact.html
  contact.html
  get-involved.html
  meet-the-team.html
  css/style.css
  js/main.js          # Partials, nav, Lenis, GSAP, forms placeholder
  js/hero-3d.js       # Home hero (Three.js, ES module)
  partials/
    header.html
    footer.html
```

Partials are loaded via `fetch()`; use a local server (`npm run dev`), not `file://`.

## Deploy

Upload the contents of **`site/`** to any static host (GitHub Pages, Cloudflare Pages, S3, Netlify, etc.).

## Next steps for the NGO

- Replace placeholder contact email/phone and wire the volunteer form to Formspree, Getform, or a backend.
- Hook donation buttons to Razorpay / compliant gateway + 80G messaging.
- Swap team photos and copy on `meet-the-team.html`.
- Add real mission / gap text on `about.html`.

## Licenses

CDN scripts (Three.js, GSAP, Lenis) follow their respective licenses. Site content © Project Thrive.
