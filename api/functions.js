import { getCharacterPrompt } from "../src/prompts.js";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const MODELS = [
  process.env.GEMINI_MODEL_PRIMARY,
  process.env.GEMINI_MODEL_SECONDARY,
  process.env.GEMINI_MODEL_FALLBACK,
].filter(Boolean);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed",
    });
  }

  if (!GEMINI_API_KEY) {
    return res.status(500).json({
      error: "Gemini API key is not configured",
    });
  }

  try {
    const { character, language = "es", messages } = req.body || {};

    if (!character) {
      return res.status(400).json({
        error: "Character is required",
      });
    }

    if (!Array.isArray(messages)) {
      return res.status(400).json({
        error: "Messages must be an array",
      });
    }

    const systemPrompt = getCharacterPrompt(character, language);

    const contents = transformMessages(messages);

    let lastError = null;

    for (const model of MODELS) {
      try {
        const result = await callGemini({
          model,
          systemPrompt,
          contents,
        });

        return res.status(200).json({
          reply: result.reply,
          usage: result.usage,
          model,
        });
      } catch (error) {
        lastError = error;
      }
    }

    throw lastError || new Error("No Gemini models configured");
  } catch (error) {
    return res.status(500).json({
      error: "Unable to generate response",
      message:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
}

function transformMessages(messages) {
  return messages.map((message) => {
    return {
      role: message.role === "assistant" ? "model" : "user",

      parts: [
        {
          text: message.content,
        },
      ],
    };
  });
}

async function callGemini({ model, systemPrompt, contents }) {
  if (!model) {
    throw new Error("Gemini model is missing");
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

  const response = await fetch(url, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",

      "x-goog-api-key": GEMINI_API_KEY,
    },

    body: JSON.stringify({
      systemInstruction: {
        parts: [
          {
            text: systemPrompt,
          },
        ],
      },

      contents,

      generationConfig: {
        temperature: 0.8,
        maxOutputTokens: 500,
      },
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.error?.message ||
        `Gemini request failed with status ${response.status}`,
    );
  }

  const reply = data?.candidates?.[0]?.content?.parts
    ?.map((part) => part.text || "")
    .join("")
    .trim();

  if (!reply) {
    throw new Error("Gemini returned an empty response");
  }

  const usageMetadata = data.usageMetadata || {};

  return {
    reply,

    usage: {
      promptTokens: usageMetadata.promptTokenCount || 0,

      responseTokens: usageMetadata.candidatesTokenCount || 0,

      totalTokens: usageMetadata.totalTokenCount || 0,
    },
  };
}
