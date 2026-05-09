// ===================================
// AETHER SPACE - CUSTOMIZATION EXAMPLES
// ===================================
//
// This file contains ready-to-use code snippets for common customizations
// Copy-paste into main.js or style.css as needed
//

/* ========================================
   JAVASCRIPT CUSTOMIZATION EXAMPLES
   ======================================== */

// ===== EXAMPLE 1: Change Hero 3D Object Color =====
// In main.js, HeroScene.createScene() method:
/*
const geometry = new THREE.IcosahedronGeometry(2, 4);
const material = new THREE.MeshStandardMaterial({
    color: 0xFF0000,                    // Change to red instead of cyan
    metalness: 0.7,
    roughness: 0.2,
    emissive: 0x8800FF,                 // Change emissive color
    emissiveIntensity: 0.3,
});
*/

// ===== EXAMPLE 2: Speed Up 3D Rotations =====
// In main.js, animate() methods:
/*
if (this.mesh) {
    this.mesh.rotation.x += 0.01;      // Increase from 0.003
    this.mesh.rotation.y += 0.015;     // Increase from 0.005
}
*/

// ===== EXAMPLE 3: Add Mouse-Tracking to Exploration =====
// In main.js, ExplorationScene class:
/*
constructor() {
    // ... existing code ...
    document.addEventListener('mousemove', (e) => this.onMouseMove(e));
}

onMouseMove(event) {
    const x = (event.clientX / window.innerWidth) * 2 - 1;
    const y = -(event.clientY / window.innerHeight) * 2 + 1;
    
    if (this.mesh) {
        this.mesh.rotation.x = y * 0.5;
        this.mesh.rotation.y = x * 0.5;
    }
}
*/

// ===== EXAMPLE 4: Add Audio to Site =====
// Add to main.js:
/*
function initAudio() {
    // Background ambience
    const audio = new Audio('./assets/ambience.mp3');
    audio.loop = true;
    audio.volume = 0.2;
    
    // Play on first interaction
    document.addEventListener('click', () => {
        if (audio.paused) audio.play();
    });
}

// Call in init(): initAudio();
*/

// ===== EXAMPLE 5: Add Keyboard Controls =====
// Add to main.js:
/*
function initKeyboardControls() {
    document.addEventListener('keydown', (e) => {
        switch(e.key) {
            case 'ArrowUp':
                window.scrollBy(0, -100);
                break;
            case 'ArrowDown':
                window.scrollBy(0, 100);
                break;
            case ' ':
                e.preventDefault();
                // Custom action
                break;
        }
    });
}
*/

// ===== EXAMPLE 6: Add Random Color Generator =====
// Add to main.js:
/*
function getRandomColor() {
    const colors = [0x00d9ff, 0xa855f7, 0x7f39fb, 0x0f4c75];
    return colors[Math.floor(Math.random() * colors.length)];
}

// Use in HeroScene.createScene():
const material = new THREE.MeshStandardMaterial({
    color: getRandomColor(),
    // ...
});
*/

// ===== EXAMPLE 7: Add Scroll Velocity Detection =====
// Add to main.js:
/*
let lastScrollY = 0;
let scrollVelocity = 0;

window.addEventListener('scroll', () => {
    scrollVelocity = window.scrollY - lastScrollY;
    lastScrollY = window.scrollY;
    
    if (scrollVelocity > 20) {
        console.log('Scrolling down fast');
    } else if (scrollVelocity < -20) {
        console.log('Scrolling up fast');
    }
});
*/

/* ========================================
   CSS CUSTOMIZATION EXAMPLES
   ======================================== */

// ===== EXAMPLE 1: Dark Mode Toggle (CSS) =====
/*
// Add to style.css

.dark-mode {
    --color-dark: #000000;
    --color-darker: #1a1a1a;
    --color-white: #ffffff;
}

.light-mode {
    --color-dark: #ffffff;
    --color-darker: #f0f0f0;
    --color-white: #000000;
}

// Add to main.js:
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    document.body.classList.toggle('light-mode');
}
*/

// ===== EXAMPLE 2: Custom Gradient Background =====
/*
body {
    background: linear-gradient(
        135deg,
        #050505 0%,
        #0f4c75 25%,
        #050505 50%,
        #7f39fb 75%,
        #050505 100%
    );
    background-size: 400% 400%;
    animation: gradientShift 15s ease infinite;
}

@keyframes gradientShift {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
}
*/

// ===== EXAMPLE 3: Add Blur to Entire Section =====
/*
.blurred-section {
    filter: blur(5px);
    transition: filter 0.3s ease;
}

.blurred-section:hover {
    filter: blur(0px);
}
*/

// ===== EXAMPLE 4: Glowing Text Effect =====
/*
.glowing-text {
    color: #00d9ff;
    text-shadow: 
        0 0 10px #00d9ff,
        0 0 20px #00d9ff,
        0 0 30px #a855f7,
        0 0 40px #a855f7;
    animation: glow 2s ease-in-out infinite;
}

@keyframes glow {
    0%, 100% {
        text-shadow: 
            0 0 10px #00d9ff,
            0 0 20px #00d9ff,
            0 0 30px #a855f7;
    }
    50% {
        text-shadow: 
            0 0 20px #00d9ff,
            0 0 30px #00d9ff,
            0 0 40px #a855f7,
            0 0 50px #a855f7;
    }
}
*/

// ===== EXAMPLE 5: Hover Animation - Scale & Rotate =====
/*
.interactive-element {
    transition: all 0.3s ease;
    cursor: pointer;
}

.interactive-element:hover {
    transform: scale(1.1) rotate(5deg);
    filter: drop-shadow(0 0 20px rgba(0, 217, 255, 0.6));
}
*/

// ===== EXAMPLE 6: Typewriter Effect =====
/*
.typewriter {
    overflow: hidden;
    border-right: 2px solid #00d9ff;
    white-space: nowrap;
    animation: typing 3.5s steps(40, end), blink 0.75s step-end infinite;
}

@keyframes typing {
    from { width: 0; }
    to { width: 100%; }
}

@keyframes blink {
    from, to { border-color: transparent; }
    50% { border-color: #00d9ff; }
}
*/

// ===== EXAMPLE 7: Parallax Layers =====
/*
.parallax-layer-1 {
    transform: translateY(var(--scroll-y) * 0.5px);
}

.parallax-layer-2 {
    transform: translateY(var(--scroll-y) * 1px);
}

.parallax-layer-3 {
    transform: translateY(var(--scroll-y) * 1.5px);
}
*/

/* ========================================
   HTML CUSTOMIZATION EXAMPLES
   ======================================== */

// ===== EXAMPLE 1: Add A New Section =====
/*
In index.html, before </body>:

<section id="new-section" class="new-section">
    <h2 class="section-title">My Custom Section</h2>
    <p>Your content here</p>
</section>

In style.css:
.new-section {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 120px 60px;
    background: linear-gradient(...);
}
*/

// ===== EXAMPLE 2: Add A New Navigation Link =====
/*
In index.html navbar:

<ul class="nav-menu">
    <li><a href="#hero" class="nav-link">Home</a></li>
    <li><a href="#new-section" class="nav-link">New Page</a></li>
</ul>
*/

// ===== EXAMPLE 3: Add A Modal/Popup =====
/*
In index.html, before </body>:

<div class="modal" id="modal">
    <div class="modal-content">
        <span class="close">&times;</span>
        <h2>Modal Title</h2>
        <p>Modal content here</p>
    </div>
</div>

In style.css:
.modal {
    display: none;
    position: fixed;
    z-index: 9999;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.8);
}

.modal.show {
    display: flex;
    align-items: center;
    justify-content: center;
}

In main.js:
function openModal() {
    document.getElementById('modal').classList.add('show');
}

function closeModal() {
    document.getElementById('modal').classList.remove('show');
}
*/

/* ========================================
   ADVANCED EXAMPLES
   ======================================== */

// ===== EXAMPLE 1: Add Physics to Objects =====
// Requires Cannon.js library
/*
npm install cannon

import * as CANNON from 'cannon';

// Create physics world
const world = new CANNON.World();
world.gravity.set(0, -9.82, 0);

// Add physics body to mesh
const body = new CANNON.Body({
    mass: 1,
    shape: new CANNON.Sphere(1),
});
world.addBody(body);
*/

// ===== EXAMPLE 2: Add Post-Processing Effects =====
// Requires EffectComposer
/*
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { BloomPass } from 'three/examples/jsm/postprocessing/BloomPass.js';

const composer = new EffectComposer(renderer);
const renderPass = new RenderPass(scene, camera);
const bloomPass = new BloomPass(1.3);

composer.addPass(renderPass);
composer.addPass(bloomPass);
*/

// ===== EXAMPLE 3: Add Shader Effects =====
/*
const shaderMaterial = new THREE.ShaderMaterial({
    vertexShader: `
        void main() {
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
    fragmentShader: `
        void main() {
            gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
        }
    `,
});
*/

// ===== EXAMPLE 4: Add Data Visualization =====
/*
// Display real-time data on site

function displayLiveData() {
    setInterval(() => {
        fetch('/api/data')
            .then(r => r.json())
            .then(data => {
                document.querySelector('.stat-number').innerText = data.value;
            });
    }, 1000);
}
*/

/* ========================================
   PERFORMANCE OPTIMIZATION
   ======================================== */

// ===== EXAMPLE 1: Lazy Load Images =====
/*
<img src="placeholder.jpg" data-src="real-image.jpg" loading="lazy" />

JavaScript:
document.querySelectorAll('img[loading="lazy"]').forEach(img => {
    img.src = img.dataset.src;
});
*/

// ===== EXAMPLE 2: Debounce Scroll Events =====
/*
function debounce(func, delay) {
    let timeoutId;
    return function(...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func(...args), delay);
    };
}

window.addEventListener('scroll', debounce(() => {
    // Expensive operation
}, 250));
*/

// ===== EXAMPLE 3: RequestAnimationFrame Instead of SetInterval =====
/*
function animate() {
    requestAnimationFrame(animate);
    // Animation code here
}
animate();
*/

// ===== EXAMPLE 4: Throttle Function =====
/*
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}
*/

/* ========================================
   TEST CONFIGURATION
   ======================================== */

// ===== Test Section 3D Scene =====
/*
// Add to main.js to test new 3D scene

class TestScene {
    constructor() {
        this.canvas = document.getElementById('canvas-test');
        if (!this.canvas) return;

        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, this.canvas.clientWidth / this.canvas.clientHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, alpha: true, antialias: true });

        this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
        this.camera.position.z = 5;

        this.createTestMesh();
        this.animate();
    }

    createTestMesh() {
        const geometry = new THREE.BoxGeometry(2, 2, 2);
        const material = new THREE.MeshStandardMaterial({ color: 0x00d9ff });
        this.mesh = new THREE.Mesh(geometry, material);
        this.scene.add(this.mesh);
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        this.mesh.rotation.x += 0.01;
        this.mesh.rotation.y += 0.01;
        this.renderer.render(this.scene, this.camera);
    }
}
*/

---

For more information, see:
- README.md - Full documentation
- 3D_MODELS_GUIDE.md - 3D integration
- QUICK_START.md - Quick reference
