const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const livesElement = document.getElementById('lives');

let score = 0;
let lives = 3;
let gameRunning = true;

const player = {
  x: canvas.width / 2 - 25,
  y: canvas.height - 50,
  width: 50,
  height: 20,
  speed: 5
};

const bullets = [];
const invaders = [];
const invaderRows = 5;
const invaderCols = 10;
const invaderWidth = 30;
const invaderHeight = 20;
const invaderSpeed = 1;
let invaderDirection = 1;

for (let row = 0; row < invaderRows; row++) {
  for (let col = 0; col < invaderCols; col++) {
    invaders.push({
      x: col * (invaderWidth + 10) + 50,
      y: row * (invaderHeight + 10) + 50,
      width: invaderWidth,
      height: invaderHeight,
      alive: true
    });
  }
}

const keys = {};

document.addEventListener('keydown', (e) => {
  keys[e.code] = true;
  if (e.code === 'Space') {
    bullets.push({
      x: player.x + player.width / 2 - 2,
      y: player.y,
      width: 4,
      height: 10,
      speed: 7
    });
  }
});

document.addEventListener('keyup', (e) => {
  keys[e.code] = false;
});

function update() {
  if (!gameRunning) return;

  // Player movement
  if (keys['ArrowLeft'] && player.x > 0) {
    player.x -= player.speed;
  }
  if (keys['ArrowRight'] && player.x < canvas.width - player.width) {
    player.x += player.speed;
  }

  // Bullets
  bullets.forEach((bullet, index) => {
    bullet.y -= bullet.speed;
    if (bullet.y < 0) {
      bullets.splice(index, 1);
    }
  });

  // Invaders
  let edgeReached = false;
  invaders.forEach(invader => {
    if (invader.alive) {
      invader.x += invaderDirection * invaderSpeed;
      if (invader.x <= 0 || invader.x + invader.width >= canvas.width) {
        edgeReached = true;
      }
    }
  });
  if (edgeReached) {
    invaderDirection *= -1;
    invaders.forEach(invader => {
      if (invader.alive) {
        invader.y += 20;
      }
    });
  }

  // Collision detection
  bullets.forEach((bullet, bIndex) => {
    invaders.forEach((invader, iIndex) => {
      if (invader.alive &&
          bullet.x < invader.x + invader.width &&
          bullet.x + bullet.width > invader.x &&
          bullet.y < invader.y + invader.height &&
          bullet.y + bullet.height > invader.y) {
        invader.alive = false;
        bullets.splice(bIndex, 1);
        score += 10;
        scoreElement.textContent = `Score: ${score}`;
      }
    });
  });

  // Check if invaders reach bottom
  invaders.forEach(invader => {
    if (invader.alive && invader.y + invader.height >= player.y) {
      lives--;
      livesElement.textContent = `Lives: ${lives}`;
      if (lives <= 0) {
        gameRunning = false;
        alert('Game Over');
      }
      // Reset invaders
      invaders.forEach(i => i.alive = true);
      invaderDirection = 1;
      for (let row = 0; row < invaderRows; row++) {
        for (let col = 0; col < invaderCols; col++) {
          const index = row * invaderCols + col;
          invaders[index].x = col * (invaderWidth + 10) + 50;
          invaders[index].y = row * (invaderHeight + 10) + 50;
        }
      }
    }
  });

  // Check win
  if (invaders.every(invader => !invader.alive)) {
    gameRunning = false;
    alert('You Win!');
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Player
  ctx.fillStyle = 'green';
  ctx.fillRect(player.x, player.y, player.width, player.height);

  // Bullets
  ctx.fillStyle = 'yellow';
  bullets.forEach(bullet => {
    ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
  });

  // Invaders
  ctx.fillStyle = 'red';
  invaders.forEach(invader => {
    if (invader.alive) {
      ctx.fillRect(invader.x, invader.y, invader.width, invader.height);
    }
  });
}

function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

gameLoop();
