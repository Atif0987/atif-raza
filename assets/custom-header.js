document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.querySelector(".custom-header__toggle");
  const close = document.querySelector(".custom-header__close");
  const drawer = document.querySelector(".custom-header__drawer");

  if (!toggle || !drawer) return;

  toggle.addEventListener("click", () => {
    drawer.classList.add("is-open");
    toggle.setAttribute("aria-expanded", "true");
  });

  close.addEventListener("click", () => {
    drawer.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
  });
});