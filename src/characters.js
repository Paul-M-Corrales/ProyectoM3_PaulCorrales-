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
      es: "Es un brillante científico, inventor y multimillonario del Universo Cinematográfico de Marvel, conocido principalmente por ser el fundador de Stark Industries y el padre de Tony Stark (Iron Man).Durante la Segunda Guerra Mundial, colaboró estrechamente con el gobierno de los Estados Unidos en el Proyecto Renacimiento, donde creó el escudo de vibranium del Capitán América y ayudó a transformar a Steve Rogers en el primer supersoldado. Tras el fin de la guerra, se convirtió en uno de los cofundadores de la agencia de espionaje S.H.I.E.L.D. junto a Peggy Carter. Aprendé del pasado con una de las mentes que sentó las bases de una nueva era tecnológica.",
      en: "He is a brilliant scientist, inventor, and billionaire from the Marvel Cinematic Universe, best known as the founder of Stark Industries and the father of Tony Stark (Iron Man). During World War II, he worked closely with the United States government on Project Rebirth, where he created Captain America’s vibranium shield and helped transform Steve Rogers into the first super-soldier. After the war, he became one of the co-founders of the intelligence agency S.H.I.E.L.D. alongside Peggy Carter.Learn from the past with one of the minds that helped build the foundations of a new technological era.",
    },
    chatDescription: {
      es: "Viajá al pasado y conversá con Howard Stark en 1943. Descubrí cómo una de las mentes más brillantes de su época analizaría tus decisiones, proyectos y problemas desde un mundo que todavía no conoce el futuro que vos sí conocés.",
      en: "Travel to the past and talk with Howard Stark in 1943. Discover how one of the brightest minds of his era would analyze your decisions, projects, and problems from a world that has not yet experienced the future you already know.",
    },
    gallery: [
      new URL("./assets/images/carousels/howard/howard-1.jpeg", import.meta.url)
        .href,

      new URL("./assets/images/carousels/howard/howard-2.jpeg", import.meta.url)
        .href,

      new URL("./assets/images/carousels/howard/howard-3.jpeg", import.meta.url)
        .href,
      new URL("./assets/images/carousels/howard/howard-4.jpeg", import.meta.url)
        .href,
    ],
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
      es: "es un genio multimillonario, magnate empresarial y brillante inventor de Marvel Comics, conocido globalmente por ser la identidad secreta del superhéroe Iron Man.Tras ser capturado por terroristas y sufrir una grave lesión en el pecho, Stark construye una armadura de alta tecnología para escapar y salvar su vida. Este evento transforma radicalmente su moral: decide cerrar la división de armas de su empresa, Stark Industries, y utilizar su intelecto para proteger al mundo.Como miembro fundador de Los Vengadores, Stark combina su ingenio, vastos recursos y una personalidad carismática, excéntrica y a veces arrogante, para combatir amenazas globales.Enfrentá los problemas del presente con pensamiento rápido, innovación y una mirada directa.",
      en: "He is a billionaire genius, business magnate, and brilliant inventor from Marvel Comics, globally known as the secret identity of the superhero Iron Man. After being captured by terrorists and suffering a severe chest injury, Stark builds a high-tech suit of armor to escape and save his life. This event radically transforms his sense of responsibility: he decides to shut down the weapons division of his company, Stark Industries, and use his intellect to protect the world. As a founding member of The Avengers, Stark combines his ingenuity, vast resources, and a charismatic, eccentric, and sometimes arrogant personality to fight global threats. Face present-day problems with fast thinking, innovation and a direct point of view.",
    },

    chatDescription: {
      es: "Volvé al presente y hablá con Tony Stark en 2026. Tecnología, innovación, decisiones y acción inmediata: enfrentá tus problemas con la mirada de alguien que vive exactamente en tu tiempo y busca soluciones para lo que está pasando ahora.",
      en: "Return to the present and talk with Tony Stark in 2026. Technology, innovation, decisions, and immediate action: face your problems through the perspective of someone living in your own time and focused on solving what is happening now.",
    },
    gallery: [
      new URL("./assets/images/carousels/tony/tony-1.jpeg", import.meta.url)
        .href,

      new URL("./assets/images/carousels/tony/tony-2.jpeg", import.meta.url)
        .href,

      new URL("./assets/images/carousels/tony/tony-3.jpeg", import.meta.url)
        .href,
      new URL("./assets/images/carousels/tony/tony-4.jpeg", import.meta.url)
        .href,
    ],
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
      es: "J.A.R.V.I.S. (Just A Rather Very Intelligent System) es una de las inteligencias artificiales más icónicas de la cultura pop, creada por Tony Stark para el universo de Marvel Comics y el Universo Cinematográfico de Marvel (MCU). Analizá escenarios, variables y posibles consecuencias con una inteligencia artificial avanzada.",
      en: "J.A.R.V.I.S. (Just A Rather Very Intelligent System) is one of the most iconic artificial intelligences in pop culture, created by Tony Stark for the Marvel Comics universe and the Marvel Cinematic Universe (MCU). Analyze scenarios, variables and possible consequences with an advanced artificial intelligence.",
    },

    chatDescription: {
      es: "Viajá al futuro y conectate con JARVIS en 2099. Una inteligencia avanzada que conoce el camino recorrido por la humanidad hasta su época y puede analizar tus decisiones desde una perspectiva que para vos todavía pertenece al futuro.",
      en: "Travel to the future and connect with JARVIS in 2099. An advanced intelligence that knows humanity's journey up to its era and can analyze your decisions from a perspective that, for you, still belongs to the future.",
    },
    gallery: [
      new URL("./assets/images/carousels/jarvis/jarvis-1.jpeg", import.meta.url)
        .href,

      new URL("./assets/images/carousels/jarvis/jarvis-2.jpeg", import.meta.url)
        .href,

      new URL("./assets/images/carousels/jarvis/jarvis-3.jpeg", import.meta.url)
        .href,
    ],
  },
];
