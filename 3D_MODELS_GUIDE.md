# 🎯 3D Models Integration Guide

This guide explains how to add your own 3D models to AETHER SPACE.

## 📦 Supported Formats

- **.glb** - Binary glTF format (recommended - smaller file size)
- **.gltf** - Text-based glTF format with separate resources

## 🔍 Where to Find Models

### Free Resources
- **Sketchfab** (https://sketchfab.com/) - Huge collection, filter by "Downloadable"
- **Poly Pizza** (https://poly.pizza/) - Free, low-poly models
- **CGTrader Free** (https://www.cgtrader.com/free-3d-models)
- **TurboSquid Free** (https://www.turbosquid.com/Search/3D-Models/free)
- **OpenGLTF** (https://opengltf.com/)

### Premium Resources
- **CGTrader** (https://www.cgtrader.com/)
- **TurboSquid** (https://www.turbosquid.com/)
- **Sketchfab Pro** (https://sketchfab.com/)

## 📥 Installation Steps

### 1. Download a Model

Download a **.glb** file. For example:
- Search "spaceship" on Sketchfab
- Find a model you like
- Download the .glb version

### 2. Place in Models Folder

Copy the file to the `/models/` directory:
```
site-spatial/
└── models/
    └── my-spaceship.glb   ← Place file here
```

### 3. Update main.js

Open `main.js` and find the scene class you want to modify.

**Example: Adding model to Hero Scene**

Find the `createScene()` method in the `HeroScene` class (around line 180):

```javascript
createScene() {
    // Remove or comment out the default geometry code:
    // const geometry = new THREE.IcosahedronGeometry(2, 4);
    // ...

    // Uncomment and modify the GLTFLoader section:
    const loader = new GLTFLoader();
    loader.load('./models/my-spaceship.glb', (gltf) => {
        const model = gltf.scene;
        
        // Adjust scale to fit your scene
        model.scale.set(1, 1, 1);
        
        // Optional: Adjust position
        model.position.set(0, 0, 0);
        
        // Optional: Add rotation offset
        model.rotation.set(0, 0, 0);
        
        this.mesh = model;
        this.scene.add(model);
        
        // Optional: Center model
        // const box = new THREE.Box3().setFromObject(model);
        // const center = box.getCenter(new THREE.Vector3());
        // model.position.sub(center);
    });
}
```

### 4. Test & Adjust

Refresh the page and verify the model appears correctly.

#### If model doesn't appear:
- Check browser console for errors (F12 → Console)
- Verify file path is correct
- Try increasing camera distance: `this.camera.position.z = 10;`
- Check model scale: try different values like 0.5 or 2

#### If model is too small/large:
- Adjust `model.scale.set(x, y, z)`
- Example: `model.scale.set(2, 2, 2)` to double size

#### If model rotation is wrong:
- Adjust `model.rotation.set(x, y, z)` (in radians)
- Example: `model.rotation.y = Math.PI / 2;` for 90° rotation

## 🎨 Model Customization Examples

### Adding Model to Exploration Scene

In the `ExplorationScene` class, replace the torus with your model:

```javascript
createScene() {
    const loader = new GLTFLoader();
    loader.load('./models/planet.glb', (gltf) => {
        const model = gltf.scene;
        model.scale.set(1.5, 1.5, 1.5);
        this.mesh = model;
        this.scene.add(model);
    });
}
```

### Adding Model to Galaxy Scene

You can add multiple models to the galaxy scene:

```javascript
createParticles() {
    // Keep existing particles
    // ... particle code ...
    
    // Add a central model
    const loader = new GLTFLoader();
    loader.load('./models/space-station.glb', (gltf) => {
        const station = gltf.scene;
        station.scale.set(10, 10, 10);
        this.scene.add(station);
    });
}
```

## 💡 Advanced Tips

### Texture Optimization

```javascript
// Apply custom materials to model
gltf.scene.traverse((child) => {
    if (child.isMesh) {
        child.material.metalness = 0.8;
        child.material.roughness = 0.2;
        child.castShadow = true;
        child.receiveShadow = true;
    }
});
```

### Animation Control

If your model has animations:

```javascript
const mixer = new THREE.AnimationMixer(gltf.scene);
const clips = gltf.animations;
if (clips.length > 0) {
    mixer.clipAction(clips[0]).play();
}

// In animate function:
// mixer.update(deltaTime);
```

### Lighting Adjustment

For different models, you might need to adjust lights:

```javascript
setupLights() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);  // Increase intensity
    this.scene.add(ambientLight);
    
    const pointLight = new THREE.PointLight(0x00d9ff, 2, 150);  // More intense
    pointLight.position.set(20, 20, 20);
    this.scene.add(pointLight);
}
```

### Performance Optimization

For large models or many meshes:

```javascript
gltf.scene.traverse((child) => {
    if (child.isMesh) {
        // Enable frustum culling
        child.frustumCulled = true;
        
        // Reduce texture resolution if needed
        if (child.material.map) {
            child.material.map.minFilter = THREE.LinearFilter;
        }
    }
});
```

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| Model not visible | Increase `camera.position.z`, check scale |
| Model is upside down | Adjust `rotation.z = Math.PI` |
| Model is too dark | Increase ambient light intensity |
| Model loads slowly | Compress .glb file, reduce textures |
| CORS error | Ensure model is in `/models/` folder |

## 📊 Model Recommendations

### For Best Performance:
- File size: < 5MB
- Polygon count: < 100,000
- Use .glb format (compressed)
- Include only necessary textures

### For Best Visuals:
- High-resolution textures (2K - 4K)
- PBR materials (Metallic/Roughness)
- Proper UV mapping
- Baked lighting if possible

## 🎬 Animation Ideas

Here are some creative ways to use models:

1. **Rotating Ship** - Add to hero, slow rotation
2. **Flying Station** - Add to exploration, orbital motion
3. **Planet** - Add to galaxy, rotation with particles
4. **Character** - Add to final CTA for engagement
5. **Building** - Showcase architecture/company HQ

## 📚 Resources

- **Three.js Loader Docs**: https://threejs.org/docs/#examples/en/loaders/GLTFLoader
- **glTF Format**: https://www.khronos.org/gltf/
- **Model Optimization**: https://poly.pizza/models

---

**Need Help?**
1. Check browser console (F12) for error messages
2. Verify file path: `./models/filename.glb`
3. Test with free models first
4. Adjust scale and position incrementally

Happy modeling! 🚀
