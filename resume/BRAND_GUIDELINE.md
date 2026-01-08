# Brand Guidelines
**Benedictus Richard Ricardo: Portfolio**

> **Vision**: A "Deep Space Luxury" aesthetic that combines professional data science authority with modern, dynamic, and elegant design. The interface feels alive, premium, and technically sophisticated.

---

## 1. Color Palette

### Primary Colors
The foundation of the dark mode aesthetics.
- **Deep Space**: `#0A0E17` (Main Background)
- **Surface**: `#121824` (Cards, Nav)
- **Elevated**: `#1A2332` (Hover States)
- **Pure White**: `#FFFFFF` (Primary Text)

### Accent Colors (The "Cyber" Palette)
Used for gradients, highlights, and interactive elements.
- **Cyber Cyan**: `#00F5D4` (Primary Action, Success, Tech)
- **Electric Purple**: `#7B61FF` (Secondary Accent, Creative)
- **Luxury Gold**: `#FFB800` (Highlights, Awards, key details)

### Gradients
The signature gradient used across buttons, text, and borders.
- **Main Gradient**: `linear-gradient(135deg, #00F5D4 0%, #7B61FF 100%)`
- **Text Gradient**: Used on headings for emphasis.

### Light Mode Adaptation
- **Background**: `#F1F5F9`
- **Text**: `#0F172A` (Slate 900)
- **Accents**: Adjusted for contrast (e.g., Cyan darkened to `#0D9488` for text).

---

## 2. Typography

### Display Font
**[Outfit](https://fonts.google.com/specimen/Outfit)**  
Used for Headings (`h1`, `h2`, `h3`, `h4`, `h5`, `h6`) and numbers.
- **Weights**: 700 (Bold), 800 (Extra Bold)
- **Character**: Modern, geometric, friendly but authoritative.

### Body Font
**[Inter](https://fonts.google.com/specimen/Inter)**  
Used for paragraphs, reading text, and UI labels.
- **Weights**: 400 (Regular), 500 (Medium), 600 (Semi-Bold)
- **Character**: Highly legible, clean, neutral.

---

## 3. UI Components

### Glassmorphism
The core container style. Elements sit on "glass" sheets above the deep background.
- **Background**: `rgba(18, 24, 36, 0.7)`
- **Blur**: `backdrop-filter: blur(20px)`
- **Border**: `1px solid rgba(255, 255, 255, 0.08)`
- **Radius**: `16px` (Large), `9999px` (Pill/Capsule)

### Buttons
- **Primary**: Gradient background, white text, glow effect on hover.
- **Ghost**: Transparent background, glass border, white text.
- **Interaction**: Transform `translateY(-2px)` and increased shadow on hover.

### Glow Effects
Shadows are used to create a "neon" effect rather than just depth.
- **Accent Glow**: `box-shadow: 0 0 20px rgba(0, 245, 212, 0.3)`

---

## 4. Animation Philosophy

All motion should be **smooth, fluid, and purposeful**.
- **Timing Function**: `cubic-bezier(0.16, 1, 0.3, 1)` (Ease-out)
- **Durations**:
    - **Fast Interaction**: 150ms (Buttons)
    - **Normal**: 300ms (Card hovers)
    - **Entrance**: 500ms+ (Page load reveals)
- **Key Interactions**:
    - **Hover**: Lift (`translateY`) + Scale (`scale(1.02)`) + Glow.
    - **Scroll**: Elements fade in and slide up (`slideUp` keyframe).

---

## 5. Iconography
- **Set**: Font Awesome 6 (Solid & Brands)
- **Usage**:
    - Use clear, descriptive icons.
    - Icons often carry the gradient or accent color.

---

*Document Version 1.0, Updated Dec 2025*
