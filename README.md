# Project Thrive — static website

Financial literacy NGO site built with **plain HTML, CSS, and JavaScript** (no React/Next). Lilac theme, smooth scrolling (Lenis), scroll reveals (GSAP), and a lightweight **Three.js** hero on the home page.

## Run locally (port **3333**)

Ports **3000** and **5050** are avoided on purpose.

```bash
npm install
npm run dev
```

Open **http://localhost:3333** — `serve` publishes the **repository root** (where `index.html` lives).

## Layout

Static pages and assets live at the **repo root** so **GitHub Pages “Deploy from branch” / (root)** works without extra build steps:

```
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
  images/
```

Repo metadata (`package.json`, `tools/`, this `README.md`) sits beside those files; they are not linked from the site.

## Assets

Camp and community photos under `images/` can be **mirrored from the live site** (`projectthrive.in` / `lovable-uploads/`). Re-run if upstream filenames change:

```bash
node tools/download-pt-images.mjs
# optional: videos + posters
node tools/download-all-media.mjs
```

Partials are loaded via `fetch()`; use a local server (`npm run dev`), not `file://`.

## Deploy

### GitHub Pages

1. **Settings → Pages → Build and deployment**
2. **Source**: **Deploy from a branch**
3. **Branch**: `main`, folder **`/` (root)**
4. Save.

With `index.html` at the root, **`https://siddarthb07.github.io/project_thrive/`** loads the site. A **`.nojekyll`** file is included so GitHub does not run Jekyll on the static files.

If you previously used **GitHub Actions** as the Pages source, switch it to **Deploy from a branch** after this layout change (otherwise the old workflow will conflict or serve the wrong tree).

### Other hosts

Point the host at the repo root (same paths as above), or upload only the static files (`*.html`, `css/`, `js/`, `partials/`, `images/`, `videos/`).

## Next steps for the NGO

- Replace placeholder contact email/phone and wire the volunteer form to Formspree, Getform, or a backend.
- Hook donation buttons to Razorpay / compliant gateway + 80G messaging.
- Swap team photos and copy on `meet-the-team.html`.
- Add real mission / gap text on `about.html`.

## Licenses

CDN scripts (Three.js, GSAP, Lenis) follow their respective licenses. Site content © Project Thrive.
