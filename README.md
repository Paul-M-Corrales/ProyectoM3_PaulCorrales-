# CHRONOS

**CHRONOS** es una experiencia web interactiva que combina inteligencia artificial, diseño cinematográfico y una interfaz inspirada en viajes temporales.

La aplicación permite al usuario elegir entre tres épocas —pasado, presente y futuro— y establecer una conversación con una mente asociada a cada período:

- **Howard Stark — 1943**
- **Tony Stark — 2026**
- **J.A.R.V.I.S. — 2099**

Cada personaje posee su propia personalidad, contexto temporal y limitaciones de conocimiento. Esto permite que una misma pregunta pueda ser abordada desde perspectivas completamente diferentes según la época elegida.

La experiencia fue desarrollada bajo un enfoque **Mobile First**, utilizando una arquitectura SPA y una integración segura con la API de Gemini mediante funciones serverless.

---

## 🌐 Demo en producción

👉 **[Abrir CHRONOS](https://proyecto-m3-paul-corrales.vercel.app/)** https://proyecto-m3-paul-corrales.vercel.app/

---

# ⏳ El concepto

> **Tres épocas. Tres mentes. Una misma pregunta.**

CHRONOS plantea una experiencia de conversación basada en viajes temporales.

El usuario puede elegir a qué época desea viajar:

### Pasado — 1943

Conversá con **Howard Stark**.

Howard responde exclusivamente desde el conocimiento, contexto histórico y tecnología disponible en su época.

No conoce acontecimientos posteriores a 1943.

---

### Presente — 2026

Conversá con **Tony Stark**.

Tony analiza los desafíos desde el presente utilizando innovación, pensamiento rápido, tecnología y resolución de problemas.

Su conocimiento está limitado al presente de CHRONOS.

---

### Futuro — 2099

Conversá con **J.A.R.V.I.S.**

JARVIS representa una inteligencia artificial avanzada capaz de analizar información histórica, presente y proyecciones futuras.

Es el personaje con mayor rango temporal dentro de CHRONOS.

---

# ✨ Funcionalidades

CHRONOS incluye:

- Intro cinematográfica mediante video.
- Botón para omitir la introducción.
- Control de sonido.
- Navegación SPA.
- History API.
- Navegación entre:
  - Inicio
  - Chat
  - Acerca de
- Selector de idioma:
  - Español
  - Inglés
- Diseño **Mobile First**.
- Responsive Design.
- Carruseles automáticos de personajes.
- Pausa de carrusel al interactuar con una imagen.
- Efecto zoom sobre imágenes.
- Animación estilo máquina de escribir.
- Selector de época.
- Tres personajes con personalidades independientes.
- Prompts específicos para cada personaje.
- Restricciones temporales de conocimiento.
- Chat conectado con Gemini.
- Historial independiente por personaje.
- Persistencia de preferencias mediante `localStorage`.
- Contador de uso de IA.
- Límite diario de tokens.
- Indicador de porcentaje de consumo.
- Estados de carga.
- Indicadores visuales mientras la IA responde.
- Mensajes especiales ante respuestas demoradas.
- Manejo de errores.
- Timeout de solicitudes.
- Sistema de modelos fallback.
- Videos individuales asociados a las respuestas de los personajes.
- Fondos personalizados en cada experiencia de chat.
- Scroll interno de conversación.
- Composer fijo dentro del chat.
- Página About.
- Información del desarrollador.
- Enlaces a LinkedIn, GitHub y correo electrónico.
- Deploy en Vercel.

---

# 🤖 Inteligencia Artificial

CHRONOS utiliza **Google Gemini API** como motor de inteligencia artificial.

La comunicación con Gemini no se realiza directamente desde el navegador.

La arquitectura utiliza:

```text
Frontend
   ↓
/api/functions
   ↓
Vercel Serverless Function
   ↓
Gemini API
```

---

## 🤖 Uso de Inteligencia Artificial y decisiones técnicas

Durante el desarrollo de CHRONOS utilicé Inteligencia Artificial como herramienta de apoyo para analizar alternativas, resolver problemas y tomar decisiones de implementación.

A continuación se muestran algunos de los prompts utilizados durante el desarrollo y la decisión técnica tomada a partir de cada consulta.

### 1. Diseño de los prompts de sistema de los personajes

![Prompt 1](./src/assets/images/prompts/prompt_1.png)

**Decisión tomada a partir de este prompt:**

A partir de esta consulta decidí implementar un **System Prompt independiente para cada personaje**, en lugar de utilizar solamente una descripción general.

Cada prompt define la identidad, personalidad, forma de expresarse y, principalmente, el contexto temporal del personaje. Howard Stark se encuentra en 1943, Tony Stark en 2026 y JARVIS en 2099.

Esta decisión permitió establecer límites claros sobre la información que cada personaje puede conocer y reducir la posibilidad de que la IA rompa su rol durante una conversación. Los prompts se mantienen separados de la interfaz y son enviados desde el backend junto con el historial correspondiente de la conversación.

---

### 2. Organización del README y acceso al proyecto desplegado

![Prompt 2](./src/assets/images/prompts/prompt_2.png)

**Decisión tomada a partir de este prompt:**

A partir de esta consulta decidí colocar el **enlace al deploy de producción inmediatamente después de la presentación de CHRONOS en el README**.

El objetivo fue que cualquier persona que revise el repositorio pueda comprender rápidamente de qué se trata el proyecto y acceder a la aplicación funcionando antes de continuar con la documentación técnica.

También decidí organizar el resto del README separando tecnologías, funcionalidades, arquitectura, integración con Gemini, instalación, variables de entorno, testing, responsive y seguridad, facilitando la lectura y evaluación del proyecto.

---

### 3. Diseño responsive y adaptación de la experiencia móvil

![Prompt 3](./src/assets/images/prompts/prompt_3.png)
**Decisión tomada a partir de este prompt:**

A partir de esta consulta decidí mantener una arquitectura **mobile-first** y adaptar de forma específica los componentes que necesitaban comportamientos diferentes según el tamaño de pantalla.

En los chats eliminé la barra visual de consumo de tokens para aprovechar mejor el espacio disponible, haciendo que la conversación ocupe automáticamente el espacio liberado. También decidí que el historial de mensajes tenga su propio scroll interno, manteniendo siempre visible el campo para escribir y enviar mensajes.

Para la introducción se ajustó el comportamiento del video según el viewport, buscando mantener una experiencia adecuada tanto en dispositivos móviles como en pantallas de mayor tamaño.

La decisión principal fue evitar alturas fijas innecesarias y utilizar Flexbox, unidades relativas y media queries para que la interfaz se adapte a diferentes resoluciones sin modificar la funcionalidad de la aplicación.

---

# 🛠️ Tecnologías utilizadas

### Frontend

- HTML5
- CSS3
- JavaScript ES Modules
- History API
- Fetch API
- localStorage
- Flexbox
- CSS Grid

### Inteligencia Artificial

- Google Gemini API
- System Prompts personalizados
- Historial de conversación enviado como contexto
- Sistema de modelos fallback

### Backend

- Node.js
- Vercel Serverless Functions

### Testing

- Vitest
- Mocks de `fetch`

### Deployment y control de versiones

- Vercel
- Git
- GitHub

---

# 🧠 Arquitectura del proyecto

CHRONOS fue desarrollado utilizando una arquitectura modular, separando la interfaz, el routing, la lógica del chat, el estado, los personajes y la comunicación con inteligencia artificial.

El flujo principal de la aplicación es:

```text
┌─────────────────────────┐
│        Frontend         │
│    HTML / CSS / JS      │
└────────────┬────────────┘
             │
             │ POST /api/functions
             ▼
┌─────────────────────────┐
│   Vercel Serverless     │
│       Function          │
│   /api/functions.js     │
└────────────┬────────────┘
             │
             │ API Key protegida
             ▼
┌─────────────────────────┐
│      Google Gemini      │
│          API            │
└────────────┬────────────┘
             │
             │ Respuesta
             ▼
┌─────────────────────────┐
│        CHRONOS          │
│     Interfaz de Chat    │
└─────────────────────────┘
```

La API Key de Gemini nunca es enviada al navegador.

La comunicación con Gemini se realiza exclusivamente desde la Serverless Function, utilizando variables de entorno del servidor.

---

# 🔄 Flujo de una conversación

El flujo de una conversación dentro de CHRONOS es:

```text
1. El usuario selecciona una época
        ↓
2. CHRONOS selecciona el personaje correspondiente
        ↓
3. Se carga su conversación
        ↓
4. El usuario escribe un mensaje
        ↓
5. El frontend agrega el mensaje al historial
        ↓
6. Se envían personaje + idioma + historial a /api/functions
        ↓
7. La Serverless Function obtiene el System Prompt correspondiente
        ↓
8. La función realiza la solicitud a Google Gemini
        ↓
9. Gemini genera la respuesta manteniendo el contexto
        ↓
10. La Serverless Function devuelve la respuesta al frontend
        ↓
11. CHRONOS agrega la respuesta al historial
        ↓
12. La interfaz actualiza la conversación
```

Cada personaje mantiene un historial independiente durante la sesión.

En cada nueva consulta se envía el historial correspondiente para que Gemini pueda mantener el contexto de la conversación.

---

# 🧭 Routing SPA

CHRONOS utiliza **History API** para implementar navegación SPA sin recargar completamente la página.

### Rutas principales

| Ruta     | Vista                        |
| -------- | ---------------------------- |
| `/`      | Introducción cinematográfica |
| `/home`  | Inicio                       |
| `/chat`  | Selección de época / Chat    |
| `/about` | Acerca de                    |

La navegación utiliza:

- `history.pushState()`
- evento `popstate`
- renderizado dinámico
- tabla de rutas

Esto permite navegar entre las diferentes vistas manteniendo el comportamiento esperado de los botones **Atrás** y **Adelante** del navegador.

Vercel también está configurado para redirigir las rutas de la SPA hacia `index.html`, evitando errores 404 cuando una ruta como `/chat` o `/about` se abre directamente.

---

# 📱 Responsive Design

CHRONOS fue desarrollado siguiendo un enfoque **Mobile First**.

Los estilos base están diseñados primero para dispositivos móviles y posteriormente se amplían para resoluciones mayores mediante media queries.

Los principales breakpoints utilizados son:

```css
@media (min-width: 768px);
```

y:

```css
@media (min-width: 1100px);
```

### 📱 Mobile

En dispositivos móviles:

- La navegación se adapta al ancho disponible.
- La introducción utiliza el viewport disponible.
- Los carruseles se adaptan a pantallas pequeñas.
- El chat aprovecha el espacio vertical disponible.
- El historial utiliza scroll interno.
- El campo de escritura permanece accesible.
- Las imágenes y videos respetan los límites de la pantalla.

### 📲 Tablet

A partir de `768px`:

- Se amplían los espacios y dimensiones de los componentes.
- Las imágenes de fondo del chat aprovechan mejor el área disponible.
- Los videos y contenidos multimedia aumentan de tamaño.
- Se mantiene la estructura SPA sin modificar la funcionalidad.

### 🖥️ Desktop

En escritorio:

- CHRONOS aprovecha el espacio horizontal disponible.
- Los chats utilizan una superficie de conversación más amplia.
- Los carruseles presentan los personajes con mayor presencia visual.
- Header, contenido y controles mantienen una distribución consistente.

---

# 📁 Estructura del proyecto

```text
M3/
│
├── api/
│   └── functions.js
│
├── src/
│   ├── assets/
│   │   ├── images/
│   │   │   ├── carousels/
│   │   │   ├── characters/
│   │   │   ├── chat-backgrounds/
│   │   │   └── prompts/
│   │   │
│   │   └── videos/
│   │
│   ├── app.js
│   ├── characters.js
│   ├── chat.js
│   ├── prompts.js
│   ├── router.js
│   ├── state.js
│   ├── styles.css
│   ├── translations.js
│   └── utils.js
│
├── tests/
│   └── chat.test.js
│
├── .env.example
├── .gitignore
├── index.html
├── package.json
├── package-lock.json
├── README.md
└── vercel.json
```

### Responsabilidad de los principales archivos

- `index.html` — Punto de entrada de la SPA.
- `src/app.js` — Renderizado y comportamiento principal de la interfaz.
- `src/router.js` — Routing SPA mediante History API.
- `src/chat.js` — Lógica de conversación y comunicación con el backend.
- `src/characters.js` — Configuración y datos de los personajes.
- `src/prompts.js` — System Prompts utilizados por cada personaje.
- `src/state.js` — Estado compartido de la aplicación.
- `src/translations.js` — Textos y traducciones ES/EN.
- `src/utils.js` — Funciones auxiliares reutilizables.
- `src/styles.css` — Diseño visual y responsive.
- `api/functions.js` — Serverless Function encargada de comunicarse con Gemini.
- `tests/chat.test.js` — Tests automatizados del funcionamiento del chat.
- `vercel.json` — Configuración necesaria para el deployment y routing SPA.

---

# ⚙️ Instalación

Para ejecutar CHRONOS localmente es necesario tener instalado **Node.js** y **npm**.

## 1. Clonar el repositorio

```bash
git clone https://github.com/Paul-M-Corrales/ProyectoM3_PaulCorrales-.git
```

## 2. Ingresar al proyecto

```bash
cd ProyectoM3_PaulCorrales-
```

## 3. Instalar las dependencias

```bash
npm install
```

---

# 🔐 Variables de entorno

Crear un archivo `.env` en la raíz del proyecto tomando como referencia `.env.example`.

```env
GEMINI_API_KEY=tu_api_key
GEMINI_MODEL_PRIMARY=nombre_del_modelo_principal
GEMINI_MODEL_SECONDARY=nombre_del_modelo_secundario
GEMINI_MODEL_FALLBACK=nombre_del_modelo_fallback
```

La API Key de Gemini **nunca debe estar expuesta en el frontend ni subirse al repositorio**.

El archivo `.env` se encuentra excluido del control de versiones mediante `.gitignore`.

La Serverless Function obtiene las variables mediante `process.env`, manteniendo las credenciales del lado del servidor.

---

# ▶️ Ejecutar la aplicación localmente

CHRONOS utiliza una Vercel Serverless Function, por lo que para reproducir localmente tanto el frontend como el backend se recomienda utilizar **Vercel CLI**.

Si Vercel CLI no está instalado:

```bash
npm install -g vercel
```

Luego ejecutar desde la raíz del proyecto:

```bash
vercel dev
```

Vercel iniciará el entorno local y mostrará en la terminal la URL disponible, normalmente:

```text
http://localhost:3000
```

> Abrir únicamente `index.html` o utilizar Live Server permite visualizar el frontend, pero no reproduce por sí solo el entorno Serverless necesario para la comunicación con Gemini.

Para utilizar las funciones de inteligencia artificial es necesario configurar una API Key válida de Gemini en el archivo `.env`.

---

# 🧪 Testing

CHRONOS utiliza **Vitest** para realizar tests automatizados.

Para ejecutar la suite de tests:

```bash
npm run test:run
```

Los tests permiten verificar la lógica de comunicación del chat de forma aislada.

Las solicitudes externas pueden ser simuladas mediante mocks de `fetch`, evitando depender de una llamada real a Gemini durante las pruebas.

Esto permite comprobar el comportamiento de la aplicación tanto ante respuestas correctas como ante situaciones de error.

---

# 🛡️ Seguridad

La seguridad de la API Key fue una consideración central en la arquitectura de CHRONOS.

La aplicación sigue este principio:

```text
Frontend
   ✕
API Key

Frontend
   ↓
Serverless Function
   ↓
API Key
   ↓
Gemini
```

La clave:

- No se encuentra escrita en el frontend.
- No forma parte del repositorio público.
- No se incluye en `.env.example`.
- El archivo `.env` está excluido mediante `.gitignore`.
- En producción se configura como variable de entorno en Vercel.
- Las llamadas autenticadas a Gemini se realizan desde `/api/functions.js`.

---

# ⚠️ Manejo de errores y demoras

CHRONOS contempla posibles problemas durante la comunicación con Gemini.

La aplicación implementa:

- Manejo de errores HTTP y de conexión.
- Estados visuales mientras se espera una respuesta.
- Mensajes temporales cuando la respuesta demora más de lo esperado.
- Timeout para evitar esperas indefinidas.
- Mensaje de error comprensible para el usuario.
- Sistema de modelos alternativos o fallback.

Si una solicitud no puede completarse correctamente, la interfaz informa al usuario sin bloquear el funcionamiento general de la aplicación.

---

# 🔁 Sistema de modelos fallback

La integración con Gemini permite configurar diferentes modelos mediante variables de entorno:

```env
GEMINI_MODEL_PRIMARY=
GEMINI_MODEL_SECONDARY=
GEMINI_MODEL_FALLBACK=
```

Esto desacopla la selección de modelos del código fuente.

La Serverless Function puede intentar utilizar los modelos configurados según su prioridad, permitiendo disponer de alternativas ante determinados problemas con el modelo principal.

Los nombres de los modelos pueden modificarse desde las variables de entorno sin necesidad de alterar la lógica del frontend.

---

# 💾 Estado e historial de conversación

CHRONOS mantiene conversaciones independientes para:

- Howard Stark
- Tony Stark
- J.A.R.V.I.S.

Los mensajes se almacenan durante la ejecución de la aplicación y el historial correspondiente se envía en cada solicitud a Gemini.

Esto es necesario porque cada petición HTTP es independiente: para que el personaje pueda comprender el contexto de la conversación, CHRONOS vuelve a enviar los mensajes anteriores junto con la nueva consulta.

Además, `localStorage` se utiliza para conservar determinadas preferencias de la experiencia, como configuraciones seleccionadas por el usuario.

---

# 🚀 Deployment

CHRONOS está desplegado en **Vercel**.

### Producción

https://proyecto-m3-paul-corrales.vercel.app/

El deployment incluye:

- Frontend SPA.
- Vercel Serverless Function.
- Variables de entorno.
- Routing para `/home`, `/chat` y `/about`.
- Integración con Google Gemini.

Las credenciales utilizadas en producción se encuentran configuradas directamente en Vercel y no forman parte del repositorio.

---

# 🧩 Conceptos aplicados

Durante el desarrollo de CHRONOS se aplicaron conceptos trabajados durante el Módulo 3:

- Single Page Applications.
- DOM y renderizado dinámico.
- Responsive Design.
- Mobile First.
- Flexbox.
- CSS Grid.
- Media Queries.
- JavaScript modular.
- ES Modules.
- Eventos.
- History API.
- `pushState`.
- `popstate`.
- JavaScript asíncrono.
- Promises.
- `async / await`.
- Fetch API.
- Manejo de respuestas HTTP.
- Integración con APIs de Inteligencia Artificial.
- System Prompts.
- Manejo de contexto conversacional.
- API Keys.
- Variables de entorno.
- Vercel Serverless Functions.
- Manejo de errores.
- AbortController y timeout.
- `localStorage`.
- Testing unitario.
- Mocks.
- Git y GitHub.
- Deployment en Vercel.

---

# 🎓 Proyecto Integrador — Henry

CHRONOS fue desarrollado como **Proyecto Integrador del Módulo 3 de Henry Full Stack Developer**.

El objetivo del proyecto fue integrar los conocimientos adquiridos durante el módulo mediante el desarrollo de una SPA funcional que combina navegación del lado del cliente, consumo de APIs, inteligencia artificial, programación asíncrona, diseño responsive, testing y deployment.

El proyecto fue diseñado buscando no solamente cumplir con los requerimientos técnicos, sino también construir una experiencia visual y narrativa propia.

---

# 👨‍💻 Autor

**Paúl Matías Corrales**

Full Stack Developer

Proyecto Integrador — Módulo 3  
Henry Full Stack Developer

- GitHub: https://github.com/Paul-M-Corrales
- LinkedIn: https://www.linkedin.com/in/paúl-corrales-90957b237
- Email: paulmatiascorrales@gmail.com
