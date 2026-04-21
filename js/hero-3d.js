import * as THREE from "https://unpkg.com/three@0.160.0/build/three.module.js";

export function initHero3d() {
  const mount = document.getElementById("hero-canvas");
  if (!mount || !window.gsap || !window.ScrollTrigger) return;

  const gsap = window.gsap;
  const ScrollTrigger = window.ScrollTrigger;
  gsap.registerPlugin(ScrollTrigger);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
  camera.position.set(0, 0.2, 4.2);

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    powerPreference: "high-performance",
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
  renderer.setClearColor(0x000000, 0);
  mount.appendChild(renderer.domElement);

  const geo = new THREE.IcosahedronGeometry(1, 1);
  const mat = new THREE.MeshStandardMaterial({
    color: 0xc4b5fd,
    emissive: 0x4c1d95,
    emissiveIntensity: 0.14,
    metalness: 0.55,
    roughness: 0.28,
    flatShading: false,
  });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.scale.setScalar(1.55);
  scene.add(mesh);

  scene.add(new THREE.AmbientLight(0xffffff, 0.38));
  const key = new THREE.DirectionalLight(0xfaf5ff, 1.05);
  key.position.set(4, 6, 4);
  scene.add(key);
  const fill = new THREE.DirectionalLight(0xc084fc, 0.55);
  fill.position.set(-5, -2, 2);
  scene.add(fill);
  const rim = new THREE.PointLight(0xa78bfa, 22, 12, 2);
  rim.position.set(2, -3, 3);
  scene.add(rim);

  let scrollProgress = 0;
  const hero = document.getElementById("hero");
  if (hero) {
    ScrollTrigger.create({
      trigger: hero,
      start: "top top",
      end: "bottom top",
      scrub: true,
      onUpdate: (self) => {
        scrollProgress = self.progress;
      },
    });
  }

  const clock = new THREE.Clock();
  function resize() {
    const w = mount.clientWidth || window.innerWidth;
    const h = mount.clientHeight || 520;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }

  resize();
  window.addEventListener("resize", resize);

  let running = true;
  function frame() {
    if (!running) return;
    requestAnimationFrame(frame);
    const delta = clock.getDelta();
    const t = scrollProgress;
    const wobble = Math.sin(clock.elapsedTime * 0.6) * 0.04;
    mesh.rotation.x = THREE.MathUtils.lerp(mesh.rotation.x, t * 0.8 + wobble, 0.08);
    mesh.rotation.y += delta * (0.18 + t * 0.12);
    mesh.rotation.z = THREE.MathUtils.lerp(mesh.rotation.z, t * -0.35, 0.06);
    renderer.render(scene, camera);
  }
  frame();

  window.addEventListener(
    "beforeunload",
    () => {
      running = false;
      renderer.dispose();
      geo.dispose();
      mat.dispose();
    },
    { once: true },
  );
}
