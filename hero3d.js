import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

const canvas = document.getElementById('hero-canvas');

try { init(); }
catch (err) {
  console.warn('3D hero disabled:', err);
  document.body.classList.add('no-webgl');
}

function init() {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
  camera.position.set(0, 0.5, 10.5);

  const key = new THREE.DirectionalLight(0xfff0d8, 2.4);
  key.position.set(3, 5, 5);
  scene.add(key, new THREE.AmbientLight(0xffffff, 0.35));
  const rim = new THREE.PointLight(0xdcc08a, 18, 20);
  rim.position.set(-4, 2, -3);
  scene.add(rim);

  /* ---- materials ---- */
  const cream = new THREE.MeshPhysicalMaterial({ color: 0xf1e6d8, roughness: 0.38, clearcoat: 1, clearcoatRoughness: 0.18 });
  const gold = new THREE.MeshStandardMaterial({ color: 0xc9a762, metalness: 1, roughness: 0.26 });
  const dark = new THREE.MeshStandardMaterial({ color: 0x1b1e26, roughness: 0.6 });

  /* ---- label texture (wraps around the bottle body) ---- */
  const tex = new THREE.CanvasTexture(document.createElement('canvas'));
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  function drawLabel() {
    const c = tex.image; c.width = 2048; c.height = 1024;
    const x = c.getContext('2d');
    x.fillStyle = '#f1e6d8'; x.fillRect(0, 0, c.width, c.height);
    x.textAlign = 'center'; x.fillStyle = '#a98a4f';
    const cx = 1024;
    x.font = '700 250px "Cormorant Garamond", Georgia, serif';
    x.fillText('LT', cx, 470);
    x.strokeStyle = '#a98a4f'; x.lineWidth = 3;
    x.beginPath(); x.moveTo(cx - 190, 520); x.lineTo(cx + 190, 520); x.stroke();
    x.font = '600 62px "Cormorant Garamond", Georgia, serif';
    x.fillText('THE LUME THEORY', cx, 610);
    x.font = '400 34px "Jost", sans-serif'; x.fillStyle = '#6f6350';
    x.fillText('S K I N  |  A E S T H E T I C S  |  W E L L N E S S', cx, 680);
    x.font = '400 28px "Jost", sans-serif';
    x.fillText('A  B R I G H T E R  Y O U', cx, 750);
    tex.needsUpdate = true;
  }
  drawLabel();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(drawLabel);
  const labelled = new THREE.MeshPhysicalMaterial({ map: tex, roughness: 0.35, clearcoat: 1, clearcoatRoughness: 0.15 });

  const mesh = (geo, mat, y = 0) => { const m = new THREE.Mesh(geo, mat); m.position.y = y; return m; };
  const cyl = (rt, rb, h) => new THREE.CylinderGeometry(rt, rb, h, 64);

  /* ---- products ---- */
  function dropperBottle() {
    const g = new THREE.Group();
    g.add(mesh(cyl(0.85, 0.85, 2.3), labelled, 0));
    g.add(mesh(cyl(0.38, 0.85, 0.4), cream, 1.3));
    g.add(mesh(cyl(0.4, 0.4, 0.34), gold, 1.67));
    g.add(mesh(new THREE.CapsuleGeometry(0.22, 0.55, 8, 24), dark, 2.2));
    g.position.y = -0.2; return g;
  }
  function tube() {
    const g = new THREE.Group();
    g.add(mesh(cyl(0.62, 0.62, 2.5), labelled, 0));
    const crimp = mesh(new THREE.BoxGeometry(1.3, 0.28, 0.14), cream, 1.38);
    g.add(crimp);
    g.add(mesh(cyl(0.48, 0.56, 0.55), gold, -1.5));
    g.rotation.z = 0.12; return g;
  }
  function jar() {
    const g = new THREE.Group();
    g.add(mesh(cyl(1.15, 1.15, 1.1), labelled, 0));
    g.add(mesh(cyl(1.2, 1.2, 0.5), gold, 0.8));
    g.position.y = -0.5; return g;
  }
  const d = dropperBottle(), t = tube(), j = jar();
  const stage = new THREE.Group();
  d.position.x = 0.1; t.position.set(-2.6, -0.1, -0.6); j.position.set(2.5, -0.5, 0.5);
  const plinth = new THREE.Group();
  const plinthBody = new THREE.MeshPhysicalMaterial({ color: 0x242832, roughness: 0.3, metalness: 0.28, clearcoat: 0.8 });
  const plinthTop = new THREE.Mesh(new THREE.CylinderGeometry(2.55, 2.7, 0.16, 96), plinthBody);
  plinthTop.position.y = -1.91;
  const plinthFoot = new THREE.Mesh(new THREE.CylinderGeometry(2.22, 2.35, 0.12, 96), dark);
  plinthFoot.position.y = -2.06;
  const plinthEdge = new THREE.Mesh(new THREE.TorusGeometry(2.52, 0.018, 12, 96), gold);
  plinthEdge.rotation.x = Math.PI / 2;
  plinthEdge.position.y = -1.82;
  plinth.add(plinthTop, plinthFoot, plinthEdge);
  stage.add(plinth, t, d, j); scene.add(stage);

  /* ---- sparkles ---- */
  const N = 140, pos = new Float32Array(N * 3);
  for (let i = 0; i < N; i++) { pos[i * 3] = (Math.random() - .5) * 11; pos[i * 3 + 1] = (Math.random() - .5) * 7; pos[i * 3 + 2] = (Math.random() - .5) * 6; }
  const pg = new THREE.BufferGeometry(); pg.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const sparkles = new THREE.Points(pg, new THREE.PointsMaterial({ color: 0xdcc08a, size: 0.05, transparent: true, opacity: 0.8, depthWrite: false }));
  scene.add(sparkles);

  /* ---- interaction ---- */
  const target = { x: 0, y: 0 }, cur = { x: 0, y: 0 };
  const hero = canvas.closest('.hero') || canvas;
  hero.addEventListener('pointermove', e => {
    const r = hero.getBoundingClientRect();
    target.x = ((e.clientX - r.left) / r.width - 0.5) * 2;
    target.y = ((e.clientY - r.top) / r.height - 0.5) * 2;
  });
  window.addEventListener('deviceorientation', e => {
    if (e.gamma == null) return;
    target.x = Math.max(-1, Math.min(1, e.gamma / 30));
    target.y = Math.max(-1, Math.min(1, (e.beta - 45) / 30));
  });
  window.addEventListener('scroll', () => { stage.userData.s = Math.min(window.scrollY / 600, 1); }, { passive: true });

  /* ---- resize ---- */
  function resize() {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    const narrow = camera.aspect < 0.95;
    stage.scale.setScalar(narrow ? 0.62 : 0.95);
    camera.updateProjectionMatrix();
  }
  new ResizeObserver(resize).observe(canvas); resize();

  /* ---- render loop (paused when off-screen) ---- */
  let visible = true;
  new IntersectionObserver(es => { visible = es[0].isIntersecting; }, { threshold: 0 }).observe(canvas);
  const clock = new THREE.Clock();
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  function frame() {
    requestAnimationFrame(frame);
    if (!visible) return;
    const time = clock.getElapsedTime();
    cur.x += (target.x - cur.x) * 0.06; cur.y += (target.y - cur.y) * 0.06;
    stage.rotation.y = cur.x * 0.35 + (stage.userData.s || 0) * 0.8;
    stage.rotation.x = cur.y * 0.12;
    if (!reduce) {
      d.rotation.y = time * 0.5; t.rotation.y = -time * 0.4 + 1; j.rotation.y = time * 0.35 + 2;
      d.position.y = -0.2 + Math.sin(time * 1.1) * 0.12;
      t.position.y = -0.1 + Math.sin(time * 1.3 + 1) * 0.1;
      j.position.y = -0.5 + Math.sin(time * 0.9 + 2) * 0.1;
      sparkles.rotation.y = time * 0.03;
    }
    renderer.render(scene, camera);
  }
  frame();
}