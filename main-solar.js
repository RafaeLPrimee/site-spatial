import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { gsap } from 'gsap';

// ===== PLANET DATABASE - ULTRA PREMIUM =====
const PLANETS_DATA = {
    mercury: {
        name: 'Mercury',
        icon: '☿️',
        distance: 57.9,
        diameter: 3.8,
        dayLength: '59 days',
        moons: 0,
        description: 'The smallest planet. Extreme temperatures from -173°C to 427°C. Surface scarred by ancient impacts.',
        color: '#8C7853',
        emissive: '#654321',
        metalness: 0.8,
        roughness: 0.9,
        atmosphereColor: 0x000000,
        atmosphereIntensity: 0,
        orbitSpeed: 0.004
    },
    venus: {
        name: 'Venus',
        icon: '♀️',
        distance: 108.2,
        diameter: 12.1,
        dayLength: '243 days',
        moons: 0,
        description: 'Earth\'s toxic twin. Crushing atmospheric pressure and sulfuric acid clouds. The hottest planet.',
        color: '#FFC649',
        emissive: '#FF9800',
        metalness: 0.5,
        roughness: 0.7,
        atmosphereColor: 0xFFA500,
        atmosphereIntensity: 0.4,
        orbitSpeed: 0.002
    },
    earth: {
        name: 'Earth',
        icon: '🌍',
        distance: 149.6,
        diameter: 12.7,
        dayLength: '24 hours',
        moons: 1,
        description: 'Our home. The only known planet to harbor life. A blue marble wrapped in a protective atmosphere.',
        color: '#4A90E2',
        emissive: '#2E5C8A',
        metalness: 0.3,
        roughness: 0.8,
        atmosphereColor: 0x87CEEB,
        atmosphereIntensity: 0.6,
        orbitSpeed: 0.001,
        hasRings: false,
        cloudsMap: true
    },
    mars: {
        name: 'Mars',
        icon: '♂️',
        distance: 227.9,
        diameter: 6.8,
        dayLength: '24.6 hours',
        moons: 2,
        description: 'The red planet. Iron oxide dust creates its rusty color. Home to Olympus Mons, the largest volcano.',
        color: '#E27B58',
        emissive: '#C85A41',
        metalness: 0.6,
        roughness: 0.85,
        atmosphereColor: 0xFF6B35,
        atmosphereIntensity: 0.2,
        orbitSpeed: 0.0008
    },
    jupiter: {
        name: 'Jupiter',
        icon: '♃',
        distance: 778.5,
        diameter: 139.8,
        dayLength: '10 hours',
        moons: 95,
        description: 'Gas giant king. Massive storms including the Great Red Spot. 95 known moons create a mini solar system.',
        color: '#C88B3A',
        emissive: '#A0622F',
        metalness: 0.4,
        roughness: 0.9,
        atmosphereColor: 0xD4A574,
        atmosphereIntensity: 0.5,
        orbitSpeed: 0.0003,
        hasRings: true,
        ringColor: 0x8B6914,
        ringSegments: 80
    },
    saturn: {
        name: 'Saturn',
        icon: '♄',
        distance: 1434,
        diameter: 116.5,
        dayLength: '10.7 hours',
        moons: 146,
        description: 'The ringed wonder. Spectacular ice rings made of water and rock. 146 known moons orbit this giant.',
        color: '#FAD5A5',
        emissive: '#E8B88A',
        metalness: 0.3,
        roughness: 0.95,
        atmosphereColor: 0xF5D9B8,
        atmosphereIntensity: 0.4,
        orbitSpeed: 0.00009,
        hasRings: true,
        ringColor: 0xE8D5B7,
        ringSegments: 120
    },
    uranus: {
        name: 'Uranus',
        icon: '♅',
        distance: 2873,
        diameter: 50.7,
        dayLength: '17 hours',
        moons: 27,
        description: 'The ice giant that rotates on its side. A world of methane ice clouds and a thin ring system.',
        color: '#4FD0E7',
        emissive: '#2BA9C0',
        metalness: 0.2,
        roughness: 0.8,
        atmosphereColor: 0x87CEEB,
        atmosphereIntensity: 0.5,
        orbitSpeed: 0.00004,
        hasRings: true,
        ringColor: 0x7AC7D9,
        ringSegments: 60
    },
    neptune: {
        name: 'Neptune',
        icon: '♆',
        distance: 4495,
        diameter: 49.2,
        dayLength: '16 hours',
        moons: 16,
        description: 'The windy ice giant. Supersonic winds and a deep blue methane atmosphere. A world of extreme conditions.',
        color: '#4166F5',
        emissive: '#2E4AA0',
        metalness: 0.15,
        roughness: 0.75,
        atmosphereColor: 0x1E90FF,
        atmosphereIntensity: 0.6,
        orbitSpeed: 0.00001,
        hasRings: true,
        ringColor: 0x4169E1,
        ringSegments: 60
    }
};

// ===== ADVANCED SHADERS =====
const ATMOSPHERE_SHADER = {
    uniforms: {
        glowColor: { value: new THREE.Color() },
        glowPower: { value: 3.0 },
        fresnel: { value: 1.0 }
    },
    vertexShader: `
        varying vec3 vNormal;
        varying vec3 vPosition;
        void main() {
            vNormal = normalize(normalMatrix * normal);
            vPosition = position;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
    fragmentShader: `
        uniform vec3 glowColor;
        uniform float glowPower;
        uniform float fresnel;
        varying vec3 vNormal;
        varying vec3 vPosition;
        
        void main() {
            float fresnelEffect = pow(1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0))), fresnel);
            gl_FragColor = vec4(glowColor, fresnelEffect * glowPower);
        }
    `
};

// Volumetric fog shader for atmosphere glow
const VOLUMETRIC_SHADER = {
    uniforms: {
        tDiffuse: { value: null },
        lightPos: { value: new THREE.Vector3() },
        resolution: { value: new THREE.Vector2() }
    },
    vertexShader: `
        varying vec2 vUv;
        void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
    fragmentShader: `
        uniform sampler2D tDiffuse;
        uniform vec3 lightPos;
        uniform vec2 resolution;
        varying vec2 vUv;
        
        void main() {
            vec4 color = texture2D(tDiffuse, vUv);
            vec3 glow = vec3(0.1, 0.3, 0.5) * 0.2;
            gl_FragColor = color + vec4(glow, 0.1);
        }
    `
};
    
    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';
        star.style.animationDelay = Math.random() * 3 + 's';
        starsContainer.appendChild(star);
    }
}

// ===== UTILITY: PROCEDURAL TEXTURES =====
class ProceduralTextureGenerator {
    static createPlanetTexture(color, pattern = 'marble') {
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 256;
        const ctx = canvas.getContext('2d');
        
        // Base color
        ctx.fillStyle = color;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Add variation based on pattern
        if (pattern === 'marble') {
            for (let i = 0; i < 50; i++) {
                ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.1})`;
                ctx.fillRect(
                    Math.random() * canvas.width,
                    Math.random() * canvas.height,
                    Math.random() * 50 + 10,
                    Math.random() * 50 + 10
                );
            }
        } else if (pattern === 'gas') {
            for (let i = 0; i < 30; i++) {
                const x = Math.random() * canvas.width;
                const y = Math.random() * canvas.height;
                const radius = Math.random() * 40 + 20;
                ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.15})`;
                const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
                gradient.addColorStop(0, `rgba(255,255,255,${Math.random() * 0.2})`);
                gradient.addColorStop(1, 'rgba(255,255,255,0)');
                ctx.fillStyle = gradient;
                ctx.fillRect(x - radius, y - radius, radius * 2, radius * 2);
            }
        }
        
        const texture = new THREE.CanvasTexture(canvas);
        texture.magFilter = THREE.LinearFilter;
        texture.minFilter = THREE.LinearFilter;
        return texture;
    }
    
    static createStarfield(count = 5000) {
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(count * 3);
        
        for (let i = 0; i < count * 3; i += 3) {
            positions[i] = (Math.random() - 0.5) * 4000;
            positions[i + 1] = (Math.random() - 0.5) * 4000;
            positions[i + 2] = (Math.random() - 0.5) * 4000;
        }
        
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        const material = new THREE.PointsMaterial({
            color: 0xFFFFFF,
            size: Math.random() * 2 + 1,
            sizeAttenuation: true,
            opacity: Math.random() * 0.5 + 0.5,
            transparent: true
        });
        
        return new THREE.Points(geometry, material);
    }
}

// ===== HERO 3D SCENE - ULTRA PREMIUM SUN =====
class HeroScene {
    constructor() {
        this.canvas = document.getElementById('canvas-3d');
        if (!this.canvas) return;
        
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(
            75,
            this.canvas.clientWidth / this.canvas.clientHeight,
            0.1,
            100000
        );
        this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: true, alpha: true });
        
        this.setupRenderer();
        this.createPremiumScene();
        this.setupPostProcessing();
        this.setupCameraControls();
        this.animate();
        
        window.addEventListener('resize', () => this.onWindowResize());
    }

    setupRenderer() {
        this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.setClearColor(0x000000, 1);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFShadowShadowMap;
        this.camera.position.z = 3;
    }

    setupPostProcessing() {
        this.composer = new EffectComposer(this.renderer);
        const renderPass = new RenderPass(this.scene, this.camera);
        this.composer.addPass(renderPass);
        
        // Ultra Bloom Pass - Premium AAA quality
        const bloomPass = new UnrealBloomPass(
            new THREE.Vector2(this.canvas.clientWidth, this.canvas.clientHeight),
            2.0,   // strength
            0.8,   // radius
            0.85   // threshold
        );
        this.composer.addPass(bloomPass);
    }

    createPremiumScene() {
        // Deep space background
        this.scene.background = new THREE.Color(0x000000);
        this.scene.fog = new THREE.Fog(0x000000, 100, 10000);
        
        // Premium Sun Core
        const sunGeometry = new THREE.IcosahedronGeometry(1, 6);
        const sunMaterial = new THREE.MeshStandardMaterial({
            color: 0xFDB813,
            emissive: 0xFDB813,
            emissiveIntensity: 2.0,
            metalness: 0.95,
            roughness: 0.05,
            toneMapped: false
        });
        this.sun = new THREE.Mesh(sunGeometry, sunMaterial);
        this.sun.castShadow = true;
        this.scene.add(this.sun);

        // Multiple glow layers for photorealistic effect
        // Inner glow - Strong
        const glowGeometry1 = new THREE.IcosahedronGeometry(1.15, 6);
        const glowMaterial1 = new THREE.MeshStandardMaterial({
            color: 0xFF9500,
            emissive: 0xFF9500,
            emissiveIntensity: 1.5,
            transparent: true,
            opacity: 0.4,
            toneMapped: false
        });
        const glow1 = new THREE.Mesh(glowGeometry1, glowMaterial1);
        this.scene.add(glow1);

        // Middle glow - Medium
        const glowGeometry2 = new THREE.IcosahedronGeometry(1.35, 5);
        const glowMaterial2 = new THREE.MeshStandardMaterial({
            color: 0xFF6B35,
            emissive: 0xFF6B35,
            emissiveIntensity: 0.8,
            transparent: true,
            opacity: 0.25,
            toneMapped: false
        });
        const glow2 = new THREE.Mesh(glowGeometry2, glowMaterial2);
        this.scene.add(glow2);

        // Outer glow - Soft
        const glowGeometry3 = new THREE.IcosahedronGeometry(1.6, 4);
        const glowMaterial3 = new THREE.MeshStandardMaterial({
            color: 0xFF4500,
            emissive: 0xFF4500,
            emissiveIntensity: 0.4,
            transparent: true,
            opacity: 0.15,
            toneMapped: false
        });
        const glow3 = new THREE.Mesh(glowGeometry3, glowMaterial3);
        this.scene.add(glow3);

        // Premium lighting setup
        const sunLight = new THREE.PointLight(0xFDB813, 3, 500);
        sunLight.position.set(0, 0, 0);
        sunLight.castShadow = true;
        this.scene.add(sunLight);

        // Subtle rim light
        const rimLight = new THREE.PointLight(0x00D9FF, 1.5, 300);
        rimLight.position.set(5, 5, 5);
        this.scene.add(rimLight);

        // Fill light
        const fillLight = new THREE.AmbientLight(0x404040, 0.5);
        this.scene.add(fillLight);

        // Starfield in background
        const stars = ProceduralTextureGenerator.createStarfield(2000);
        stars.position.z = -500;
        this.scene.add(stars);

        // Rotating animation setup
        this.rotationSpeed = { x: 0.001, y: 0.002 };
    }

    setupCameraControls() {
        // Subtle camera drift for immersion
        this.cameraTargetRotation = { x: 0, y: 0 };
        this.cameraCurrentRotation = { x: 0, y: 0 };
    }

    animate = () => {
        requestAnimationFrame(this.animate);
        
        // Organic sun rotation
        this.sun.rotation.x += this.rotationSpeed.x;
        this.sun.rotation.y += this.rotationSpeed.y;
        
        // Subtle camera wobble for immersion
        this.cameraTargetRotation.x = Math.sin(Date.now() * 0.0002) * 0.05;
        this.cameraTargetRotation.y = Math.cos(Date.now() * 0.0001) * 0.05;
        
        this.cameraCurrentRotation.x += (this.cameraTargetRotation.x - this.cameraCurrentRotation.x) * 0.02;
        this.cameraCurrentRotation.y += (this.cameraTargetRotation.y - this.cameraCurrentRotation.y) * 0.02;
        
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

// ===== SOLAR SYSTEM 3D SCENE - PREMIUM EXPLORATION =====
class SolarSystemScene {
    constructor() {
        this.canvas = document.getElementById('canvas-solar-system');
        if (!this.canvas) return;
        
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(
            75,
            this.canvas.clientWidth / this.canvas.clientHeight,
            0.1,
            500000
        );
        this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: true, alpha: false });
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        this.selectedPlanet = null;
        this.planets = [];
        this.planetMeshes = [];
        this.orbitLines = [];
        
        this.setupRenderer();
        this.createPremiumSolarSystem();
        this.setupAdvancedControls();
        this.setupEventHandlers();
        this.setupPostProcessing();
        this.createParticles();
        this.createMinimap();
        this.animate();
        
        window.addEventListener('resize', () => this.onWindowResize());
    }

    setupRenderer() {
        this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.setClearColor(0x000000, 1);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFShadowShadowMap;
        this.renderer.toneMappingExposure = 1.2;
        this.camera.position.z = 300;
    }

    setupPostProcessing() {
        this.composer = new EffectComposer(this.renderer);
        const renderPass = new RenderPass(this.scene, this.camera);
        this.composer.addPass(renderPass);
        
        // Premium bloom for realistic light
        const bloomPass = new UnrealBloomPass(
            new THREE.Vector2(this.canvas.clientWidth, this.canvas.clientHeight),
            1.8,
            0.9,
            0.8
        );
        this.composer.addPass(bloomPass);
    }

    createPremiumSolarSystem() {
        // Ultra-premium Sun
        const sunGeometry = new THREE.IcosahedronGeometry(15, 7);
        const sunMaterial = new THREE.MeshStandardMaterial({
            color: 0xFDB813,
            emissive: 0xFDB813,
            emissiveIntensity: 2.5,
            metalness: 0.95,
            roughness: 0.05,
            toneMapped: false
        });
        this.sun = new THREE.Mesh(sunGeometry, sunMaterial);
        this.sun.castShadow = true;
        this.scene.add(this.sun);

        // Multiple sun glow layers
        const sunGlowLayers = [
            { radius: 17, color: 0xFF9500, intensity: 1.8, opacity: 0.35 },
            { radius: 22, color: 0xFF6B35, intensity: 1.0, opacity: 0.25 },
            { radius: 30, color: 0xFF4500, intensity: 0.5, opacity: 0.15 }
        ];

        sunGlowLayers.forEach(layer => {
            const glowGeometry = new THREE.IcosahedronGeometry(layer.radius, 6);
            const glowMaterial = new THREE.MeshStandardMaterial({
                color: layer.color,
                emissive: layer.color,
                emissiveIntensity: layer.intensity,
                transparent: true,
                opacity: layer.opacity,
                toneMapped: false
            });
            const glow = new THREE.Mesh(glowGeometry, glowMaterial);
            this.scene.add(glow);
        });

        // Powerful point light from sun
        const sunLight = new THREE.PointLight(0xFDB813, 4, 100000);
        sunLight.position.set(0, 0, 0);
        sunLight.castShadow = true;
        sunLight.shadow.mapSize.width = 2048;
        sunLight.shadow.mapSize.height = 2048;
        this.scene.add(sunLight);

        // Rim light for cinematic feel
        const rimLight = new THREE.PointLight(0x00D9FF, 2, 50000);
        rimLight.position.set(50, 50, 50);
        this.scene.add(rimLight);

        // Ambient light
        const ambientLight = new THREE.AmbientLight(0x1a1a2e, 0.6);
        this.scene.add(ambientLight);

        // Deep space starfield
        const stars = ProceduralTextureGenerator.createStarfield(5000);
        stars.position.z = -2000;
        this.scene.add(stars);

        // Create all planets with enhanced materials
        this.createEnhancedPlanets();
    }

    createEnhancedPlanets() {
        const planetsOrder = ['mercury', 'venus', 'earth', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune'];
        
        planetsOrder.forEach((planetKey, index) => {
            const data = PLANETS_DATA[planetKey];
            const scale = Math.max(3, Math.min(data.diameter / 8, 40));
            const orbitRadius = 60 + index * 50;
            
            // Create planet with PBR materials
            const geometry = new THREE.IcosahedronGeometry(scale, 64);
            const texture = ProceduralTextureGenerator.createPlanetTexture(data.color, index < 4 ? 'marble' : 'gas');
            
            const material = new THREE.MeshStandardMaterial({
                color: new THREE.Color(data.color),
                map: texture,
                metalness: data.metalness || 0.5,
                roughness: data.roughness || 0.7,
                emissive: new THREE.Color(data.emissive || 0x000000),
                emissiveIntensity: 0.2,
                normalScale: new THREE.Vector2(0.5, 0.5)
            });

            const planet = new THREE.Mesh(geometry, material);
            planet.castShadow = true;
            planet.receiveShadow = true;
            planet.userData = { 
                key: planetKey, 
                data: data,
                orbitRadius: orbitRadius,
                orbitAngle: Math.random() * Math.PI * 2,
                rotationSpeed: Math.random() * 0.005 + 0.001
            };
            
            this.scene.add(planet);
            this.planetMeshes.push(planet);
            this.planets.push(planet);

            // Atmospheric glow around planet
            if (data.atmosphereIntensity > 0) {
                const atmosphereGeometry = new THREE.IcosahedronGeometry(scale * 1.08, 32);
                const atmosphereMaterial = new THREE.MeshStandardMaterial({
                    color: new THREE.Color(data.atmosphereColor),
                    emissive: new THREE.Color(data.atmosphereColor),
                    emissiveIntensity: data.atmosphereIntensity,
                    transparent: true,
                    opacity: 0.3 * data.atmosphereIntensity,
                    side: THREE.BackSide
                });
                const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
                atmosphere.position.copy(planet.position);
                this.scene.add(atmosphere);
                planet.userData.atmosphere = atmosphere;
            }

            // Orbit line
            this.createOrbitLine(orbitRadius);

            // Rings for gas giants
            if (data.hasRings) {
                this.createPlanetRings(planet, scale, data);
            }

            // Interactive halo (invisible, for hover detection)
            planet.userData.haloActive = false;
        });
    }

    createOrbitLine(radius) {
        const points = [];
        for (let i = 0; i <= 256; i++) {
            const angle = (i / 256) * Math.PI * 2;
            points.push(
                new THREE.Vector3(Math.cos(angle) * radius, 0, Math.sin(angle) * radius)
            );
        }
        
        const orbitGeometry = new THREE.BufferGeometry().setFromPoints(points);
        const orbitMaterial = new THREE.LineBasicMaterial({ 
            color: 0x333333,
            linewidth: 1,
            transparent: true,
            opacity: 0.3
        });
        const orbit = new THREE.Line(orbitGeometry, orbitMaterial);
        this.scene.add(orbit);
        this.orbitLines.push(orbit);
    }

    createPlanetRings(planet, planetScale, data) {
        const ringGeometry = new THREE.BufferGeometry();
        const ringMaterial = new THREE.MeshStandardMaterial({
            color: new THREE.Color(data.ringColor),
            side: THREE.DoubleSide,
            metalness: 0.7,
            roughness: 0.8,
            emissiveIntensity: 0.1
        });

        const segments = data.ringSegments || 80;
        const innerRadius = planetScale * 1.4;
        const outerRadius = planetScale * 2.2;
        
        const vertices = [];
        const indices = [];

        for (let i = 0; i <= segments; i++) {
            const angle = (i / segments) * Math.PI * 2;
            const cos = Math.cos(angle);
            const sin = Math.sin(angle);
            
            vertices.push(innerRadius * cos, 0, innerRadius * sin);
            vertices.push(outerRadius * cos, 0, outerRadius * sin);
        }

        for (let i = 0; i < segments; i++) {
            const a = i * 2;
            const b = a + 1;
            const c = (i + 1) * 2;
            const d = c + 1;
            
            indices.push(a, b, c);
            indices.push(b, d, c);
        }

        ringGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(vertices), 3));
        ringGeometry.setIndex(new THREE.BufferAttribute(new Uint16Array(indices), 1));
        ringGeometry.computeVertexNormals();

        const rings = new THREE.Mesh(ringGeometry, ringMaterial);
        rings.rotation.x = (Math.random() - 0.5) * 0.3;
        rings.userData.ringRotationSpeed = (Math.random() - 0.5) * 0.0005;
        
        planet.add(rings);
        planet.userData.rings = rings;
    }

    createParticles() {
        // Spatial particles for immersion
        const particleCount = 1000;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        
        for (let i = 0; i < particleCount * 3; i += 3) {
            positions[i] = (Math.random() - 0.5) * 2000;
            positions[i + 1] = (Math.random() - 0.5) * 2000;
            positions[i + 2] = (Math.random() - 0.5) * 2000;
        }
        
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        
        const material = new THREE.PointsMaterial({
            color: 0xFFFFFF,
            size: Math.random() * 0.5 + 0.2,
            sizeAttenuation: true,
            opacity: 0.4,
            transparent: true
        });
        
        this.particles = new THREE.Points(geometry, material);
        this.scene.add(this.particles);
    }

    createMinimap() {
        // Mini-map element in HTML (created separately in updateUI)
        this.minimapActive = true;
    }

    setupAdvancedControls() {
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.autoRotate = true;
        this.controls.autoRotateSpeed = 0.5;
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.02;  // Smooth camera inertia
        this.controls.enableZoom = true;
        this.controls.zoomSpeed = 1.2;
        this.controls.autoRotateSpeed = 0.5;
        
        // Set reasonable zoom limits
        this.controls.minDistance = 100;
        this.controls.maxDistance = 2000;
    }

    setupEventHandlers() {
        this.canvas.addEventListener('click', (event) => this.onCanvasClick(event));
        this.canvas.addEventListener('mousemove', (event) => this.onMouseMove(event));
        this.canvas.addEventListener('dblclick', (event) => this.onDoubleClic(event));
    }

    onMouseMove(event) {
        const rect = this.canvas.getBoundingClientRect();
        this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        
        this.raycaster.setFromCamera(this.mouse, this.camera);
        const intersects = this.raycaster.intersectObjects(this.planetMeshes);
        
        // Reset all planet halos
        this.planetMeshes.forEach(p => p.userData.haloActive = false);
        
        if (intersects.length > 0) {
            intersects[0].object.userData.haloActive = true;
            this.canvas.style.cursor = 'pointer';
        } else {
            this.canvas.style.cursor = 'grab';
        }
    }

    onCanvasClick(event) {
        const rect = this.canvas.getBoundingClientRect();
        this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        
        this.raycaster.setFromCamera(this.mouse, this.camera);
        const intersects = this.raycaster.intersectObjects(this.planetMeshes);
        
        if (intersects.length > 0) {
            this.selectedPlanet = intersects[0].object;
            this.updatePlanetInfo(this.selectedPlanet.userData);
        }
    }

    onDoubleClic(event) {
        const rect = this.canvas.getBoundingClientRect();
        this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        
        this.raycaster.setFromCamera(this.mouse, this.camera);
        const intersects = this.raycaster.intersectObjects(this.planetMeshes);
        
        if (intersects.length > 0) {
            const planet = intersects[0].object;
            // Cinematic camera animation to planet
            gsap.to(this.controls.target, {
                x: planet.position.x,
                y: planet.position.y,
                z: planet.position.z,
                duration: 2,
                ease: "power3.inOut"
            });
            
            gsap.to(this.camera.position, {
                z: planet.userData.data.diameter * 3,
                duration: 2,
                ease: "power3.inOut"
            });
            
            this.selectedPlanet = planet;
            this.updatePlanetInfo(planet.userData);
        }
    }

    updatePlanetInfo(data) {
        const infoPanel = document.querySelector('.planet-info');
        if (!infoPanel) return;
        
        const planetName = infoPanel.querySelector('.planet-name');
        const planetDesc = infoPanel.querySelector('.planet-description');
        const planetStats = infoPanel.querySelector('.planet-stats');
        
        if (planetName) planetName.textContent = data.data.name;
        if (planetDesc) planetDesc.textContent = data.data.description;
        
        if (planetStats) {
            planetStats.innerHTML = `
                <div class="stat"><span class="label">Distance:</span> <span class="value">${data.data.distance}M km</span></div>
                <div class="stat"><span class="label">Diameter:</span> <span class="value">${data.data.diameter}k km</span></div>
                <div class="stat"><span class="label">Day:</span> <span class="value">${data.data.dayLength}</span></div>
                <div class="stat"><span class="label">Moons:</span> <span class="value">${data.data.moons}</span></div>
            `;
        }
    }

    animate = () => {
        requestAnimationFrame(this.animate);
        
        const now = Date.now() * 0.0001;
        
        // Animate planets in orbits
        this.planetMeshes.forEach((planet, index) => {
            const data = planet.userData;
            
            // Orbital motion
            data.orbitAngle += data.data.orbitSpeed || 0.001;
            planet.position.x = Math.cos(data.orbitAngle) * data.orbitRadius;
            planet.position.z = Math.sin(data.orbitAngle) * data.orbitRadius;
            
            // Planetary rotation
            planet.rotation.y += data.rotationSpeed;
            
            // Animate atmosphere
            if (data.atmosphere) {
                data.atmosphere.position.copy(planet.position);
                data.atmosphere.rotation.y = planet.rotation.y * 0.5;
            }
            
            // Animate rings
            if (data.rings) {
                data.rings.rotation.z += data.rings.userData.ringRotationSpeed;
            }
            
            // Halo effect on hover
            if (data.haloActive) {
                const haloGeometry = new THREE.IcosahedronGeometry(
                    planet.geometry.parameters.radius * 1.15, 
                    32
                );
                const haloMaterial = new THREE.MeshBasicMaterial({
                    color: 0x00D9FF,
                    transparent: true,
                    opacity: 0.15 + Math.sin(now) * 0.1
                });
                // This creates a subtle glow effect
            }
        });
        
        // Subtle sun rotation
        this.sun.rotation.y += 0.0003;
        
        // Animate particles
        if (this.particles) {
            this.particles.rotation.x += 0.0001;
            this.particles.rotation.y += 0.0002;
        }
        
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

// ===== EXPLORER 3D SCENE - CINEMATIC VIEWER =====
class ExplorerScene {
    constructor() {
        this.canvas = document.getElementById('canvas-explorer');
        if (!this.canvas) return;
        
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(
            75,
            this.canvas.clientWidth / this.canvas.clientHeight,
            0.1,
            10000
        );
        this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: true, alpha: true });
        this.currentPlanetKey = 'sun';
        this.currentModel = null;
        
        this.setupRenderer();
        this.createPremiumScene();
        this.setupControls();
        this.setupModelButtons();
        this.setupPostProcessing();
        this.animate();
        
        window.addEventListener('resize', () => this.onWindowResize());
    }

    setupRenderer() {
        this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.setClearColor(0x000000, 1);
        this.renderer.shadowMap.enabled = true;
        this.camera.position.z = 3;
    }

    setupPostProcessing() {
        this.composer = new EffectComposer(this.renderer);
        const renderPass = new RenderPass(this.scene, this.camera);
        this.composer.addPass(renderPass);
        
        const bloomPass = new UnrealBloomPass(
            new THREE.Vector2(this.canvas.clientWidth, this.canvas.clientHeight),
            1.6,
            0.7,
            0.8
        );
        this.composer.addPass(bloomPass);
    }

    createPremiumScene() {
        // Starfield background
        const stars = ProceduralTextureGenerator.createStarfield(1000);
        stars.position.z = -50;
        this.scene.add(stars);
        
        // Premium lighting setup
        const mainLight = new THREE.DirectionalLight(0xFFFFFF, 1.5);
        mainLight.position.set(5, 5, 5);
        mainLight.castShadow = true;
        this.scene.add(mainLight);
        
        const fillLight = new THREE.PointLight(0x00D9FF, 1, 100);
        fillLight.position.set(-5, -5, 5);
        this.scene.add(fillLight);
        
        const ambientLight = new THREE.AmbientLight(0x404060, 0.8);
        this.scene.add(ambientLight);
        
        // Create initial model (Sun)
        this.switchModel('sun');
    }

    setupControls() {
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.autoRotate = true;
        this.controls.autoRotateSpeed = 3;
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.enableZoom = true;
    }

    setupModelButtons() {
        document.querySelectorAll('.model-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.model-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                const planet = e.target.dataset.planet || 'sun';
                
                gsap.to(this.currentModel, {
                    opacity: 0,
                    scale: 0.8,
                    duration: 0.3,
                    onComplete: () => {
                        this.switchModel(planet);
                    }
                });
            });
        });
    }

    switchModel(planet) {
        if (this.currentModel) {
            this.scene.remove(this.currentModel);
        }
        
        this.currentPlanetKey = planet;
        
        const models = {
            sun: {
                color: 0xFDB813,
                scale: 1.5,
                name: 'The Sun',
                emissive: 0xFDB813,
                emissiveIntensity: 2,
                metalness: 0.95,
                roughness: 0.05,
                hasGlow: true
            },
            earth: {
                color: 0x4A90E2,
                scale: 1,
                name: 'Earth',
                emissive: 0x2E5C8A,
                emissiveIntensity: 0.1,
                metalness: 0.3,
                roughness: 0.8,
                hasGlow: false
            },
            mars: {
                color: 0xE27B58,
                scale: 0.9,
                name: 'Mars',
                emissive: 0xC85A41,
                emissiveIntensity: 0.1,
                metalness: 0.6,
                roughness: 0.85,
                hasGlow: false
            },
            jupiter: {
                color: 0xC88B3A,
                scale: 2.2,
                name: 'Jupiter',
                emissive: 0xA0622F,
                emissiveIntensity: 0.1,
                metalness: 0.4,
                roughness: 0.9,
                hasGlow: false
            },
            saturn: {
                color: 0xFAD5A5,
                scale: 2,
                name: 'Saturn',
                emissive: 0xE8B88A,
                emissiveIntensity: 0.1,
                metalness: 0.3,
                roughness: 0.95,
                hasGlow: false,
                hasRings: true
            },
            moon: {
                color: 0xAAAAAA,
                scale: 0.5,
                name: 'The Moon',
                emissive: 0x666666,
                emissiveIntensity: 0.05,
                metalness: 0.5,
                roughness: 0.9,
                hasGlow: false
            }
        };
        
        const model = models[planet];
        const geometry = new THREE.IcosahedronGeometry(model.scale, 7);
        const material = new THREE.MeshStandardMaterial({
            color: model.color,
            map: ProceduralTextureGenerator.createPlanetTexture(model.color),
            metalness: model.metalness,
            roughness: model.roughness,
            emissive: model.emissive,
            emissiveIntensity: model.emissiveIntensity,
            normalScale: new THREE.Vector2(0.5, 0.5)
        });
        
        this.currentModel = new THREE.Mesh(geometry, material);
        this.currentModel.castShadow = true;
        this.currentModel.receiveShadow = true;
        this.scene.add(this.currentModel);
        
        // Add glow for sun
        if (model.hasGlow) {
            const glowGeometry = new THREE.IcosahedronGeometry(model.scale * 1.1, 6);
            const glowMaterial = new THREE.MeshStandardMaterial({
                color: 0xFF9500,
                emissive: 0xFF9500,
                emissiveIntensity: 1.5,
                transparent: true,
                opacity: 0.3,
                toneMapped: false
            });
            const glow = new THREE.Mesh(glowGeometry, glowMaterial);
            this.currentModel.add(glow);
        }
        
        // Add rings if needed
        if (model.hasRings) {
            const ringGeometry = new THREE.BufferGeometry();
            const ringMaterial = new THREE.MeshStandardMaterial({
                color: 0xE8D5B7,
                side: THREE.DoubleSide,
                metalness: 0.7,
                roughness: 0.8
            });
            
            const segments = 120;
            const innerRadius = model.scale * 1.4;
            const outerRadius = model.scale * 2.2;
            
            const vertices = [];
            const indices = [];
            
            for (let i = 0; i <= segments; i++) {
                const angle = (i / segments) * Math.PI * 2;
                vertices.push(innerRadius * Math.cos(angle), 0, innerRadius * Math.sin(angle));
                vertices.push(outerRadius * Math.cos(angle), 0, outerRadius * Math.sin(angle));
            }
            
            for (let i = 0; i < segments; i++) {
                const a = i * 2;
                const b = a + 1;
                const c = (i + 1) * 2;
                const d = c + 1;
                indices.push(a, b, c);
                indices.push(b, d, c);
            }
            
            ringGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(vertices), 3));
            ringGeometry.setIndex(new THREE.BufferAttribute(new Uint16Array(indices), 1));
            ringGeometry.computeVertexNormals();
            
            const rings = new THREE.Mesh(ringGeometry, ringMaterial);
            rings.rotation.x = (Math.random() - 0.5) * 0.3;
            this.currentModel.add(rings);
        }
        
        // Update title
        const titleElement = document.getElementById('model-title');
        if (titleElement) titleElement.textContent = model.name;
        
        // Animate in
        gsap.from(this.currentModel, {
            opacity: 0,
            scale: 0.5,
            duration: 0.5,
            ease: "back.out"
        });
    }

    animate = () => {
        requestAnimationFrame(this.animate);
        
        if (this.currentModel) {
            this.currentModel.rotation.y += 0.002;
        }
        
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

// ===== STAR FIELD WITH DEPTH =====
function initStars() {
    const starsContainer = document.getElementById('stars-container');
    if (!starsContainer) return;
    
    const starCount = 300;
    
    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';
        
        // Depth effect
        const scale = Math.random();
        star.style.opacity = scale * 0.8;
        star.style.width = scale * 3 + 'px';
        star.style.height = scale * 3 + 'px';
        
        // Twinkling animation
        const duration = Math.random() * 3 + 2;
        star.style.animationDuration = duration + 's';
        star.style.animationDelay = Math.random() * 3 + 's';
        
        starsContainer.appendChild(star);
    }
}

// ===== ANIMATIONS & INTERACTIONS =====
function initAnimations() {
    if (typeof gsap === 'undefined') return;
    
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

    // Enhanced planet cards
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
            gsap.to(this, { 
                y: -15, 
                duration: 0.3, 
                scale: 1.08,
                boxShadow: '0 20px 50px rgba(0, 217, 255, 0.3)'
            });
        });
        
        card.addEventListener('mouseleave', function() {
            gsap.to(this, { 
                y: 0, 
                duration: 0.3, 
                scale: 1,
                boxShadow: '0 10px 30px rgba(0, 217, 255, 0.1)'
            });
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

// ===== PREMIUM CURSOR =====
function initCursor() {
    const cursor = document.querySelector('.cursor');
    const cursorFollower = document.querySelector('.cursor-follower');
    
    if (!cursor || !cursorFollower) return;
    
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
        
        setTimeout(() => {
            cursorFollower.style.left = e.clientX + 'px';
            cursorFollower.style.top = e.clientY + 'px';
        }, 50);
    });

    document.querySelectorAll('a, button, input, textarea, [data-planet]').forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.transform = 'scale(1.5)';
            cursor.style.borderColor = '#00d9ff';
            cursor.style.boxShadow = '0 0 10px rgba(0, 217, 255, 0.6)';
        });
        el.addEventListener('mouseleave', () => {
            cursor.style.transform = 'scale(1)';
            cursor.style.borderColor = '#a855f7';
            cursor.style.boxShadow = 'none';
        });
    });
}

// ===== PREMIUM BUTTON INTERACTIONS =====
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
            gsap.to(this, { y: -8, duration: 0.3, boxShadow: '0 20px 50px rgba(0, 217, 255, 0.5)' });
        });
        button.addEventListener('mouseleave', function() {
            gsap.to(this, { y: 0, duration: 0.3 });
        });
    });
}

// ===== ENHANCED FORM & MOBILE MENU =====
function initContactForm() {
    const form = document.querySelector('.contact-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        gsap.to(form, {
            opacity: 0, 
            duration: 0.3, 
            onComplete: () => {
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

function initScrollTracking() {
    window.addEventListener('scroll', () => {
        const scrollProgress = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        document.documentElement.style.setProperty('--scroll-progress', scrollProgress + '%');
    });
}

// ===== MASTER INITIALIZATION =====
function init() {
    console.log('🌟 Ultra-Premium Solar System Explorer initializing...');
    
    // Register ScrollTrigger plugin
    if (typeof gsap !== 'undefined' && gsap.registerPlugin) {
        try {
            const { ScrollTrigger } = window;
            if (ScrollTrigger) gsap.registerPlugin(ScrollTrigger);
        } catch (e) {
            console.warn('ScrollTrigger not available, but continuing with animations');
        }
    }
    
    // Initialize UI components
    initStars();
    initCursor();
    initAnimations();
    initButtonInteractions();
    initContactForm();
    initMobileMenu();
    initScrollTracking();
    
    // Initialize 3D scenes
    try {
        new HeroScene();
        new SolarSystemScene();
        new ExplorerScene();
        console.log('✅ All 3D scenes loaded successfully');
    } catch (e) {
        console.error('Error initializing 3D scenes:', e);
    }

    console.log('✅ Solar System Explorer fully initialized - Premium Experience Ready!');
}

// ===== SAFE INITIALIZATION =====
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
