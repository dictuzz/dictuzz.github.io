/**
 * The Digital Loom: Particle Curtain System V4
 * - Independent Scroll Logic (mapped to 0-100vh)
 * - Initial "Random Scatter" state
 */
(function () {
    var checkDeps = setInterval(function () {
        if (window.THREE && window.gsap) {
            clearInterval(checkDeps);
            initLoom();
        }
    }, 100);

    function initLoom() {
        var container = document.getElementById('loom-container');
        if (!container) return;

        var CONFIG = {
            particleCount: 60000,
            textScale: 0.85, // Increased from 0.5 for massive text
            color1: new THREE.Color(0xffffff),
            color2: new THREE.Color(0xffd700),
            mouseRadius: 100,
            mouseForce: 50
        };

        // Scene
        var scene = new THREE.Scene();
        scene.fog = new THREE.FogExp2(0x050505, 0.002);

        var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);
        camera.position.z = 1000;

        var renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        container.appendChild(renderer.domElement);

        // Interaction
        var mouse = new THREE.Vector3(9999, 9999, 0);

        // Particles
        var geometry = new THREE.BufferGeometry();
        var positions = new Float32Array(CONFIG.particleCount * 3);
        var targets = new Float32Array(CONFIG.particleCount * 3);
        var randoms = new Float32Array(CONFIG.particleCount);
        var colors = new Float32Array(CONFIG.particleCount * 3);

        // Initialize Particles (SCATTER STATE)
        // Randomly distributed in a large 3D volume
        for (var i = 0; i < CONFIG.particleCount; i++) {
            var range = 4000;
            var x = (Math.random() - 0.5) * range;
            var y = (Math.random() - 0.5) * range;
            var z = (Math.random() - 0.5) * range; // Deep scatter

            positions[i * 3] = x;
            positions[i * 3 + 1] = y;
            positions[i * 3 + 2] = z;

            randoms[i] = Math.random();

            var color = Math.random() > 0.9 ? CONFIG.color2 : CONFIG.color1;
            colors[i * 3] = color.r;
            colors[i * 3 + 1] = color.g;
            colors[i * 3 + 2] = color.b;

            // Default target
            targets[i * 3] = 0;
            targets[i * 3 + 1] = 0;
            targets[i * 3 + 2] = 0;
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('aTarget', new THREE.BufferAttribute(targets, 3));
        geometry.setAttribute('aRandom', new THREE.BufferAttribute(randoms, 1));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        // Shader Material
        var material = new THREE.ShaderMaterial({
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
                    
                    // Initial State: SCATTER (Positions from attribute)
                    // But we want them to float/move?
                    vec3 pos = position;
                    
                    // Add subtle float movement in Scatter state
                    pos.x += sin(uTime * 0.5 + aRandom * 10.0) * 100.0 * (1.0 - uMorph);
                    pos.y += cos(uTime * 0.3 + aRandom * 10.0) * 100.0 * (1.0 - uMorph);

                    // Morphing: Mix from Scatter(pos) to Target(aTarget)
                    // uMorph goes 0 -> 1
                    vec3 finalPos = mix(pos, aTarget, uMorph);
                    
                    // Mouse Interaction (Only when formed mostly)
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
                    // Driven by uScroll (0.0 to 1.0)
                    // Fly UP
                    float scrollY = uScroll * 1500.0;
                    finalPos.y += scrollY; 
                    
                    // Add chaos as they fly up
                    finalPos.x += (aRandom - 0.5) * uScroll * 1000.0; 
                    finalPos.z += uScroll * 500.0; 

                    vec4 mvPosition = modelViewMatrix * vec4(finalPos, 1.0);
                    gl_Position = projectionMatrix * mvPosition;
                    
                    gl_PointSize = (1.5 + aRandom) * uPixelRatio * (1200.0 / -mvPosition.z);
                    
                    // Fade out
                    vAlpha = 1.0 - (uScroll * 2.5); // Fade faster
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

        var points = new THREE.Points(geometry, material);
        scene.add(points);

        // ---------------------------------------------------------
        // CANVAS TEXT SAMPLING
        // ---------------------------------------------------------
        function samplePointsFromText() {
            var canvas = document.createElement('canvas');
            var ctx = canvas.getContext('2d');
            var width = 2048;
            var height = 1024;
            canvas.width = width;
            canvas.height = height;

            ctx.fillStyle = '#000000';
            ctx.fillRect(0, 0, width, height);

            ctx.fillStyle = '#ffffff';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            // Responsive Font Sizes
            var isMobile = window.innerWidth < 768;
            var scaleFactor = isMobile ? 0.4 : 1.0; // Scale down for mobile

            // Font 1: BENEDICTUS
            var fontSize1 = 280 * scaleFactor;
            ctx.font = '800 ' + fontSize1 + 'px "Plus Jakarta Sans", sans-serif';
            ctx.fillText('BENEDICTUS', width / 2, height / 2 - (160 * scaleFactor));

            // Font 2: RICHARD RICARDO
            var fontSize2 = 190 * scaleFactor;
            ctx.font = '700 ' + fontSize2 + 'px "Plus Jakarta Sans", sans-serif';
            ctx.fillText('RICHARD RICARDO', width / 2, height / 2 + (160 * scaleFactor));

            var imageData = ctx.getImageData(0, 0, width, height);
            var data = imageData.data;
            var validPoints = [];

            var step = 4;

            for (var y = 0; y < height; y += step) {
                for (var x = 0; x < width; x += step) {
                    var i = (y * width + x) * 4;
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
                for (var i = 0; i < CONFIG.particleCount; i++) {
                    var p = validPoints[Math.floor(Math.random() * validPoints.length)];
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
                var scrollTop = window.scrollY;
                var windowHeight = window.innerHeight;

                // Mapped to FIRST VIEWPORT only (0 to 100vh)
                // 3D Text stays for first 20% then flies out by 100%

                var startOutput = windowHeight * 0.2;
                var endOutput = windowHeight * 0.8;

                var progress = (scrollTop - startOutput) / (endOutput - startOutput);
                if (progress < 0) progress = 0;
                if (progress > 1) progress = 1;

                // If user is way past, keep it gone
                if (scrollTop > endOutput) progress = 1;

                material.uniforms.uScroll.value = progress;

                // Z-Index Hack: When fully scrolled out, push to back so it doesn't block interactions
                if (progress >= 0.95) {
                    container.style.zIndex = -10;
                    container.style.pointerEvents = 'none'; // Ensure no interference
                } else {
                    container.style.zIndex = 1; // Bring back when at top
                    container.style.pointerEvents = 'auto';
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
            var vec = new THREE.Vector3(
                (e.clientX / window.innerWidth) * 2 - 1,
                -(e.clientY / window.innerHeight) * 2 + 1,
                0.5
            );
            vec.unproject(camera);
            var dir = vec.sub(camera.position).normalize();
            var distance = -camera.position.z / dir.z;
            var pos = camera.position.clone().add(dir.multiplyScalar(distance));
            material.uniforms.uMouse.value.copy(pos);
        });

        var clock = new THREE.Clock();
        function animate() {
            requestAnimationFrame(animate);
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
})();
