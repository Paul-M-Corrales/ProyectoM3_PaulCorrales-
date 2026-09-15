export const characters = [
  {
    id: "howard",
    era: "past",
    year: "1943",
    name: "Howard Stark",

    image: new URL(
      "./assets/images/characters/howard_stark.webp",
      import.meta.url,
    ).href,

    video: new URL("./assets/videos/howard.mp4", import.meta.url).href,

    role: {
      es: "Visión, disciplina y legado",
      en: "Vision, discipline and legacy",
    },

    description: {
      es: "Aprendé del pasado con una de las mentes que sentó las bases de una nueva era tecnológica.",
      en: "Learn from the past with one of the minds that helped build the foundations of a new technological era.",
    },
  },

  {
    id: "tony",
    era: "present",
    year: "2026",
    name: "Tony Stark",

    image: new URL(
      "./assets/images/characters/tony_stark.webp",
      import.meta.url,
    ).href,

    video: new URL("./assets/videos/tony.mp4", import.meta.url).href,

    role: {
      es: "Acción, innovación y resolución",
      en: "Action, innovation and problem solving",
    },

    description: {
      es: "Enfrentá los problemas del presente con pensamiento rápido, innovación y una mirada directa.",
      en: "Face present-day problems with fast thinking, innovation and a direct point of view.",
    },
  },

  {
    id: "jarvis",
    era: "future",
    year: "2099",
    name: "JARVIS",

    image: new URL("./assets/images/characters/jarvis_img.jpg", import.meta.url)
      .href,

    video: new URL("./assets/videos/jarvis.mp4", import.meta.url).href,

    role: {
      es: "Análisis, estrategia y proyección",
      en: "Analysis, strategy and projection",
    },

    description: {
      es: "Analizá escenarios, variables y posibles consecuencias con una inteligencia artificial avanzada.",
      en: "Analyze scenarios, variables and possible consequences with an advanced artificial intelligence.",
    },
  },
];
