(function () {
  'use strict';
  const C = window.LUME, P = window.PRODUCTS || [], R = window.RESULTS || [], RV = window.REVIEWS || [];
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const money = n => C.currency + Number(n).toLocaleString('en-IN');
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const find = id => P.find(p => p.id === id);
  const LABEL = { acne: 'Acne', pigmentation: 'Pigmentation', skin: 'Skin Health' };
  const TINT = { acne: '#d3dfcb', pigmentation: '#f0d5b3', skin: '#e2d6c8' };

  /* ---------- logo detection ---------- */
  const probe = new Image();
  probe.onload = () => document.body.classList.add('has-logo');
  probe.src = 'assets/logo.png';

  /* ---------- cart state ---------- */
  let cart = [];
  try { cart = JSON.parse(localStorage.getItem('lume_cart') || '[]'); } catch (e) {}
  cart = cart.filter(i => find(i.id) && i.qty > 0);
  const save = () => { try { localStorage.setItem('lume_cart', JSON.stringify(cart)); } catch (e) {} };
  const totals = () => {
    const sub = cart.reduce((s, i) => s + find(i.id).price * i.qty, 0);
    const ship = !cart.length || sub >= C.freeShippingAbove ? 0 : C.shipping;
    return { sub, ship, total: sub + ship, count: cart.reduce((s, i) => s + i.qty, 0) };
  };

  /* ---------- toast ---------- */
  let tt;
  function toast(msg) {
    const t = $('#toast'); t.textContent = msg; t.classList.add('show');
    clearTimeout(tt); tt = setTimeout(() => t.classList.remove('show'), 2400);
  }

  /* ---------- product art (SVG bottles used when no photo is set) ---------- */
  function art(p) {
    const t = TINT[p.concern] || '#e2d6c8', id = 'g' + p.id.replace(/\W/g, '');
    const defs = `<defs>
      <linearGradient id="${id}b" x1="0" x2="1"><stop offset="0" stop-color="${t}"/><stop offset=".45" stop-color="#fffaf2"/><stop offset="1" stop-color="${t}"/></linearGradient>
      <linearGradient id="${id}g" x1="0" x2="1"><stop offset="0" stop-color="#8f6f35"/><stop offset=".5" stop-color="#e6cc92"/><stop offset="1" stop-color="#8f6f35"/></linearGradient></defs>`;
    const lab = (x, y, w, h) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="4" fill="#faf5ee" opacity=".95"/>
      <text x="${x + w / 2}" y="${y + h * .45}" text-anchor="middle" font-family="Cormorant Garamond,serif" font-weight="700" font-size="${Math.min(w * .3, 22)}" fill="#a07f3f">LT</text>
      <text x="${x + w / 2}" y="${y + h * .72}" text-anchor="middle" font-family="Jost,sans-serif" font-size="4.6" letter-spacing="1" fill="#5d5242">THE LUME THEORY</text>`;
    const G = `url(#${id}g)`, B = `url(#${id}b)`;
    let body = '';
    if (p.type === 'dropper') body = `<rect x="84" y="14" width="32" height="48" rx="14" fill="#2a2620"/><rect x="74" y="60" width="52" height="18" rx="3" fill="${G}"/><path d="M62 96q0-18 12-18h52q12 0 12 18v110q0 12-12 12H74q-12 0-12-12Z" fill="${B}" stroke="#00000014"/>${lab(70, 118, 60, 70)}`;
    else if (p.type === 'tube') body = `<rect x="64" y="22" width="72" height="14" rx="2" fill="${t}" stroke="#0000001a"/><path d="M68 36h64l-6 164H74Z" fill="${B}" stroke="#00000014"/><rect x="76" y="198" width="48" height="26" rx="5" fill="${G}"/>${lab(80, 80, 40, 80)}`;
    else if (p.type === 'jar') body = `<rect x="46" y="112" width="108" height="38" rx="8" fill="${G}"/><path d="M50 150h100v42q0 24-24 24H74q-24 0-24-24Z" fill="${B}" stroke="#00000014"/>${lab(66, 156, 68, 48)}`;
    else body = `<rect x="94" y="22" width="14" height="34" fill="${G}"/><rect x="78" y="16" width="48" height="14" rx="6" fill="${G}"/><rect x="88" y="54" width="26" height="22" rx="3" fill="${G}"/><path d="M60 100q0-24 20-24h42q20 0 20 24v104q0 14-16 14H76q-16 0-16-14Z" fill="${B}" stroke="#00000014"/>${lab(70, 120, 62, 72)}`;
    return `<svg viewBox="0 0 200 240" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${defs}<ellipse cx="100" cy="226" rx="52" ry="7" fill="#00000022"/>${body}</svg>`;
  }
  const media = p => (p.image ? `<img class="photo" src="${esc(p.image)}" alt="${esc(p.name)}" loading="lazy" onerror="this.remove()">` : '') + art(p);

  /* ---------- products grid ---------- */
  let filter = 'all';
  function renderGrid() {
    const list = P.filter(p => filter === 'all' || p.concern === filter);
    $('#product-grid').innerHTML = list.map((p, i) => {
      const off = p.mrp > p.price ? Math.round((1 - p.price / p.mrp) * 100) : 0;
      return `<article class="card tilt" style="animation-delay:${i * 60}ms" data-id="${p.id}">
        <div class="card-media" data-view="${p.id}">
          ${p.badge ? `<span class="badge">${esc(p.badge)}</span>` : ''}${off ? `<span class="save">${off}% off</span>` : ''}
          ${media(p)}
        </div>
        <div class="card-body">
          <span class="tag">${LABEL[p.concern]}</span>
          <h3>${esc(p.name)}</h3>
          <p class="tl">${esc(p.tagline)}</p>
          <div class="price"><b>${money(p.price)}</b>${p.mrp > p.price ? `<s>${money(p.mrp)}</s>` : ''}<small>${esc(p.size)}</small></div>
          <div class="card-actions">
            <button class="btn view" data-view="${p.id}">View</button>
            <button class="btn add" data-add="${p.id}">Add to bag</button>
          </div>
        </div></article>`;
    }).join('');
    bindTilt($$('#product-grid .card'));
  }
  function setFilter(f, scroll) {
    filter = f;
    $$('#chips .chip').forEach(c => c.classList.toggle('active', c.dataset.filter === f));
    renderGrid();
    if (scroll) $('#shop').scrollIntoView({ behavior: 'smooth' });
  }
  $('#chips').addEventListener('click', e => { const c = e.target.closest('.chip'); if (c) setFilter(c.dataset.filter); });
  $$('.concern').forEach(b => b.addEventListener('click', () => setFilter(b.dataset.filter, true)));
  $('#product-grid').addEventListener('click', e => {
    const a = e.target.closest('[data-add]'); if (a) return add(a.dataset.add, 1, true);
    const v = e.target.closest('[data-view]'); if (v) openModal(v.dataset.view);
  });

  /* ---------- 3D tilt ---------- */
  function bindTilt(els) {
    if (!matchMedia('(hover:hover)').matches) return;
    els.forEach(el => {
      el.addEventListener('pointermove', e => {
        const r = el.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
        el.classList.add('moving');
        el.style.transform = `perspective(900px) rotateX(${(-y * 10).toFixed(2)}deg) rotateY(${(x * 12).toFixed(2)}deg) translateZ(6px)`;
      });
      el.addEventListener('pointerleave', () => { el.classList.remove('moving'); el.style.transform = ''; });
    });
  }
  bindTilt($$('.concern'));

  /* ---------- modal ---------- */
  let mqty = 1;
  function openModal(id) {
    const p = find(id); if (!p) return; mqty = 1;
    $('#modal-card').innerHTML = `<button class="m-close" data-close aria-label="Close">✕</button>
      <div class="m-media">${media(p)}</div>
      <div class="m-info">
        <span class="tag">${LABEL[p.concern]} · ${esc(p.size)}</span>
        <h3>${esc(p.name)}</h3>
        <div class="price"><b>${money(p.price)}</b>${p.mrp > p.price ? `<s>${money(p.mrp)}</s>` : ''}</div>
        <p>${esc(p.desc)}</p>
        <h5>Key actives</h5><div class="actives">${p.actives.map(a => `<span>${esc(a)}</span>`).join('')}</div>
        <h5>How to use</h5><p>${esc(p.how)}</p>
        <div class="buyrow">
          <div class="qty"><button id="mq-" aria-label="Less">−</button><span id="mq">1</span><button id="mq+" aria-label="More">+</button></div>
          <button class="btn gold" id="m-add" style="flex:1">Add to bag</button>
        </div></div>`;
    $('#modal').hidden = false; document.body.style.overflow = 'hidden';
    $('#mq-').onclick = () => { mqty = Math.max(1, mqty - 1); $('#mq').textContent = mqty; };
    $('#mq+').onclick = () => { mqty = Math.min(10, mqty + 1); $('#mq').textContent = mqty; };
    $('#m-add').onclick = () => { add(id, mqty, true); closeModal(); };
  }
  function closeModal() { $('#modal').hidden = true; document.body.style.overflow = ''; }
  $('#modal').addEventListener('click', e => { if (e.target.closest('[data-close]')) closeModal(); });

  /* ---------- cart ---------- */
  function add(id, q, open) {
    const it = cart.find(i => i.id === id);
    if (it) it.qty = Math.min(10, it.qty + q); else cart.push({ id, qty: q });
    save(); renderCart(); toast(find(id).name + ' added to bag');
    const c = $('#cart-count'); c.classList.add('bump'); setTimeout(() => c.classList.remove('bump'), 250);
    if (open) setTimeout(() => openDrawer(), 250);
  }
  function renderCart() {
    const t = totals();
    $('#cart-count').textContent = t.count;
    $('#t-sub').textContent = money(t.sub);
    $('#t-ship').textContent = t.ship ? money(t.ship) : 'FREE';
    $('#t-total').textContent = $('#t-total2').textContent = money(t.total);
    const left = C.freeShippingAbove - t.sub;
    $('#ship-note').innerHTML = !cart.length ? 'Free shipping on orders above ' + money(C.freeShippingAbove)
      : left > 0 ? `Add <b>${money(left)}</b> more for <b>free shipping</b><div class="ship-bar"><i style="width:${Math.min(100, t.sub / C.freeShippingAbove * 100)}%"></i></div>`
      : '🎉 You’ve unlocked <b>free shipping</b>!<div class="ship-bar"><i style="width:100%"></i></div>';
    $('#go-checkout').disabled = !cart.length;
    $('#go-checkout').style.opacity = cart.length ? 1 : .5;
    $('#cart-items').innerHTML = cart.length ? cart.map(i => {
      const p = find(i.id);
      return `<div class="ci"><div class="ci-art">${art(p)}</div>
        <div><h4>${esc(p.name)}</h4><small>${esc(p.size)} · ${money(p.price)}</small>
          <div class="qty"><button data-dec="${i.id}" aria-label="Less">−</button><span>${i.qty}</span><button data-inc="${i.id}" aria-label="More">+</button></div></div>
        <div><b>${money(p.price * i.qty)}</b><button class="rm" data-rm="${i.id}">Remove</button></div></div>`;
    }).join('') : `<div class="empty"><p>Your bag is empty.</p><p><a href="#shop" data-closedrawer>Start shopping</a></p></div>`;
  }
  $('#cart-items').addEventListener('click', e => {
    const t = e.target;
    if (t.dataset.closedrawer !== undefined) return closeDrawer();
    const ch = (id, d) => { const it = cart.find(i => i.id === id); if (!it) return; it.qty += d; if (it.qty < 1) cart = cart.filter(i => i !== it); it && (it.qty = Math.min(10, it.qty)); save(); renderCart(); };
    if (t.dataset.inc) ch(t.dataset.inc, 1);
    else if (t.dataset.dec) ch(t.dataset.dec, -1);
    else if (t.dataset.rm) { cart = cart.filter(i => i.id !== t.dataset.rm); save(); renderCart(); }
  });

  /* drawer views */
  const view = v => {
    ['cart', 'checkout', 'done'].forEach(n => $('#view-' + n).hidden = n !== v);
    $('#drawer-title').textContent = v === 'cart' ? 'Your Bag' : v === 'checkout' ? 'Checkout' : 'Order ready';
  };
  function openDrawer(v) { view(v || 'cart'); $('#drawer').classList.add('open'); $('#overlay').classList.add('show'); $('#drawer').setAttribute('aria-hidden', 'false'); document.body.style.overflow = 'hidden'; }
  function closeDrawer() { $('#drawer').classList.remove('open'); $('#overlay').classList.remove('show'); $('#drawer').setAttribute('aria-hidden', 'true'); document.body.style.overflow = ''; }
  $('#cart-open').onclick = () => openDrawer();
  $('#drawer-close').onclick = $('#overlay').onclick = closeDrawer;
  $('#done-close').onclick = closeDrawer;
  $('#go-checkout').onclick = () => { if (cart.length) view('checkout'); };
  $('#back-cart').onclick = () => view('cart');
  document.addEventListener('keydown', e => { if (e.key === 'Escape') { closeDrawer(); closeModal(); } });

  /* ---------- WhatsApp checkout ---------- */
  function waLink(text) { return `https://wa.me/${C.whatsapp}?text=${encodeURIComponent(text)}`; }
  $('#view-checkout').addEventListener('submit', e => {
    e.preventDefault();
    if (!cart.length) return;
    if (!/^\d{8,15}$/.test(C.whatsapp) || C.whatsapp === '919999999999') toast('Owner: set your WhatsApp number in js/config.js');
    const f = Object.fromEntries(new FormData(e.target).entries());
    const t = totals(), id = 'LT' + Date.now().toString().slice(-7);
    const L = [`*🛍️ New Order — ${C.brand}*`, `Order ID: ${id}`, '', '*Items*'];
    cart.forEach((i, n) => { const p = find(i.id); L.push(`${n + 1}. ${p.name} (${p.size}) × ${i.qty} = ${money(p.price * i.qty)}`); });
    L.push('', `Subtotal: ${money(t.sub)}`, `Shipping: ${t.ship ? money(t.ship) : 'FREE'}`, `*Total: ${money(t.total)}*`, '',
      '*Delivery details*', `Name: ${f.name}`, `Phone: ${f.phone}`, `Address: ${f.address}, ${f.city}, ${f.state} - ${f.pin}`,
      `Payment: ${f.pay}`);
    if (f.notes && f.notes.trim()) L.push(`Notes: ${f.notes.trim()}`);
    L.push('', 'Please confirm my order. Thank you! 🙏');
    const url = waLink(L.join('\n'));
    window.open(url, '_blank');
    $('#done-id').textContent = id; $('#done-link').href = url;
    cart = []; save(); renderCart(); e.target.reset(); view('done');
  });

  /* ---------- before / after sliders ---------- */
  function placeholder(kind, seed) {
    const before = kind === 'before';
    let marks = '', s = seed * 9301 + (before ? 7 : 3);
    const rnd = () => (s = (s * 9301 + 49297) % 233280) / 233280;
    const skins = ['#d8aa90', '#efc5a8', '#b98268', '#e2b99d'];
    const skin = skins[(seed - 1) % skins.length];
    const count = before ? 22 : 5;
    for (let i = 0; i < count; i++) {
      const x = 125 + rnd() * 150, y = 210 + rnd() * 125;
      const radius = before ? 3 + rnd() * 5 : 2 + rnd() * 2;
      marks += `<circle cx="${x}" cy="${y}" r="${radius}" fill="${before ? '#a84e45' : '#b96f5c'}" opacity="${before ? .72 : .28}"/>`;
    }
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500">
      <defs><linearGradient id="bg" x2="0" y2="1"><stop stop-color="#fffaf4"/><stop offset="1" stop-color="#f0dfd2"/></linearGradient><linearGradient id="face" x2=".8" y2="1"><stop stop-color="${skin}"/><stop offset="1" stop-color="#bd8b70"/></linearGradient></defs>
      <rect width="400" height="500" fill="url(#bg)"/>
      <path d="M73 500c4-106 41-151 127-151s123 45 127 151" fill="#695245"/>
      <path d="M123 365v-51h154v51c-23 27-43 38-77 38s-54-11-77-38" fill="url(#face)"/>
      <ellipse cx="200" cy="219" rx="112" ry="145" fill="url(#face)"/>
      <path d="M88 206c-6-100 39-159 116-159 75 0 116 54 109 151-14-15-24-39-28-70-36 28-102 39-181 28-2 20-7 37-16 50Z" fill="#45352d"/>
      <path d="M116 208c8-9 20-13 33-10M251 198c13-4 26 0 34 9" fill="none" stroke="#49352e" stroke-width="7" stroke-linecap="round"/>
      <ellipse cx="151" cy="225" rx="8" ry="5" fill="#352a26"/><ellipse cx="266" cy="225" rx="8" ry="5" fill="#352a26"/>
      <path d="m204 225-12 55 18 5" fill="none" stroke="#9f6c58" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M177 310q23 15 46 0" fill="none" stroke="#874f4b" stroke-width="5" stroke-linecap="round"/>
      ${marks}
      <rect x="12" y="12" width="112" height="30" rx="15" fill="#0b0f16" opacity=".82"/>
      <text x="68" y="32" text-anchor="middle" font-family="sans-serif" font-size="12" letter-spacing="1.5" fill="#f1e6d8">ILLUSTRATION</text>
      </svg>`;
    return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
  }
  function makeSlider(r, i) {
    const n = i + 1;
    const fig = document.createElement('figure');
    fig.className = 'ba-card reveal';
    fig.innerHTML = `<div class="ba" role="slider" aria-label="Before and after comparison, ${esc(r.title)}" aria-valuemin="0" aria-valuemax="100" aria-valuenow="50" tabindex="0">
        <img class="ba-img" alt="Illustration of skin after ${esc(r.concern)} care" src="${esc(r.after)}">
        <div class="ba-before"><img class="ba-img" alt="Illustration of skin before ${esc(r.concern)} care" src="${esc(r.before)}"></div>
        <span class="ba-tag l">Before</span><span class="ba-tag r">After</span>
        <div class="ba-handle"><span>⇆</span></div></div>
      <figcaption><span class="pill">Illustration · ${esc(r.concern)}</span><h3>${esc(r.title)}</h3><p>${esc(r.products)}</p></figcaption>`;
    const imgs = $$('img', fig);
    imgs[0].onerror = () => { imgs[0].onerror = null; imgs[0].src = placeholder('after', n); };
    imgs[1].onerror = () => { imgs[1].onerror = null; imgs[1].src = placeholder('before', n); };
    const el = $('.ba', fig);
    let drag = false;
    const set = x => {
      const b = el.getBoundingClientRect();
      const p = Math.max(0, Math.min(100, (x - b.left) / b.width * 100));
      el.style.setProperty('--pos', p + '%'); el.setAttribute('aria-valuenow', Math.round(p));
    };
    el.addEventListener('pointerdown', e => { drag = true; el.classList.add('drag'); el.setPointerCapture(e.pointerId); set(e.clientX); });
    el.addEventListener('pointermove', e => { if (drag) set(e.clientX); });
    ['pointerup', 'pointercancel'].forEach(ev => el.addEventListener(ev, () => { drag = false; el.classList.remove('drag'); }));
    el.addEventListener('keydown', e => {
      const cur = parseFloat(getComputedStyle(el).getPropertyValue('--pos')) || 50;
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        const v = Math.max(0, Math.min(100, cur + (e.key === 'ArrowLeft' ? -5 : 5)));
        el.style.setProperty('--pos', v + '%'); el.setAttribute('aria-valuenow', Math.round(v)); e.preventDefault();
      }
    });
    return fig;
  }
  R.forEach((r, i) => $('#ba-grid').appendChild(makeSlider(r, i)));

  /* ---------- reviews ---------- */
  if (RV.length) {
    $('#reviews').hidden = false;
    $('#review-grid').innerHTML = RV.map(r => `<div class="review"><div class="stars">${'★'.repeat(r.rating || 5)}</div><p>${esc(r.text)}</p><b>${esc(r.name)}</b><small>${esc(r.city || '')}</small></div>`).join('');
  }

  /* ---------- misc UI ---------- */
  $('#free-ship').textContent = money(C.freeShippingAbove);
  $('#year').textContent = new Date().getFullYear();
  $('#foot-ig').href = C.instagram;
  const hi = encodeURIComponent('Hi ' + C.brand + '! I have a question about your products.');
  $('#foot-wa').href = $('#wa-float').href = `https://wa.me/${C.whatsapp}?text=${hi}`;
  const hdr = $('#header');
  addEventListener('scroll', () => hdr.classList.toggle('scrolled', scrollY > 30), { passive: true });
  const nav = $('#nav'), burger = $('#burger');
  burger.onclick = () => { nav.classList.toggle('open'); burger.classList.toggle('open'); };
  $$('#nav a').forEach(a => a.addEventListener('click', () => { nav.classList.remove('open'); burger.classList.remove('open'); }));

  const io = 'IntersectionObserver' in window ? new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } }), { threshold: .12 }) : null;
  $$('.reveal').forEach(el => io ? io.observe(el) : el.classList.add('in'));

  renderGrid(); renderCart();
})();