import { router, navigateTo } from "./router.js";

document.addEventListener("DOMContentLoaded", () => {
  router();
});

document.addEventListener("click", (event) => {
  const link = event.target.closest("[data-link]");

  if (!link) return;

  event.preventDefault();

  navigateTo(link.getAttribute("href"));
});

window.addEventListener("popstate", () => {
  router();
});
