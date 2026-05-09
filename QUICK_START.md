# ⚡ Quick Start Guide

Get AETHER SPACE running in minutes!

## 🚀 Installation (First Time)

### 1. Open Terminal

Navigate to the project folder:
```bash
cd "c:\Users\rafae\OneDrive\Bureau\site-spatial"
```

### 2. Install Dependencies

```bash
npm install
```

This installs:
- **three** - 3D graphics
- **gsap** - Animations
- **vite** - Build tool

## 🎮 Development Commands

### Start Development Server
```bash
npm run dev
```

- Opens at `http://localhost:3000`
- Auto-reloads on file changes
- Shows real-time preview

### Build for Production
```bash
npm run build
```

- Generates optimized files in `/dist/` folder
- Ready for deployment

### Preview Production Build
```bash
npm run preview
```

- Tests the production build locally

## 📋 File Editing Quick Reference

### Edit Design (Colors, Spacing, Fonts)
→ Open `style.css`

### Edit Content (Text, Titles, Descriptions)
→ Open `index.html`

### Edit Functionality (Animations, 3D, Interactions)
→ Open `main.js`

### Add Custom 3D Models
→ Place `.glb` files in `/models/` folder  
→ See `3D_MODELS_GUIDE.md`

## 🎯 Common Tasks

### Change Hero Title
1. Open `index.html`
2. Find `<h1 class="hero-title">` (line ~39)
3. Edit the text inside `<span>` tags

### Change Primary Color (Cyan)
1. Open `style.css`
2. Find `--color-cyan: #00d9ff;` (line 14)
3. Replace with your color code

### Speed Up Animations
1. Open `style.css`
2. Find `--transition-smooth: 0.3s` (line 20)
3. Change to smaller value (e.g., `0.15s`)

### Add a 3D Model
1. Download `.glb` file from Sketchfab/Poly Pizza
2. Save to `/models/` folder
3. Open `main.js`
4. Find the scene class you want (HeroScene, etc.)
5. Uncomment the `GLTFLoader` code
6. Update path: `'./models/your-file.glb'`

### Change Section Titles
1. Open `index.html`
2. Search for `.section-title` class
3. Edit the text

## 📱 Testing Responsive Design

### Desktop (F12 → Toggle Device Toolbar)
- 1920x1080 or larger

### Tablet
- iPad: 1024x768 or 810x1080
- Tablet: 768x1024

### Mobile
- iPhone: 390x844
- Android: 360x800

## 🎨 Color Customization Quick Reference

Open `style.css` and modify colors:

```css
--color-dark: #050505;          /* Background */
--color-darker: #0a0a0a;        /* Darker bg */
--color-blue: #0f4c75;          /* Deep blue */
--color-cyan: #00d9ff;          /* Bright cyan - MAIN ACCENT */
--color-purple: #7f39fb;        /* Purple */
--color-violet: #a855f7;        /* Violet */
--color-white: #f5f5f5;         /* Text */
```

### Quick Color Palette Ideas

**Modern Neon** (Change from default):
```css
--color-cyan: #00ff88;    /* Neon green */
--color-purple: #ff00ff;  /* Neon magenta */
```

**Ocean Theme**:
```css
--color-cyan: #0099ff;    /* Ocean blue */
--color-purple: #00ccff;  /* Teal */
```

**Retro 80s**:
```css
--color-cyan: #ff006e;    /* Hot pink */
--color-purple: #ffd60a;  /* Golden yellow */
```

## 🔍 Browser DevTools Tips

### F12 Shortcuts
- **F12** - Open DevTools
- **Ctrl+Shift+I** - DevTools
- **Ctrl+Shift+M** - Toggle device view
- **Ctrl+Shift+C** - Inspect element

### Performance Check
1. F12 → Performance tab
2. Click record
3. Scroll through site
4. Stop recording
5. Check FPS (target: 60fps)

### Debug 3D Scenes
1. F12 → Console
2. Look for error messages
3. Check console logs
4. Verify file paths

## 📚 Documentation Files

- **README.md** - Full documentation
- **3D_MODELS_GUIDE.md** - How to add 3D models
- **QUICK_START.md** - This file

## 🆘 Troubleshooting

### Site won't start
```bash
# Clear cache and reinstall
rm -r node_modules package-lock.json
npm install
npm run dev
```

### Port 3000 already in use
```bash
# Vite will automatically use next available port
# Or specify port:
npm run dev -- --port 3001
```

### Models not loading
1. Check file path in main.js
2. Verify file exists in `/models/` folder
3. Check console for errors (F12)
4. Try different model format

### Animations not smooth
1. Close other applications
2. Check GPU acceleration (DevTools → Performance)
3. Reduce particle count in GalaxyScene
4. Try different browser

### CSS not updating
1. Hard refresh: **Ctrl+Shift+R**
2. Clear browser cache
3. Restart dev server

## 🚀 Deployment

### Deploy to Vercel (Recommended)
1. Push code to GitHub
2. Connect at vercel.com
3. Auto-deploys on every push

### Deploy to GitHub Pages
```bash
npm run build
# Push /dist/ folder to gh-pages branch
```

### Deploy to Netlify
1. Connect GitHub repo
2. Set build command: `npm run build`
3. Set publish directory: `dist`

## ✅ Pre-Launch Checklist

- [ ] Test on desktop
- [ ] Test on tablet
- [ ] Test on mobile
- [ ] Check all animations are smooth
- [ ] Verify 3D scenes load
- [ ] Test all buttons/links
- [ ] Update content text
- [ ] Add custom logo
- [ ] Test on different browsers
- [ ] Final performance check (60fps)

## 📞 Quick Reference

| Command | Purpose |
|---------|---------|
| `npm install` | Install dependencies |
| `npm run dev` | Start dev server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |

---

**Ready to build something amazing?** 🌌

Start with `npm run dev` and begin editing!
