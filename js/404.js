/**
 * 404 SNAKE GAME
 * Full-screen snake with "404" obstacles that spawn as you score.
 * Supports keyboard, d-pad buttons, and touch swipe.
 */
(function () {
  'use strict';

  /* ── DOM ─────────────────────────────────────────────────────── */
  const canvas      = document.getElementById('game-canvas');
  const startScreen = document.getElementById('start-overlay');
  const deathScreen  = document.getElementById('gameover-overlay');
  const btnStart    = document.getElementById('btn-start');
  const btnRestart  = document.getElementById('btn-restart');
  const scoreEl     = document.getElementById('score-display');
  const bestEl      = document.getElementById('best-display');
  const finalScore  = document.getElementById('final-score');
  const finalBest   = document.getElementById('final-best');
  const deathTitle  = document.getElementById('gameover-title');
  const deathQuip   = document.getElementById('gameover-quip');
  const deathEmoji  = document.getElementById('gameover-emoji');
  const dpadBtns    = document.querySelectorAll('[data-dir]');

  if (!(canvas instanceof HTMLCanvasElement)) return;
  const ctx = canvas.getContext('2d');

  /* ── Constants ───────────────────────────────────────────────── */
  const GRID          = 20;            // cells per row/col
  const TICK_BASE     = 130;           // ms per tick at start
  const TICK_MIN      = 65;            // fastest tick
  const TICK_ACCEL    = 3;             // ms shaved per food eaten
  const OBSTACLE_INTERVAL = 4;        // new 404 obstacle every N food
  const MAX_OBSTACLES = 8;
  const LOCAL_KEY     = 'dictuzz_404_best';

  /* ── Palette (neobrutalism) ─────────────────────────────────── */
  const COLOR = {
    bg:        '#FFF8E7',
    grid:      'rgba(10,10,10,0.10)',
    snakeHead: '#FF7A2A',
    snakeBody: '#FF6B9D',
    snakeTail: '#C8A2FF',
    food:      '#FFE066',
    foodGlow:  'rgba(255,224,102,0.0)',
    obstacle:  '#FF6B9D',
    obstacleBg:'rgba(255,107,157,0.10)',
    text404:   '#0A0A0A',
    wallFlash: '#FF6B9D',
    ink:       '#0A0A0A',
  };

  /* ── Funny death messages ────────────────────────────────────── */
  const DEATH_DATA = [
    { emoji: '💀', title: 'Wasted.',         quip: 'You hit a 404. The irony writes itself.' },
    { emoji: '🐍', title: 'Snake Down!',     quip: 'That 404 wasn\'t a page — it was a wall.' },
    { emoji: '😵', title: 'Oops.',           quip: 'You found the page. It was inside the obstacle all along.' },
    { emoji: '🪦', title: 'RIP.',            quip: 'Error 404: Survival skills not found.' },
    { emoji: '🤡', title: 'Clown Mode.',     quip: 'Even the snake is embarrassed for you.' },
    { emoji: '💥', title: 'BOOM.',           quip: 'That 404 had a family. And you drove right into them.' },
    { emoji: '🫠', title: 'Melted.',         quip: 'Your score has been forwarded to /dev/null.' },
    { emoji: '🧱', title: 'Bricked.',        quip: 'Congratulations, you\'re now a 404 yourself.' },
    { emoji: '🐛', title: 'Bug Report.',     quip: 'Cause of death: skill issue.' },
    { emoji: '😂', title: 'LOL.',            quip: 'The 404 didn\'t even move. You did this to yourself.' },
    { emoji: '🎮', title: 'Game Over.',      quip: 'Insert coin to continue. Oh wait, this is free.' },
    { emoji: '☠️', title: 'Fatal Error.',    quip: 'Exception: SnakeOutOfBoundsException at line 404.' },
    { emoji: '🍕', title: 'Delivery Failed.',quip: 'The pizza (food) will never be delivered now.' },
    { emoji: '📉', title: 'Stonks Down.',    quip: 'Your portfolio just crashed harder than this snake.' },
    { emoji: '🦴', title: 'Boned.',          quip: 'This is what happens when you don\'t read the URL.' },
  ];

  /* ── State ───────────────────────────────────────────────────── */
  let cell, w, h;
  let snake, dir, queuedDir, food, obstacles, score, bestScore;
  let tickMs, tickId, running, started;
  let particles = [];
  let flashTimer = 0;

  /* ── Helpers ─────────────────────────────────────────────────── */
  function loadBest() {
    try { return parseInt(localStorage.getItem(LOCAL_KEY), 10) || 0; } catch { return 0; }
  }
  function saveBest(v) {
    try { localStorage.setItem(LOCAL_KEY, v); } catch {}
  }

  function randInt(max) { return Math.floor(Math.random() * max); }

  function occupied(x, y) {
    if (snake.some(s => s.x === x && s.y === y)) return true;
    if (food && food.x === x && food.y === y) return true;
    if (obstacles.some(o => {
      // each obstacle is a 3-wide block of cells representing "4","0","4"
      for (let dx = 0; dx < 3; dx++) {
        if (o.x + dx === x && o.y === y) return true;
      }
      return false;
    })) return true;
    return false;
  }

  function spawnFood() {
    let tries = 0;
    let fx, fy;
    do {
      fx = randInt(GRID);
      fy = randInt(GRID);
      tries++;
    } while (occupied(fx, fy) && tries < 500);
    return { x: fx, y: fy };
  }

  function spawnObstacle() {
    let tries = 0;
    let ox, oy;
    do {
      ox = randInt(GRID - 3);  // needs 3 cells wide
      oy = randInt(GRID);
      tries++;
      // check all 3 cells
      let blocked = false;
      for (let dx = 0; dx < 3; dx++) {
        if (occupied(ox + dx, oy)) { blocked = true; break; }
      }
      if (!blocked) break;
    } while (tries < 300);
    return { x: ox, y: oy };
  }

  function isObstacle(x, y) {
    return obstacles.some(o => {
      for (let dx = 0; dx < 3; dx++) {
        if (o.x + dx === x && o.y === y) return true;
      }
      return false;
    });
  }

  /* ── Particles ───────────────────────────────────────────────── */
  function emitParticles(cx, cy, color, count) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1 + Math.random() * 3;
      particles.push({
        x: cx, y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1,
        decay: 0.02 + Math.random() * 0.03,
        size: 2 + Math.random() * 4,
        color: color,
      });
    }
  }

  function updateParticles() {
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vx *= 0.96;
      p.vy *= 0.96;
      p.life -= p.decay;
      if (p.life <= 0) particles.splice(i, 1);
    }
  }

  function drawParticles() {
    particles.forEach(p => {
      ctx.globalAlpha = p.life * 0.8;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;
  }

  /* ── Sizing ──────────────────────────────────────────────────── */
  function resize() {
    const shell = document.getElementById('game-shell');
    const topBar = document.querySelector('.top-bar');
    const dpad = document.getElementById('dpad');

    const topH = topBar ? topBar.offsetHeight : 0;
    const dpadH = (dpad && getComputedStyle(dpad).display !== 'none') ? dpad.offsetHeight : 0;
    const available = shell.clientHeight - topH - dpadH - 8;
    const maxW = Math.min(shell.clientWidth, 640);
    const size = Math.min(available, maxW);

    canvas.width  = size * window.devicePixelRatio;
    canvas.height = size * window.devicePixelRatio;
    canvas.style.width  = size + 'px';
    canvas.style.height = size + 'px';
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    w = h = size;
    cell = size / GRID;
  }

  /* ── Drawing ─────────────────────────────────────────────────── */
  function drawGrid() {
    ctx.fillStyle = COLOR.bg;
    ctx.fillRect(0, 0, w, h);

    ctx.strokeStyle = COLOR.grid;
    ctx.lineWidth = 1;
    for (let i = 1; i < GRID; i++) {
      const p = i * cell;
      ctx.beginPath(); ctx.moveTo(p, 0); ctx.lineTo(p, h); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, p); ctx.lineTo(w, p); ctx.stroke();
    }
  }

  function drawFood() {
    if (!food) return;
    const x = food.x * cell;
    const y = food.y * cell;
    const pad = cell * 0.18;
    const w = cell - pad * 2;
    // hard offset shadow block
    ctx.fillStyle = COLOR.ink;
    roundRect(x + pad + 3, y + pad + 3, w, w, 4);
    ctx.fill();
    // body
    ctx.fillStyle = COLOR.food;
    roundRect(x + pad, y + pad, w, w, 4);
    ctx.fill();
    // ink border
    ctx.strokeStyle = COLOR.ink;
    ctx.lineWidth = 2;
    roundRect(x + pad, y + pad, w, w, 4);
    ctx.stroke();
  }

  function drawSnake() {
    const len = snake.length;
    snake.forEach((seg, i) => {
      const x = seg.x * cell;
      const y = seg.y * cell;
      const pad = 1;
      const radius = i === 0 ? 6 : 4;

      // alternating Gen Z palette: pink, orange, purple
      let fill;
      if (i === 0) fill = COLOR.snakeHead;        // orange head
      else if (i % 2 === 0) fill = COLOR.snakeBody; // pink
      else fill = COLOR.snakeTail;                  // purple

      // ink-ringed segment with no glow
      ctx.fillStyle = fill;
      roundRect(x + pad, y + pad, cell - pad * 2, cell - pad * 2, radius);
      ctx.fill();
      ctx.strokeStyle = COLOR.ink;
      ctx.lineWidth = 2;
      roundRect(x + pad, y + pad, cell - pad * 2, cell - pad * 2, radius);
      ctx.stroke();

      // Eyes on head
      if (i === 0) {
        drawEyes(seg);
      }
    });
  }

  function drawEyes(head) {
    const cx = head.x * cell + cell / 2;
    const cy = head.y * cell + cell / 2;
    const eyeR = cell * 0.1;
    const offset = cell * 0.18;

    let e1x, e1y, e2x, e2y;
    if (dir.x === 1)       { e1x = cx + offset; e1y = cy - offset; e2x = cx + offset; e2y = cy + offset; }
    else if (dir.x === -1) { e1x = cx - offset; e1y = cy - offset; e2x = cx - offset; e2y = cy + offset; }
    else if (dir.y === -1) { e1x = cx - offset; e1y = cy - offset; e2x = cx + offset; e2y = cy - offset; }
    else                   { e1x = cx - offset; e1y = cy + offset; e2x = cx + offset; e2y = cy + offset; }

    ctx.fillStyle = '#ffffff';
    ctx.beginPath(); ctx.arc(e1x, e1y, eyeR, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(e2x, e2y, eyeR, 0, Math.PI * 2); ctx.fill();

    // pupils
    ctx.fillStyle = COLOR.ink;
    const pr = eyeR * 0.55;
    ctx.beginPath(); ctx.arc(e1x + dir.x * pr * 0.3, e1y + dir.y * pr * 0.3, pr, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(e2x + dir.x * pr * 0.3, e2y + dir.y * pr * 0.3, pr, 0, Math.PI * 2); ctx.fill();
  }

  function drawObstacles() {
    obstacles.forEach(o => {
      const x = o.x * cell;
      const y = o.y * cell;
      const bw = cell * 3;

      // hard drop shadow
      ctx.fillStyle = COLOR.ink;
      roundRect(x + 4, y + 4, bw - 2, cell - 2, 6);
      ctx.fill();

      // pink background block
      ctx.fillStyle = COLOR.obstacle;
      roundRect(x + 1, y + 1, bw - 2, cell - 2, 6);
      ctx.fill();

      // ink border
      ctx.strokeStyle = COLOR.ink;
      ctx.lineWidth = 2.5;
      roundRect(x + 1, y + 1, bw - 2, cell - 2, 6);
      ctx.stroke();

      // "404" text
      ctx.fillStyle = COLOR.ink;
      ctx.font = `900 ${Math.floor(cell * 0.65)}px 'Archivo Black', 'JetBrains Mono', monospace`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('404', x + bw / 2, y + cell / 2 + 1);
    });
  }

  function drawWallFlash() {
    if (flashTimer > 0) {
      const a = flashTimer * 0.85;
      ctx.shadowBlur = 0;
      ctx.strokeStyle = `rgba(255, 107, 157, ${a})`;
      ctx.lineWidth = 6;
      roundRect(3, 3, w - 6, h - 6, 8);
      ctx.stroke();
      flashTimer -= 0.08;
    }
  }

  /* ── Utils ───────────────────────────────────────────────────── */
  function lerp(a, b, t) { return a + (b - a) * t; }

  function roundRect(x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
  }

  /* ── Render ──────────────────────────────────────────────────── */
  let animId;
  function renderLoop() {
    ctx.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);
    drawGrid();
    drawObstacles();
    drawFood();
    drawSnake();
    updateParticles();
    drawParticles();
    drawWallFlash();
    animId = requestAnimationFrame(renderLoop);
  }

  /* ── Game Logic ──────────────────────────────────────────────── */
  function initState() {
    const mid = Math.floor(GRID / 2);
    snake = [
      { x: mid, y: mid },
      { x: mid - 1, y: mid },
      { x: mid - 2, y: mid },
    ];
    dir = { x: 1, y: 0 };
    queuedDir = { x: 1, y: 0 };
    obstacles = [];
    score = 0;
    tickMs = TICK_BASE;
    particles = [];
    flashTimer = 0;
    food = spawnFood();
    bestScore = loadBest();
    updateUI();
  }

  function updateUI() {
    scoreEl.textContent = score;
    bestEl.textContent  = bestScore;
  }

  function tick() {
    dir = queuedDir;
    const head = {
      x: snake[0].x + dir.x,
      y: snake[0].y + dir.y,
    };

    // Wall collision
    if (head.x < 0 || head.x >= GRID || head.y < 0 || head.y >= GRID) {
      die(); return;
    }
    // Self collision
    if (snake.some(s => s.x === head.x && s.y === head.y)) {
      die(); return;
    }
    // Obstacle collision
    if (isObstacle(head.x, head.y)) {
      die(); return;
    }

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
      score++;
      tickMs = Math.max(TICK_MIN, tickMs - TICK_ACCEL);

      // Particle burst at food
      emitParticles(
        food.x * cell + cell / 2,
        food.y * cell + cell / 2,
        COLOR.food, 12
      );

      // Maybe spawn obstacle
      if (score > 0 && score % OBSTACLE_INTERVAL === 0 && obstacles.length < MAX_OBSTACLES) {
        obstacles.push(spawnObstacle());
      }

      food = spawnFood();

      if (score > bestScore) {
        bestScore = score;
        saveBest(bestScore);
      }
      updateUI();
    } else {
      snake.pop();
    }
  }

  function die() {
    running = false;
    clearInterval(tickId);

    // Death particles
    const headPx = snake[0].x * cell + cell / 2;
    const headPy = snake[0].y * cell + cell / 2;
    emitParticles(headPx, headPy, COLOR.obstacle, 24);
    flashTimer = 1;

    // Canvas shake
    canvas.classList.add('canvas-shake');
    setTimeout(() => canvas.classList.remove('canvas-shake'), 350);

    // Show death screen after a beat
    setTimeout(showDeathScreen, 600);
  }

  function showDeathScreen() {
    const d = DEATH_DATA[randInt(DEATH_DATA.length)];
    deathEmoji.textContent = d.emoji;
    deathTitle.textContent = d.title;
    deathQuip.textContent  = d.quip;
    finalScore.textContent = score;
    finalBest.textContent  = bestScore;

    deathScreen.classList.remove('hidden');
    deathScreen.style.animation = 'none';
    deathScreen.offsetHeight; // reflow
    deathScreen.style.animation = '';
  }

  function startGame() {
    initState();
    started = true;
    running = true;
    startScreen.classList.add('hidden');
    deathScreen.classList.add('hidden');
    tickId = setInterval(tick, tickMs);
  }

  function restartGame() {
    initState();
    running = true;
    deathScreen.classList.add('hidden');
    clearInterval(tickId);
    tickId = setInterval(tick, tickMs);
  }

  /* ── Input: Keyboard ─────────────────────────────────────────── */
  const DIR_MAP = {
    ArrowUp:    { x:  0, y: -1 },
    ArrowDown:  { x:  0, y:  1 },
    ArrowLeft:  { x: -1, y:  0 },
    ArrowRight: { x:  1, y:  0 },
    w: { x:  0, y: -1 },
    s: { x:  0, y:  1 },
    a: { x: -1, y:  0 },
    d: { x:  1, y:  0 },
    W: { x:  0, y: -1 },
    S: { x:  0, y:  1 },
    A: { x: -1, y:  0 },
    D: { x:  1, y:  0 },
  };

  window.addEventListener('keydown', e => {
    // Start game on any arrow/wasd press
    if (!started && DIR_MAP[e.key]) {
      e.preventDefault();
      startGame();
      return;
    }

    const next = DIR_MAP[e.key];
    if (next && running) {
      e.preventDefault();
      // Prevent 180
      if (next.x + dir.x !== 0 || next.y + dir.y !== 0) {
        queuedDir = next;
      }
    }

    // Space to restart
    if (e.key === ' ' && !running && started) {
      e.preventDefault();
      restartGame();
    }
  });

  /* ── Input: D-Pad ────────────────────────────────────────────── */
  const DIR_STR = {
    up:    { x:  0, y: -1 },
    down:  { x:  0, y:  1 },
    left:  { x: -1, y:  0 },
    right: { x:  1, y:  0 },
  };

  dpadBtns.forEach(btn => {
    btn.addEventListener('pointerdown', e => {
      e.preventDefault();
      if (!started) { startGame(); return; }
      const next = DIR_STR[btn.dataset.dir];
      if (next && running) {
        if (next.x + dir.x !== 0 || next.y + dir.y !== 0) {
          queuedDir = next;
        }
      }
    });
  });

  /* ── Input: Swipe ────────────────────────────────────────────── */
  let touchStart = null;
  canvas.addEventListener('touchstart', e => {
    const t = e.touches[0];
    touchStart = { x: t.clientX, y: t.clientY };
  }, { passive: true });

  canvas.addEventListener('touchmove', e => {
    e.preventDefault(); // prevent scroll while swiping on canvas
  }, { passive: false });

  canvas.addEventListener('touchend', e => {
    if (!touchStart) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - touchStart.x;
    const dy = t.clientY - touchStart.y;
    const absDx = Math.abs(dx);
    const absDy = Math.abs(dy);
    const threshold = 20;
    touchStart = null;

    if (Math.max(absDx, absDy) < threshold) return;

    let next;
    if (absDx > absDy) {
      next = dx > 0 ? DIR_STR.right : DIR_STR.left;
    } else {
      next = dy > 0 ? DIR_STR.down : DIR_STR.up;
    }

    if (!started) { startGame(); return; }
    if (next && running) {
      if (next.x + dir.x !== 0 || next.y + dir.y !== 0) {
        queuedDir = next;
      }
    }
  }, { passive: true });

  /* ── Buttons ─────────────────────────────────────────────────── */
  btnStart.addEventListener('click', startGame);
  btnRestart.addEventListener('click', restartGame);

  /* ── Focus / Blur ────────────────────────────────────────────── */
  window.addEventListener('blur', () => {
    if (running) { clearInterval(tickId); }
  });
  window.addEventListener('focus', () => {
    if (running) { clearInterval(tickId); tickId = setInterval(tick, tickMs); }
  });

  /* ── Resize ──────────────────────────────────────────────────── */
  window.addEventListener('resize', () => {
    resize();
  });

  /* ── Init ────────────────────────────────────────────────────── */
  resize();
  initState();
  bestEl.textContent = bestScore;
  renderLoop();

})();
