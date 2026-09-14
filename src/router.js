const routes = {
  "/": renderHome,
  "/home": renderHome,
  "/chat": renderChat,
  "/about": renderAbout,
};

function renderHome() {
  return `
    <section class="page home-page">
      <p class="eyebrow">PAST · PRESENT · FUTURE</p>

      <h1>CHRONOS</h1>

      <p class="hero-text">
        Tres épocas. Tres mentes. Una pregunta.
      </p>

      <a href="/chat" class="primary-button" data-link>
        Iniciar experiencia
      </a>
    </section>
  `;
}

function renderChat() {
  return `
    <section class="page">
      <h1>Chat</h1>

      <p>
        Muy pronto vas a poder elegir entre Howard Stark,
        Tony Stark y JARVIS.
      </p>
    </section>
  `;
}

function renderAbout() {
  return `
    <section class="page">
      <h1>Sobre CHRONOS</h1>

      <p>
        CHRONOS es una experiencia interactiva que permite
        conversar con personajes de distintas épocas usando
        inteligencia artificial.
      </p>
    </section>
  `;
}

export function router() {
  const app = document.querySelector("#app");

  const path = window.location.pathname;

  const renderView = routes[path] || renderHome;

  app.innerHTML = renderView();
}

export function navigateTo(url) {
  history.pushState(null, "", url);

  router();
}
