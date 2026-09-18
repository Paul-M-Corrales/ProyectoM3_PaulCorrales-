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

export async function sendMessageToAI({
  character,
  language,
  messages,
  signal,
}) {
  const response = await fetch("/api/functions", {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    signal,

    body: JSON.stringify({
      character,
      language,

      messages: messages.map((message) => ({
        role: message.role,
        content: message.content,
      })),
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.message || data?.error || "No se pudo obtener una respuesta.",
    );
  }

  return data;
}
