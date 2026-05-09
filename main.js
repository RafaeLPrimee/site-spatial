import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

// ===== PLANET DATABASE =====
const PLANETS_DATA = {
    mercury: {
        name: 'Mercury',
        icon: '☿️',
        distance: 57.9,
        diameter: 3.8,
        dayLength: '59 days',
        moons: 0,
        description: 'The smallest planet and closest to the Sun. Extreme temperatures and a cratered surface.',
        color: '#8C7853'
    },
    venus: {
        name: 'Venus',
        icon: '♀️',
        distance: 108.2,
        diameter: 12.1,
        dayLength: '243 days',
        moons: 0,
        description: 'Earth\'s toxic twin with crushing atmospheric pressure.',
        color: '#FFC649'
    },
    earth: {
        name: 'Earth',
        icon: '🌍',
        distance: 149.6,
        diameter: 12.7,
        dayLength: '24 hours',
        moons: 1,
        description: 'Our home. The only known planet to harbor life.',
        color: '#4A90E2'
    },
    mars: {
        name: 'Mars',
        icon: '♂️',
        distance: 227.9,
        diameter: 6.8,
        dayLength: '24.6 hours',
        moons: 2,
        description: 'The red planet. Home to the largest volcano in our solar system.',
        color: '#E27B58'
    },
    jupiter: {
        name: 'Jupiter',
        icon: '♃',
        distance: 778.5,
        diameter: 139.8,
        dayLength: '10 hours',
        moons: 95,
        description: 'The gas giant king. A massive world of storms and incredible magnetosphere.',
        color: '#C88B3A'
    },
    saturn: {
        name: 'Saturn',
        icon: '♄',
        distance: 1434,
        diameter: 116.5,
        dayLength: '10.7 hours',
        moons: 146,
        description: 'The ringed wonder. Famous for its spectacular system of icy rings.',
        color: '#FAD5A5'
    },
    uranus: {
        name: 'Uranus',
        icon: '♅',
        distance: 2873,
        diameter: 50.7,
        dayLength: '17 hours',
        moons: 27,
        description: 'The ice giant that rotates on its side. A mysterious world of methane clouds.',
        color: '#4FD0E7'
    },
    neptune: {
        name: 'Neptune',
        icon: '♆',
        distance: 4495,
        diameter: 49.2,
        dayLength: '16 hours',
        moons: 16,
        description: 'The windy ice giant. Supersonic winds and deep blue coloring.',
        color: '#4166F5'
    }
};

// ===== 3D MODELS DATABASE - ULTRA PREMIUM =====
const MODELS_CONFIG = {
    sun: {
        name: 'The Sun',
        fallbackColor: 0xFDB813,
        scale: 1.5,
        textureUrl: 'https://images.unsplash.com/photo-1532693322450-2cb5c511067d?w=2048&h=2048&q=80',
        hasAtmosphere: true,
        emissive: true,
        segments: 128
    },
    earth: {
        name: 'Earth',
        fallbackColor: 0x4A90E2,
        scale: 1,
        textureUrl: 'https://cdn.jsdelivr.net/npm/three@r128/examples/textures/planets/earth_atmos_2048.jpg',
        normalUrl: 'https://cdn.jsdelivr.net/npm/three@r128/examples/textures/planets/earth_normal_2048.jpg',
        hasAtmosphere: true,
        atmosphereColor: 0x87CEEB,
        segments: 128
    },
    mars: {
        name: 'Mars',
        fallbackColor: 0xE27B58,
        scale: 0.9,
        textureUrl: 'https://cdn.jsdelivr.net/npm/three@r128/examples/textures/planets/mars_1k_color.jpg',
        hasAtmosphere: false,
        segments: 96
    },
    jupiter: {
        name: 'Jupiter',
        fallbackColor: 0xC88B3A,
        scale: 2.2,
        textureUrl: 'https://cdn.jsdelivr.net/npm/three@r128/examples/textures/planets/jupiter_2048.png',
        hasAtmosphere: true,
        atmosphereColor: 0xFFB347,
        segments: 128,
        hasStorms: true
    },
    saturn: {
        name: 'Saturn',
        fallbackColor: 0xFAD5A5,
        scale: 2,
        textureUrl: 'https://cdn.jsdelivr.net/npm/three@r128/examples/textures/planets/saturn_2048.png',
        hasRings: true,
        ringsTexture: 'https://cdn.jsdelivr.net/npm/three@r128/examples/textures/planets/saturn_ring_alpha.png',
        hasAtmosphere: false,
        segments: 128
    },
    moon: {
        name: 'The Moon',
        fallbackColor: 0xAAAAAA,
        scale: 0.5,
        textureUrl: 'https://cdn.jsdelivr.net/npm/three@r128/examples/textures/planets/moon_1024.jpg',
        normalUrl: 'https://cdn.jsdelivr.net/npm/three@r128/examples/textures/planets/moon_normal_1024.jpg',
        segments: 96
    }
};

// ===== CUSTOM SHADERS FOR ATMOSPHERES & EFFECTS =====
const ATMOSPHERE_SHADER = {
    vertexShader: `
        varying vec3 vertexNormal;
        varying vec3 vertexPosition;
        
        void main() {
            vertexNormal = normalize(normalMatrix * normal);
            vertexPosition = vec3(modelViewMatrix * vec4(position, 1.0));
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
    fragmentShader: `
        uniform vec3 atmosphereColor;
        uniform float atmosphereIntensity;
        varying vec3 vertexNormal;
        varying vec3 vertexPosition;
        
        void main() {
            vec3 normal = normalize(vertexNormal);
            vec3 viewDir = normalize(-vertexPosition);
            
            float fresnel = pow(1.0 - dot(normal, viewDir), 3.0);
            fresnel = smoothstep(0.0, 1.0, fresnel);
            
            vec3 color = atmosphereColor * fresnel * atmosphereIntensity;
            gl_FragColor = vec4(color, fresnel * 0.4);
        }
    `
};

const GLOW_SHADER = {
    vertexShader: `
        varying vec3 vertexNormal;
        
        void main() {
            vertexNormal = normalize(normalMatrix * normal);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
    fragmentShader: `
        uniform vec3 glowColor;
        uniform float glowIntensity;
        varying vec3 vertexNormal;
        
        void main() {
            vec3 normal = normalize(vertexNormal);
            vec3 viewDir = normalize(vec3(0.0, 0.0, 1.0) - normal);
            
            float glow = pow(dot(normal, viewDir), 0.5);
            gl_FragColor = vec4(glowColor, glow * glowIntensity);
        }
    `
};

// ===== STAR FIELD =====
function initStars() {
    const starsContainer = document.getElementById('stars-container');
    const starCount = 100;
    
    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';
        star.style.animationDelay = Math.random() * 3 + 's';
        starsContainer.appendChild(star);
    }
}

// ===== HERO 3D SCENE - SUN =====
class HeroScene {
    constructor() {
        this.canvas = document.getElementById('canvas-3d');
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(
            75,
            this.canvas.clientWidth / this.canvas.clientHeight,
            0.1,
            10000
        );
        this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: true, alpha: true });
        
        this.setupRenderer();
        this.createScene();
        this.setupPostProcessing();
        this.animate();
        window.addEventListener('resize', () => this.onWindowResize());
    }

    setupRenderer() {
        this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setClearColor(0x000000, 0.1);
        this.camera.position.z = 3;
    }

    setupPostProcessing() {
        this.composer = new EffectComposer(this.renderer);
        const renderPass = new RenderPass(this.scene, this.camera);
        this.composer.addPass(renderPass);
        
        const bloomPass = new UnrealBloomPass(
            new THREE.Vector2(this.canvas.clientWidth, this.canvas.clientHeight),
            1.5,
            0.4,
            0.85
        );
        this.composer.addPass(bloomPass);
    }

    createScene() {
        // Sun - Large glowing sphere
        const sunGeometry = new THREE.IcosahedronGeometry(1, 5);
        const sunMaterial = new THREE.MeshStandardMaterial({
            color: 0xFDB813,
            emissive: 0xFDB813,
            emissiveIntensity: 1,
            metalness: 0.9,
            roughness: 0.1
        });
        this.sun = new THREE.Mesh(sunGeometry, sunMaterial);
        this.scene.add(this.sun);

        // Glow
        const glowGeometry = new THREE.IcosahedronGeometry(1.1, 5);
        const glowMaterial = new THREE.MeshStandardMaterial({
            color: 0xFF8800,
            emissive: 0xFF8800,
            emissiveIntensity: 0.5,
            transparent: true,
            opacity: 0.3
        });
        const glow = new THREE.Mesh(glowGeometry, glowMaterial);
        this.scene.add(glow);

        // Lighting
        const sunLight = new THREE.PointLight(0xFDB813, 2, 100);
        sunLight.position.set(0, 0, 0);
        this.scene.add(sunLight);

        const ambientLight = new THREE.AmbientLight(0x404040);
        this.scene.add(ambientLight);
    }

    animate = () => {
        requestAnimationFrame(this.animate);
        
        this.sun.rotation.x += 0.001;
        this.sun.rotation.y += 0.002;
        
        this.composer.render();
    }

    onWindowResize() {
        const width = this.canvas.clientWidth;
        const height = this.canvas.clientHeight;
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }
}

// ===== SOLAR SYSTEM 3D SCENE - DISCOVERY (ULTRA-ACCESSIBLE) =====
class SolarSystemScene {
    constructor() {
        this.canvas = document.getElementById('canvas-solar-system');
        if (!this.canvas) return;
        
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x000011);
        this.camera = new THREE.PerspectiveCamera(
            75,
            this.canvas.clientWidth / this.canvas.clientHeight,
            0.1,
            100000
        );
        this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: true });
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        this.selectedPlanet = null;
        this.planetLabels = [];
        this.planets = [];
        this.hoverPlanet = null;
        this.originalCameraPosition = { x: 0, y: 0, z: 150 };
        this.isZoomedIn = false;
        
        this.setupRenderer();
        this.createSolarSystem();
        this.setupControls();
        this.setupEvents();
        this.addInstructions();
        this.createQuickSelectButtons();
        this.animate();
        window.addEventListener('resize', () => this.onWindowResize());
    }

    setupRenderer() {
        this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setClearColor(0x000000);
        this.camera.position.set(0, 0, 150);
    }

    createSolarSystem() {
        // Sun at center
        const sunGeometry = new THREE.SphereGeometry(12, 64, 64);
        const sunMaterial = new THREE.MeshStandardMaterial({
            color: 0xFDB813,
            emissive: 0xFDB813,
            emissiveIntensity: 0.8,
            metalness: 0.5,
            roughness: 0.3
        });
        this.sun = new THREE.Mesh(sunGeometry, sunMaterial);
        this.scene.add(this.sun);

        // Sun glow
        const glowGeometry = new THREE.SphereGeometry(14, 32, 32);
        const glowMaterial = new THREE.MeshBasicMaterial({
            color: 0xFDB813,
            transparent: true,
            opacity: 0.15
        });
        const sunGlow = new THREE.Mesh(glowGeometry, glowMaterial);
        this.scene.add(sunGlow);

        // Sun light
        const sunLight = new THREE.PointLight(0xFDB813, 3, 500);
        this.scene.add(sunLight);

        this.planets = [];
        const planetsOrder = ['mercury', 'venus', 'earth', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune'];
        
        planetsOrder.forEach((planetKey, index) => {
            const data = PLANETS_DATA[planetKey];
            const scale = Math.max(2.5, Math.min(data.diameter / 10, 25));
            const orbitRadius = 40 + index * 20;
            
            // Planet
            const geometry = new THREE.SphereGeometry(scale, 48, 48);
            const material = new THREE.MeshStandardMaterial({
                color: data.color,
                metalness: 0.6,
                roughness: 0.4,
                emissive: data.color,
                emissiveIntensity: 0.1
            });
            const planet = new THREE.Mesh(geometry, material);
            planet.userData = { key: planetKey, data: data, scale: scale };
            planet.castShadow = true;
            planet.receiveShadow = true;
            
            // Orbit line
            const orbitGeometry = new THREE.BufferGeometry();
            const orbitPoints = [];
            for (let i = 0; i <= 256; i++) {
                const angle = (i / 256) * Math.PI * 2;
                orbitPoints.push(
                    Math.cos(angle) * orbitRadius,
                    0,
                    Math.sin(angle) * orbitRadius
                );
            }
            orbitGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(orbitPoints), 3));
            const orbitMaterial = new THREE.LineBasicMaterial({ 
                color: 0x444444,
                linewidth: 1
            });
            const orbit = new THREE.Line(orbitGeometry, orbitMaterial);
            this.scene.add(orbit);
            
            planet.userData.orbitRadius = orbitRadius;
            planet.userData.orbitAngle = Math.random() * Math.PI * 2;
            
            this.scene.add(planet);
            this.planets.push(planet);
        });

        // Ambient light
        const ambientLight = new THREE.AmbientLight(0x666666);
        this.scene.add(ambientLight);
    }

    setupControls() {
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.autoRotate = true;
        this.controls.autoRotateSpeed = 1.5;
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.08;
        this.controls.enableZoom = true;
        this.controls.minDistance = 50;
        this.controls.maxDistance = 500;
        this.controls.touches = {
            ONE: THREE.TOUCH.ROTATE,
            TWO: THREE.TOUCH.DOLLY_PAN
        };
    }

    setupEvents() {
        this.canvas.addEventListener('click', (event) => this.onCanvasClick(event));
        this.canvas.addEventListener('mousemove', (event) => this.onMouseMove(event));
    }

    onMouseMove(event) {
        const rect = this.canvas.getBoundingClientRect();
        this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        
        this.raycaster.setFromCamera(this.mouse, this.camera);
        const intersects = this.raycaster.intersectObjects(this.planets);
        
        // Reset previous hover
        if (this.hoverPlanet) {
            this.hoverPlanet.material.emissiveIntensity = 0.1;
            this.hoverPlanet.scale.set(1, 1, 1);
        }
        
        // Highlight hovered planet
        if (intersects.length > 0) {
            this.hoverPlanet = intersects[0].object;
            this.hoverPlanet.material.emissiveIntensity = 0.5;
            this.hoverPlanet.scale.set(1.1, 1.1, 1.1);
            this.canvas.style.cursor = 'pointer';
        } else {
            this.hoverPlanet = null;
            this.canvas.style.cursor = 'grab';
        }
    }

    onCanvasClick(event) {
        const rect = this.canvas.getBoundingClientRect();
        this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        
        this.raycaster.setFromCamera(this.mouse, this.camera);
        const intersects = this.raycaster.intersectObjects(this.planets);
        
        if (intersects.length > 0) {
            this.selectPlanet(intersects[0].object);
        }
    }

    selectPlanet(planet) {
        // Reset previous selection
        if (this.selectedPlanet && this.selectedPlanet !== planet) {
            this.selectedPlanet.material.emissiveIntensity = 0.1;
        }
        
        this.selectedPlanet = planet;
        planet.material.emissiveIntensity = 0.8;
        
        // Zoom to planet
        this.zoomToPlanet(planet);
        
        // Update info panel
        this.updatePlanetInfo(planet.userData);
        
        // Highlight button
        this.updateQuickSelectButtons(planet.userData.key);
    }

    zoomToPlanet(planet) {
        this.controls.autoRotate = false;
        this.isZoomedIn = true;
        
        const distance = planet.userData.scale * 4;
        const targetPosition = planet.position.clone();
        targetPosition.normalize().multiplyScalar(distance);
        
        // Animate camera zoom
        gsap.to(this.camera.position, {
            x: targetPosition.x,
            y: targetPosition.y,
            z: targetPosition.z,
            duration: 1.2,
            ease: 'power2.inOut',
            onUpdate: () => {
                this.controls.target.copy(planet.position);
                this.controls.update();
            }
        });
    }

    zoomOut() {
        this.controls.autoRotate = true;
        this.isZoomedIn = false;
        this.selectedPlanet = null;
        
        gsap.to(this.camera.position, {
            x: 0,
            y: 0,
            z: 150,
            duration: 1.2,
            ease: 'power2.inOut',
            onUpdate: () => {
                this.controls.target.set(0, 0, 0);
                this.controls.update();
            }
        });
    }

    updatePlanetInfo(data) {
        document.getElementById('planet-name').textContent = data.data.name;
        document.getElementById('planet-description').textContent = data.data.description;
        
        const stats = document.getElementById('planet-stats').querySelectorAll('.stat');
        stats[0].querySelector('.value').textContent = data.data.distance + 'M km';
        stats[1].querySelector('.value').textContent = data.data.diameter + 'k km';
        stats[2].querySelector('.value').textContent = data.data.dayLength;
        stats[3].querySelector('.value').textContent = data.data.moons;
    }

    addInstructions() {
        // Add overlay instructions
        const instructionsDiv = document.createElement('div');
        instructionsDiv.style.cssText = `
            position: absolute;
            bottom: 20px;
            left: 20px;
            background: rgba(0, 0, 0, 0.8);
            color: #FDB813;
            padding: 15px;
            border-radius: 8px;
            font-size: 12px;
            border: 1px solid rgba(253, 184, 19, 0.3);
            max-width: 250px;
            font-family: 'Inter', sans-serif;
            backdrop-filter: blur(10px);
            z-index: 10;
        `;
        instructionsDiv.innerHTML = `
            <div style="font-weight: 600; margin-bottom: 8px;">🎮 Contrôles:</div>
            <div style="margin-bottom: 5px;"><strong>Souris:</strong> Survolez → Cliquez planète</div>
            <div style="margin-bottom: 5px;"><strong>Scroll:</strong> Zoomez</div>
            <div style="margin-bottom: 5px;"><strong>Drag:</strong> Faites pivoter</div>
            <div style="margin-top: 8px; font-size: 11px; opacity: 0.7;">Cliquez les boutons rapides ↓</div>
        `;
        this.canvas.parentElement.style.position = 'relative';
        this.canvas.parentElement.appendChild(instructionsDiv);
    }

    createQuickSelectButtons() {
        const buttonsContainer = document.createElement('div');
        buttonsContainer.style.cssText = `
            position: absolute;
            bottom: 20px;
            right: 20px;
            display: flex;
            flex-direction: column;
            gap: 8px;
            z-index: 10;
        `;
        
        const planetsOrder = ['mercury', 'venus', 'earth', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune'];
        
        planetsOrder.forEach(planetKey => {
            const btn = document.createElement('button');
            const data = PLANETS_DATA[planetKey];
            btn.textContent = `${data.icon} ${data.name}`;
            btn.className = 'planet-quick-btn';
            btn.style.cssText = `
                padding: 8px 12px;
                background: rgba(253, 184, 19, 0.1);
                border: 1px solid rgba(253, 184, 19, 0.3);
                color: white;
                border-radius: 6px;
                cursor: pointer;
                font-size: 12px;
                font-weight: 500;
                font-family: 'Inter', sans-serif;
                transition: all 0.3s ease;
                white-space: nowrap;
                backdrop-filter: blur(10px);
            `;
            
            btn.onmouseover = () => {
                btn.style.background = 'rgba(253, 184, 19, 0.2)';
                btn.style.borderColor = 'rgba(253, 184, 19, 0.6)';
                btn.style.transform = 'scale(1.05)';
            };
            
            btn.onmouseout = () => {
                btn.style.background = 'rgba(253, 184, 19, 0.1)';
                btn.style.borderColor = 'rgba(253, 184, 19, 0.3)';
                btn.style.transform = 'scale(1)';
            };
            
            btn.onclick = () => {
                const planet = this.planets.find(p => p.userData.key === planetKey);
                if (planet) this.selectPlanet(planet);
            };
            
            buttonsContainer.appendChild(btn);
        });
        
        // Add "Reset" button
        const resetBtn = document.createElement('button');
        resetBtn.textContent = '🔄 Réinitialiser';
        resetBtn.style.cssText = `
            padding: 8px 12px;
            background: rgba(0, 217, 255, 0.1);
            border: 1px solid rgba(0, 217, 255, 0.3);
            color: white;
            border-radius: 6px;
            cursor: pointer;
            font-size: 12px;
            font-weight: 500;
            font-family: 'Inter', sans-serif;
            transition: all 0.3s ease;
            margin-top: 8px;
            backdrop-filter: blur(10px);
        `;
        
        resetBtn.onmouseover = () => {
            resetBtn.style.background = 'rgba(0, 217, 255, 0.2)';
            resetBtn.style.borderColor = 'rgba(0, 217, 255, 0.6)';
            resetBtn.style.transform = 'scale(1.05)';
        };
        
        resetBtn.onmouseout = () => {
            resetBtn.style.background = 'rgba(0, 217, 255, 0.1)';
            resetBtn.style.borderColor = 'rgba(0, 217, 255, 0.3)';
            resetBtn.style.transform = 'scale(1)';
        };
        
        resetBtn.onclick = () => this.zoomOut();
        
        buttonsContainer.appendChild(resetBtn);
        
        this.canvas.parentElement.appendChild(buttonsContainer);
        this.quickSelectButtons = buttonsContainer;
    }

    updateQuickSelectButtons(planetKey) {
        const buttons = this.quickSelectButtons.querySelectorAll('button:not(:last-child)');
        buttons.forEach(btn => {
            const btnText = btn.textContent.toLowerCase();
            const planetName = PLANETS_DATA[planetKey].name.toLowerCase();
            
            if (btnText.includes(planetName)) {
                btn.style.background = 'rgba(253, 184, 19, 0.3)';
                btn.style.borderColor = 'rgba(253, 184, 19, 0.8)';
                btn.style.boxShadow = '0 0 15px rgba(253, 184, 19, 0.3)';
            } else {
                btn.style.background = 'rgba(253, 184, 19, 0.1)';
                btn.style.borderColor = 'rgba(253, 184, 19, 0.3)';
                btn.style.boxShadow = 'none';
            }
        });
    }

    animate = () => {
        requestAnimationFrame(this.animate);
        
        this.planets.forEach(planet => {
            planet.userData.orbitAngle += 0.0005;
            planet.position.x = Math.cos(planet.userData.orbitAngle) * planet.userData.orbitRadius;
            planet.position.z = Math.sin(planet.userData.orbitAngle) * planet.userData.orbitRadius;
            planet.rotation.x += 0.0008;
            planet.rotation.y += 0.0012;
        });
        
        this.sun.rotation.y += 0.0004;
        
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }

    onWindowResize() {
        const width = this.canvas.clientWidth;
        const height = this.canvas.clientHeight;
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }
}

// ===== EXPLORER 3D SCENE - ULTRA PREMIUM VERSION =====
class ExplorerScene {
    constructor() {
        this.canvas = document.getElementById('canvas-explorer');
        if (!this.canvas) return;
        
        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.Fog(0x000000, 100, 1000);
        this.camera = new THREE.PerspectiveCamera(
            75,
            this.canvas.clientWidth / this.canvas.clientHeight,
            0.1,
            1000
        );
        this.renderer = new THREE.WebGLRenderer({ 
            canvas: this.canvas, 
            antialias: true,
            preserveDrawingBuffer: true
        });
        this.textureLoader = new THREE.TextureLoader();
        this.currentAtmosphere = null;
        this.atmosphereMesh = null;
        
        this.setupRenderer();
        this.setupPostProcessing();
        this.setupLighting();
        this.createSun();
        this.setupControls();
        this.setupModelButtons();
        this.animate();
        window.addEventListener('resize', () => this.onWindowResize());
    }

    setupRenderer() {
        this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setClearColor(0x000000);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFShadowShadowMap;
        this.camera.position.z = 3;
    }

    setupPostProcessing() {
        this.composer = new EffectComposer(this.renderer);
        const renderPass = new RenderPass(this.scene, this.camera);
        this.composer.addPass(renderPass);
        
        this.bloomPass = new UnrealBloomPass(
            new THREE.Vector2(this.canvas.clientWidth, this.canvas.clientHeight),
            2,
            1,
            0.8
        );
        this.composer.addPass(this.bloomPass);
    }

    setupLighting() {
        // Point light from camera direction for better surface detail
        this.mainLight = new THREE.PointLight(0xFFFFFF, 2);
        this.mainLight.position.set(5, 3, 5);
        this.mainLight.castShadow = true;
        this.mainLight.shadow.mapSize.width = 2048;
        this.mainLight.shadow.mapSize.height = 2048;
        this.scene.add(this.mainLight);
        
        // Colored rim light for atmosphere glow
        this.rimLight = new THREE.PointLight(0x00FFFF, 0.5);
        this.rimLight.position.set(-5, 0, 0);
        this.scene.add(this.rimLight);
        
        // Ambient light
        const ambientLight = new THREE.AmbientLight(0x333333, 1.5);
        this.scene.add(ambientLight);
    }

    createTexturedPlanet(planetKey) {
        const config = MODELS_CONFIG[planetKey];
        const segments = config.segments || 64;
        
        // Create high-detail sphere
        const geometry = new THREE.IcosahedronGeometry(config.scale, segments);
        
        const material = new THREE.MeshStandardMaterial({
            color: config.fallbackColor,
            metalness: 0.3,
            roughness: 0.8,
            side: THREE.FrontSide,
            flatShading: false
        });
        
        // Load main texture
        if (config.textureUrl) {
            this.textureLoader.load(
                config.textureUrl,
                (texture) => {
                    texture.encoding = THREE.sRGBEncoding;
                    material.map = texture;
                    material.needsUpdate = true;
                },
                undefined,
                (error) => console.log('Texture load error:', error)
            );
        }
        
        // Load normal map if available
        if (config.normalUrl) {
            this.textureLoader.load(
                config.normalUrl,
                (normalMap) => {
                    material.normalMap = normalMap;
                    material.normalScale.set(0.5, 0.5);
                    material.needsUpdate = true;
                },
                undefined,
                (error) => console.log('Normal map load error:', error)
            );
        }
        
        // Special handling for Sun
        if (planetKey === 'sun') {
            material.emissive.setHex(0xFDB813);
            material.emissiveIntensity = 1.2;
            material.metalness = 0.8;
            material.roughness = 0.2;
        }
        
        const planet = new THREE.Mesh(geometry, material);
        planet.castShadow = true;
        planet.receiveShadow = true;
        
        return planet;
    }

    addAtmosphere(planetKey) {
        // Remove old atmosphere
        if (this.atmosphereMesh) {
            this.scene.remove(this.atmosphereMesh);
            this.atmosphereMesh = null;
        }
        
        const config = MODELS_CONFIG[planetKey];
        if (!config.hasAtmosphere) return;
        
        const atmosphereGeometry = new THREE.IcosahedronGeometry(config.scale * 1.1, 32);
        const atmosphereMaterial = new THREE.ShaderMaterial({
            uniforms: {
                atmosphereColor: { value: new THREE.Color(config.atmosphereColor || 0x4A90E2) },
                atmosphereIntensity: { value: 0.3 }
            },
            vertexShader: ATMOSPHERE_SHADER.vertexShader,
            fragmentShader: ATMOSPHERE_SHADER.fragmentShader,
            transparent: true,
            side: THREE.BackSide
        });
        
        this.atmosphereMesh = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
        this.scene.add(this.atmosphereMesh);
    }

    createSun() {
        if (this.currentModel) {
            this.scene.remove(this.currentModel);
        }
        
        this.currentModel = this.createTexturedPlanet('sun');
        this.scene.add(this.currentModel);
        
        this.addAtmosphere('sun');
        
        // Adjust rim light for sun
        this.rimLight.color.setHex(0xFFD700);
        this.rimLight.intensity = 1;
        
        document.getElementById('model-title').textContent = 'The Sun';
    }

    setupControls() {
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.autoRotate = true;
        this.controls.autoRotateSpeed = 2;
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.enableZoom = true;
        this.controls.autoRotateSpeed = 1.5;
    }

    setupModelButtons() {
        document.querySelectorAll('.model-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.model-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.switchModel(e.target.dataset.planet);
            });
        });
    }

    switchModel(planet) {
        if (this.currentModel) {
            this.scene.remove(this.currentModel);
        }
        
        // Remove rings and atmosphere
        const rings = this.scene.getObjectByName('saturn-rings');
        if (rings) {
            this.scene.remove(rings);
        }
        
        if (this.atmosphereMesh) {
            this.scene.remove(this.atmosphereMesh);
            this.atmosphereMesh = null;
        }
        
        const config = MODELS_CONFIG[planet];
        this.currentModel = this.createTexturedPlanet(planet);
        this.scene.add(this.currentModel);
        
        // Add atmosphere if available
        this.addAtmosphere(planet);
        
        // Add Saturn rings
        if (planet === 'saturn') {
            this.addSaturnRings();
        }
        
        // Adjust lighting for planet type
        if (planet === 'earth') {
            this.rimLight.color.setHex(0x00AAFF);
            this.rimLight.intensity = 0.8;
        } else if (planet === 'mars') {
            this.rimLight.color.setHex(0xFF6B4A);
            this.rimLight.intensity = 0.6;
        } else if (planet === 'jupiter') {
            this.rimLight.color.setHex(0xFFB347);
            this.rimLight.intensity = 0.7;
        } else {
            this.rimLight.color.setHex(0x00FFFF);
            this.rimLight.intensity = 0.5;
        }
        
        document.getElementById('model-title').textContent = config.name;
    }

    addSaturnRings() {
        // Create Saturn's rings with improved appearance
        const innerRadius = 2.5;
        const outerRadius = 4;
        const geometry = new THREE.RingGeometry(innerRadius, outerRadius, 128);
        
        // Try to load Saturn ring texture first
        const material = new THREE.MeshStandardMaterial({
            color: 0xE8D9C1,
            transparent: true,
            metalness: 0.3,
            roughness: 0.7,
            side: THREE.DoubleSide
        });
        
        // Try loading ring texture
        this.textureLoader.load(
            'https://cdn.jsdelivr.net/npm/three@r128/examples/textures/planets/saturn_ring_alpha.png',
            (texture) => {
                material.alphaMap = texture;
                material.needsUpdate = true;
            },
            undefined,
            () => {
                // Fallback: create procedural ring pattern
                const canvas = document.createElement('canvas');
                canvas.width = 512;
                canvas.height = 512;
                const ctx = canvas.getContext('2d');
                
                // Radial gradient for rings
                for (let i = 0; i < canvas.width; i++) {
                    for (let j = 0; j < canvas.height; j++) {
                        const x = (i - canvas.width/2) / canvas.width;
                        const y = (j - canvas.height/2) / canvas.height;
                        const dist = Math.sqrt(x*x + y*y);
                        
                        if (dist > 0.15 && dist < 0.45) {
                            const brightness = Math.sin(dist * 40 + Math.random() * 5) * 64 + 180;
                            const alpha = Math.cos((dist - 0.15) * Math.PI) * 200;
                            ctx.fillStyle = `rgba(232, 217, 193, ${alpha/255})`;
                            ctx.fillRect(i, j, 1, 1);
                        }
                    }
                }
                
                const texture = new THREE.CanvasTexture(canvas);
                material.alphaMap = texture;
                material.needsUpdate = true;
            }
        );
        
        const rings = new THREE.Mesh(geometry, material);
        rings.name = 'saturn-rings';
        rings.rotation.x = Math.PI / 3.2;
        rings.receiveShadow = true;
        this.scene.add(rings);
    }

    animate = () => {
        requestAnimationFrame(this.animate);
        
        if (this.currentModel) {
            this.currentModel.rotation.y += 0.002;
            
            // Rotate atmosphere with planet
            if (this.atmosphereMesh) {
                this.atmosphereMesh.rotation.y += 0.002;
            }
        }
        
        // Update rim light position to follow camera
        const angle = this.controls ? this.controls.getAzimuthalAngle() : 0;
        this.rimLight.position.x = Math.cos(angle) * -5;
        this.rimLight.position.z = Math.sin(angle) * -5;
        
        this.controls.update();
        this.composer.render();
    }

    onWindowResize() {
        const width = this.canvas.clientWidth;
        const height = this.canvas.clientHeight;
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
        this.composer.setSize(width, height);
    }
}

// ===== ANIMATIONS =====
function initAnimations() {
    gsap.registerPlugin(ScrollTrigger);
    
    // Section reveals
    const sections = document.querySelectorAll(
        '.discovery-section, .planets-section, .explorer-section, .about-section, .contact-section'
    );
    sections.forEach(section => {
        gsap.from(section, {
            scrollTrigger: {
                trigger: section,
                start: 'top 80%',
            },
            opacity: 0,
            y: 50,
            duration: 1
        });
    });

    // Planet cards
    document.querySelectorAll('.planet-card').forEach((card, index) => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: 'top 90%',
            },
            opacity: 0,
            y: 30,
            rotation: -5,
            duration: 0.8,
            delay: index * 0.1
        });

        card.addEventListener('mouseenter', function() {
            gsap.to(this, { y: -10, duration: 0.3, scale: 1.05 });
        });
        card.addEventListener('mouseleave', function() {
            gsap.to(this, { y: 0, duration: 0.3, scale: 1 });
        });
    });

    // About cards
    document.querySelectorAll('.about-card').forEach((card, index) => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: 'top 90%',
            },
            opacity: 0,
            x: (index % 2 === 0 ? -50 : 50),
            duration: 0.8,
            delay: index * 0.1
        });
    });
}

// ===== CURSOR =====
function initCursor() {
    const cursor = document.querySelector('.cursor');
    const cursorFollower = document.querySelector('.cursor-follower');
    
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
        
        setTimeout(() => {
            cursorFollower.style.left = e.clientX + 'px';
            cursorFollower.style.top = e.clientY + 'px';
        }, 100);
    });

    document.querySelectorAll('a, button, input, textarea').forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.transform = 'scale(1.5)';
            cursor.style.borderColor = '#00d9ff';
        });
        el.addEventListener('mouseleave', () => {
            cursor.style.transform = 'scale(1)';
            cursor.style.borderColor = '#a855f7';
        });
    });
}

// ===== BUTTON INTERACTIONS =====
function initButtonInteractions() {
    document.querySelectorAll('.cta-button').forEach(button => {
        button.addEventListener('click', function(e) {
            gsap.to(this, { scaleY: 0.95, yoyo: true, repeat: 1, duration: 0.1 });
            const ripple = document.createElement('span');
            ripple.className = 'ripple';
            ripple.style.left = (e.clientX - this.getBoundingClientRect().left) + 'px';
            ripple.style.top = (e.clientY - this.getBoundingClientRect().top) + 'px';
            this.appendChild(ripple);
            setTimeout(() => ripple.remove(), 600);
        });

        button.addEventListener('mouseenter', function() {
            gsap.to(this, { y: -5, duration: 0.3, boxShadow: '0 20px 40px rgba(0, 217, 255, 0.4)' });
        });
        button.addEventListener('mouseleave', function() {
            gsap.to(this, { y: 0, duration: 0.3 });
        });
    });
}

// ===== FORM =====
function initContactForm() {
    const form = document.querySelector('.contact-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        gsap.to(form, {
            opacity: 0, duration: 0.3, onComplete: () => {
                form.style.display = 'none';
                const success = document.createElement('div');
                success.className = 'success-message';
                success.innerHTML = '✓ Message sent successfully!';
                form.parentElement.appendChild(success);
                gsap.from(success, { opacity: 0, y: 20, duration: 0.5 });
            }
        });
    });
}

// ===== MOBILE MENU =====
function initMobileMenu() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (!navToggle) return;

    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
    });

    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        });
    });
}

// ===== SCROLL TRACKING =====
function initScrollTracking() {
    window.addEventListener('scroll', () => {
        const scrollProgress = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
    });
}

// ===== INITIALIZATION =====
function init() {
    console.log('🌍 Solar System Explorer initializing...');
    
    initStars();
    initCursor();
    initAnimations();
    initButtonInteractions();
    initContactForm();
    initMobileMenu();
    initScrollTracking();
    
    new HeroScene();
    new SolarSystemScene();
    new ExplorerScene();

    console.log('✅ Solar System fully initialized');
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
