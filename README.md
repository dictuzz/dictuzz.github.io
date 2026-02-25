# Benedictus Richard Ricardo — Interactive Portfolio

> *"I turn operational chaos into automated systems. Data science student. Process builder."*

A cinematic, high-performance personal portfolio website designed to win Awwwards. This project emphasizes motion, narrative, and "Liquid" interaction design.

> **Part of the [dictuzz.github.io](https://dictuzz.github.io) Hybrid Ecosystem**
> This module serves as the **"Cinematic Core"** of the personal brand, operating independently of the root `config.js` to maximize performance and visual fidelity.

## 🌟 Key Features

### Act I: The Digital Loom (`index.html`)
- **Particle System**: A custom Three.js simulation of 30,000 particles (optimized for GPU performance while maintaining visual density).
- **Chaos to Order**: Particles start in a random 3D scatter and morph into the name using Canvas 2D Sampling for precise typography ("Plus Jakarta Sans").
- **Scroll Narrative**: A strict scroll-driven timeline where the 3D text flies up and fades out, revealing the tagline via a "Matrix Scramble" effect without overlap.

### Act II: The Investigation Board (`proof.html`)
- **Immersive Canvas**: A massive `300vw x 300vh` grid layout.
- **GSAP Camera**: Scroll-driven camera movements that Pan, Zoom, and Rotate to specific coordinates.
- **Dossier View**: Interactive cards that open into a focused, luxury-styled modal for reading details.
- **Lazy Loading**: High-res images load only when approached in the viewport.

### Act III: The Thread (`thread.html`)
- **Karaoke Reader**: A focus-mode reading experience where the active line lights up (100% opacity) while surrounding text dims (20% opacity) based on scroll position.
- **Kinetic Typography**: Large serif headers that react to scroll velocity.

### Act IV: The Signal (`signal.html`)
- **Clean CTA**: A minimal contact page with staggered entrance animations.

## 🛠️ Technology Stack

- **Core**: HTML5, CSS3 (Variables), Native JavaScript (Modules).
- **3D Engine**: [Three.js](https://threejs.org/) (WebGL).
- **Animation**: [GSAP (GreenSock)](https://gsap.com/) + ScrollTrigger.
- **Smooth Scroll**: [Lenis](https://lenis.studio/) for momentum-based scrolling.
- **Fonts**: Newsreader (Serif) & Plus Jakarta Sans (Sans Serif) via Google Fonts.

## 🧰 Development Tooling

To ensure code consistency, this project uses **ESLint**, **Prettier**, and **EditorConfig**.

1.  **Install tools globally** (or locally if you initialize npm):
    ```bash
    npm install -g eslint prettier
    ```

2.  **Editor Integration**:
    -   Install **VS Code ESLint** and **Prettier** extensions.
    -   The `.editorconfig` file helps maintain consistent coding styles for multiple developers working on the same project across various editors and IDEs.

## 🚀 How to Run

No build step required. This is a static site.

> **Note**: Unlike the Resume app, this Portfolio does **not** use the root `config.js`. Textures, colors, and particles are configured directly in `js/curtain-loom.js` and `css/style.css` for low-level control.

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/dictuzz/dictuzz.github.io.git
    cd dictuzz.github.io/portfolio
    ```

2.  **Serve locally**:
    You need a local server to handle ES Modules and CORS (for textures/fonts).
    ```bash
    npx serve .
    ```

3.  **Open**:
    Visit `http://localhost:3000` in your browser.

## 📂 Project Structure

```
portfolio/
├── css/
│   ├── style.css         # Global styles & variables
│   ├── curtain.css       # Specifics for Index/Particle system
│   ├── proof.css         # The Investigation Board grid
│   ├── thread.css        # Typography styles
│   └── signal.css        # Contact page styles
├── js/
│   ├── core.js           # Shared logic (Lenis, Loader)
│   ├── curtain.js        # Index page logic & ScrollTrigger timeline
│   ├── curtain-loom.js   # Three.js Particle System
│   ├── proof.js          # Pan/Zoom logic for Board
│   ├── thread.js         # Karaoke reader logic
│   └── signal.js         # Contact animations
├── assets/               # Images and textures
└── *.html                # Entry points
```

## 🎨 Design Philosophy

-   **"Liquid Motion"**: Everything should feel fluid. Using `Lenis` for scroll smoothing and `GSAP` for scrub-based animations creates a sense of weight.
-   **Cinematic Lighting**: Dark mode base with Gold (`#ffd700`) accents and "Imperial Red" (`#ba0000`) highlights.
-   **Performance & Security**: 
    -   **Strict CSP**: Content-Security-Policy metadata locks down external execution risks.
    -   **Lightweight Assets**: Self-hosted WebP images and a 2KB vector SVG favicon.
    -   **Spam Deterrence**: Contact forms integrate invisible honeypots.
    -   **Optimization**: Scripts deferred, images lazy-loaded, and WebGL geometry cached for peak performance.
