const root = document.querySelector('.case-not-found');
const board = document.getElementById('snake-board');
const scoreEl = document.getElementById('snake-score');
const controls = document.querySelectorAll('[data-direction]');

if (root) {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (reduceMotion) {
    root.classList.add('is-ready');
  } else {
    window.addEventListener(
      'load',
      () => {
        window.requestAnimationFrame(() => {
          root.classList.add('is-ready');
        });
      },
      { once: true }
    );
  }
}

if (board instanceof HTMLCanvasElement && scoreEl) {
  const ctx = board.getContext('2d');
  const gridSize = 16;
  const cell = board.width / gridSize;
  const initialState = () => ({
    snake: [{ x: 8, y: 8 }],
    direction: { x: 1, y: 0 },
    queued: { x: 1, y: 0 },
    food: spawnFood([{ x: 8, y: 8 }]),
    score: 0
  });

  let state = initialState();
  let gameId = window.setInterval(tick, 150);

  function spawnFood(snake) {
    let food = { x: 4, y: 4 };

    do {
      food = {
        x: Math.floor(Math.random() * gridSize),
        y: Math.floor(Math.random() * gridSize)
      };
    } while (snake.some(segment => segment.x === food.x && segment.y === food.y));

    return food;
  }

  function setDirection(next) {
    const opposite = state.direction.x + next.x === 0 && state.direction.y + next.y === 0;
    if (!opposite) {
      state.queued = next;
    }
  }

  function resetGame() {
    state = initialState();
    updateScore();
  }

  function updateScore() {
    scoreEl.textContent = String(state.score);
  }

  function drawCell(x, y, fill) {
    ctx.fillStyle = fill;
    ctx.fillRect(x * cell + 2, y * cell + 2, cell - 4, cell - 4);
  }

  function render() {
    ctx.clearRect(0, 0, board.width, board.height);

    ctx.fillStyle = '#e8dcc8';
    ctx.fillRect(0, 0, board.width, board.height);

    drawCell(state.food.x, state.food.y, '#8b1a1a');

    state.snake.forEach((segment, index) => {
      drawCell(segment.x, segment.y, index === 0 ? '#1a3a8b' : '#1f271f');
    });
  }

  function tick() {
    state.direction = state.queued;
    const head = {
      x: state.snake[0].x + state.direction.x,
      y: state.snake[0].y + state.direction.y
    };

    const hitWall = head.x < 0 || head.x >= gridSize || head.y < 0 || head.y >= gridSize;
    const hitSelf = state.snake.some(segment => segment.x === head.x && segment.y === head.y);

    if (hitWall || hitSelf) {
      resetGame();
      render();
      return;
    }

    state.snake.unshift(head);

    if (head.x === state.food.x && head.y === state.food.y) {
      state.score += 1;
      state.food = spawnFood(state.snake);
      updateScore();
    } else {
      state.snake.pop();
    }

    render();
  }

  const directionMap = {
    ArrowUp: { x: 0, y: -1 },
    ArrowDown: { x: 0, y: 1 },
    ArrowLeft: { x: -1, y: 0 },
    ArrowRight: { x: 1, y: 0 },
    w: { x: 0, y: -1 },
    a: { x: -1, y: 0 },
    s: { x: 0, y: 1 },
    d: { x: 1, y: 0 },
    up: { x: 0, y: -1 },
    down: { x: 0, y: 1 },
    left: { x: -1, y: 0 },
    right: { x: 1, y: 0 }
  };

  window.addEventListener('keydown', event => {
    const next = directionMap[event.key];
    if (next) {
      event.preventDefault();
      setDirection(next);
    }
  });

  controls.forEach(control => {
    control.addEventListener('click', () => {
      const next = directionMap[control.getAttribute('data-direction')];
      if (next) {
        setDirection(next);
      }
    });
  });

  window.addEventListener('blur', () => {
    window.clearInterval(gameId);
  });

  window.addEventListener('focus', () => {
    window.clearInterval(gameId);
    gameId = window.setInterval(tick, 150);
  });

  updateScore();
  render();
}
