const qs = (sel, root = document) => root.querySelector(sel);
const qsa = (sel, root = document) => Array.from(root.querySelectorAll(sel));

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const prefersReduced = () => reducedMotion.matches;

let lenis = null;

/* ------------------------------------------------------------------ */
/* Partials + navigation                                               */
/* ------------------------------------------------------------------ */

async function loadPartial(id, url) {
  const el = qs(`#${id}`);
  if (!el) return;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(res.status);
    el.innerHTML = await res.text();
  } catch (e) {
    console.warn("Partial load failed:", url, e);
  }
}

function currentPageFile() {
  const parts = window.location.pathname.split("/").filter(Boolean);
  const last = parts[parts.length - 1] || "index.html";
  return last.endsWith(".html") ? last : "index.html";
}

function setActiveNav() {
  const file = currentPageFile();
  qsa("[data-nav]").forEach((a) => {
    if (a.getAttribute("data-nav") === file) {
      a.classList.add("is-active");
      a.setAttribute("aria-current", "page");
    }
  });
}

function initHeader() {
  const header = qs("[data-header]");
  if (!header) return;
  let lastY = window.scrollY;

  const update = () => {
    const y = window.scrollY;
    header.classList.toggle("is-solid", y > 40);
    const menuOpen = header.classList.contains("is-menu-open");
    header.classList.toggle("is-hidden", !menuOpen && y > 640 && y > lastY + 2);
    if (y < lastY - 2 || y < 640) header.classList.remove("is-hidden");
    lastY = y;
  };
  update();
  window.addEventListener("scroll", update, { passive: true });
  header.addEventListener("focusin", () => header.classList.remove("is-hidden"));
}

function initMobileNav() {
  const header = qs("[data-header]");
  const toggle = qs(".nav-toggle");
  const panel = qs("#mobile-nav");
  if (!header || !toggle || !panel) return;
  const label = qs(".nav-toggle__label", toggle);

  const setOpen = (open) => {
    toggle.setAttribute("aria-expanded", String(open));
    if (label) label.textContent = open ? "Close" : "Menu";
    panel.hidden = !open;
    header.classList.toggle("is-menu-open", open);
    document.body.classList.toggle("is-locked", open);
    if (lenis) open ? lenis.stop() : lenis.start();
    if (open) qs("a", panel)?.focus();
  };

  toggle.addEventListener("click", () => {
    setOpen(toggle.getAttribute("aria-expanded") !== "true");
  });
  qsa("a", panel).forEach((a) => a.addEventListener("click", () => setOpen(false)));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
      setOpen(false);
      toggle.focus();
    }
  });
  window.matchMedia("(min-width: 981px)").addEventListener("change", (e) => {
    if (e.matches) setOpen(false);
  });
}

/* ------------------------------------------------------------------ */
/* Motion: Lenis + GSAP ScrollTrigger                                  */
/* ------------------------------------------------------------------ */

async function initSmoothScroll() {
  if (prefersReduced() || !window.gsap || !window.ScrollTrigger) return;
  try {
    const { default: Lenis } = await import("https://cdn.jsdelivr.net/npm/lenis@1.3.23/+esm");
    lenis = new Lenis({ duration: 1.1, smoothWheel: true });
  } catch (e) {
    console.warn("Lenis unavailable, using native scroll", e);
    return;
  }

  const { gsap, ScrollTrigger } = window;
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  qsa('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href");
      if (id.length < 2) return;
      const target = qs(id);
      if (!target) return;
      e.preventDefault();
      lenis.scrollTo(target, { offset: -80 });
      history.replaceState(null, "", id);
    });
  });

  if (window.location.hash) {
    const target = qs(window.location.hash);
    if (target) requestAnimationFrame(() => lenis.scrollTo(target, { offset: -80, immediate: true }));
  }
}

function initMotion() {
  if (!window.gsap || !window.ScrollTrigger) return;
  const { gsap, ScrollTrigger } = window;
  gsap.registerPlugin(ScrollTrigger);

  if (prefersReduced()) return;

  const heroIn = qsa("[data-hero-in]");
  if (heroIn.length) {
    gsap.from(heroIn, {
      y: 28,
      autoAlpha: 0,
      duration: 0.9,
      ease: "power3.out",
      stagger: 0.08,
      delay: 0.08,
    });
  }

  qsa("[data-reveal]").forEach((el) => {
    gsap.from(el, {
      y: 26,
      autoAlpha: 0,
      duration: 0.78,
      ease: "power2.out",
      scrollTrigger: { trigger: el, start: "top 88%", once: true },
    });
  });

  qsa("[data-reveal-group]").forEach((group) => {
    gsap.from(group.children, {
      y: 22,
      autoAlpha: 0,
      duration: 0.72,
      ease: "power2.out",
      stagger: 0.08,
      scrollTrigger: { trigger: group, start: "top 88%", once: true },
    });
  });

  qsa("[data-parallax]").forEach((el) => {
    const host = el.parentElement;
    gsap.fromTo(
      el,
      { yPercent: -3 },
      {
        yPercent: 3,
        ease: "none",
        scrollTrigger: { trigger: host, start: "top bottom", end: "bottom top", scrub: true },
      },
    );
  });

  const hero = qs("#hero");
  if (hero) {
    gsap.to("[data-hero-media]", {
      scale: 1.075,
      yPercent: 4,
      ease: "none",
      scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: true },
    });
    gsap.to(".hero__content", {
      yPercent: -7,
      autoAlpha: 0.62,
      ease: "none",
      scrollTrigger: { trigger: hero, start: "35% top", end: "bottom top", scrub: true },
    });
    gsap.from(".hero__metric", {
      y: 10,
      autoAlpha: 0,
      duration: 0.65,
      ease: "power2.out",
      stagger: 0.07,
      delay: 0.35,
    });
  }

  const mm = gsap.matchMedia();
  qsa("[data-steps]").forEach((steps) => {
    const line = qs("[data-steps-line]", steps);
    if (!line) return;
    const trigger = { trigger: steps, start: "top 80%", end: "bottom 60%", scrub: true };
    mm.add("(min-width: 881px)", () => {
      gsap.fromTo(line, { scaleX: 0, scaleY: 1 }, { scaleX: 1, ease: "none", scrollTrigger: trigger });
    });
    mm.add("(max-width: 880px)", () => {
      gsap.fromTo(line, { scaleY: 0, scaleX: 1 }, { scaleY: 1, ease: "none", scrollTrigger: trigger });
    });
  });
}

function initCounters() {
  const els = qsa("[data-count]");
  if (!els.length) return;
  const fmt = new Intl.NumberFormat("en-IN");
  const render = (el, v) => {
    el.textContent = `${el.dataset.prefix || ""}${fmt.format(Math.round(v))}`;
    if (el.dataset.suffix) {
      const em = document.createElement("em");
      em.textContent = el.dataset.suffix;
      el.appendChild(em);
    }
  };
  els.forEach((el) => render(el, Number(el.dataset.count)));
  if (prefersReduced() || !window.gsap || !window.ScrollTrigger) return;

  els.forEach((el) => {
    const end = Number(el.dataset.count);
    if (Number.isNaN(end)) return;
    const state = { v: 0 };
    render(el, 0);
    window.gsap.to(state, {
      v: end,
      duration: 1.8,
      ease: "power2.out",
      scrollTrigger: { trigger: el, start: "top 90%", once: true },
      onUpdate: () => render(el, state.v),
    });
  });
}

/* ------------------------------------------------------------------ */
/* Video                                                               */
/* ------------------------------------------------------------------ */

function initHeroVideo() {
  const video = qs("[data-hero-video]");
  const btn = qs("[data-hero-toggle]");
  if (!video) return;

  let userPaused = prefersReduced();
  const sync = () => {
    if (!btn) return;
    const paused = video.paused;
    btn.setAttribute("aria-pressed", String(paused));
    qs("[data-label]", btn).textContent = paused ? "Play" : "Pause";
    qs("[data-icon-pause]", btn).hidden = paused;
    qs("[data-icon-play]", btn).hidden = !paused;
  };

  if (userPaused) {
    video.removeAttribute("autoplay");
    video.pause();
  }
  video.addEventListener("play", sync);
  video.addEventListener("pause", sync);
  sync();

  btn?.addEventListener("click", () => {
    if (video.paused) {
      userPaused = false;
      video.play().catch(() => {});
    } else {
      userPaused = true;
      video.pause();
    }
  });

  if ("IntersectionObserver" in window) {
    new IntersectionObserver(([entry]) => {
      if (userPaused) return;
      if (entry.isIntersecting) video.play().catch(() => {});
      else video.pause();
    }).observe(video);
  }
}

function initVideoPlayers() {
  const players = qsa("[data-video]");
  players.forEach((player) => {
    const video = qs("video", player);
    const btn = qs(".video-player__play", player);
    if (!video || !btn) return;

    btn.addEventListener("click", () => {
      players.forEach((p) => {
        const v = qs("video", p);
        if (v && v !== video) v.pause();
      });
      video.controls = true;
      player.classList.add("is-playing");
      video.play().catch(() => {});
      video.focus({ preventScroll: true });
    });
  });
}

/* ------------------------------------------------------------------ */
/* Mock forms                                                          */
/* ------------------------------------------------------------------ */

function initDonateForms() {
  const fmt = new Intl.NumberFormat("en-IN");
  qsa("[data-donate-form]").forEach((form) => {
    const submit = qs('button[type="submit"]', form);
    const status = qs(".donate-status", form);
    const custom = qs('input[name="custom"]', form);
    const customRadio = qs('input[name="amount"][value="custom"]', form);

    const amount = () => {
      const picked = qs('input[name="amount"]:checked', form);
      if (!picked) return 0;
      if (picked.value === "custom") return Number(custom?.value) || 0;
      return Number(picked.value);
    };
    const update = () => {
      const a = amount();
      submit.textContent = a > 0 ? `Donate ₹${fmt.format(a)}` : "Enter an amount";
      if (status) status.textContent = "";
    };

    form.addEventListener("change", update);
    custom?.addEventListener("focus", () => {
      if (customRadio) customRadio.checked = true;
      update();
    });
    custom?.addEventListener("input", update);
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const a = amount();
      if (!status) return;
      status.textContent =
        a > 0
          ? `Thank you. In the live site, your ₹${fmt.format(a)} gift would continue to a secure payment page. (Mockup — nothing was charged.)`
          : "Please choose or enter an amount.";
    });
    update();
  });
}

function initMockForms() {
  qsa("[data-mock-form]").forEach((form) => {
    const status = qs(".form-status", form);
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!form.checkValidity()) {
        status.textContent = "Please fill in your name, a valid email, and any required fields.";
        status.classList.add("is-error");
        qs(":invalid", form)?.focus();
        return;
      }
      const name = new FormData(form).get("name");
      status.classList.remove("is-error");
      status.textContent = `Thanks${name ? `, ${name}` : ""}! This is a mockup, so nothing was sent — please email getinfo_projectthrive@gmail.com for now.`;
      form.reset();
    });
  });
}

/* ------------------------------------------------------------------ */
/* Lightbox                                                            */
/* ------------------------------------------------------------------ */

function initLightbox() {
  const triggers = qsa("[data-lightbox]");
  if (!triggers.length || typeof HTMLDialogElement === "undefined") return;

  const dialog = document.createElement("dialog");
  dialog.className = "lightbox";
  dialog.setAttribute("aria-label", "Photo viewer");
  dialog.innerHTML = `
    <img alt="" />
    <div class="lightbox__bar">
      <span data-lb-caption></span>
      <span>
        <button type="button" data-lb-prev aria-label="Previous photo">Prev</button>
        <button type="button" data-lb-next aria-label="Next photo">Next</button>
        <button type="button" data-lb-close>Close</button>
      </span>
    </div>`;
  document.body.appendChild(dialog);
  const img = qs("img", dialog);
  const caption = qs("[data-lb-caption]", dialog);
  let set = [];
  let index = 0;

  const show = (i) => {
    index = (i + set.length) % set.length;
    const t = set[index];
    img.src = t.dataset.lightbox;
    img.alt = qs("img", t)?.alt || t.getAttribute("aria-label") || "";
    caption.textContent = img.alt;
    const multi = set.length > 1;
    qs("[data-lb-prev]", dialog).hidden = !multi;
    qs("[data-lb-next]", dialog).hidden = !multi;
  };

  triggers.forEach((t) => {
    t.addEventListener("click", () => {
      const group = t.closest(".gallery");
      set = group ? qsa("[data-lightbox]", group) : [t];
      show(set.indexOf(t));
      lenis?.stop();
      dialog.showModal();
    });
  });

  qs("[data-lb-prev]", dialog).addEventListener("click", () => show(index - 1));
  qs("[data-lb-next]", dialog).addEventListener("click", () => show(index + 1));
  qs("[data-lb-close]", dialog).addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (e) => {
    if (e.target === dialog) dialog.close();
  });
  dialog.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") show(index - 1);
    if (e.key === "ArrowRight") show(index + 1);
  });
  dialog.addEventListener("close", () => lenis?.start());
}

/* ------------------------------------------------------------------ */

async function boot() {
  await Promise.all([
    loadPartial("site-header", "partials/header.html"),
    loadPartial("site-footer", "partials/footer.html"),
  ]);

  const year = qs("#year");
  if (year) year.textContent = String(new Date().getFullYear());

  setActiveNav();
  initHeader();
  initMobileNav();

  initHeroVideo();
  initVideoPlayers();
  initDonateForms();
  initMockForms();
  initLightbox();

  await initSmoothScroll();
  initMotion();
  initCounters();
  window.ScrollTrigger?.refresh();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot);
} else {
  boot();
}
