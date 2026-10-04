/* =========================================================
   SILVER SPOON DINER
========================================================= */


/* ================= NAVBAR ================= */

const navbar = document.getElementById("navbar");

window.addEventListener("scroll", () => {
  if (window.scrollY > 30) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }
});


/* ================= MOBILE MENU ================= */

const menuToggle = document.getElementById("menuToggle");
const mobileMenu = document.getElementById("mobileMenu");

menuToggle.addEventListener("click", () => {
  mobileMenu.classList.toggle("active");
});


/* Close mobile menu after clicking a link */

document.querySelectorAll(".mobile-menu a").forEach(link => {
  link.addEventListener("click", () => {
    mobileMenu.classList.remove("active");
  });
});


/* ================= CURRENT YEAR ================= */

document.getElementById("year").textContent =
  new Date().getFullYear();


/* ================= SMOOTH SCROLL ================= */

document.querySelectorAll('a[href^="#"]').forEach(anchor => {

  anchor.addEventListener("click", function (event) {

    const target = document.querySelector(
      this.getAttribute("href")
    );

    if (!target) return;

    event.preventDefault();

    const navbarHeight = navbar.offsetHeight;

    const targetPosition =
      target.getBoundingClientRect().top +
      window.scrollY -
      navbarHeight;

    window.scrollTo({
      top: targetPosition,
      behavior: "smooth"
    });

  });

});


/* ================= IMAGE PLACEHOLDER HELPER =================
   
   To replace a placeholder with an actual image:

   <div class="image-placeholder hero-image"
        style="background-image: url('images/food.jpg');">
   </div>

   Then remove the placeholder-content inside it.
========================================================= */


/* ================= REVEAL ANIMATION ================= */

const revealElements = document.querySelectorAll(
  ".menu-card, .gallery-large, .gallery-small, .feature-image, .feature-copy, .intro-grid"
);

const observer = new IntersectionObserver(
  (entries) => {

    entries.forEach(entry => {

      if (entry.isIntersecting) {

        entry.target.classList.add("revealed");

        observer.unobserve(entry.target);

      }

    });

  },
  {
    threshold: 0.12
  }
);


revealElements.forEach(element => {

  element.classList.add("reveal");

  observer.observe(element);

});