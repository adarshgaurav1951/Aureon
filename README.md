<p align="center">
  <img src="public/assets/aureon_hero_banner.jpg" alt="Aureon Hyper Sports Car Experience" width="100%" />
</p>

<h1 align="center">AUREON // Hyper Sports Car Experience</h1>

<p align="center">
  <b>The Architecture of Speed & Light. Dedicated to the Relentless Perfection of Combustion, Hybrid Propulsion, and Carbo-Titanium Matrix.</b>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Vite-6.4-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/GSAP-3.12-88CE02?style=for-the-badge&logo=greensock&logoColor=white" alt="GSAP" />
  <img src="https://img.shields.io/badge/Lenis-Smooth_Scroll-F59E0B?style=for-the-badge" alt="Lenis" />
  <img src="https://img.shields.io/badge/Web_Audio-Procedural_Synth-00F0FF?style=for-the-badge" alt="Web Audio API" />
  <img src="https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js" />
</p>

---

## 🏎️ Interactive Visual Showcase

### 1. Volumetric Storytelling Phases (180 Canvas Frames)
The car dynamically rotates and deconstructs across 180 volumetric frames synchronized with momentum scrolling:

<p align="center">
  <img src="public/assets/aureon_phases_showcase.jpg" alt="Phase 1 Genesis, Phase 2 Core X-Ray, Phase 3 Cockpit Sanctuary" width="100%" />
</p>

<p align="center">
  <b>Phase 01 // The Genesis</b> (Volumetric 360 Exterior) &nbsp;&bull;&nbsp; 
  <b>Phase 02 // The Core</b> (Powertrain & Monocoque X-Ray) &nbsp;&bull;&nbsp; 
  <b>Phase 03 // The Sanctuary</b> (Driver Sanctuary Cockpit)
</p>

---

### 2. Bespoke Atelier Studio Configurator
Authentic photorealistic side-profile visualization with real-time CSS shaders for metallurgical finishes and aerodynamic trim options:

<p align="center">
  <img src="public/assets/aureon_configurator_preview.jpg" alt="Aureon Photorealistic Side Profile Atelier" width="100%" />
</p>

- **01 // Exterior Metallurgical Finish**: Real-time shader adjustments for *Champagne Gold*, *Liquid Silver Chrome*, *Obsidian Matte*, and *Motorsport Titanium*.
- **02 // Aerodynamic Architecture**: Dynamic toggle between *Sprint Circuit High Downforce* (1,200 kg @ 300 km/h) and *Speedtail GT Maximum Velocity* (440 km/h).
- **03 // Cockpit Sanctuary Appointment**: Bespoke interior trims (*Saddle Cognac*, *Obsidian Race Alcantara*, *Arctic White Silk*).

---

## ⚡ Key Highlights

- **180-Frame Volumetric Scrubbing**: Canvas-rendered sequence with zero lag using pre-buffered high-efficiency WebP frames.
- **Dynamic Telemetry & Audio Synthesizer**: Procedural Web Audio API engine acoustic synthesizer (interactive acceleration sound), live HUD telemetry readouts, radar ping hotspots, and interactive technical blueprint modals.
- **Track Simulator / Auto-Drive**: Autonomous cruise simulation looping through the car's volumetric sequence with real-time speed adjustments.
- **Luxury Brutalist Design System**: Deep black obsidian backgrounds (`#030406`), solar titanium gold accents (`#F59E0B`, `#FBBF24`), liquid chrome gradients, and glassmorphism.

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
│       ├── aureon_hero_banner.jpg           # Flagship GitHub hero preview banner
│       ├── aureon_phases_showcase.jpg       # 3-Phase panoramic showcase
│       ├── aureon_configurator_preview.jpg  # Photorealistic Atelier studio preview
│       ├── aureon_side_profile.webp         # High-resolution car side profile render
│       ├── phase1/                          # Frames 001 - 060 (Genesis Exterior 360)
│       ├── phase2/                          # Frames 061 - 120 (Chassis & Powertrain X-Ray)
│       └── phase3/                          # Frames 121 - 180 (Cockpit Sanctuary)
├── index.html                               # Semantic HTML5 architecture & UI overlays
├── style.css                                # Custom CSS design system, typography & glassmorphism
├── main.js                                  # GSAP timeline, canvas renderer, configurator & audio engine
├── package.json                             # Scripts & project dependencies
├── vite.config.js                           # Vite build configuration
└── .gitignore                               # Standard git ignore rules (node_modules, dist)
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
Private bespoke release &copy; 2026 AUREON Automotive Labs. All rights reserved.
