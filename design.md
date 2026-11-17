# dictuzz design guide

This guide describes the visual system used across dictuzz.me. Keep it aligned with [`assets/css/tokens.css`](assets/css/tokens.css), the shared layer in [`assets/css/core.css`](assets/css/core.css), and the page stylesheets.

## Brand idea

The site should feel like a well-kept working notebook: clear, warm, analytical, and personal. The signature is a quiet drafting grid over warm paper, editorial typography, restrained archival gold, and brick-red details. Use the grid as texture; keep content and controls in the foreground.

The root page stays a compact link hub. Resume, portfolio, and Resources are different tools in the same visual family:

- **Home:** a personal index that helps visitors choose a path.
- **Resume:** a structured professional dossier with clear section navigation and evidence-led content.
- **Portfolio:** an editorial field notebook for case studies, diagrams, outcomes, and project context.
- **Resources:** a practical directory with direct links and fast search.
- **Terms:** a quiet reading page using the shared site shell.
- **404:** the existing retro arcade treatment is a deliberate standalone exception.

## Color

Use CSS custom properties from `tokens.css`; avoid adding a second palette inside page styles. The core palette is:

| Role | Light theme | Dark theme |
|---|---|---|
| Page | `--color-surface-page` `#f4ecdb` | `#0d1117` |
| Surface | `--color-surface-card` `#efe5d0` | `#11161e` |
| Primary text | `--color-text-primary` `#15181d` | `#ecebe4` |
| Secondary text | `--color-text-secondary` `#2b2f37` | `#d6d4cb` |
| Brand gold | `--color-primary-500` `#c4974f` | `#d2b787` |
| Brick red | `--color-secondary-500` `#a8351c` | `#d6543e` |

Gold is mainly for rules, markers, diagrams, and emphasis. For small text, use `--color-text-brand-aaa`; for red text, use `--color-accent-aaa`. The bright decorative values are not text colors. Reserve green, blue, and red status colors for their semantic meanings.

## Typography

- **Fraunces** is the display face for page titles and editorial headings.
- **Manrope** is the reading and interface face for paragraphs, labels, navigation, forms, and buttons.
- Keep body copy comfortable to scan. Use short measure for prose and avoid all-caps for long labels.
- Use fluid `clamp()` sizes for large headings. Allow translated copy to wrap naturally; do not force English line breaks onto other locales.

## Layout and texture

- The shared drafting grid is a transparent, fixed background layer: 48px spacing at low opacity by default. Keep it behind content and disable it around keyboard focus as the shared CSS currently does.
- Portfolio work surfaces may use a tighter grid and stronger diagram detail, while the surrounding page remains quieter.
- Center content in a readable maximum-width container. Use consistent horizontal gutters and give section headings clear space before content.
- Prefer aligned columns, strong typographic hierarchy, and thin rules over nested cards. Use depth only to mark a real layer or featured item.
- Keep the homepage compact. Do not turn the root link hub into a second portfolio landing page.
- Portfolio cards and case studies can be square-cornered and diagrammatic; resume and resource controls use softer shared radii.

## Components and interaction

- Reuse shared navigation, footer, theme controls, language controls, buttons, and focus styles where the page pattern allows.
- Links must look and behave like links. Use persistent underlines or clear hover/focus affordances for editorial copy; do not rely on color alone.
- Gold-filled buttons need dark text. Preserve a visible focus ring with adequate contrast in both themes.
- Keep controls easy to target, label icon-only buttons, and maintain a logical keyboard order.
- Use motion briefly and purposefully. Respect `prefers-reduced-motion`; the grid and decorative diagrams must never obscure content or capture pointer input.

## Responsive and accessible content

- Build layouts mobile-first and check at narrow, tablet, and desktop widths. Columns must collapse without horizontal scrolling.
- Keep text readable when browser zoom or text spacing increases. Do not crop translated headings or controls.
- Use semantic headings, landmarks, lists, and descriptive link text. Provide meaningful alt text for informative images and empty alt text for decoration.
- Preserve language metadata and translated navigation, titles, descriptions, and page copy across English, Indonesian, and German routes.
- Keep portfolio results accurate and attributable. Project imagery uses a shared 3:2 frame; crop photographs with `cover`, and preserve dashboard detail with `contain`.
- Keep intrinsic image dimensions in the markup to reduce layout shift, and write alt text that describes the actual image rather than its surrounding case study.

## Sources of truth

- Shared values and theme modes: `assets/css/tokens.css`
- Shared grid, focus treatment, utilities, and footer: `assets/css/core.css`
- Home and Terms: `css/site.css`
- Resume: `resume/resume.css`
- Portfolio: `portfolio/portfolio.css`
- Resources: `resources/resources.css`
- 404 page: `css/404.css`

If a page needs a distinct accent or composition, keep it within the palette and explain the reason here before introducing a new global token.
