# AUREON // Hyper Sports Car Experience

> High-end brutalist motorsport web experience powered by 180 volumetric canvas frames, GSAP ScrollTrigger sequence scrubbing, Lenis momentum scrolling, interactive chassis configuration, and real-time audio telemetry.

---

## 🏎️ Overview

**Aureon** is an interactive, cinematic 3D web experience showcasing the pinnacle of automotive engineering:
- **180-Frame Volumetric Scrubbing**: Smooth canvas-based frame sequencing across 3 distinct phases (Genesis, Core X-Ray, and Cockpit Sanctuary).
- **Interactive Atelier Configurator**: Real-time CSS metallurgical finish filtering (Champagne Gold, Liquid Silver, Obsidian Carbon, Motorsport Titanium) on the photorealistic side profile, with dynamic aerodynamic and interior appointment selections.
- **Dynamic Telemetry & Audio Synthesizer**: Web Audio API engine acoustic synthesizer, live HUD telemetry readouts, radar ping hotspots, and interactive technical blueprint modals.
- **Track Simulator / Auto-Drive**: Autonomous cruise simulation looping through the car's volumetric sequence with real-time speed adjustments.

---

## 🛠️ Tech Stack

- **Core**: Vanilla HTML5, Vanilla CSS3 (Custom Design System), Modern JavaScript (ESModules)
- **Bundler & Dev Server**: [Vite](https://vitejs.dev/)
- **Animation & Scrubbing**: [GSAP](https://gsap.com/) & [ScrollTrigger](https://gsap.com/scrolltrigger/)
- **Smooth Scrolling**: [@studio-freight/lenis](https://github.com/darkroomengineering/lenis)
- **Audio Engine**: Native HTML5 Web Audio API (real-time procedural oscillator & acoustic synthesis)

---

## 🚀 Commands & Development Workflow

### 1. Prerequisites
Ensure you have [Node.js](https://nodejs.org/) installed:
- Node.js `v18.0.0` or higher
- npm `v9.0.0` or higher

```bash
node -v
npm -v
```

---

### 2. Clone Repository
```bash
git clone https://github.com/adarshgaurav1951/Aureon.git
cd Aureon
```

---

### 3. Install Dependencies
Install all required runtime dependencies (GSAP, Lenis, Vite):
```bash
npm install
```

---

### 4. Run Locally (Development Server)
Starts the Vite dev server with Hot Module Replacement (HMR) at `http://localhost:5173/`:
```bash
npm run dev
```

---

### 5. Build for Production
Compiles and minifies all assets into the optimized `dist/` directory:
```bash
npm run build
```

---

### 6. Preview Production Build
Locally preview the generated production build before deploying:
```bash
npm run preview
```

---

## 📁 Project Structure

```
Aureon/
├── public/
│   └── assets/
│       ├── aureon_side_profile.webp   # Photorealistic car side profile render
│       ├── phase1/                    # Frames 001 - 060 (Genesis Exterior 360)
│       ├── phase2/                    # Frames 061 - 120 (Chassis & Powertrain X-Ray)
│       └── phase3/                    # Frames 121 - 180 (Cockpit Sanctuary)
├── index.html                         # Semantic HTML5 architecture & UI overlays
├── style.css                          # Custom CSS design system, typography & glassmorphism
├── main.js                            # GSAP timeline, canvas renderer, configurator & audio engine
├── package.json                       # Scripts & project dependencies
├── vite.config.js                     # Vite build configuration
└── .gitignore                         # Standard git ignore rules (node_modules, dist)
```

---

## 🔄 Git Workflow

To stage, commit, and push updates to the repository:

```bash
# Check working tree status
git status

# Stage all modified and new files
git add .

# Commit changes with a descriptive message
git commit -m "feat: your feature or update description"

# Push to the main branch on GitHub
git push origin main
```

---

## 📄 License
Private bespoke release © 2026 AUREON Automotive Labs. All rights reserved.
