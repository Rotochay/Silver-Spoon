/* =========================================================
   SILVER SPOON DINER — interactions & animations
========================================================= */
const navbar = document.getElementById("navbar");
const progress = document.getElementById("scrollProgress");
const backToTop = document.getElementById("backToTop");

/* ---------- Scroll: navbar, progress bar, back-to-top ---------- */
function onScroll() {
  const y = window.scrollY;
  navbar.classList.toggle("scrolled", y > 30);
  backToTop.classList.toggle("show", y > 700);
  const max = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.width = (max > 0 ? (y / max) * 100 : 0) + "%";
}
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

/* ---------- Mobile menu ---------- */
const menuToggle = document.getElementById("menuToggle");
const mobileMenu = document.getElementById("mobileMenu");
function setMenu(open) {
  mobileMenu.classList.toggle("active", open);
  menuToggle.classList.toggle("open", open);
  menuToggle.setAttribute("aria-expanded", open);
}
menuToggle.addEventListener("click", () => setMenu(!mobileMenu.classList.contains("active")));
document.querySelectorAll(".mobile-menu a").forEach(a => a.addEventListener("click", () => setMenu(false)));

/* ---------- Smooth scroll with navbar offset ---------- */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", e => {
    const target = document.querySelector(anchor.getAttribute("href"));
    if (!target) return;
    e.preventDefault();
    window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - navbar.offsetHeight + 1, behavior: "smooth" });
  });
});

/* ---------- Current year ---------- */
document.getElementById("year").textContent = new Date().getFullYear();

/* ---------- Reveal on scroll (staggered) ---------- */
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const siblings = [...entry.target.parentElement.children].filter(el => el.classList.contains("reveal"));
    entry.target.style.transitionDelay = Math.min(siblings.indexOf(entry.target), 5) * 90 + "ms";
    entry.target.classList.add("revealed");
    revealObserver.unobserve(entry.target);
  });
}, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
document.querySelectorAll(".reveal").forEach(el => revealObserver.observe(el));

/* ---------- Animated number counters ---------- */
const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const end = parseFloat(el.dataset.count);
    const decimals = parseInt(el.dataset.decimals || "0", 10);
    const start = performance.now();
    const duration = 1400;
    (function tick(now) {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = (end * eased).toFixed(decimals);
      if (p < 1) requestAnimationFrame(tick);
    })(start);
    counterObserver.unobserve(el);
  });
}, { threshold: 0.6 });
document.querySelectorAll("[data-count]").forEach(el => counterObserver.observe(el));

/* ---------- Active nav link while scrolling ---------- */
const navLinks = document.querySelectorAll(".desktop-nav a");
const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    navLinks.forEach(l => l.classList.toggle("active", l.getAttribute("href") === "#" + entry.target.id));
  });
}, { rootMargin: "-45% 0px -50% 0px" });
document.querySelectorAll("main section[id]").forEach(s => sectionObserver.observe(s));

/* ---------- Open now / closed status (UK time) ---------- */
const HOURS = { 0: [9, 16], 1: [8, 17], 2: [8, 17], 3: [8, 17], 4: [8, 17], 5: [8, 17], 6: [8, 17] };
function ukNow() {
  const parts = new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/London", weekday: "short", hour: "numeric", minute: "numeric", hour12: false }).formatToParts(new Date());
  const get = t => parts.find(p => p.type === t).value;
  const day = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(get("weekday"));
  return { day, hour: parseInt(get("hour"), 10) + parseInt(get("minute"), 10) / 60 };
}
function updateStatus() {
  const { day, hour } = ukNow();
  const [open, close] = HOURS[day];
  const isOpen = hour >= open && hour < close;
  const el = document.getElementById("openStatus");
  el.classList.toggle("is-open", isOpen);
  el.classList.toggle("is-closed", !isOpen);
  el.querySelector(".status-text").textContent = isOpen ? `Open now · until ${close}:00` : `Closed · opens ${HOURS[(hour < open ? day : (day + 1) % 7)][0]}:00`;
  document.querySelectorAll("#hoursList > div").forEach(row => {
    row.classList.toggle("today", row.dataset.days.split(",").includes(String(day)));
  });
}
updateStatus();
setInterval(updateStatus, 60000);

/* ---------- Review slider ---------- */
const reviews = document.querySelectorAll(".review");
const dotsWrap = document.getElementById("reviewDots");
let current = 0;
let timer;
function showReview(i) {
  reviews[current].classList.remove("active");
  dotsWrap.children[current].classList.remove("active");
  current = (i + reviews.length) % reviews.length;
  reviews[current].classList.add("active");
  dotsWrap.children[current].classList.add("active");
}
reviews.forEach((_, i) => {
  const b = document.createElement("button");
  b.setAttribute("aria-label", `Show review ${i + 1}`);
  if (i === 0) b.classList.add("active");
  b.addEventListener("click", () => { showReview(i); restart(); });
  dotsWrap.appendChild(b);
});
function restart() { clearInterval(timer); timer = setInterval(() => showReview(current + 1), 6000); }
restart();

/* ---------- Subtle parallax on hero image ---------- */
const heroImg = document.querySelector(".hero-image img");
if (heroImg && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  window.addEventListener("scroll", () => {
    const y = window.scrollY;
    if (y < window.innerHeight) heroImg.style.transform = `scale(1.08) translateY(${y * 0.06}px)`;
  }, { passive: true });
}
