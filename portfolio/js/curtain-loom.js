/**
 * The Digital Loom: Particle Curtain System V4
 * - Independent Scroll Logic (mapped to 0-100vh)
 * - Initial "Random Scatter" state
 */

// Wait for Dependencies AND Data
let retries = 0;
const checkDeps = setInterval(function () {
    if (window.THREE && window.gsap && window.PORTFOLIO_CONTENT) {
        clearInterval(checkDeps);
        initLoom();
    } else if (retries++ > 50) {
        clearInterval(checkDeps);
        console.warn("Dependencies failed to load for Loom");
    }
}, 100);

function initLoom() {
    const container = document.getElementById('loom-container');
    if (!container) return;

    const isMobile = window.innerWidth <= 768;
    const PARTICLE_COUNT = isMobile ? 15000 : 30000;

    const CONFIG = {
        particleCount: PARTICLE_COUNT,
        textScale: 0.85,
        color1: new THREE.Color(0xffffff),
        color2: new THREE.Color(0xffd700),
        mouseRadius: 100,
        mouseForce: 50
    };

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050505, 0.002);

    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.z = 1000;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Interaction
    const mouse = new THREE.Vector3(9999, 9999, 0);

    // Particles
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(CONFIG.particleCount * 3);
    const targets = new Float32Array(CONFIG.particleCount * 3);
    const randoms = new Float32Array(CONFIG.particleCount);
    const colors = new Float32Array(CONFIG.particleCount * 3);

    // Initialize Particles (SCATTER STATE)
    for (let i = 0; i < CONFIG.particleCount; i++) {
        const range = 4000;
        const x = (Math.random() - 0.5) * range;
        const y = (Math.random() - 0.5) * range;
        const z = (Math.random() - 0.5) * range;

        positions[i * 3] = x;
        positions[i * 3 + 1] = y;
        positions[i * 3 + 2] = z;

        randoms[i] = Math.random();

        const color = Math.random() > 0.9 ? CONFIG.color2 : CONFIG.color1;
        colors[i * 3] = color.r;
        colors[i * 3 + 1] = color.g;
        colors[i * 3 + 2] = color.b;

        targets[i * 3] = 0;
        targets[i * 3 + 1] = 0;
        targets[i * 3 + 2] = 0;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('aTarget', new THREE.BufferAttribute(targets, 3));
    geometry.setAttribute('aRandom', new THREE.BufferAttribute(randoms, 1));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Shader Material
    const material = new THREE.ShaderMaterial({
        uniforms: {
            uTime: { value: 0 },
            uMouse: { value: new THREE.Vector3(9999, 9999, 0) },
            uMorph: { value: 0 },
            uScroll: { value: 0 },
            uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) }
        },
        vertexShader: `
                uniform float uTime;
                uniform vec3 uMouse;
                uniform float uMorph;
                uniform float uScroll;
                uniform float uPixelRatio;

                attribute vec3 aTarget;
                attribute float aRandom;
                attribute vec3 color;

                varying vec3 vColor;
                varying float vAlpha;

                void main() {
                    vColor = color;
                    
                    // Initial State: SCATTER 
                    vec3 pos = position;
                    
                    // Add subtle float movement in Scatter state
                    pos.x += sin(uTime * 0.5 + aRandom * 10.0) * 100.0 * (1.0 - uMorph);
                    pos.y += cos(uTime * 0.3 + aRandom * 10.0) * 100.0 * (1.0 - uMorph);

                    // Morphing: Mix from Scatter(pos) to Target(aTarget)
                    vec3 finalPos = mix(pos, aTarget, uMorph);
                    
                    // Mouse Interaction 
                    if (uMorph > 0.8) {
                        float dist = distance(finalPos.xy, uMouse.xy);
                        float radius = 150.0;
                        if (dist < radius) {
                            vec3 dir = normalize(finalPos - uMouse);
                            float force = (1.0 - dist / radius) * 40.0;
                            finalPos += dir * force;
                        }
                    }

                    // --- SCROLL OUT ANIMATION ---
                    float scrollY = uScroll * 1500.0;
                    finalPos.y += scrollY; 
                    
                    // Add chaos as they fly up
                    finalPos.x += (aRandom - 0.5) * uScroll * 1000.0; 
                    finalPos.z += uScroll * 500.0; 

                    vec4 mvPosition = modelViewMatrix * vec4(finalPos, 1.0);
                    gl_Position = projectionMatrix * mvPosition;
                    
                    gl_PointSize = (1.5 + aRandom) * uPixelRatio * (1200.0 / -mvPosition.z);
                    
                    // Fade out
                    vAlpha = 1.0 - (uScroll * 2.5); 
                    if (vAlpha < 0.0) vAlpha = 0.0;
                }
            `,
        fragmentShader: `
                varying vec3 vColor;
                varying float vAlpha;

                void main() {
                    vec2 uv = gl_PointCoord - 0.5;
                    float r = length(uv);
                    if (r > 0.5) discard;
                    
                    // Solid center for legibility
                    float glow = 1.0 - r * 2.0;
                    if (glow < 0.2) discard; 

                    gl_FragColor = vec4(vColor, vAlpha * glow);
                }
            `,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    // ---------------------------------------------------------
    // CANVAS TEXT SAMPLING (DYNAMIC)
    // ---------------------------------------------------------
    function samplePointsFromText() {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const width = 2048;
        const height = 1024;
        canvas.width = width;
        canvas.height = height;

        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, width, height);

        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        const isMobile = window.innerWidth < 768;
        const scaleFactor = isMobile ? 0.4 : 1.0;

        // Dynamic Text from Data
        const textLines = window.PORTFOLIO_CONTENT.portfolio.curtain.textLines || ["BENEDICTUS", "RICHARD"];

        // Font Config
        const fontSize1 = 280 * scaleFactor;
        const fontSize2 = 190 * scaleFactor;

        // Line 1
        if (textLines[0]) {
            ctx.font = '800 ' + fontSize1 + 'px "Plus Jakarta Sans", sans-serif';
            ctx.fillText(textLines[0], width / 2, height / 2 - (160 * scaleFactor));
        }

        // Line 2
        if (textLines[1]) {
            ctx.font = '700 ' + fontSize2 + 'px "Plus Jakarta Sans", sans-serif';
            ctx.fillText(textLines[1], width / 2, height / 2 + (160 * scaleFactor));
        }

        const imageData = ctx.getImageData(0, 0, width, height);
        const data = imageData.data;
        const validPoints = [];

        const step = 4;

        for (let y = 0; y < height; y += step) {
            for (let x = 0; x < width; x += step) {
                const i = (y * width + x) * 4;
                if (data[i] > 100) {
                    validPoints.push({
                        x: (x - width / 2) * CONFIG.textScale,
                        y: -(y - height / 2) * CONFIG.textScale,
                        z: 0
                    });
                }
            }
        }

        if (validPoints.length > 0) {
            for (let i = 0; i < CONFIG.particleCount; i++) {
                const p = validPoints[Math.floor(Math.random() * validPoints.length)];
                targets[i * 3] = p.x;
                targets[i * 3 + 1] = p.y;
                targets[i * 3 + 2] = (Math.random() - 0.5) * 5;
            }
            geometry.attributes.aTarget.needsUpdate = true;
            initInteraction();
        }
    }

    if (document.fonts) {
        document.fonts.ready.then(function () {
            samplePointsFromText();
        });
    } else {
        setTimeout(samplePointsFromText, 500);
    }

    function initInteraction() {
        // Auto Morph after delay
        setTimeout(function () {
            morphToText();
        }, 1000);

        // SCROLL LISTENER
        window.addEventListener('scroll', function () {
            const scrollTop = window.scrollY;
            const windowHeight = window.innerHeight;

            // Mapped to FIRST VIEWPORT only (0 to 100vh)
            // 3D Text stays for first 20% then flies out by 100%

            const startOutput = windowHeight * 0.2;
            const endOutput = windowHeight * 0.8;

            let progress = (scrollTop - startOutput) / (endOutput - startOutput);
            if (progress < 0) progress = 0;
            if (progress > 1) progress = 1;

            // If user is way past, keep it gone
            if (scrollTop > endOutput) progress = 1;

            material.uniforms.uScroll.value = progress;

            // Hide completely when scrolled out to prevent particle bleed-through
            if (progress >= 0.95) {
                container.style.zIndex = -10;
                container.style.pointerEvents = 'none';
                container.style.visibility = 'hidden';
                container.style.opacity = '0';
            } else {
                container.style.zIndex = 1;
                container.style.pointerEvents = 'auto';
                container.style.visibility = 'visible';
                container.style.opacity = '1';
            }
        });
    }

    function morphToText() {
        gsap.to(material.uniforms.uMorph, {
            value: 1,
            duration: 4.0,
            ease: 'power2.inOut' // Slower, more cinematic morph
        });
    }

    window.addEventListener('mousemove', function (e) {
        const vec = new THREE.Vector3(
            (e.clientX / window.innerWidth) * 2 - 1,
            -(e.clientY / window.innerHeight) * 2 + 1,
            0.5
        );
        vec.unproject(camera);
        const dir = vec.sub(camera.position).normalize();
        const distance = -camera.position.z / dir.z;
        const pos = camera.position.clone().add(dir.multiplyScalar(distance));
        material.uniforms.uMouse.value.copy(pos);
    });

    const clock = new THREE.Clock();
    let isTabActive = true;

    document.addEventListener('visibilitychange', function () {
        isTabActive = !document.hidden;
    });

    function animate() {
        requestAnimationFrame(animate);
        // Skip rendering if scrolled out or tab hidden
        if (material.uniforms.uScroll.value >= 1.0 || !isTabActive) return;

        material.uniforms.uTime.value = clock.getElapsedTime();
        renderer.render(scene, camera);
    }
    animate();

    window.addEventListener('resize', function () {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}
