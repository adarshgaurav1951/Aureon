/**
 * AUREON // Hyper Sports Car Storytelling Experience
 * Senior Creative Developer Engine
 * GSAP 3.12+ ScrollTrigger, Lenis Momentum, HTML5 Canvas Sequence Renderer,
 * Parallax Shift, Magnetic Cursor, Interactive Configurator & Motorsport Audio Synthesizer
 */

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

/* ==========================================================================
   1. Configuration & Constants
   ========================================================================== */
const CONFIG = {
  totalFrames: 180,
  phases: [
    { name: 'phase1', start: 1, end: 60, title: '01. GENESIS' },
    { name: 'phase2', start: 61, end: 120, title: '02. THE CORE' },
    { name: 'phase3', start: 121, end: 180, title: '03. COCKPIT' },
  ],
  scrubInertia: 1.5, // Heavy luxury inertia
  parallaxMaxOffset: 6, // ±6px mouse parallax
  hotspotsVisibleRange: [68, 118], // Hotspots active around frame 80
};

/* ==========================================================================
   2. Motorsport Audio Synthesizer (V16 Engine & Turbo Accents)
   ========================================================================== */
class AudioSynthesizer {
  constructor() {
    this.ctx = null;
    this.isMuted = true;
    this.droneOsc = null;
    this.droneOsc2 = null;
    this.droneGain = null;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggle() {
    this.init();
    this.isMuted = !this.isMuted;
    if (!this.isMuted) {
      this.startDrone();
      this.playChirp(880, 0.08, 'sawtooth');
    } else {
      this.stopDrone();
    }
    return !this.isMuted;
  }

  startDrone() {
    if (!this.ctx || this.droneOsc) return;
    try {
      this.droneOsc = this.ctx.createOscillator();
      this.droneOsc2 = this.ctx.createOscillator();
      this.droneGain = this.ctx.createGain();

      this.droneOsc.type = 'sawtooth';
      this.droneOsc.frequency.setValueAtTime(42, this.ctx.currentTime); // Low V16 idle rumble

      this.droneOsc2.type = 'triangle';
      this.droneOsc2.frequency.setValueAtTime(84, this.ctx.currentTime); // Octave harmonic

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(160, this.ctx.currentTime);

      this.droneGain.gain.setValueAtTime(0.001, this.ctx.currentTime);
      this.droneGain.gain.exponentialRampToValueAtTime(0.05, this.ctx.currentTime + 1.5);

      this.droneOsc.connect(filter);
      this.droneOsc2.connect(filter);
      filter.connect(this.droneGain);
      this.droneGain.connect(this.ctx.destination);

      this.droneOsc.start();
      this.droneOsc2.start();
    } catch (e) {
      console.warn('Audio drone error:', e);
    }
  }

  stopDrone() {
    if (this.droneGain && this.ctx) {
      try {
        this.droneGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.4);
        setTimeout(() => {
          if (this.droneOsc) {
            this.droneOsc.stop();
            this.droneOsc.disconnect();
            this.droneOsc = null;
          }
          if (this.droneOsc2) {
            this.droneOsc2.stop();
            this.droneOsc2.disconnect();
            this.droneOsc2 = null;
          }
        }, 400);
      } catch (e) {
        this.droneOsc = null;
        this.droneOsc2 = null;
      }
    }
  }

  playChirp(freq = 1200, duration = 0.05, type = 'sine') {
    if (this.isMuted || !this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.5, this.ctx.currentTime + duration);

      gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {}
  }

  playThud() {
    if (this.isMuted || !this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(95, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(25, this.ctx.currentTime + 0.35);

      gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.35);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.35);
    } catch (e) {}
  }
}

const audioSys = new AudioSynthesizer();

/* ==========================================================================
   3. Master Image Controller & Preloader
   ========================================================================== */
class MasterController {
  constructor() {
    this.images = [];
    this.loadedCount = 0;
    this.totalFrames = CONFIG.totalFrames;
    this.currentFrame = 0;
    this.targetFrame = 0;
    this.isPhase1Ready = false;

    this.dom = {
      preloader: document.getElementById('preloader'),
      bar: document.getElementById('preloader-bar'),
      pct: document.getElementById('preloader-pct'),
      msg: document.getElementById('preloader-msg'),
      frames: document.getElementById('preloader-frames'),
      skipBtn: document.getElementById('btn-skip-preloader'),
      canvas: document.getElementById('car-canvas'),
      hudFrame: document.getElementById('hud-frame-num'),
      hudScrub: document.getElementById('hud-scrub-val'),
      hudStatus: document.getElementById('hud-drive-status'),
      navPhase: document.getElementById('nav-active-phase'),
      titleAether: document.getElementById('hero-title-aether'),
    };

    this.ctx = this.dom.canvas.getContext('2d');
    if (this.ctx) {
      this.ctx.imageSmoothingEnabled = true;
      this.ctx.imageSmoothingQuality = 'high';
    }
    this.parallax = { targetX: 0, targetY: 0, currentX: 0, currentY: 0 };
  }

  getFrameUrl(index) {
    const frameNum = index + 1; // 1 to 180
    let phaseFolder = 'phase1';
    if (frameNum > 120) {
      phaseFolder = 'phase3';
    } else if (frameNum > 60) {
      phaseFolder = 'phase2';
    }
    const padded = String(frameNum).padStart(3, '0');
    return `/assets/${phaseFolder}/frame_${padded}.webp`;
  }

  async preload() {
    return new Promise((resolve) => {
      let resolved = false;

      const onFrameLoad = (idx) => {
        this.loadedCount++;
        const pct = Math.floor((this.loadedCount / this.totalFrames) * 100);

        if (this.dom.bar) this.dom.bar.style.width = `${pct}%`;
        if (this.dom.pct) this.dom.pct.textContent = `${String(pct).padStart(2, '0')}%`;
        if (this.dom.frames) this.dom.frames.textContent = `[ ${String(this.loadedCount).padStart(3, '0')} / ${this.totalFrames} ]`;

        if (this.loadedCount === 20) {
          if (this.dom.msg) this.dom.msg.textContent = 'OPTICAL TELEMETRY: CALIBRATING...';
        } else if (this.loadedCount === 60) {
          if (this.dom.msg) this.dom.msg.textContent = 'PHASE 01 CACHED // GENESIS READY';
          this.isPhase1Ready = true;
          if (this.dom.skipBtn) this.dom.skipBtn.style.display = 'inline-block';
        } else if (this.loadedCount === 120) {
          if (this.dom.msg) this.dom.msg.textContent = 'VOLUMETRIC ENGINE MATRIX LOADED...';
        } else if (this.loadedCount >= this.totalFrames) {
          if (this.dom.msg) this.dom.msg.textContent = 'AUREON SPORT OS: 100% OPERATIONAL';
        }

        if (idx === 0) {
          this.drawFrame(0);
        }

        if (this.loadedCount >= this.totalFrames && !resolved) {
          resolved = true;
          setTimeout(() => {
            this.finishPreload();
            resolve();
          }, 350);
        }
      };

      for (let i = 0; i < this.totalFrames; i++) {
        const img = new Image();
        img.src = this.getFrameUrl(i);
        img.onload = () => {
          this.images[i] = img;
          onFrameLoad(i);
        };
        img.onerror = () => {
          const frameNum = i + 1;
          const phase = frameNum > 120 ? 'phase3' : frameNum > 60 ? 'phase2' : 'phase1';
          const localNum = String(((frameNum - 1) % 60) + 1).padStart(3, '0');
          img.src = `./assets/${phase}/${localNum}.webp`;
          img.onload = () => {
            this.images[i] = img;
            onFrameLoad(i);
          };
          img.onerror = () => {
            console.warn(`Frame ${frameNum} failed to load.`);
            onFrameLoad(i);
          };
        };
      }

      setTimeout(() => {
        if (!resolved) {
          resolved = true;
          this.finishPreload();
          resolve();
        }
      }, 5000);
    });
  }

  finishPreload() {
    document.body.classList.remove('is-loading');
    if (this.dom.preloader) {
      this.dom.preloader.classList.add('fade-out');
    }
    this.drawFrame(0);
  }

  resizeCanvas() {
    const canvas = this.dom.canvas;
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    if (this.ctx) {
      this.ctx.imageSmoothingEnabled = true;
      this.ctx.imageSmoothingQuality = 'high';
    }
    this.drawFrame(this.currentFrame);
  }

  drawFrame(frameIndex) {
    const canvas = this.dom.canvas;
    if (!canvas) return;
    const ctx = this.ctx;
    const img = this.images[frameIndex];
    if (!img || !img.complete) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const cWidth = canvas.width;
    const cHeight = canvas.height;
    const imgWidth = img.naturalWidth || 1920;
    const imgHeight = img.naturalHeight || 1080;

    const canvasRatio = cWidth / cHeight;
    const imgRatio = imgWidth / imgHeight;

    let drawW, drawH, drawX, drawY;

    if (canvasRatio > imgRatio) {
      drawW = cWidth;
      drawH = cWidth / imgRatio;
      drawX = 0;
      drawY = (cHeight - drawH) / 2;
    } else {
      drawH = cHeight;
      drawW = cHeight * imgRatio;
      drawX = (cWidth - drawW) / 2;
      drawY = 0;
    }

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const offsetX = this.parallax.currentX * dpr;
    const offsetY = this.parallax.currentY * dpr;

    ctx.save();
    ctx.drawImage(img, drawX + offsetX, drawY + offsetY, drawW, drawH);
    ctx.restore();
  }
}

/* ==========================================================================
   4. Application Initialization & GSAP + Lenis Controller
   ========================================================================== */
window.addEventListener('DOMContentLoaded', async () => {
  const master = new MasterController();

  // 1. Initialize Lenis Momentum Smooth Scrolling
  const lenis = new Lenis({
    duration: 1.35,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    wheelMultiplier: 0.95,
  });

  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);

  // 2. Window Resize Handling
  window.addEventListener('resize', () => master.resizeCanvas());
  master.resizeCanvas();

  // 3. Preload all frame sequences
  await master.preload();

  // Manual skip button on preloader
  const btnSkip = document.getElementById('btn-skip-preloader');
  if (btnSkip) {
    btnSkip.addEventListener('click', () => master.finishPreload());
  }

  // 4. Parallax Mouse Listener (±6px shift)
  window.addEventListener('mousemove', (e) => {
    const normX = (e.clientX / window.innerWidth) - 0.5;
    const normY = (e.clientY / window.innerHeight) - 0.5;
    master.parallax.targetX = normX * CONFIG.parallaxMaxOffset * 2;
    master.parallax.targetY = normY * CONFIG.parallaxMaxOffset * 2;
  });

  function parallaxLoop() {
    master.parallax.currentX += (master.parallax.targetX - master.parallax.currentX) * 0.08;
    master.parallax.currentY += (master.parallax.targetY - master.parallax.currentY) * 0.08;
    master.drawFrame(master.currentFrame);
    requestAnimationFrame(parallaxLoop);
  }
  requestAnimationFrame(parallaxLoop);

  // 5. GSAP ScrollTrigger Sequence Scrubbing (Dedicated to #story-track)
  const storyTrack = document.getElementById('story-track') || document.getElementById('scroll-container');
  const hotspots = document.querySelectorAll('.hotspot');
  const phaseStep1 = document.getElementById('step-1');
  const phaseStep2 = document.getElementById('step-2');
  const phaseStep3 = document.getElementById('step-3');

  ScrollTrigger.create({
    trigger: storyTrack,
    start: 'top top',
    end: 'bottom bottom',
    scrub: CONFIG.scrubInertia,
    onUpdate: (self) => {
      const progress = self.progress;
      const targetFrame = Math.min(
        CONFIG.totalFrames - 1,
        Math.floor(progress * CONFIG.totalFrames)
      );

      if (targetFrame !== master.currentFrame) {
        master.currentFrame = targetFrame;
        master.drawFrame(targetFrame);
      }

      const displayFrame = String(targetFrame + 1).padStart(3, '0');
      if (master.dom.hudFrame) {
        master.dom.hudFrame.textContent = `FRAME [${displayFrame}/${CONFIG.totalFrames}]`;
      }
      if (master.dom.hudScrub) {
        master.dom.hudScrub.textContent = `${(progress * 100).toFixed(1)}%`;
      }

      let activePhaseName = '01. GENESIS';
      let driveStatus = 'WARMING UP';

      if (targetFrame < 60) {
        activePhaseName = '01. GENESIS';
        driveStatus = 'WARMING UP';
        phaseStep1?.classList.add('active');
        phaseStep2?.classList.remove('active');
        phaseStep3?.classList.remove('active');
      } else if (targetFrame < 120) {
        activePhaseName = '02. THE CORE';
        driveStatus = '1,650 BHP V16 BOOST';
        phaseStep1?.classList.remove('active');
        phaseStep2?.classList.add('active');
        phaseStep3?.classList.remove('active');
      } else {
        activePhaseName = '03. COCKPIT';
        driveStatus = 'TRACK MODE ACTIVE';
        phaseStep1?.classList.remove('active');
        phaseStep2?.classList.remove('active');
        phaseStep3?.classList.add('active');
      }

      if (master.dom.navPhase) {
        master.dom.navPhase.textContent = activePhaseName;
      }
      if (master.dom.hudStatus) {
        master.dom.hudStatus.textContent = driveStatus;
      }

      // Adaptive Weight for H1 AUREON
      if (master.dom.titleAether) {
        const weight = Math.floor(500 + progress * 400);
        const letterSpacing = (0.08 - progress * 0.04).toFixed(3);
        master.dom.titleAether.style.fontWeight = weight;
        master.dom.titleAether.style.letterSpacing = `${letterSpacing}em`;
      }

      // Hotspots Visibility (Frame 70 - 118, peak at 80)
      const inHotspotWindow = targetFrame >= CONFIG.hotspotsVisibleRange[0] && targetFrame <= CONFIG.hotspotsVisibleRange[1];
      hotspots.forEach((spot) => {
        if (inHotspotWindow) {
          spot.classList.add('is-visible');
        } else {
          spot.classList.remove('is-visible');
        }
      });
    },
  });

  // 6. Smooth Canvas Background Fade when user scrolls into Editorial Sections
  const configuratorSection = document.getElementById('section-configurator');
  if (configuratorSection) {
    ScrollTrigger.create({
      trigger: configuratorSection,
      start: 'top 70%',
      onEnter: () => {
        gsap.to('#canvas-container', { opacity: 0.22, duration: 0.6 });
        gsap.to('.hud-telemetry', { opacity: 0, duration: 0.4 });
      },
      onLeaveBack: () => {
        gsap.to('#canvas-container', { opacity: 1, duration: 0.6 });
        gsap.to('.hud-telemetry', { opacity: 1, duration: 0.4 });
      },
    });
  }

  // 7. Initialize Interactive Configurator
  initConfigurator(lenis);

  // 8. Custom Magnetic Cursor
  initMagneticCursor();

  // 9. Hotspot and HUD Spec Interactions
  initHotspotInteractions();

  // 10. Modals (Technical Blueprint, Commission, Atelier Locator, Dossier)
  initModals(lenis);

  // 11. Audio Controls
  initAudioControls();

  // 12. Smooth Scroll & Anchor Links
  initScrollLinks(lenis);

  // 13. Auto-Drive & Track Simulation Controller
  initAutoDriveController(master, lenis);
});

/* ==========================================================================
   5. Interactive Configurator Logic
   ========================================================================== */
function initConfigurator(lenis) {
  const colorBtns = document.querySelectorAll('.cfg-color-btn');
  const aeroBtns = document.querySelectorAll('.cfg-aero-btn');
  const interiorBtns = document.querySelectorAll('.cfg-interior-btn');
  const applyBtn = document.getElementById('btn-apply-config');

  const specCode = document.getElementById('cfg-spec-code');
  const statWeight = document.getElementById('cfg-stat-weight');
  const statDownforce = document.getElementById('cfg-stat-downforce');
  const statDrag = document.getElementById('cfg-stat-drag');
  const stageGlow = document.getElementById('stage-chassis-glow');

  const realCarImg = document.getElementById('real-car-base-img');

  let selectedColor = 'champagne-gold';
  let selectedAero = 'track';
  let selectedInterior = 'saddle';

  const COLOR_PALETTES = {
    gold: {
      code: 'AU-2026-CHAMPAGNE-GOLD',
      imgFilter: 'contrast(1.06) brightness(1.02) saturate(1.18) sepia(0.08)',
      glow: 'radial-gradient(circle, rgba(245, 158, 11, 0.45) 0%, transparent 70%)',
      finishOption: 'champagne-gold',
    },
    silver: {
      code: 'AU-2026-LIQUID-SILVER',
      imgFilter: 'contrast(1.15) brightness(1.06) grayscale(0.65)',
      glow: 'radial-gradient(circle, rgba(226, 232, 240, 0.45) 0%, transparent 70%)',
      finishOption: 'liquid-silver',
    },
    obsidian: {
      code: 'AU-2026-OBSIDIAN-CARBON',
      imgFilter: 'contrast(1.32) brightness(0.74) grayscale(0.4)',
      glow: 'radial-gradient(circle, rgba(100, 116, 139, 0.35) 0%, transparent 70%)',
      finishOption: 'obsidian-carbon',
    },
    titanium: {
      code: 'AU-2026-RACE-TITANIUM',
      imgFilter: 'contrast(1.12) brightness(0.96) saturate(0.85)',
      glow: 'radial-gradient(circle, rgba(148, 163, 184, 0.4) 0%, transparent 70%)',
      finishOption: 'race-titanium',
    },
  };

  colorBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      colorBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      const colorKey = btn.getAttribute('data-color');
      const palette = COLOR_PALETTES[colorKey];
      if (palette) {
        selectedColor = palette.finishOption;
        if (specCode) specCode.textContent = palette.code;
        if (realCarImg && palette.imgFilter) realCarImg.style.filter = palette.imgFilter;
        if (stageGlow) stageGlow.style.background = palette.glow;
      }
      audioSys.playChirp(1200, 0.04, 'sine');
    });
  });

  aeroBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      aeroBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      const aeroKey = btn.getAttribute('data-aero');
      selectedAero = aeroKey;

      if (aeroKey === 'track') {
        if (statDownforce) statDownforce.textContent = '1,200 KG @ 300';
        if (statDrag) statDrag.textContent = '0.198 Cd';
        if (statWeight) statWeight.textContent = '1,420 KG';
        if (wingPath) wingPath.setAttribute('d', 'M 600 135 L 670 115 L 665 125 L 610 142 Z');
      } else {
        if (statDownforce) statDownforce.textContent = '650 KG @ 300';
        if (statDrag) statDrag.textContent = '0.184 Cd';
        if (statWeight) statWeight.textContent = '1,395 KG';
        if (wingPath) wingPath.setAttribute('d', 'M 610 140 L 660 135 L 658 139 L 615 142 Z');
      }
      audioSys.playChirp(900, 0.05, 'triangle');
    });
  });

  interiorBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      interiorBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      selectedInterior = btn.getAttribute('data-interior');
      audioSys.playChirp(1000, 0.03, 'sine');
    });
  });


  applyBtn?.addEventListener('click', () => {
    const allocSelect = document.getElementById('alloc-finish');
    if (allocSelect) {
      allocSelect.value = selectedColor;
    }
    const modalAlloc = document.getElementById('modal-allocation');
    modalAlloc?.classList.add('is-open');
    lenis.stop();
    audioSys.playThud();
  });
}

/* ==========================================================================
   6. Custom Magnetic Cursor
   ========================================================================== */
function initMagneticCursor() {
  const dot = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  if (!dot || !ring) return;

  let mouseX = -100, mouseY = -100;
  let ringX = -100, ringY = -100;
  let targetMagneticEl = null;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
  });

  function renderCursor() {
    if (targetMagneticEl) {
      const rect = targetMagneticEl.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      ringX += (centerX - ringX) * 0.25;
      ringY += (centerY - ringY) * 0.25;
    } else {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
    }

    ring.style.transform = `translate(${ringX}px, ${ringY}px)`;
    requestAnimationFrame(renderCursor);
  }
  requestAnimationFrame(renderCursor);

  const magneticElements = document.querySelectorAll(
    'button, a, [data-magnetic], .hotspot-trigger, .hud-spec-item, input, select'
  );

  magneticElements.forEach((el) => {
    el.addEventListener('mouseenter', () => {
      ring.classList.add('active-hover');
      targetMagneticEl = el.hasAttribute('data-magnetic') ? el : null;
      audioSys.playChirp(1300, 0.03, 'sine');
    });

    el.addEventListener('mousemove', (e) => {
      if (el.hasAttribute('data-magnetic')) {
        const rect = el.getBoundingClientRect();
        const pullX = (e.clientX - (rect.left + rect.width / 2)) * 0.2;
        const pullY = (e.clientY - (rect.top + rect.height / 2)) * 0.2;
        el.style.transform = `translate(${pullX}px, ${pullY}px)`;
      }
    });

    el.addEventListener('mouseleave', () => {
      ring.classList.remove('active-hover');
      targetMagneticEl = null;
      if (el.hasAttribute('data-magnetic')) {
        el.style.transform = '';
      }
    });
  });
}

/* ==========================================================================
   7. Hotspots & Telemetry Interactions
   ========================================================================== */
function initHotspotInteractions() {
  const hotspotTriggers = document.querySelectorAll('.hotspot-trigger');
  hotspotTriggers.forEach((trigger) => {
    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      const parent = trigger.closest('.hotspot');
      const wasActive = parent.classList.contains('is-active');
      document.querySelectorAll('.hotspot').forEach((h) => h.classList.remove('is-active'));
      if (!wasActive) {
        parent.classList.add('is-active');
        audioSys.playChirp(1100, 0.08, 'triangle');
      }
    });
  });

  window.addEventListener('click', () => {
    document.querySelectorAll('.hotspot').forEach((h) => h.classList.remove('is-active'));
  });

  const specItems = document.querySelectorAll('.hud-spec-item');
  specItems.forEach((item) => {
    const targetKey = item.getAttribute('data-hotspot-target');
    const hotspot = document.getElementById(`hotspot-${targetKey}`);

    item.addEventListener('mouseenter', () => {
      if (hotspot) hotspot.classList.add('is-active');
    });

    item.addEventListener('mouseleave', () => {
      if (hotspot) hotspot.classList.remove('is-active');
    });

    item.addEventListener('click', () => {
      if (hotspot) {
        hotspot.classList.toggle('is-active');
        audioSys.playChirp(850, 0.06, 'triangle');
      }
    });
  });
}

/* ==========================================================================
   8. Modals (Blueprint, Commission, Ateliers, Dossier Simulation)
   ========================================================================== */
function initModals(lenis) {
  // Blueprint Modal
  const modalBlueprint = document.getElementById('modal-blueprint');
  const btnOpenBlueprint = document.getElementById('cta-view-blueprint');
  const btnNavBlueprint = document.getElementById('btn-nav-blueprint');
  const btnCloseBlueprint = document.getElementById('btn-close-blueprint');
  const backdropBlueprint = document.getElementById('modal-blueprint-backdrop');

  const openBlueprint = () => {
    modalBlueprint?.classList.add('is-open');
    lenis.stop();
    audioSys.playChirp(700, 0.1, 'sine');
  };

  const closeBlueprint = () => {
    modalBlueprint?.classList.remove('is-open');
    lenis.start();
    audioSys.playChirp(400, 0.08, 'sine');
  };

  btnOpenBlueprint?.addEventListener('click', openBlueprint);
  btnNavBlueprint?.addEventListener('click', openBlueprint);
  btnCloseBlueprint?.addEventListener('click', closeBlueprint);
  backdropBlueprint?.addEventListener('click', closeBlueprint);

  // Commission Modal
  const modalAlloc = document.getElementById('modal-allocation');
  const btnOpenAlloc = document.getElementById('cta-secure-allocation');
  const btnNavAlloc = document.getElementById('btn-nav-reserve');
  const btnInquirySecure = document.getElementById('btn-inquiry-secure');
  const btnCloseAlloc = document.getElementById('btn-close-allocation');
  const backdropAlloc = document.getElementById('modal-allocation-backdrop');
  const formAlloc = document.getElementById('form-allocation');
  const formView = document.getElementById('allocation-form-view');
  const successView = document.getElementById('allocation-success-view');
  const btnDoneAlloc = document.getElementById('btn-done-allocation');

  const openAlloc = () => {
    modalAlloc?.classList.add('is-open');
    lenis.stop();
    audioSys.playThud();
  };

  const closeAlloc = () => {
    modalAlloc?.classList.remove('is-open');
    lenis.start();
    audioSys.playChirp(500, 0.08, 'sine');
  };

  btnOpenAlloc?.addEventListener('click', openAlloc);
  btnNavAlloc?.addEventListener('click', openAlloc);
  btnInquirySecure?.addEventListener('click', openAlloc);
  btnCloseAlloc?.addEventListener('click', closeAlloc);
  backdropAlloc?.addEventListener('click', closeAlloc);

  formAlloc?.addEventListener('submit', (e) => {
    e.preventDefault();
    audioSys.playThud();
    audioSys.playChirp(1500, 0.15, 'sawtooth');
    if (formView) formView.style.display = 'none';
    if (successView) successView.style.display = 'flex';
  });

  btnDoneAlloc?.addEventListener('click', () => {
    closeAlloc();
    setTimeout(() => {
      if (formView) formView.style.display = 'block';
      if (successView) successView.style.display = 'none';
      if (formAlloc) formAlloc.reset();
    }, 400);
  });

  // Atelier Directory Modal
  const modalAtelier = document.getElementById('modal-atelier');
  const atelierLinks = document.querySelectorAll('.link-atelier');
  const btnCloseAtelier = document.getElementById('btn-close-atelier');
  const backdropAtelier = document.getElementById('modal-atelier-backdrop');

  const openAtelier = (e) => {
    e.preventDefault();
    modalAtelier?.classList.add('is-open');
    lenis.stop();
    audioSys.playChirp(750, 0.08, 'sine');
  };

  const closeAtelier = () => {
    modalAtelier?.classList.remove('is-open');
    lenis.start();
    audioSys.playChirp(450, 0.08, 'sine');
  };

  atelierLinks.forEach((link) => link.addEventListener('click', openAtelier));
  btnCloseAtelier?.addEventListener('click', closeAtelier);
  backdropAtelier?.addEventListener('click', closeAtelier);

  // Download Dossier Simulation
  const btnDownloadDossier = document.getElementById('btn-download-dossier');
  btnDownloadDossier?.addEventListener('click', () => {
    audioSys.playThud();
    audioSys.playChirp(1400, 0.2, 'sawtooth');
    alert('AUREON MOTORSPORT DOSSIER (PDF)\n\n48-Page Confidential Technical Specification & Homologation Document transmitted to your secure download queue.');
  });

  // Provenance & Authenticity Links
  const linkProvenance = document.getElementById('link-provenance');
  const linkAuthenticity = document.getElementById('link-authenticity');

  linkProvenance?.addEventListener('click', (e) => {
    e.preventDefault();
    audioSys.playChirp(900, 0.1, 'sine');
    alert('AUREON CHASSIS PROVENANCE REGISTRY\n\nAll 50 chassis are cryptographically registered on the Aureon Private Ledger in Geneva. Each owner receives an encrypted NFC chassis passport.');
  });

  linkAuthenticity?.addEventListener('click', (e) => {
    e.preventDefault();
    audioSys.playChirp(900, 0.1, 'sine');
    alert('AUREON DIGITAL PASSPORT AUTHENTICATION\n\nVerified biometric keycard with real-time telemetry link to Geneva Racing Atelier.');
  });

  // Legal Links
  document.getElementById('link-privacy')?.addEventListener('click', (e) => {
    e.preventDefault();
    alert('AUREON PRIVACY POLICY\n\nClient data is protected under Swiss Federal Data Protection Act (FADP) and encrypted at rest.');
  });

  document.getElementById('link-terms')?.addEventListener('click', (e) => {
    e.preventDefault();
    alert('TERMS OF COMMISSION\n\nAureon allocations require a refundable $100,000 USD escrow deposit held with Credit Suisse Geneva.');
  });

  document.getElementById('link-cookies')?.addEventListener('click', (e) => {
    e.preventDefault();
    alert('COOKIES PREFERENCES\n\nEssential performance cookies are active to enable high-definition WebGL/Canvas rendering.');
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeBlueprint();
      closeAlloc();
      closeAtelier();
    }
  });
}

/* ==========================================================================
   9. Audio Controls
   ========================================================================== */
function initAudioControls() {
  const btnAudio = document.getElementById('btn-audio-toggle');
  const audioText = document.getElementById('audio-state-text');
  const audioBars = document.querySelector('.audio-bars');

  btnAudio?.addEventListener('click', () => {
    const isLive = audioSys.toggle();
    if (isLive) {
      if (audioText) audioText.textContent = 'EXHAUST LIVE';
      audioBars?.classList.add('playing');
    } else {
      if (audioText) audioText.textContent = 'MUTED';
      audioBars?.classList.remove('playing');
    }
  });
}

/* ==========================================================================
   10. Smooth Scroll & Anchor Links
   ========================================================================== */
function initScrollLinks(lenis) {
  const btnGenesis = document.getElementById('cta-initiate-genesis');
  const brandLogo = document.getElementById('nav-brand-logo');
  const footerLogo = document.getElementById('footer-logo-top');
  const btnBackToTop = document.getElementById('btn-back-to-top');

  btnGenesis?.addEventListener('click', () => {
    audioSys.playThud();
    lenis.scrollTo('#section-core', {
      duration: 1.6,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });
  });

  const scrollToTop = (e) => {
    e.preventDefault();
    audioSys.playChirp(800, 0.05, 'sine');
    lenis.scrollTo(0, {
      duration: 1.8,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });
  };

  brandLogo?.addEventListener('click', scrollToTop);
  footerLogo?.addEventListener('click', scrollToTop);
  btnBackToTop?.addEventListener('click', scrollToTop);

  // Wire up all in-page anchor links (Nav bar, footer links, etc.)
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId && targetId !== '#') {
        const targetEl = document.querySelector(targetId);
        if (targetEl) {
          e.preventDefault();
          audioSys.playChirp(900, 0.04, 'sine');
          lenis.scrollTo(targetEl, {
            duration: 1.5,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          });
        }
      }
    });
  });
}

/* ==========================================================================
   11. Auto-Drive & Track Simulation Controller
   ========================================================================== */
function initAutoDriveController(master, lenis) {
  const navBtn = document.getElementById('btn-autodrive-toggle');
  const heroBtn = document.getElementById('cta-track-run');
  const stateText = document.getElementById('autodrive-state-text');
  const storyTrack = document.getElementById('story-track');

  let isAutoDriving = false;
  let autoDriveRaf = null;
  let currentTargetFrame = master.currentFrame || 0;
  let driveDirection = 1;

  function toggleAutoDrive(forcedState) {
    isAutoDriving = forcedState !== undefined ? forcedState : !isAutoDriving;

    if (isAutoDriving) {
      navBtn?.classList.add('is-active');
      heroBtn?.classList.add('is-active');
      if (stateText) stateText.textContent = 'ACTIVE';

      if (!audioSys.isPlaying) {
        audioSys.toggle();
      }
      audioSys.playRevSound();

      let lastTime = performance.now();
      function driveLoop(now) {
        if (!isAutoDriving) return;
        const delta = Math.min((now - lastTime) / 1000, 0.1);
        lastTime = now;

        currentTargetFrame += driveDirection * 24 * delta;

        if (currentTargetFrame >= CONFIG.totalFrames - 1) {
          currentTargetFrame = CONFIG.totalFrames - 1;
          driveDirection = -1;
        } else if (currentTargetFrame <= 0) {
          currentTargetFrame = 0;
          driveDirection = 1;
        }

        const frameInt = Math.floor(currentTargetFrame);
        if (frameInt !== master.currentFrame) {
          master.currentFrame = frameInt;
          master.drawFrame(frameInt);
        }

        const displayFrame = String(frameInt + 1).padStart(3, '0');
        if (master.dom.hudFrame) {
          master.dom.hudFrame.textContent = `FRAME [${displayFrame}/${CONFIG.totalFrames}]`;
        }
        const kmh = Math.floor(220 + Math.sin(now * 0.003) * 140);
        const rpm = Math.floor(kmh * 8.8);
        if (master.dom.hudStatus) {
          master.dom.hudStatus.textContent = `TRACK RUN // ${kmh} KM/H (${rpm} RPM)`;
        }

        autoDriveRaf = requestAnimationFrame(driveLoop);
      }
      lastTime = performance.now();
      autoDriveRaf = requestAnimationFrame(driveLoop);
    } else {
      navBtn?.classList.remove('is-active');
      heroBtn?.classList.remove('is-active');
      if (stateText) stateText.textContent = 'OFF';
      if (autoDriveRaf) {
        cancelAnimationFrame(autoDriveRaf);
        autoDriveRaf = null;
      }
      if (master.dom.hudStatus) {
        master.dom.hudStatus.textContent = 'WARMING UP';
      }
    }
  }

  navBtn?.addEventListener('click', () => toggleAutoDrive());
  heroBtn?.addEventListener('click', () => toggleAutoDrive());
}
