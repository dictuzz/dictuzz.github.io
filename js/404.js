/* ============================================
           JAVASCRIPT - MAIN APPLICATION
           ============================================ */

        // ============================================
        // CONFIGURATION & STATE
        // ============================================
        const CONFIG = {
            SHARDS_COUNT: 5,
            IDLE_TIMEOUT: 20000, // 20 seconds
            PARTICLE_COUNT: 100,
            MATRIX_CHARS: 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEF',
            TERMINAL_COMMANDS: ['reboot', 'recover', 'home', 'help', 'clear', 'matrix', 'glitch', 'shards', 'konami'],
            SHARD_POSITIONS: [
                { top: '15%', left: '10%' },
                { top: '25%', left: '85%' },
                { top: '60%', left: '5%' },
                { top: '70%', left: '90%' },
                { top: '45%', left: '50%' }
            ]
        };

        const STATE = {
            shardsCollected: 0,
            soundEnabled: false,
            idleTimer: null,
            konamiProgress: 0,
            konamiCode: ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'],
            audioContext: null,
            particles: [],
            mouseX: 0,
            mouseY: 0,
            isRedirecting: false
        };

        // ============================================
        // UTILITY FUNCTIONS
        // ============================================
        const utils = {
            random: (min, max) => Math.random() * (max - min) + min,
            randomInt: (min, max) => Math.floor(utils.random(min, max + 1)),
            randomColor: () => {
                const colors = ['#bf00ff', '#00f0ff', '#ff00aa', '#00ff88'];
                return colors[utils.randomInt(0, colors.length - 1)];
            },
            clamp: (value, min, max) => Math.max(min, Math.min(max, value))
        };

        // ============================================
        // CUSTOM CURSOR
        // ============================================
        const cursor = document.getElementById('cursor');
        
        document.addEventListener('mousemove', (e) => {
            STATE.mouseX = e.clientX;
            STATE.mouseY = e.clientY;
            cursor.style.left = e.clientX - 10 + 'px';
            cursor.style.top = e.clientY - 10 + 'px';
        });

        document.addEventListener('mousedown', () => cursor.classList.add('clicking'));
        document.addEventListener('mouseup', () => cursor.classList.remove('clicking'));

        // ============================================
        // GLITCH EFFECT
        // ============================================
        const glitchOverlay = document.getElementById('glitchOverlay');
        
        function triggerGlitch() {
            glitchOverlay.classList.add('active');
            playGlitchSound();
            setTimeout(() => glitchOverlay.classList.remove('active'), 300);
        }

        // Random glitch intervals
        function randomGlitch() {
            const delay = utils.random(3000, 10000);
            setTimeout(() => {
                if (!STATE.isRedirecting) {
                    triggerGlitch();
                    randomGlitch();
                }
            }, delay);
        }

        // Initial glitch on load
        setTimeout(triggerGlitch, 500);
        randomGlitch();

        // ============================================
        // AUDIO SYSTEM
        // ============================================
        function initAudio() {
            STATE.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }

        function playTone(type, freq, freqEnd, gain, duration) {
            if (!STATE.soundEnabled || !STATE.audioContext) return;
            const t = STATE.audioContext.currentTime;
            const osc = STATE.audioContext.createOscillator();
            const vol = STATE.audioContext.createGain();
            osc.connect(vol);
            vol.connect(STATE.audioContext.destination);
            osc.type = type;
            osc.frequency.setValueAtTime(freq, t);
            if (freqEnd) osc.frequency.exponentialRampToValueAtTime(freqEnd, t + duration);
            vol.gain.setValueAtTime(gain, t);
            vol.gain.exponentialRampToValueAtTime(0.01, t + duration);
            osc.start(t);
            osc.stop(t + duration);
        }

        function playGlitchSound() {
            playTone('sawtooth', 100, 50, 0.1, 0.1);
        }

        function playCollectSound() {
            playTone('sine', 880, 1760, 0.2, 0.2);
        }

        function playSuccessSound() {
            if (!STATE.soundEnabled || !STATE.audioContext) return;
            [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
                setTimeout(() => playTone('sine', freq, null, 0.2, 0.3), i * 100);
            });
        }

        // Sound Toggle
        const soundToggle = document.getElementById('soundToggle');
        soundToggle.addEventListener('click', () => {
            STATE.soundEnabled = !STATE.soundEnabled;
            soundToggle.classList.toggle('muted', !STATE.soundEnabled);
            
            if (STATE.soundEnabled && !STATE.audioContext) {
                initAudio();
            }
            
            if (STATE.soundEnabled) {
                playGlitchSound();
            }
        });

        // ============================================
        // PARTICLE SYSTEM
        // ============================================
        const particleCanvas = document.getElementById('particleCanvas');
        const particleCtx = particleCanvas.getContext('2d');

        function resizeParticleCanvas() {
            particleCanvas.width = window.innerWidth;
            particleCanvas.height = window.innerHeight;
        }

        class Particle {
            constructor() {
                this.reset();
            }

            reset() {
                this.x = utils.random(0, particleCanvas.width);
                this.y = utils.random(0, particleCanvas.height);
                this.size = utils.random(1, 3);
                this.speedX = utils.random(-0.5, 0.5);
                this.speedY = utils.random(-0.5, 0.5);
                this.color = utils.randomColor();
                this.alpha = utils.random(0.3, 1);
            }

            update() {
                // Mouse attraction
                const dx = STATE.mouseX - this.x;
                const dy = STATE.mouseY - this.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 150) {
                    const force = (150 - distance) / 150;
                    this.x -= (dx / distance) * force * 0.5;
                    this.y -= (dy / distance) * force * 0.5;
                }

                this.x += this.speedX;
                this.y += this.speedY;

                // Boundary check
                if (this.x < 0 || this.x > particleCanvas.width || 
                    this.y < 0 || this.y > particleCanvas.height) {
                    this.reset();
                }
            }

            draw() {
                particleCtx.beginPath();
                particleCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                particleCtx.fillStyle = this.color;
                particleCtx.globalAlpha = this.alpha;
                particleCtx.fill();
                particleCtx.globalAlpha = 1;
            }
        }

        function initParticles() {
            resizeParticleCanvas();
            for (let i = 0; i < CONFIG.PARTICLE_COUNT; i++) {
                STATE.particles.push(new Particle());
            }
        }

        function animateParticles() {
            if (STATE.isRedirecting) return;
            
            particleCtx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);
            
            STATE.particles.forEach(particle => {
                particle.update();
                particle.draw();
            });

            // Draw connections between nearby particles
            STATE.particles.forEach((p1, i) => {
                STATE.particles.slice(i + 1).forEach(p2 => {
                    const dx = p1.x - p2.x;
                    const dy = p1.y - p2.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < 100) {
                        particleCtx.beginPath();
                        particleCtx.moveTo(p1.x, p1.y);
                        particleCtx.lineTo(p2.x, p2.y);
                        particleCtx.strokeStyle = p1.color;
                        particleCtx.globalAlpha = (100 - distance) / 100 * 0.2;
                        particleCtx.stroke();
                        particleCtx.globalAlpha = 1;
                    }
                });
            });

            requestAnimationFrame(animateParticles);
        }

        // ============================================
        // MATRIX RAIN EFFECT
        // ============================================
        const matrixCanvas = document.getElementById('matrixCanvas');
        const matrixCtx = matrixCanvas.getContext('2d');

        function resizeMatrixCanvas() {
            matrixCanvas.width = window.innerWidth;
            matrixCanvas.height = window.innerHeight;
        }

        let matrixDrops = [];

        function initMatrix() {
            resizeMatrixCanvas();
            const columns = Math.floor(matrixCanvas.width / 20);
            matrixDrops = Array(columns).fill(1);
        }

        function drawMatrix() {
            if (STATE.isRedirecting) return;
            
            matrixCtx.fillStyle = 'rgba(10, 10, 15, 0.05)';
            matrixCtx.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height);

            matrixCtx.fillStyle = '#bf00ff';
            matrixCtx.font = '15px Share Tech Mono';

            matrixDrops.forEach((y, i) => {
                const char = CONFIG.MATRIX_CHARS[utils.randomInt(0, CONFIG.MATRIX_CHARS.length - 1)];
                matrixCtx.fillText(char, i * 20, y * 20);

                if (y * 20 > matrixCanvas.height && Math.random() > 0.975) {
                    matrixDrops[i] = 0;
                }
                matrixDrops[i]++;
            });

            requestAnimationFrame(drawMatrix);
        }

        // ============================================
        // DATA SHARDS (COLLECTIBLES)
        // ============================================
        const shardsContainer = document.getElementById('shardsContainer');
        const shardCountDisplay = document.getElementById('shardCount');

        function createShards() {
            CONFIG.SHARD_POSITIONS.forEach((pos, i) => {
                const shard = document.createElement('div');
                shard.className = 'data-shard';
                shard.style.top = pos.top;
                shard.style.left = pos.left;
                shard.style.animationDelay = `${i * 0.5}s`;
                shard.innerHTML = createShardSVG();
                shard.dataset.index = i;
                
                shard.addEventListener('click', () => collectShard(shard));
                
                shardsContainer.appendChild(shard);
            });
        }

        function createShardSVG() {
            const color = utils.randomColor();
            return `
                <svg viewBox="0 0 40 40" width="40" height="40">
                    <defs>
                        <filter id="glow-${Date.now()}" x="-50%" y="-50%" width="200%" height="200%">
                            <feGaussianBlur stdDeviation="2" result="blur"/>
                            <feMerge>
                                <feMergeNode in="blur"/>
                                <feMergeNode in="SourceGraphic"/>
                            </feMerge>
                        </filter>
                    </defs>
                    <polygon points="20,2 38,20 20,38 2,20" 
                             fill="none" 
                             stroke="${color}" 
                             stroke-width="2"
                             filter="url(#glow-${Date.now()})"/>
                    <polygon points="20,8 32,20 20,32 8,20" 
                             fill="${color}" 
                             opacity="0.3"/>
                    <circle cx="20" cy="20" r="3" fill="${color}"/>
                </svg>
            `;
        }

        function collectShard(shard) {
            if (shard.classList.contains('collected')) return;
            
            shard.classList.add('collected');
            STATE.shardsCollected++;
            shardCountDisplay.textContent = STATE.shardsCollected;
            playCollectSound();
            triggerGlitch();

            // Add log entry
            addLog(`Data shard ${STATE.shardsCollected}/5 recovered`, 'success');

            if (STATE.shardsCollected >= CONFIG.SHARDS_COUNT) {
                setTimeout(showSuccess, 500);
            }

            // Hide shard after animation
            setTimeout(() => {
                shard.style.display = 'none';
            }, 500);
        }

        // ============================================
        // TERMINAL COMMANDS
        // ============================================
        const terminalInput = document.getElementById('terminalInput');

        function processCommand(command) {
            const cmd = command.toLowerCase().trim();
            
            addLog(`> ${command}`, 'info');
            
            switch(cmd) {
                case 'help':
                    addLog('Available commands:', 'info');
                    addLog('  reboot  - Restart system', 'info');
                    addLog('  recover - Recover lost data', 'info');
                    addLog('  home    - Return to homepage', 'info');
                    addLog('  clear   - Clear terminal', 'info');
                    addLog('  matrix  - Toggle matrix rain', 'info');
                    addLog('  glitch  - Trigger glitch effect', 'info');
                    addLog('  shards  - Show shard status', 'info');
                    addLog('Or collect 5 data shards to recover!', 'info');
                    break;
                    
                case 'reboot':
                case 'recover':
                case 'home':
                    addLog('Initiating system recovery...', 'success');
                    setTimeout(showSuccess, 1000);
                    break;
                    
                case 'clear':
                    clearLogs();
                    break;
                    
                case 'matrix':
                    const opacity = matrixCanvas.style.opacity === '0' ? '0.3' : '0';
                    matrixCanvas.style.opacity = opacity;
                    addLog(`Matrix rain ${opacity === '0' ? 'disabled' : 'enabled'}`, 'info');
                    break;
                    
                case 'glitch':
                    triggerGlitch();
                    addLog('GLITCH TRIGGERED', 'warning');
                    break;
                    
                case 'shards':
                    addLog(`Data shards collected: ${STATE.shardsCollected}/${CONFIG.SHARDS_COUNT}`, 'info');
                    addLog('Click the floating diamonds to collect them!', 'info');
                    break;
                    
                case 'konami':
                    addLog('Konami code... interesting.', 'warning');
                    addLog('Try: Up Up Down Down Left Right Left Right B A', 'info');
                    break;
                    
                default:
                    addLog(`Command not recognized: ${command}`, 'error');
                    addLog('Type "help" for available commands', 'warning');
            }
        }

        terminalInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && terminalInput.value.trim()) {
                processCommand(terminalInput.value);
                terminalInput.value = '';
                resetIdleTimer();
            }
        });

        // ============================================
        // SYSTEM LOGS
        // ============================================
        const systemLogs = document.getElementById('systemLogs');
        const logMessages = [
            { text: 'Initializing system architecture...', type: 'info' },
            { text: 'Workflow path disconnected', type: 'error' },
            { text: 'Attempting process recovery...', type: 'warning' },
            { text: 'Connection lost to main hub', type: 'error' },
            { text: 'Coordination subsystem offline', type: 'error' },
            { text: 'Scanning for alternative routes...', type: 'info' },
            { text: 'System optimization pending', type: 'warning' },
            { text: 'Process pathway unstable', type: 'warning' },
            { text: 'Searching for home directory...', type: 'info' },
            { text: 'ERROR: Page not found in system', type: 'error' }
        ];

        function addLog(text, type = 'info') {
            const logLine = document.createElement('div');
            logLine.className = `log-line log-${type}`;
            
            const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false });
            logLine.textContent = `[${timestamp}] ${text}`;
            
            systemLogs.appendChild(logLine);
            
            // Keep only last 20 logs
            while (systemLogs.children.length > 20) {
                systemLogs.removeChild(systemLogs.firstChild);
            }
            
            systemLogs.scrollTop = systemLogs.scrollHeight;
        }

        function clearLogs() {
            systemLogs.innerHTML = '';
            addLog('Terminal cleared', 'info');
        }

        function startRandomLogs() {
            const addRandomLog = () => {
                if (STATE.isRedirecting) return;
                
                const msg = logMessages[utils.randomInt(0, logMessages.length - 1)];
                addLog(msg.text, msg.type);
                
                setTimeout(addRandomLog, utils.random(2000, 5000));
            };
            
            setTimeout(addRandomLog, 1000);
        }

        // ============================================
        // IDLE DETECTION
        // ============================================
        const idleMessage = document.getElementById('idleMessage');

        function resetIdleTimer() {
            idleMessage.classList.remove('visible');
            clearTimeout(STATE.idleTimer);
            
            STATE.idleTimer = setTimeout(() => {
                if (!STATE.isRedirecting) {
                    idleMessage.classList.add('visible');
                    addLog('System idle timeout reached', 'warning');
                    addLog('Manual override required', 'error');
                }
            }, CONFIG.IDLE_TIMEOUT);
        }

        ['mousemove', 'click', 'keypress', 'scroll'].forEach(event => {
            document.addEventListener(event, resetIdleTimer);
        });

        // ============================================
        // KONAMI CODE DETECTION
        // ============================================
        document.addEventListener('keydown', (e) => {
            if (e.key === STATE.konamiCode[STATE.konamiProgress]) {
                STATE.konamiProgress++;
                
                if (STATE.konamiProgress === STATE.konamiCode.length) {
                    // Konami code completed!
                    addLog('KONAMI CODE ACTIVATED!', 'success');
                    addLog('Easter egg unlocked!', 'success');
                    triggerGlitch();
                    
                    // Auto-complete shards
                    const shards = document.querySelectorAll('.data-shard:not(.collected)');
                    shards.forEach((shard, i) => {
                        setTimeout(() => collectShard(shard), i * 200);
                    });
                    
                    STATE.konamiProgress = 0;
                }
            } else {
                STATE.konamiProgress = 0;
            }
        });

        // ============================================
        // SUCCESS ANIMATION & REDIRECT
        // ============================================
        const successOverlay = document.getElementById('successOverlay');

        function showSuccess() {
            if (STATE.isRedirecting) return;
            
            STATE.isRedirecting = true;
            playSuccessSound();
            
            successOverlay.classList.add('active');
            
            addLog('SYSTEM RESTORED', 'success');
            addLog('Redirecting to homepage...', 'info');
            
            // Redirect after animation
            setTimeout(() => {
                // Redirect to actual homepage
                window.location.href = '/';
                
                // For demo, show completion message
                document.querySelector('.success-subtext').textContent = 
                    'Demo complete! Refresh to play again.';
            }, 3000);
        }

        // ============================================
        // PARALLAX EFFECT
        // ============================================
        const gridFloor = document.querySelector('.grid-floor');
        const contentEl = document.querySelector('.content');
        document.addEventListener('mousemove', (e) => {
            const x = (e.clientX / window.innerWidth - 0.5) * 20;
            const y = (e.clientY / window.innerHeight - 0.5) * 20;
            
            if (gridFloor) gridFloor.style.transform = 
                `rotateX(70deg) translateX(${x}px)`;
            
            if (contentEl) contentEl.style.transform = 
                `translateX(${x * 0.5}px) translateY(${y * 0.5}px)`;
        });

        // ============================================
        // WINDOW RESIZE HANDLER
        // ============================================
        window.addEventListener('resize', () => {
            resizeParticleCanvas();
            resizeMatrixCanvas();
            initMatrix();
        });

        // ============================================
        // INITIALIZATION
        // ============================================
        function init() {
            initParticles();
            animateParticles();
            initMatrix();
            drawMatrix();
            createShards();
            startRandomLogs();
            resetIdleTimer();
            
            // Focus terminal input
            setTimeout(() => {
                terminalInput.focus();
            }, 5000);
            
            addLog('System architecture loaded', 'success');
            addLog('ERROR: 404 - Path not optimized', 'error');
            addLog('Process recovery engaged', 'warning');
        }

        // Start the application
        init();

        // ============================================
        // EASTER EGG: Double-click brand for effect
        // ============================================
        document.querySelector('.brand').addEventListener('dblclick', () => {
            document.body.style.animation = 'none';
            document.body.offsetHeight; // Trigger reflow
            
            const colors = ['--neon-purple', '--neon-blue', '--neon-pink', '--neon-green'];
            let i = 0;
            
            const colorChange = setInterval(() => {
                document.querySelector('.brand').style.textShadow = 
                    `0 0 10px var(${colors[i]}), 0 0 20px var(${colors[i]}), 0 0 40px var(${colors[i]})`;
                i = (i + 1) % colors.length;
            }, 100);
            
            setTimeout(() => clearInterval(colorChange), 2000);
            
            addLog('Color overload mode activated!', 'success');
        });

        // ============================================
        // EASTER EGG: Console message
        // ============================================
        console.log(`
%c╔═══════════════════════════════════════════╗
║                                           ║
║     ██╗███╗   ██╗████████╗██████╗  ██████╗ ║
║     ██║████╗  ██║╚══██╔══╝██╔══██╗██╔═══██╗║
║     ██║██╔██╗ ██║   ██║   ██║  ██║██║   ██║║
║     ██║██║╚██╗██║   ██║   ██║  ██║██║   ██║║
║     ██║██║ ╚████║   ██║   ██████╔╝╚██████╔╝║
║     ╚═╝╚═╝  ╚═══╝   ╚═╝   ╚═════╝  ╚═════╝ ║
║                                           ║
║         System Path Not Found             ║
║                                           ║
║   Hint: Try the Konami code! ↑↑↓↓←→←→BA   ║
║                                           ║
╚═══════════════════════════════════════════╝
        `, 'color: #bf00ff; font-family: monospace;');