const conversations = {
  howard: [],
  tony: [],
  jarvis: [],
};

export function getConversation(characterId) {
  return conversations[characterId] || [];
}

export function addMessage(characterId, message) {
  if (!conversations[characterId]) {
    conversations[characterId] = [];
  }

  conversations[characterId].push(message);
}

export function clearConversation(characterId) {
  conversations[characterId] = [];
}

export function createUserMessage(content) {
  return {
    id: crypto.randomUUID(),
    role: "user",
    content,
    timestamp: new Date().toISOString(),
  };
}

export function createAssistantMessage(content) {
  return {
    id: crypto.randomUUID(),
    role: "assistant",
    content,
    timestamp: new Date().toISOString(),
  };
}
