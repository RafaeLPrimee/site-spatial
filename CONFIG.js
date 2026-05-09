/* 
 * ===================================
 * AETHER SPACE - CONFIGURATION FILE
 * ===================================
 * 
 * This file contains all customizable settings
 * Modify these values to change the site behavior without touching code
 * 
 * NOTE: This is informational. Actual configuration is in CSS variables
 * and HTML/JS files as noted below.
 */

// ===== SITE METADATA =====
// Edit in: index.html <head>
const SITE_CONFIG = {
    title: "AETHER SPACE - Future of Interstellar Exploration",
    description: "Premium spatial/sci-fi landing page with immersive 3D graphics",
    keywords: "sci-fi, 3d, animation, interactive, landing page",
};

// ===== DESIGN SYSTEM =====
// Edit in: style.css :root variables
const COLORS = {
    dark: "#050505",              // Primary background
    darker: "#0a0a0a",            // Darker sections
    blue: "#0f4c75",              // Deep space blue
    cyan: "#00d9ff",              // Main accent - CHANGE THIS FOR NEW COLOR
    purple: "#a855f7",            // Secondary accent
    violet: "#7f39fb",            // Tertiary accent
    white: "#f5f5f5",             // Primary text
    whiteDim: "#e8e8e8",          // Secondary text
};

// ===== TYPOGRAPHY =====
// Edit in: style.css :root and index.html <head>
const FONTS = {
    primary: "'Inter', sans-serif",           // Body text
    secondary: "'Orbitron', monospace",       // Headings
    weights: {
        light: 300,
        regular: 400,
        medium: 500,
        semibold: 600,
        bold: 700,
        extrabold: 900,
    },
};

// ===== ANIMATION TIMINGS =====
// Edit in: style.css :root
const ANIMATIONS = {
    transitionSmooth: "0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    transitionFast: "0.15s cubic-bezier(0.4, 0, 0.2, 1)",
    heroTitleDuration: "1s",                  // edit in CSS
    cardRevealDuration: "0.8s",               // edit in CSS
    scrollAnimationDuration: "1.5s",          // edit in CSS
};

// ===== 3D SCENE SETTINGS =====
// Edit in: main.js scene classes
const SCENE_CONFIG = {
    // Hero Scene
    hero: {
        cameraZ: 5,                           // Adjust distance
        meshScale: 1,                         // Adjust size
        rotationSpeedX: 0.003,                // How fast it spins
        rotationSpeedY: 0.005,
        model: "./models/spaceship.glb",      // Change model path
    },
    
    // Exploration Scene
    exploration: {
        cameraZ: 8,
        meshScale: 1,
        rotationSpeedX: 0.002,
        rotationSpeedY: 0.003,
        rotationSpeedZ: 0.001,
        model: "./models/planet.glb",
    },
    
    // Galaxy Scene
    galaxy: {
        particleCount: 2000,                  // More particles = better visuals but slower
        particleSize: 0.5,
        rotationSpeedX: 0.0001,
        rotationSpeedY: 0.0002,
    },
};

// ===== LIGHTING SETTINGS =====
// Edit in: main.js setupLights() methods
const LIGHTING = {
    ambientLight: {
        color: 0xffffff,
        intensity: 0.4,                       // 0-1, higher = brighter
    },
    
    pointLight1: {
        color: 0x00d9ff,                      // Cyan
        intensity: 1,
        distance: 100,
        position: [10, 10, 10],
    },
    
    pointLight2: {
        color: 0xa855f7,                      // Purple
        intensity: 0.8,
        distance: 100,
        position: [-10, -10, 10],
    },
};

// ===== STAR FIELD SETTINGS =====
// Edit in: main.js initStars()
const STARFIELD = {
    count: 150,                               // Number of stars
    maxDuration: 5,                           // Max twinkling duration
    maxDelay: 2,                              // Max animation delay
};

// ===== PARTICLE SYSTEM =====
// Edit in: main.js GalaxyScene.createParticles()
const PARTICLES = {
    count: 2000,
    radius: 100,
    colors: {
        cyan: [0, 0.8, 1],                    // RGB format
        purple: [0.66, 0.33, 0.98],
    },
};

// ===== RESPONSIVE BREAKPOINTS =====
// Edit in: style.css @media queries
const BREAKPOINTS = {
    desktop: 1024,        // Large screens
    tablet: 768,          // Medium screens
    mobile: 480,          // Small screens
};

// ===== CONTENT STRINGS =====
// Edit directly in: index.html
const CONTENT = {
    // Navigation
    navItems: ["Home", "Exploration", "Technology", "Vision", "Enter"],
    
    // Hero Section
    heroTitle: "AETHER SPACE",
    heroSubtitle: "Transcending the boundaries of human exploration",
    heroDescription: "Navigate through infinite cosmos with advanced artificial intelligence and cutting-edge spatial technologies",
    heroCTA: "BEGIN JOURNEY",
    
    // Exploration Section
    explorationTitle: "Beyond Human Limits",
    explorationCards: [
        { icon: "🌌", title: "Interstellar Navigation", desc: "..." },
        { icon: "⚡", title: "Neural Integration", desc: "..." },
        // ... more cards
    ],
    
    // Technology Section
    technologyTitle: "Advanced Systems",
    techCards: [
        { number: "01", title: "Quantum Processors", desc: "..." },
        // ... more cards
    ],
    
    // Galaxy Section
    galaxyTitle: "Infinite Possibilities",
    stats: [
        { value: 1000000, label: "Star Systems" },
        { value: 847, label: "Exoplanets" },
        { value: 156, label: "Active Missions" },
        { value: 99.9, label: "Mission Success %" },
    ],
    
    // Final CTA
    ctaTitle: "ENTER THE FUTURE",
    ctaSubtitle: "Join thousands of explorers shaping the next frontier of civilization",
    ctaPrimary: "Start Your Journey",
    ctaSecondary: "Learn More",
};

// ===== BUTTON STYLES =====
// Edit in: style.css .cta-button
const BUTTONS = {
    primary: {
        background: "linear-gradient(135deg, #00d9ff, #a855f7)",
        color: "#050505",
        padding: "16px 40px",
        fontSize: "14px",
        borderRadius: "4px",
    },
    
    secondary: {
        background: "transparent",
        color: "#00d9ff",
        border: "2px solid #00d9ff",
        padding: "16px 40px",
        fontSize: "14px",
        borderRadius: "4px",
    },
};

// ===== CARD STYLES =====
// Edit in: style.css .card, .glass-card, .tech-card
const CARDS = {
    glass: {
        background: "rgba(255, 255, 255, 0.05)",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        borderRadius: "12px",
        padding: "30px",
    },
    
    tech: {
        background: "rgba(15, 30, 50, 0.6)",
        border: "1px solid rgba(0, 217, 255, 0.15)",
        borderRadius: "8px",
        padding: "30px",
    },
};

// ===== PERFORMANCE SETTINGS =====
// For optimization on lower-end devices
const PERFORMANCE = {
    // Reduce particle count for mobile
    particleCountMobile: 500,
    particleCountTablet: 1000,
    particleCountDesktop: 2000,
    
    // Disable animations on mobile if needed
    disableAnimationsOnMobile: false,
    
    // Pixel ratio for rendering
    pixelRatio: Math.min(window.devicePixelRatio, 2),
};

// ===== CUSTOM CURSOR SETTINGS =====
// Edit in: main.js initCursor()
const CURSOR = {
    size: "10px",
    color: "#00d9ff",
    glowColor: "rgba(0, 217, 255, 0.5)",
    followDelay: "0.3s",
};

// ===== GSAP ANIMATION SETTINGS =====
// Edit in: main.js initAnimations()
const GSAP_CONFIG = {
    staggerDelay: 0.1,                       // Delay between staggered animations
    scrollTriggerScrub: 0.5,                 // Smooth scroll linking
    easing: "power2.out",                    // Default easing function
};

// ===== WHERE TO MAKE CHANGES =====

/*

QUICK EDIT GUIDE:

1. COLORS
   → style.css :root {}
   
2. FONTS
   → index.html <head>
   → style.css :root --font-* variables
   
3. TEXT CONTENT
   → index.html (search for text)
   
4. ANIMATIONS SPEED
   → style.css (animation-duration, --transition-smooth)
   → main.js (duration in gsap.to() calls)
   
5. 3D SCENE SETTINGS
   → main.js (scene classes: HeroScene, ExplorationScene, GalaxyScene)
   
6. LIGHTING
   → main.js setupLights() methods
   
7. RESPONSIVE BREAKPOINTS
   → style.css @media queries
   
8. BUTTONS & CARDS
   → style.css (.cta-button, .card, .tech-card)

9. PARTICLE EFFECTS
   → main.js GalaxyScene.createParticles()

10. 3D MODELS
    → main.js (uncomment GLTFLoader)
    → Place .glb files in /models/ folder

*/

// ===== EXPORT FOR USE =====
export { SITE_CONFIG, COLORS, FONTS, ANIMATIONS, SCENE_CONFIG, LIGHTING };
