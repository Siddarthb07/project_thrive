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

### GitHub Pages (this repo)

The live HTML/CSS/JS lives in **`site/`**, not the repository root (the root has `package.json`, `README.md`, and `tools/`). GitHub’s default “Deploy from branch” only serves the **root** or **`/docs`**, so it would show the README instead of the site.

**Use GitHub Actions** (workflow included):

1. Push the latest `main` branch (includes `.github/workflows/deploy-pages.yml`).
2. On GitHub: **Settings → Pages → Build and deployment**.
3. Under **Source**, choose **GitHub Actions** (not “Deploy from a branch”).
4. Open the **Actions** tab and confirm the **Deploy GitHub Pages** workflow succeeds.

Your site will be at **`https://siddarthb07.github.io/project_thrive/`** (GitHub normalizes the hostname; replace with your username if it differs).

### Other hosts

Upload the **contents** of **`site/`** (not the whole monorepo) to Cloudflare Pages, Netlify, S3, etc.

## Next steps for the NGO

- Replace placeholder contact email/phone and wire the volunteer form to Formspree, Getform, or a backend.
- Hook donation buttons to Razorpay / compliant gateway + 80G messaging.
- Swap team photos and copy on `meet-the-team.html`.
- Add real mission / gap text on `about.html`.

## Licenses

CDN scripts (Three.js, GSAP, Lenis) follow their respective licenses. Site content © Project Thrive.
