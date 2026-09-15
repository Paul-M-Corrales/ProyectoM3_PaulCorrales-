import { state } from "./state.js";
import { characters } from "./characters.js";
import { translations } from "./translations.js";

const routes = {
  "/": renderIntro,
  "/home": renderHome,
  "/chat": renderChat,
  "/about": renderAbout,
};

export function navigateTo(url) {
  history.pushState(null, "", url);

  router();
}

export function router() {
  const app = document.querySelector("#app");

  const path = window.location.pathname;

  const isIntroRoute =
    path === "/" ||
    path === "/index.html" ||
    path === "/src/" ||
    path === "/src/index.html";

  if (isIntroRoute) {
    app.innerHTML = renderIntro();

    setupIntro();

    return;
  }

  const renderView = routes[path] || renderHome;

  app.innerHTML = `
    ${renderHeader()}
    ${renderTokenBar()}
    ${renderView()}
  `;
}

function setupIntro() {
  const video = document.querySelector("#intro-video");

  const skipButton = document.querySelector("#skip-intro");

  const soundButton = document.querySelector("#toggle-sound");

  const controls = document.querySelector(".intro-controls");

  const introStart = document.querySelector("#intro-start");

  const startButton = document.querySelector("#start-experience");

  function finishIntro() {
    if (video) {
      video.pause();
      video.classList.add("hidden");
    }

    controls?.classList.add("hidden");

    introStart?.classList.remove("hidden");
  }

  video?.addEventListener("ended", finishIntro);

  skipButton?.addEventListener("click", finishIntro);

  soundButton?.addEventListener("click", () => {
    if (!video) return;

    video.muted = !video.muted;

    soundButton.textContent = video.muted ? "🔇" : "🔊";

    soundButton.setAttribute(
      "aria-label",
      video.muted ? "Activar sonido" : "Silenciar sonido",
    );
  });

  startButton?.addEventListener("click", () => {
    navigateTo("/home");
  });
}

function renderIntro() {
  const isSpanish = state.language === "es";

  const introVideo = new URL("./assets/videos/intro.mp4", import.meta.url).href;

  return `
    <main class="intro-page">

      <video
        id="intro-video"
        class="intro-video"
        autoplay
        muted
        playsinline
      >
        <source
          src="${introVideo}"
          type="video/mp4"
        />
      </video>

      <div class="intro-controls">

        <button
          id="toggle-sound"
          class="sound-button"
          type="button"
          aria-label="${isSpanish ? "Activar sonido" : "Enable sound"}"
        >
          🔇
        </button>

        <button
          id="skip-intro"
          class="skip-intro-button"
          type="button"
        >
          ${isSpanish ? "Omitir" : "Skip"}
        </button>

      </div>

      <section
        id="intro-start"
        class="intro-start hidden"
      >

        <h1>CHRONOS</h1>

        <button
          id="start-experience"
          class="start-experience-button"
          type="button"
        >
          ${isSpanish ? "EMPEZAR" : "START"}
        </button>

      </section>

    </main>
  `;
}
function renderHeader() {
  const t = translations[state.language];

  return `
    <header class="main-header">

      <a href="/home" class="logo" data-link>
        CHRONOS
      </a>

      <nav class="main-nav">
        <a href="/home" data-link>
          ${t.navHome}
        </a>

        <a href="/chat" data-link>
          ${t.navChat}
        </a>

        <a href="/about" data-link>
          ${t.navAbout}
        </a>
      </nav>

      <div class="language-switch">

        <button
          type="button"
          data-language="es"
          class="${state.language === "es" ? "active" : ""}"
        >
          ES
        </button>

        <span>/</span>

        <button
          type="button"
          data-language="en"
          class="${state.language === "en" ? "active" : ""}"
        >
          EN
        </button>

      </div>

    </header>
  `;
}

function renderTokenBar() {
  const used = state.tokenUsage;
  const limit = state.tokenLimit;

  const remaining = Math.max(limit - used, 0);

  const percentage = Math.min(Math.round((used / limit) * 100), 100);

  const language = state.language;

  return `
    <section class="ai-usage">

      <div class="ai-usage-icon">
        ✦
      </div>

      <div class="ai-usage-content">

        <div class="ai-usage-header">

          <div class="ai-usage-title">
            ${language === "es" ? "USO DIARIO DE IA" : "DAILY AI USAGE"}

            <span class="ai-status">
              ${language === "es" ? "Disponible" : "Available"}
            </span>
          </div>

          <div class="ai-usage-numbers">
            <strong>
              ${used.toLocaleString()}
            </strong>

            <span>
              / ${limit.toLocaleString()}
            </span>

            <strong class="ai-percentage">
              ${percentage}%
            </strong>
          </div>

        </div>

        <div class="ai-progress">

          <div
            class="ai-progress-fill"
            style="width: ${percentage}%"
          ></div>

        </div>

        <div class="ai-usage-footer">

          <span>
            ${remaining.toLocaleString()}
            ${language === "es" ? " restantes" : " remaining"}
          </span>

          <span>
            ${language === "es" ? "Sistema disponible" : "System available"}
          </span>

        </div>

      </div>

    </section>
  `;
}

function renderHome() {
  const t = translations[state.language];

  return `
    <main class="home-page">

      <section class="hero">

        <p class="eyebrow">
          ${t.heroEyebrow}
        </p>

        <h1>
          ${t.heroTitle}
        </h1>

        <p class="hero-subtitle">
          ${t.heroSubtitle}
        </p>

        <p class="hero-question">
          ${t.heroQuestion}
        </p>

      </section>

      <section class="character-grid">

        ${characters
          .map((character) => renderCharacterCard(character))
          .join("")}

      </section>

    </main>
  `;
}

function renderCharacterCard(character) {
  const t = translations[state.language];

  return `
    <article class="character-card ${character.era}">

      <div class="character-image">

        <img
          src="${character.image}"
          alt="${character.name}"
        />

        <div class="character-image-overlay"></div>

        <div class="character-card-top">

          <span class="era">
            ${t[character.era]}
          </span>

          <span class="year">
            ${character.year}
          </span>

        </div>

      </div>

      <div class="character-card-content">

        <h2>
          ${character.name}
        </h2>

        <h3>
          ${character.role[state.language]}
        </h3>

        <p>
          ${character.description[state.language]}
        </p>

      </div>

      <button
        type="button"
        class="character-button"
        data-character="${character.id}"
      >
        ${t.enterChat}

        <span>→</span>
      </button>

    </article>
  `;
}

function renderChat() {
  const t = translations[state.language];

  const character =
    characters.find((character) => character.id === state.selectedCharacter) ||
    characters[1];

  return `
    <main class="chat-selection-page">

      <section class="chat-selection-heading">

        <p class="eyebrow">
          ${character.year}
        </p>

        <h1>
          ${character.name}
        </h1>

        <p>
          ${character.role[state.language]}
        </p>

      </section>

      <section class="chat-placeholder ${character.era}">

        <p>
          ${t.chatSubtitle}
        </p>

        <strong>
          Chat con ${character.name}
        </strong>

        <span>
          Próximo paso: conectar esta pantalla con Gemini.
        </span>

      </section>

    </main>
  `;
}

function renderAbout() {
  const t = translations[state.language];

  return `
    <main class="about-page">

      <section>

        <p class="eyebrow">
          CHRONOS // M3
        </p>

        <h1>
          ${t.aboutTitle}
        </h1>

        <p>
          ${t.aboutText}
        </p>

      </section>

    </main>
  `;
}
