import Lenis from "https://cdn.jsdelivr.net/npm/lenis@1.3.23/+esm";

const qs = (sel, root = document) => root.querySelector(sel);

async function loadPartial(id, url) {
  const el = qs(`#${id}`);
  if (!el) return;
  try {
    const res = await fetch(url);
    el.innerHTML = await res.text();
  } catch (e) {
    console.warn("Partial load failed:", url, e);
  }
}

function currentPageFile() {
  const path = window.location.pathname.split("/").filter(Boolean);
  const last = path[path.length - 1] || "index.html";
  return last.endsWith(".html") ? last : "index.html";
}

function setActiveNav() {
  const file = currentPageFile();
  document.querySelectorAll("[data-nav]").forEach((a) => {
    if (a.getAttribute("data-nav") === file) {
      a.classList.add("is-active");
    }
  });
}

function initMobileNav() {
  const toggle = document.querySelector(".nav-toggle");
  const panel = document.querySelector("#mobile-nav");
  if (!toggle || !panel) return;

  toggle.addEventListener("click", () => {
    const open = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!open));
    toggle.setAttribute("aria-label", open ? "Open menu" : "Close menu");
    panel.hidden = open;
  });

  panel.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => {
      toggle.setAttribute("aria-expanded", "false");
      panel.hidden = true;
    });
  });
}

function initLenisAndScrollTrigger() {
  const reduced =
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduced || !window.gsap || !window.ScrollTrigger) return;

  const gsap = window.gsap;
  const ScrollTrigger = window.ScrollTrigger;
  gsap.registerPlugin(ScrollTrigger);

  const lenis = new Lenis({
    duration: 1.12,
    smoothWheel: true,
  });

  lenis.on("scroll", ScrollTrigger.update);

  const tick = (time) => {
    lenis.raf(time);
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);

  window.addEventListener("beforeunload", () => lenis.destroy());
}

function initReveals() {
  if (!window.gsap || !window.ScrollTrigger) return;
  const gsap = window.gsap;
  const ScrollTrigger = window.ScrollTrigger;
  gsap.registerPlugin(ScrollTrigger);

  gsap.utils.toArray("[data-reveal]").forEach((el) => {
    gsap.fromTo(
      el,
      { autoAlpha: 0, y: 36 },
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.85,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 90%",
          toggleActions: "play none none reverse",
        },
      },
    );
  });
}

function initCounters() {
  if (!window.gsap || !window.ScrollTrigger) return;
  const gsap = window.gsap;
  const ScrollTrigger = window.ScrollTrigger;

  gsap.utils.toArray("[data-count]").forEach((el) => {
    const end = Number(el.dataset.count);
    if (Number.isNaN(end)) return;
    const obj = { v: 0 };
    gsap.fromTo(
      obj,
      { v: 0 },
      {
        v: end,
        duration: 1.4,
        ease: "power2.out",
        scrollTrigger: {
          trigger: el,
          start: "top 88%",
          toggleActions: "play none none reverse",
        },
        onUpdate: () => {
          el.textContent = `${Math.round(obj.v)}`;
        },
      },
    );
  });
}

function initParallaxBackgrounds() {
  if (!window.gsap || !window.ScrollTrigger) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const gsap = window.gsap;

  const heroBg = document.querySelector(".hero__media");
  if (heroBg) {
    gsap.fromTo(
      heroBg,
      { y: "-10%", scale: 1.06 },
      {
        y: "10%",
        scale: 1.12,
        ease: "none",
        scrollTrigger: {
          trigger: "#hero",
          start: "top top",
          end: "bottom top",
          scrub: 0.65,
        },
      },
    );
  }

  gsap.utils.toArray("[data-parallax-section]").forEach((section) => {
    const bg = section.querySelector(".section__parallax-bg");
    if (!bg) return;
    gsap.fromTo(
      bg,
      { y: "-12%" },
      {
        y: "12%",
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top bottom",
          end: "bottom top",
          scrub: 0.55,
        },
      },
    );
  });
}

async function boot() {
  const base = ""; // served from site root
  await loadPartial("site-header", `${base}partials/header.html`);
  await loadPartial("site-footer", `${base}partials/footer.html`);

  const y = qs("#year");
  if (y) y.textContent = String(new Date().getFullYear());

  setActiveNav();
  initMobileNav();

  initLenisAndScrollTrigger();
  initReveals();
  initCounters();
  initParallaxBackgrounds();

  if (window.ScrollTrigger) {
    window.ScrollTrigger.refresh();
  }

  if (document.body.dataset.page === "home") {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (!prefersReduced) {
      const { initHero3d } = await import("./hero-3d.js");
      initHero3d();
    }
  }

  initVolunteerFormPlaceholder();
}

function initVolunteerFormPlaceholder() {
  const form = qs("#volunteer-form");
  if (!form) return;
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const name = fd.get("name");
    alert(
      `Thanks, ${name || "friend"} — wire this form to Formspree, Getform, or your NGO email. This is a static demo.`,
    );
    form.reset();
  });
}

document.addEventListener("DOMContentLoaded", boot);
