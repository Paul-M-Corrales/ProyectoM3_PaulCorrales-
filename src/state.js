import {
  getTokenUsage,
  getTokenLimit,
  resetTokenUsageIfNeeded,
} from "./utils.js";

resetTokenUsageIfNeeded();

export const state = {
  language: localStorage.getItem("chronos-language") || "es",

  selectedCharacter: localStorage.getItem("chronos-character") || null,

  tokenUsage: getTokenUsage(),

  tokenLimit: getTokenLimit(),
};

export function updateTokenState() {
  state.tokenUsage = getTokenUsage();
  state.tokenLimit = getTokenLimit();
}
