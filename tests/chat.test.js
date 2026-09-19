import { beforeEach, afterEach, describe, expect, it, vi } from "vitest";

import {
  getConversation,
  addMessage,
  clearConversation,
  createUserMessage,
  createAssistantMessage,
  sendMessageToAI,
} from "../src/chat.js";

describe("CHRONOS chat", () => {
  beforeEach(() => {
    clearConversation("howard");
    clearConversation("tony");
    clearConversation("jarvis");

    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("inicia cada conversación vacía", () => {
    expect(getConversation("howard")).toEqual([]);
    expect(getConversation("tony")).toEqual([]);
    expect(getConversation("jarvis")).toEqual([]);
  });

  it("guarda mensajes de forma independiente para cada personaje", () => {
    const howardMessage = createUserMessage("Hola Howard");
    const tonyMessage = createUserMessage("Hola Tony");

    addMessage("howard", howardMessage);
    addMessage("tony", tonyMessage);

    expect(getConversation("howard")).toHaveLength(1);
    expect(getConversation("tony")).toHaveLength(1);
    expect(getConversation("jarvis")).toHaveLength(0);

    expect(getConversation("howard")[0].content).toBe("Hola Howard");
    expect(getConversation("tony")[0].content).toBe("Hola Tony");
  });

  it("crea correctamente mensajes del usuario y del asistente", () => {
    const userMessage = createUserMessage("Necesito ayuda");
    const assistantMessage = createAssistantMessage("Estoy para ayudarte");

    expect(userMessage).toEqual(
      expect.objectContaining({
        role: "user",
        content: "Necesito ayuda",
      }),
    );

    expect(assistantMessage).toEqual(
      expect.objectContaining({
        role: "assistant",
        content: "Estoy para ayudarte",
      }),
    );

    expect(userMessage.id).toBeTruthy();
    expect(assistantMessage.id).toBeTruthy();
  });

  it("envía el mensaje a la API mediante fetch", async () => {
    const mockResponse = {
      text: "Respuesta temporal de Howard",
      usage: {
        totalTokens: 123,
      },
    };

    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue(mockResponse),
    });

    const character = {
      id: "howard",
      name: "Howard Stark",
    };

    const messages = [
      {
        role: "user",
        content: "¿En qué año estamos?",
      },
    ];

    const result = await sendMessageToAI({
      character,
      language: "es",
      messages,
    });

    expect(fetchMock).toHaveBeenCalledTimes(1);

    expect(fetchMock).toHaveBeenCalledWith(
      "/api/functions",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          "Content-Type": "application/json",
        }),
      }),
    );

    const requestOptions = fetchMock.mock.calls[0][1];
    const requestBody = JSON.parse(requestOptions.body);

    expect(requestBody.language).toBe("es");

    expect(requestBody.messages).toEqual([
      {
        role: "user",
        content: "¿En qué año estamos?",
      },
    ]);

    expect(result).toEqual(mockResponse);
  });

  it("maneja correctamente un error HTTP de la API", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: false,
      status: 500,
      json: vi.fn(),
    });

    await expect(
      sendMessageToAI({
        character: {
          id: "tony",
          name: "Tony Stark",
        },
        language: "es",
        messages: [
          {
            role: "user",
            content: "Hola Tony",
          },
        ],
      }),
    ).rejects.toThrow();
  });

  it("envía correctamente el idioma seleccionado", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({
        text: "Hello. Temporal connection established.",
        usage: {
          totalTokens: 50,
        },
      }),
    });

    await sendMessageToAI({
      character: {
        id: "jarvis",
        name: "JARVIS",
      },
      language: "en",
      messages: [
        {
          role: "user",
          content: "Hello",
        },
      ],
    });

    const requestOptions = globalThis.fetch.mock.calls[0][1];
    const requestBody = JSON.parse(requestOptions.body);

    expect(requestBody.language).toBe("en");
  });
});
