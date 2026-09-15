const TOKEN_LIMIT = 50000;
const TOKEN_STORAGE_KEY = "chronos-token-usage";
const TOKEN_DATE_KEY = "chronos-token-date";

function getToday() {
  return new Date().toISOString().split("T")[0];
}

export function resetTokenUsageIfNeeded() {
  const savedDate = localStorage.getItem(TOKEN_DATE_KEY);
  const today = getToday();

  if (savedDate !== today) {
    localStorage.setItem(TOKEN_STORAGE_KEY, "0");
    localStorage.setItem(TOKEN_DATE_KEY, today);
  }
}

export function getTokenUsage() {
  resetTokenUsageIfNeeded();

  return Number(localStorage.getItem(TOKEN_STORAGE_KEY) || 0);
}

export function addTokenUsage(tokens) {
  resetTokenUsageIfNeeded();

  const currentUsage = getTokenUsage();

  const newUsage = currentUsage + Number(tokens || 0);

  localStorage.setItem(TOKEN_STORAGE_KEY, String(newUsage));

  return newUsage;
}

export function hasAvailableTokens() {
  return getTokenUsage() < TOKEN_LIMIT;
}

export function getRemainingTokens() {
  return Math.max(TOKEN_LIMIT - getTokenUsage(), 0);
}

export function getTokenLimit() {
  return TOKEN_LIMIT;
}
