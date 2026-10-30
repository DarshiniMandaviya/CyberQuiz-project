
const menuBtn = document.getElementById("menuBtn");
const navLinks = document.getElementById("navLinks");

menuBtn.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("show");
  menuBtn.setAttribute("aria-expanded", String(isOpen));
});

navLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("show");
    menuBtn.setAttribute("aria-expanded", "false");
  });
});
