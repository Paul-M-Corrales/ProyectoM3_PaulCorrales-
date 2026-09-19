import { characters } from "./characters.js";
import { translations } from "./translations.js";
import { state, updateTokenState } from "./state.js";
import {
  getConversation,
  addMessage,
  createUserMessage,
  createAssistantMessage,
  sendMessageToAI,
} from "./chat.js";
import {
  addTokenUsage,
  hasAvailableTokens,
  getRemainingTokens,
} from "./utils.js";
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

  // Estamos dentro del chat de un personaje
  const isCharacterChat = path === "/chat" && Boolean(state.selectedCharacter);

  // Activa el modo especial de chat para que ocupe todo el espacio disponible
  app.classList.toggle("chat-mode", isCharacterChat);

  const isIntroRoute =
    path === "/" ||
    path === "/index.html" ||
    path === "/src/" ||
    path === "/src/index.html";

  // INTRO
  if (isIntroRoute) {
    app.innerHTML = renderIntro();

    setupIntro();

    return;
  }

  const renderView = routes[path] || renderHome;

  app.innerHTML = `
    ${renderHeader()}
    ${isCharacterChat ? "" : renderTokenBar()}
    ${renderView()}
  `;

  // Inicializa la lógica del chat únicamente cuando hay un personaje seleccionado
  if (isCharacterChat) {
    setupChat();
  }
}
function setupChat() {
  const form = document.querySelector("#chat-form");
  const input = document.querySelector("#chat-input");
  const messagesContainer = document.querySelector("#chat-messages");
  const sendButton = document.querySelector(".chat-send-button");

  if (!form || !input || !messagesContainer) {
    return;
  }

  scrollChatToBottom();

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const content = input.value.trim();

    if (!content) {
      return;
    }

    if (!hasAvailableTokens()) {
      showChatError(
        state.language === "es"
          ? "Alcanzaste el límite diario de IA. La conexión temporal estará disponible nuevamente mañana."
          : "You have reached the daily AI limit. The temporal connection will be available again tomorrow.",
      );

      return;
    }

    const characterId = state.selectedCharacter;

    const userMessage = createUserMessage(content);

    addMessage(characterId, userMessage);
    const characterMedia = document.querySelector("#chat-character-media");

    if (characterMedia) {
      characterMedia.classList.remove("hidden");
    }

    input.value = "";
    input.disabled = true;

    if (sendButton) {
      sendButton.disabled = true;
    }

    renderCurrentConversation();
    showTypingIndicator();
    scrollChatToBottom();

    const controller = new AbortController();

    const waitingMessages = getWaitingMessages(characterId, state.language);

    const firstDelayMessage = setTimeout(() => {
      updateWaitingMessage(waitingMessages[0]);
    }, 4000);

    const secondDelayMessage = setTimeout(() => {
      updateWaitingMessage(waitingMessages[1]);
    }, 8000);

    const requestTimeout = setTimeout(() => {
      controller.abort();
    }, 12000);

    try {
      const conversation = getConversation(characterId);

      const data = await sendMessageToAI({
        character: characterId,
        language: state.language,
        messages: conversation,
        signal: controller.signal,
      });

      const usedTokens = data?.usage?.totalTokens || 0;

      if (usedTokens > 0) {
        addTokenUsage(usedTokens);
        updateTokenState();
        refreshTokenBar();
      }

      const assistantMessage = createAssistantMessage(data.reply);

      addMessage(characterId, assistantMessage);

      removeTypingIndicator();

      renderCurrentConversation();

      scrollChatToBottom();
    } catch (error) {
      removeTypingIndicator();

      if (error.name === "AbortError") {
        showChatError(
          state.language === "es"
            ? "Wow, esta conexión temporal está tardando demasiado. Volvé a intentarlo en unos instantes para que pueda darte una respuesta como corresponde."
            : "Wow, this temporal connection is taking too long. Please try again in a moment so I can give you the response you deserve.",
        );
      } else {
        console.error(error);

        showChatError(
          state.language === "es"
            ? "La conexión temporal tuvo un problema. Intentá nuevamente en unos segundos."
            : "The temporal connection encountered a problem. Please try again in a few seconds.",
        );
      }
    } finally {
      clearTimeout(firstDelayMessage);
      clearTimeout(secondDelayMessage);
      clearTimeout(requestTimeout);

      input.disabled = false;

      if (sendButton) {
        sendButton.disabled = false;
      }

      input.focus();
    }
  });
}
function refreshTokenBar() {
  const currentTokenBar = document.querySelector(".ai-usage");

  if (!currentTokenBar) {
    return;
  }

  const wrapper = document.createElement("div");

  wrapper.innerHTML = renderTokenBar().trim();

  const newTokenBar = wrapper.firstElementChild;

  if (!newTokenBar) {
    return;
  }

  currentTokenBar.replaceWith(newTokenBar);
}

function renderCurrentConversation() {
  const messagesContainer = document.querySelector("#chat-messages");

  const character = characters.find(
    (character) => character.id === state.selectedCharacter,
  );

  if (!messagesContainer || !character) {
    return;
  }

  const messages = getConversation(character.id);

  messagesContainer.innerHTML =
    messages.length === 0
      ? renderInitialMessage(character)
      : messages.map((message) => renderMessage(message, character)).join("");
}

function showTypingIndicator() {
  const messagesContainer = document.querySelector("#chat-messages");

  const character = characters.find(
    (character) => character.id === state.selectedCharacter,
  );

  if (!messagesContainer || !character) {
    return;
  }

  const article = document.createElement("article");

  article.id = "typing-indicator";

  article.className = "message assistant-message typing-message";

  article.innerHTML = `
    <span class="message-author">
      ${character.name}
    </span>

    <div class="typing-content">

      <div class="typing-dots">
        <span></span>
        <span></span>
        <span></span>
      </div>

      <p
        id="waiting-message"
        class="waiting-message"
      ></p>

    </div>
  `;

  messagesContainer.appendChild(article);
}
function updateWaitingMessage(message) {
  const element = document.querySelector("#waiting-message");

  if (!element) {
    return;
  }

  element.textContent = message;

  scrollChatToBottom();
}
function removeTypingIndicator() {
  document.querySelector("#typing-indicator")?.remove();
}
function showChatError(message) {
  const messagesContainer = document.querySelector("#chat-messages");

  if (!messagesContainer) {
    return;
  }

  const errorElement = document.createElement("article");

  errorElement.className = "chat-error-message";

  errorElement.textContent = message;

  messagesContainer.appendChild(errorElement);

  scrollChatToBottom();
}

function scrollChatToBottom() {
  requestAnimationFrame(() => {
    const messagesContainer = document.querySelector("#chat-messages");

    if (!messagesContainer) return;

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
            <span class="chat-year">${character.year}</span>
            <h1>${character.name}</h1>
            <p>${character.role[state.language]}</p>
          </div>
        </header>

        <section
          id="chat-character-media"
          class="chat-fixed-media ${
            messages.some((message) => message.role === "assistant")
              ? ""
              : "hidden"
          }"
        >
          <video
            class="chat-character-video"
            autoplay
            muted
            loop
            playsinline
          >
            <source src="${character.video}" type="video/mp4" />
          </video>
        </section>

        <div class="chat-body">
          <div class="chat-background-layer" aria-hidden="true">
            <img
              src="${character.chatBackground}"
              alt=""
              class="chat-background-image"
            />
          </div>

          <div id="chat-messages" class="chat-messages">
            ${
              messages.length === 0
                ? renderInitialMessage(character)
                : messages
                    .map((message) => renderMessage(message, character))
                    .join("")
            }
          </div>
        </div>

        <form id="chat-form" class="chat-composer">
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
    <article class="message ${isUser ? "user-message" : "assistant-message"}">
      <span class="message-author">
        ${isUser ? (state.language === "es" ? "Vos" : "You") : character.name}
      </span>

      <p>${escapeHTML(message.content)}</p>

      <time>${time}</time>
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

      <section class="developer-section">

        <div class="developer-divider"></div>

        <p class="developer-label">
          ${
            state.language === "es"
              ? "DESARROLLADO Y DISEÑADO POR"
              : "DEVELOPED AND DESIGNED BY"
          }
        </p>

        <h2>
          Paúl Matías Corrales
        </h2>

        <p class="developer-description">
          ${
            state.language === "es"
              ? "Full Stack Developer · Diseño, desarrollo y experiencia de usuario de CHRONOS."
              : "Full Stack Developer · Design, development and user experience of CHRONOS."
          }
        </p>

        <div class="developer-links">

          <a
            href="https://www.linkedin.com/in/paúl-corrales-90957b237?utm_source=share_via&utm_content=profile&utm_medium=member_android"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn de Paúl Matías Corrales"
            class="developer-link"
          >
            <span class="developer-icon">in</span>
            LinkedIn
          </a>

          <a
            href="https://github.com/Paul-M-Corrales"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub de Paúl Matías Corrales"
            class="developer-link"
          >
            <span class="developer-icon">&lt;/&gt;</span>
            GitHub
          </a>

          <a
            href="mailto:paulmatiascorrales@gmail.com"
            aria-label="Enviar email a Paúl Matías Corrales"
            class="developer-link"
          >
            <span class="developer-icon">@</span>
            Gmail
          </a>

        </div>

      </section>

    </main>
  `;
}
function getWaitingMessages(characterId, language) {
  const messages = {
    howard: {
      es: [
        "Dame un momento. Estoy organizando estas ideas con los recursos de 1943...",
        "Interesante. Esto requiere un poco más de cálculo del habitual...",
      ],

      en: [
        "Give me a moment. I'm organizing these ideas with the resources of 1943...",
        "Interesting. This requires a little more calculation than usual...",
      ],
    },

    tony: {
      es: [
        "Un segundo. Estoy corriendo algunas posibilidades...",
        "Esto se está poniendo interesante. Dame unos segundos más...",
      ],

      en: [
        "One second. I'm running a few possibilities...",
        "This is getting interesting. Give me a few more seconds...",
      ],
    },

    jarvis: {
      es: [
        "Permítame analizar los patrones relacionados con su consulta...",
        "El análisis está requiriendo más variables de las previstas...",
      ],

      en: [
        "Allow me to analyze the patterns related to your request...",
        "The analysis is requiring more variables than anticipated...",
      ],
    },
  };

  return messages[characterId]?.[language] || messages.tony.es;
}
