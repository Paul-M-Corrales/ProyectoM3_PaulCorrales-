import { router, navigateTo } from "./router.js";

import { state, updateTokenState } from "./state.js";

import { resetTokenUsageIfNeeded } from "./utils.js";

export function setLanguage(language) {
  state.language = language;

  localStorage.setItem("chronos-language", language);

  document.documentElement.lang = language;

  router();
}

export function setSelectedCharacter(characterId) {
  state.selectedCharacter = characterId;

  localStorage.setItem("chronos-character", characterId);

  navigateTo("/chat");
}
export function clearSelectedCharacter() {
  state.selectedCharacter = null;

  localStorage.removeItem("chronos-character");
}

export function refreshTokenUsage() {
  updateTokenState();

  router();
}

document.addEventListener("DOMContentLoaded", () => {
  resetTokenUsageIfNeeded();

  updateTokenState();

  document.documentElement.lang = state.language;

  router();
});

document.addEventListener("click", (event) => {
  const link = event.target.closest("[data-link]");

  if (link) {
    event.preventDefault();

    const url = link.getAttribute("href");

    if (url === "/chat") {
      clearSelectedCharacter();
    }

    navigateTo(url);

    return;
  }

  const languageButton = event.target.closest("[data-language]");

  if (languageButton) {
    setLanguage(languageButton.dataset.language);

    return;
  }
  const changeCharacterButton = event.target.closest("[data-change-character]");

  if (changeCharacterButton) {
    clearSelectedCharacter();

    router();

    return;
  }
  const characterButton = event.target.closest("[data-character]");

  if (characterButton) {
    setSelectedCharacter(characterButton.dataset.character);
  }
});

window.addEventListener("popstate", () => {
  router();
});
