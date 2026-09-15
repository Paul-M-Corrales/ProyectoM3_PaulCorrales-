export async function sendMessageToAI({ character, language, messages }) {
  const response = await fetch("/api/functions", {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify({
      character,
      language,
      messages,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.error || data?.message || "No se pudo obtener una respuesta.",
    );
  }

  return data;
}
