
const IMAGES = {
  
  hero: "assets/images/image3.jpg",
  "cat-cleansers": "assets/images/image2.jpg",
  "cat-serums": "assets/images/image11.jpg",
  "cat-moisturizers": "assets/images/image5.jpg",
  philosophy: "assets/images/image10.jpg",
  banner: "assets/images/image6.jpg",
  serum: "assets/images/image7.jpg",
  cream: "assets/images/image8.jpg",
  cleanser: "assets/images/image1.jpg",
  mask: "assets/images/image9.jpg",
};

const PRODUCTS = [
  { id: "olive-radiance-serum", name: "Olive Radiance Serum", desc: "A lightweight botanical serum in elegant sage glass.", price: 38, img: "serum", badge: "Bestseller" },
  { id: "dewdrop-hydration-cream", name: "Dewdrop Hydration Cream", desc: "A soft, velvety cream for a calming daily ritual.", price: 42, img: "cream", badge: "" },
  { id: "pure-botanical-cleanser", name: "Pure Botanical Cleanser", desc: "A gentle, plant-inspired cleanser for morning and evening.", price: 26, img: "cleanser", badge: "Bestseller" },
  { id: "green-ritual-face-mask", name: "Green Ritual Face Mask", desc: "A mindful weekly mask inspired by green botanicals.", price: 34, img: "mask", badge: "" },
];

const FREE_SHIPPING = 75;
const CART_KEY = "olivera_cart_v1";

/* ---------- Helpers ---------- */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const money = (n) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);
const findProduct = (id) => PRODUCTS.find((p) => p.id === id);

function escapeHTML(str) {
  return String(str).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

/* ---------- Images (with graceful fallback) ---------- */
function applyImages(root = document) {
  $$("img[data-img]", root).forEach((img) => {
    const src = IMAGES[img.dataset.img];
    if (!src) return;
    img.addEventListener("error", () => img.parentElement?.classList.add("img-fallback"), { once: true });
    img.src = src;
  });
}

/* ---------- Cart state ---------- */
let cart = loadCart();

function loadCart() {
  try {
    const raw = JSON.parse(localStorage.getItem(CART_KEY));
    if (!Array.isArray(raw)) return [];
    return raw.filter((i) => findProduct(i.id) && Number.isInteger(i.qty) && i.qty > 0);
  } catch {
    return [];
  }
}
function saveCart() {
  try { localStorage.setItem(CART_KEY, JSON.stringify(cart)); } catch { /* storage unavailable */ }
}

function addToCart(id) {
  const item = cart.find((i) => i.id === id);
  item ? item.qty++ : cart.push({ id, qty: 1 });
  saveCart(); renderCart();
  toast(`${findProduct(id).name} added to your bag`);
}
function changeQty(id, delta) {
  const item = cart.find((i) => i.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) cart = cart.filter((i) => i.id !== id);
  saveCart(); renderCart();
}
function removeItem(id) {
  cart = cart.filter((i) => i.id !== id);
  saveCart(); renderCart();
}
const cartCount = () => cart.reduce((s, i) => s + i.qty, 0);
const cartSubtotal = () => cart.reduce((s, i) => s + i.qty * findProduct(i.id).price, 0);

/* ---------- Render: products ---------- */
function renderProducts() {
  $("#product-grid").innerHTML = PRODUCTS.map((p) => `
    <article class="group reveal flex flex-col">
      <div class="img-wrap aspect-[4/5]">
        <img data-img="${p.img}" alt="${escapeHTML(p.name)}" loading="lazy" />
        ${p.badge ? `<span class="absolute top-3 left-3 bg-ivory text-forest text-[0.6rem] tracking-[0.2em] uppercase px-3 py-1.5">${p.badge}</span>` : ""}
      </div>
      <div class="pt-5 flex-1 flex flex-col">
        <h3 class="text-2xl text-forest leading-tight">${escapeHTML(p.name)}</h3>
        <p class="mt-2 text-sm text-charcoal/70 leading-relaxed flex-1">${escapeHTML(p.desc)}</p>
        <p class="mt-3 font-serif text-xl text-forest">${money(p.price)}</p>
        <button class="btn btn-outline mt-4 w-full" data-add="${p.id}" aria-label="Add ${escapeHTML(p.name)} to bag">Add to Bag</button>
      </div>
    </article>`).join("");
  applyImages($("#product-grid"));
}

/* ---------- Render: cart ---------- */
function renderCart() {
  const count = cartCount();
  const badge = $("#cart-count");
  badge.textContent = count;
  badge.classList.toggle("opacity-0", count === 0);

  const list = $("#cart-items");
  if (!cart.length) {
    list.innerHTML = `<li class="py-16 text-center">
      <p class="font-serif text-2xl text-forest">Your bag is empty</p>
      <p class="mt-2 text-sm text-charcoal/65">Add a little nature to your ritual.</p>
      <button class="btn btn-outline mt-6" data-close-cart>Continue Browsing</button></li>`;
  } else {
    list.innerHTML = cart.map((i) => {
      const p = findProduct(i.id);
      return `<li class="py-5 flex gap-4">
        <div class="img-wrap w-20 h-24 shrink-0"><img data-img="${p.img}" alt="${escapeHTML(p.name)}" /></div>
        <div class="flex-1 min-w-0">
          <div class="flex justify-between gap-2">
            <h3 class="text-xl text-forest leading-tight">${escapeHTML(p.name)}</h3>
            <span class="text-sm">${money(p.price * i.qty)}</span>
          </div>
          <p class="text-xs text-charcoal/55 mt-1">${money(p.price)} each</p>
          <div class="mt-3 flex items-center justify-between">
            <div class="inline-flex items-center border border-olive">
              <button class="w-8 h-8" data-dec="${p.id}" aria-label="Decrease quantity of ${escapeHTML(p.name)}">−</button>
              <span class="w-8 text-center text-sm" aria-live="polite">${i.qty}</span>
              <button class="w-8 h-8" data-inc="${p.id}" aria-label="Increase quantity of ${escapeHTML(p.name)}">+</button>
            </div>
            <button class="text-xs underline text-charcoal/60 hover:text-forest" data-remove="${p.id}">Remove</button>
          </div>
        </div>
      </li>`;
    }).join("");
    applyImages(list);
  }

  const sub = cartSubtotal();
  $("#cart-subtotal").textContent = money(sub);
  $("#checkout-btn").disabled = !cart.length;
  $("#checkout-btn").classList.toggle("opacity-50", !cart.length);
  const remaining = FREE_SHIPPING - sub;
  $("#free-ship").innerHTML = !cart.length ? "" : remaining > 0
    ? `You are <strong>${money(remaining)}</strong> away from free shipping.`
    : `You've unlocked <strong>free shipping</strong>.`;
}

/* ---------- Drawer ---------- */
let lastFocus = null;
function openCart() {
  lastFocus = document.activeElement;
  $("#cart-drawer").classList.remove("translate-x-full");
  $("#cart-drawer").setAttribute("aria-hidden", "false");
  $("#overlay").classList.remove("opacity-0", "pointer-events-none");
  document.body.style.overflow = "hidden";
  setTimeout(() => $("#cart-close").focus(), 50);
}
function closeCart() {
  $("#cart-drawer").classList.add("translate-x-full");
  $("#cart-drawer").setAttribute("aria-hidden", "true");
  $("#overlay").classList.add("opacity-0", "pointer-events-none");
  document.body.style.overflow = "";
  lastFocus?.focus?.();
}
const cartOpen = () => !$("#cart-drawer").classList.contains("translate-x-full");

/* ---------- Toast ---------- */
let toastTimer;
function toast(msg) {
  const t = $("#toast");
  t.textContent = msg;
  t.classList.remove("opacity-0");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.add("opacity-0"), 2400);
}

/* ---------- Mobile menu ---------- */
function setupMenu() {
  const btn = $("#menu-btn"), menu = $("#mobile-menu");
  const set = (open) => {
    menu.classList.toggle("hidden", !open);
    btn.setAttribute("aria-expanded", String(open));
    btn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  };
  btn.addEventListener("click", () => set(menu.classList.contains("hidden")));
  $$("a", menu).forEach((a) => a.addEventListener("click", () => set(false)));
  window.matchMedia("(min-width: 1024px)").addEventListener("change", (e) => e.matches && set(false));
  return set;
}

/* ---------- Search ---------- */
function setupSearch() {
  const modal = $("#search-modal"), input = $("#search-input"), results = $("#search-results");
  const render = (q = "") => {
    const term = q.trim().toLowerCase();
    const hits = PRODUCTS.filter((p) => !term || (p.name + " " + p.desc).toLowerCase().includes(term));
    results.innerHTML = hits.length
      ? hits.map((p) => `<li class="py-3 flex items-center gap-4">
          <div class="img-wrap w-14 h-16 shrink-0"><img data-img="${p.img}" alt="" /></div>
          <div class="flex-1"><p class="font-serif text-xl text-forest leading-tight">${escapeHTML(p.name)}</p><p class="text-sm">${money(p.price)}</p></div>
          <button class="btn btn-outline !px-4 !py-2" data-add="${p.id}">Add</button></li>`).join("")
      : `<li class="py-6 text-center text-sm text-charcoal/60">No products found for “${escapeHTML(q)}”.</li>`;
    applyImages(results);
  };
  const open = () => { modal.classList.remove("hidden"); document.body.style.overflow = "hidden"; render(); input.value = ""; input.focus(); };
  const close = () => { modal.classList.add("hidden"); document.body.style.overflow = ""; };
  $("#search-btn").addEventListener("click", open);
  $("#search-close").addEventListener("click", close);
  modal.addEventListener("click", (e) => e.target === modal && close());
  input.addEventListener("input", (e) => render(e.target.value));
  return close;
}

/* ---------- Newsletter ---------- */
function setupNewsletter() {
  const form = $("#newsletter-form"), input = $("#newsletter-email"), msg = $("#newsletter-msg");
  const valid = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const v = input.value.trim();
    msg.className = "mt-4 text-sm min-h-[1.25rem]";
    if (!v) { msg.textContent = "Please enter your email address."; msg.classList.add("text-red-800"); input.focus(); return; }
    if (!valid(v)) { msg.textContent = "Please enter a valid email address."; msg.classList.add("text-red-800"); input.focus(); return; }
    msg.textContent = "Thank you for joining! (Preview only — no email was saved.)";
    msg.classList.add("text-forest");
    form.reset();
  });
}

/* ---------- Scroll reveal ---------- */
function setupReveal() {
  const els = $$(".reveal");
  if (!("IntersectionObserver" in window)) return els.forEach((el) => el.classList.add("in"));
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
  }, { threshold: 0.12 });
  els.forEach((el) => io.observe(el));
}

/* ---------- Init ---------- */
document.addEventListener("DOMContentLoaded", () => {
  renderProducts();
  applyImages();
  renderCart();
  const closeMenu = setupMenu();
  const closeSearch = setupSearch();
  setupNewsletter();
  setupReveal();
  $("#year").textContent = new Date().getFullYear();

  // Global click delegation
  document.addEventListener("click", (e) => {
    const t = e.target.closest("button");
    if (!t) return;
    if (t.dataset.add) addToCart(t.dataset.add);
    else if (t.dataset.inc) changeQty(t.dataset.inc, 1);
    else if (t.dataset.dec) changeQty(t.dataset.dec, -1);
    else if (t.dataset.remove) removeItem(t.dataset.remove);
    else if (t.hasAttribute("data-close-cart")) closeCart();
  });

  $("#cart-btn").addEventListener("click", openCart);
  $("#cart-close").addEventListener("click", closeCart);
  $("#overlay").addEventListener("click", closeCart);
  $("#checkout-btn").addEventListener("click", () =>
    toast("Checkout is not available in this preview — no order has been placed."));

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") { if (cartOpen()) closeCart(); closeSearch(); closeMenu(false); }
    // basic focus trap inside cart drawer
    if (e.key === "Tab" && cartOpen()) {
      const f = $$("button, a[href], input", $("#cart-drawer")).filter((el) => !el.disabled);
      if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  // Sync cart across tabs
  window.addEventListener("storage", (e) => { if (e.key === CART_KEY) { cart = loadCart(); renderCart(); } });
});