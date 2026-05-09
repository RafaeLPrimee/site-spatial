# 🌌 AETHER SPACE - Premium Spatial/Sci-Fi Landing Page

A cutting-edge, immersive landing page showcasing futuristic design with advanced 3D graphics, fluid animations, and premium UI/UX inspired by Interstellar, Dune, Star Citizen, and cyberpunk aesthetics.

## ✨ Features

- **Ultra-Premium Design** - Minimaliste, cinématique, et futuriste
- **Advanced 3D Graphics** - Three.js integration with animated geometric objects
- **Fluid Animations** - GSAP + ScrollTrigger for smooth, elegant transitions
- **Custom Cursor** - Interactive cursor with glow effects
- **Particle Effects** - Animated galaxy with thousands of particles
- **Responsive Design** - Perfect on desktop, tablet, and mobile
- **Performance Optimized** - Smooth 60fps animations
- **Glassmorphism UI** - Modern frosted glass effects
- **Scroll Interactions** - Parallax and scroll-linked animations

## 📁 Project Structure

```
site-spatial/
├── index.html          # Main HTML file
├── style.css           # All styling and animations
├── main.js             # JavaScript logic and Three.js scenes
├── package.json        # Dependencies configuration
├── vite.config.js      # Vite build configuration
├── models/             # 3D model storage (.glb, .gltf)
├── textures/           # Texture files for 3D objects
└── assets/             # Additional assets
```

## 🚀 Installation & Setup

### 1. Install Dependencies

```bash
npm install three
npm install gsap
npm install vite
```

Or install all at once:

```bash
npm install
```

### 2. Start Development Server

```bash
npm run dev
```

The site will open at `http://localhost:3000`

### 3. Build for Production

```bash
npm run build
```

Output will be in the `dist/` folder.

## 🎨 Design System

### Color Palette

- **Dark Base**: `#050505` (Deep black)
- **Accent Cyan**: `#00d9ff` (Luminous cyan)
- **Accent Purple**: `#a855f7` (Violet)
- **Accent Blue**: `#0f4c75` (Deep space blue)
- **Text**: `#f5f5f5` (Off-white)

### Typography

- **Primary Font**: Inter (body text, UI)
- **Secondary Font**: Orbitron (headings, monospace)
- **Weights**: 300, 400, 500, 600, 700

### Effects

- **Glow**: Cyan (#00d9ff) and Purple (#a855f7) glowing shadows
- **Blur**: 10-20px backdrop filters for glass effect
- **Transparency**: Layered opacity for depth

## 📐 Section Guide

### Hero Section (100vh)
- Fullscreen immersive experience
- 3D animated geometric object (default: Icosahedron)
- Animated starfield background
- Custom cursor tracking
- Premium CTA buttons

**Files**: index.html `#hero`, style.css `.hero`, main.js `HeroScene`

### Exploration Section
- Rotating 3D Torus object
- Glassmorphism cards with hover effects
- Reveal animations on scroll

**Files**: index.html `#exploration`, style.css `.exploration`, main.js `ExplorationScene`

### Technology Section
- HUD-style interface grid
- Animated progress bars
- Tech stat cards with hover interactions
- Sci-fi line effects

**Files**: index.html `#technology`, style.css `.technology`

### Galaxy Section
- Particle-based starfield
- Animated statistics counters
- Parallax effect

**Files**: index.html `#galaxy`, style.css `.galaxy`, main.js `GalaxyScene`

### Final CTA Section
- Large immersive title
- Call-to-action buttons
- Footer with social links

**Files**: index.html `#cta`, style.css `.final-cta`

## 🎬 Animation Guide

### GSAP Animations Included

1. **Hero Title** - Staggered slide-in animation
2. **Scroll-Triggered Reveals** - Fade-in on section visibility
3. **Tech Cards** - Progressive appearance with stagger
4. **Stat Counters** - Animated number increment
5. **Parallax** - Smooth scroll-linked transforms

### Custom Animations

- Custom cursor movements
- 3D object rotations
- Starfield twinkling
- Button hover states
- Navigation underline effects

## 🎯 How to Add Custom 3D Models

### Step 1: Prepare Your Model

Download a .glb or .gltf file from:
- **Sketchfab**: https://sketchfab.com/
- **Poly Pizza**: https://poly.pizza/
- **CGTrader**: https://www.cgtrader.com/

### Step 2: Place in Models Folder

Copy your file to `/models/` folder:
```
models/
├── spaceship.glb
├── planet.glb
└── station.gltf
```

### Step 3: Update main.js

In `main.js`, find the scene class you want to modify and uncomment the GLTFLoader code:

**For Hero Scene:**
```javascript
const loader = new GLTFLoader();
loader.load('./models/spaceship.glb', (gltf) => {
    const model = gltf.scene;
    model.scale.set(1, 1, 1); // Adjust scale
    this.mesh = model;
    this.scene.add(model);
});
```

### Step 4: Adjust Camera & Lighting

Modify camera position and lighting in each scene class to properly display your model:
```javascript
this.camera.position.z = 5;  // Adjust distance
this.mesh.position.set(0, 0, 0);  // Adjust position
```

## 🎨 Customization Guide

### Change Colors

Edit CSS variables in `style.css`:
```css
:root {
    --color-dark: #050505;
    --color-cyan: #00d9ff;
    --color-purple: #a855f7;
    /* ... etc ... */
}
```

### Modify Text

Edit text in `index.html`:
- Hero title: Lines 38-42
- Section titles: Search `<h2 class="section-title">`
- Card descriptions: Inside `.card` divs

### Adjust Animation Speed

In `style.css`:
```css
:root {
    --transition-smooth: 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    --transition-fast: 0.15s cubic-bezier(0.4, 0, 0.2, 1);
}
```

### Modify 3D Object Rotation

In `main.js`, find the `animate()` methods:
```javascript
this.mesh.rotation.x += 0.003;  // Change rotation speed
this.mesh.rotation.y += 0.005;
```

### Particle Count in Galaxy

In `main.js` `GalaxyScene.createParticles()`:
```javascript
const particleCount = 2000;  // Increase/decrease particles
```

## 📱 Responsive Breakpoints

- **Desktop**: 1024px+
- **Tablet**: 768px - 1023px
- **Mobile**: < 768px
- **Small Mobile**: < 480px

All sections and components adapt gracefully to screen sizes.

## ⚙️ Performance Tips

1. **Reduce Particle Count** - Modify `particleCount` in GalaxyScene for lower-end devices
2. **Disable Animations** - Comment out GSAP animations in low-performance situations
3. **Optimize Models** - Keep 3D models under 5MB (use compressed .glb format)
4. **Use CDN** - For production, host dependencies on CDN
5. **Enable GPU Acceleration** - Ensure CSS transforms are GPU-accelerated

## 🛠️ Development Notes

### Key Libraries

- **Three.js** - 3D graphics rendering
- **GSAP** - Animation library with ScrollTrigger plugin
- **Vite** - Fast build tool and dev server

### Browser Compatibility

- Chrome/Edge 90+
- Firefox 88+
- Safari 15+

### Recommended Dev Tools

- VS Code with Live Server
- Chrome DevTools for 3D inspection
- Vite's built-in HMR (Hot Module Replacement)

## 📝 Code Organization

### HTML Structure
- Semantic HTML5
- Clear section divisions with IDs
- CSS class naming (BEM-inspired)
- Canvas elements for 3D scenes

### CSS Architecture
- CSS Variables for theming
- Mobile-first responsive design
- Animation utilities
- Glassmorphism helpers

### JavaScript Modules
- Modular class structure (Scene classes)
- Event listener management
- THREE.js integration
- GSAP timeline control

## 🎓 Learning Resources

- **Three.js**: https://threejs.org/docs/
- **GSAP**: https://gsap.com/docs/
- **WebGL**: https://webglfundamentals.org/

## 📄 License

This project is open-source and available for personal and commercial use.

## 🙏 Credits

Design inspiration from:
- Interstellar (Christopher Nolan)
- Dune (Denis Villeneuve)
- Star Citizen (Cloud Imperium Games)
- Apple Design Language
- Tesla Design System
- Cyberpunk Aesthetics
- No Man's Sky

---

**Version**: 1.0.0  
**Last Updated**: May 2026  
**Status**: Production Ready ✅

For support and questions, refer to the code comments and documentation above.
