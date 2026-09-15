import { state } from "./state.js";
import { characters } from "./characters.js";
import { translations } from "./translations.js";
import {
  getConversation,
  addMessage,
  createUserMessage,
  createAssistantMessage,
} from "./chat.js";

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
  if (path === "/chat" && state.selectedCharacter) {
    setupChat();
  }
}
function setupChat() {
  const form = document.querySelector("#chat-form");

  const input = document.querySelector("#chat-input");

  const messagesContainer = document.querySelector("#chat-messages");

  if (!form || !input || !messagesContainer) {
    return;
  }

  scrollChatToBottom();

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const content = input.value.trim();

    if (!content) {
      return;
    }

    const characterId = state.selectedCharacter;

    const userMessage = createUserMessage(content);

    addMessage(characterId, userMessage);

    // Respuesta temporal.
    // Después esto lo reemplaza Gemini.
    const temporaryResponse = createAssistantMessage(
      state.language === "es"
        ? "Recibí tu mensaje. En el próximo paso esta respuesta vendrá de Gemini."
        : "I received your message. In the next step this response will come from Gemini.",
    );

    addMessage(characterId, temporaryResponse);

    router();
  });
}

function scrollChatToBottom() {
  requestAnimationFrame(() => {
    const messagesContainer = document.querySelector("#chat-messages");

    if (!messagesContainer) {
      return;
    }

    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  });
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

      <section class="home-intro">

        <p class="eyebrow">
          ${t.heroEyebrow}
        </p>

        <h1>
          CHRONOS
        </h1>

        <p class="home-intro-text">
          ${
            state.language === "es"
              ? "Tres épocas. Tres mentes. Una misma pregunta."
              : "Three eras. Three minds. One question."
          }
        </p>

      </section>

      <section class="timeline-showcase">

        ${characters
          .map((character, index) => renderCharacterShowcase(character, index))
          .join("")}

      </section>

      <section class="home-chat-cta">

        <p>
          ${
            state.language === "es"
              ? "¿Listo para elegir con quién hablar?"
              : "Ready to choose who you want to talk to?"
          }
        </p>

        <a
          href="/chat"
          class="primary-cta"
          data-link
        >
          ${state.language === "es" ? "IR AL CHAT" : "GO TO CHAT"}
        </a>

      </section>

    </main>
  `;
}
function renderCharacterShowcase(character, index) {
  const gallery = character.gallery || [];

  const duplicatedGallery = [...gallery, ...gallery];

  return `
    <article class="character-showcase ${character.era}">

      <div class="showcase-heading">

        <span class="showcase-era">
          ${character.year}
        </span>

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

      <div
        class="character-carousel ${
          index % 2 === 0 ? "carousel-left" : "carousel-right"
        }"
      >

        <div
          class="carousel-track"
          style="--carousel-speed: ${
            index === 0 ? "26s" : index === 1 ? "18s" : "22s"
          };"
        >

          ${duplicatedGallery
            .map(
              (image, imageIndex) => `
                <div class="carousel-slide">

                  <img
                    src="${image}"
                    alt="${character.name} ${(imageIndex % gallery.length) + 1}"
                  />

                </div>
              `,
            )
            .join("")}

        </div>

      </div>

    </article>
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
          ${character.chatDescription[state.language]}
        </p>

      </div>

      <button
        type="button"
        class="character-button"
        data-character="${character.id}"
      >
        ${
          character.era === "past"
            ? state.language === "es"
              ? "VIAJAR AL PASADO"
              : "TRAVEL TO THE PAST"
            : character.era === "present"
              ? state.language === "es"
                ? "EXPLORAR EL PRESENTE"
                : "EXPLORE THE PRESENT"
              : state.language === "es"
                ? "VIAJAR AL FUTURO"
                : "TRAVEL TO THE FUTURE"
        }

        <span>→</span>
      </button>

    </article>
  `;
}

function renderChat() {
  if (!state.selectedCharacter) {
    return renderCharacterSelection();
  }

  return renderCharacterChat();
}
function renderCharacterSelection() {
  const t = translations[state.language];

  return `
    <main class="character-selection-page">

      <section class="character-selection-header">

        <p class="eyebrow">
          PAST · PRESENT · FUTURE
        </p>

        <h1>
  ${
    state.language === "es"
      ? "¿A qué época querés viajar?"
      : "Which era do you want to visit?"
  }
</h1>

        <p>
  ${
    state.language === "es"
      ? "Pasado · Presente · Futuro. Elegí tu destino y comenzá la conversación."
      : "Past · Present · Future. Choose your destination and begin the conversation."
  }
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
function renderCharacterChat() {
  const character = characters.find(
    (character) => character.id === state.selectedCharacter,
  );

  if (!character) {
    state.selectedCharacter = null;
    return renderCharacterSelection();
  }

  const messages = getConversation(character.id);

  return `
    <main class="chat-page">

      <section class="chat-shell ${character.era}">

        <header class="chat-character-header">

          <button
            type="button"
            class="change-character-button"
            data-change-character
          >
            ← ${
              state.language === "es" ? "Cambiar destino" : "Change destination"
            }
          </button>

          <div>
            <span class="chat-year">
              ${character.year}
            </span>

            <h1>
              ${character.name}
            </h1>

            <p>
              ${character.role[state.language]}
            </p>
          </div>

        </header>

        <div
          id="chat-messages"
          class="chat-messages"
        >

          ${
            messages.length === 0
              ? renderInitialMessage(character)
              : messages
                  .map((message) => renderMessage(message, character))
                  .join("")
          }

        </div>

        <form
          id="chat-form"
          class="chat-composer"
        >

          <input
            id="chat-input"
            type="text"
            autocomplete="off"
            placeholder="${
              state.language === "es"
                ? `Escribile a ${character.name}...`
                : `Write to ${character.name}...`
            }"
          />

          <button
            type="submit"
            class="chat-send-button"
            aria-label="${
              state.language === "es" ? "Enviar mensaje" : "Send message"
            }"
          >
            ↑
          </button>

        </form>

      </section>

    </main>
  `;
}
function renderInitialMessage(character) {
  const messages = {
    howard: {
      es: "1943. Has llegado bastante lejos para hablar conmigo. ¿Qué asunto te trae al pasado?",
      en: "1943. You've traveled quite a long way to speak with me. What brings you to the past?",
    },

    tony: {
      es: "Bienvenido al presente. Decime qué problema tenemos y veamos cómo lo resolvemos.",
      en: "Welcome to the present. Tell me what problem we're dealing with and let's figure it out.",
    },

    jarvis: {
      es: "Conexión temporal establecida. Año 2099. ¿Qué desea conocer del futuro?",
      en: "Temporal connection established. Year 2099. What would you like to know about the future?",
    },
  };

  return `
    <article class="message assistant-message">

      <span class="message-author">
        ${character.name}
      </span>

      <p>
        ${messages[character.id][state.language]}
      </p>

    </article>
  `;
}

function renderMessage(message, character) {
  const isUser = message.role === "user";

  const time = new Date(message.timestamp).toLocaleTimeString(
    state.language === "es" ? "es-AR" : "en-US",
    {
      hour: "2-digit",
      minute: "2-digit",
    },
  );

  return `
    <article
      class="message ${isUser ? "user-message" : "assistant-message"}"
    >

      ${
        !isUser
          ? `
            <video
              class="character-response-video"
              autoplay
              muted
              loop
              playsinline
            >
              <source
                src="${character.video}"
                type="video/mp4"
              />
            </video>
          `
          : ""
      }

      <span class="message-author">
        ${isUser ? (state.language === "es" ? "Vos" : "You") : character.name}
      </span>

      <p>
        ${escapeHTML(message.content)}
      </p>

      <time>
        ${time}
      </time>

    </article>
  `;
}

function escapeHTML(text) {
  const div = document.createElement("div");

  div.textContent = text;

  return div.innerHTML;
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
