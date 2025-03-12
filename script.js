const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const tileSize = 20; // Adjusted tile size
const map = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
    [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
];

const pacMan = {
    x: tileSize * 1.5,
    y: tileSize * 1.5,
    radius: tileSize / 2,
    speed: 2,
    angle1: 0.25 * Math.PI,
    angle2: 1.75 * Math.PI,
    direction: 'right'
};

const pellets = [];
const pelletRadius = 5;
const pelletCount = 50;
let score = 0;

const ghosts = [
    { x: tileSize * 10, y: tileSize * 10, radius: tileSize / 2, speed: 1.5, direction: 'left', color: 'red' },
    { x: tileSize * 15, y: tileSize * 15, radius: tileSize / 2, speed: 1.5, direction: 'up', color: 'pink' },
    // Add more ghosts as needed
];

const powerPellets = [];
const powerPelletRadius = 10;
const powerPelletCount = 4;
let powerMode = false;
let powerModeTimer = 0;

let lives = 3;
let level = 1;
let gameStarted = false;

function createPellets() {
    for (let i = 0; i < pelletCount; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        pellets.push({ x, y });
    }
}

function createPowerPellets() {
    for (let i = 0; i < powerPelletCount; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        powerPellets.push({ x, y });
    }
}

function drawPellets() {
    pellets.forEach(pellet => {
        ctx.beginPath();
        ctx.arc(pellet.x, pellet.y, pelletRadius, 0, 2 * Math.PI, false);
        ctx.fillStyle = 'white';
        ctx.fill();
        ctx.closePath();
    });
}

function drawPowerPellets() {
    powerPellets.forEach(pellet => {
        ctx.beginPath();
        ctx.arc(pellet.x, pellet.y, powerPelletRadius, 0, 2 * Math.PI, false);
        ctx.fillStyle = 'blue';
        ctx.fill();
        ctx.closePath();
    });
}

function drawPacMan() {
    ctx.beginPath();
    ctx.arc(pacMan.x, pacMan.y, pacMan.radius, pacMan.angle1, pacMan.angle2, false);
    ctx.lineTo(pacMan.x, pacMan.y);
    ctx.fillStyle = 'yellow';
    ctx.fill();
    ctx.closePath();
}

function drawGhosts() {
    ghosts.forEach(ghost => {
        ctx.beginPath();
        ctx.arc(ghost.x, ghost.y, ghost.radius, 0, 2 * Math.PI, false);
        ctx.fillStyle = ghost.color;
        ctx.fill();
        ctx.closePath();
    });
}

function drawMap() {
    for (let row = 0; row < map.length; row++) {
        for (let col = 0; col < map[row].length; col++) {
            if (map[row][col] === 1) {
                ctx.fillStyle = 'blue';
                ctx.fillRect(col * tileSize, row * tileSize, tileSize, tileSize);
            } else if (map[row][col] === 0) {
                ctx.fillStyle = 'black';
                ctx.fillRect(col * tileSize, row * tileSize, tileSize, tileSize);
            }
        }
    }
}

function updatePacMan() {
    let nextX = pacMan.x;
    let nextY = pacMan.y;

    if (pacMan.direction === 'right') nextX += pacMan.speed;
    if (pacMan.direction === 'left') nextX -= pacMan.speed;
    if (pacMan.direction === 'up') nextY -= pacMan.speed;
    if (pacMan.direction === 'down') nextY += pacMan.speed;

    const col = Math.floor(nextX / tileSize);
    const row = Math.floor(nextY / tileSize);

    if (map[row][col] === 0) {
        pacMan.x = nextX;
        pacMan.y = nextY;
    }

    if (pacMan.x > canvas.width) pacMan.x = 0;
    if (pacMan.x < 0) pacMan.x = canvas.width;
    if (pacMan.y > canvas.height) pacMan.y = 0;
    if (pacMan.y < 0) pacMan.y = canvas.height;
}

function updateGhosts() {
    ghosts.forEach(ghost => {
        const dx = pacMan.x - ghost.x;
        const dy = pacMan.y - ghost.y;
        const distance = Math.hypot(dx, dy);

        if (distance < 200) {
            if (Math.abs(dx) > Math.abs(dy)) {
                ghost.direction = dx > 0 ? 'right' : 'left';
            } else {
                ghost.direction = dy > 0 ? 'down' : 'up';
            }
        }

        let nextX = ghost.x;
        let nextY = ghost.y;

        if (ghost.direction === 'right') nextX += ghost.speed;
        if (ghost.direction === 'left') nextX -= ghost.speed;
        if (ghost.direction === 'up') nextY -= ghost.speed;
        if (ghost.direction === 'down') nextY += ghost.speed;

        const col = Math.floor(nextX / tileSize);
        const row = Math.floor(nextY / tileSize);

        if (map[row][col] === 0) {
            ghost.x = nextX;
            ghost.y = nextY;
        }

        if (ghost.x > canvas.width) ghost.x = 0;
        if (ghost.x < 0) ghost.x = canvas.width;
        if (ghost.y > canvas.height) ghost.y = 0;
        if (ghost.y < 0) ghost.y = canvas.height;
    });
}

function checkPelletCollision() {
    pellets.forEach((pellet, index) => {
        const dist = Math.hypot(pacMan.x - pellet.x, pacMan.y - pellet.y);
        if (dist < pacMan.radius + pelletRadius) {
            pellets.splice(index, 1);
            score += 10;
        }
    });
}

function checkPowerPelletCollision() {
    powerPellets.forEach((pellet, index) => {
        const dist = Math.hypot(pacMan.x - pellet.x, pacMan.y - pellet.y);
        if (dist < pacMan.radius + powerPelletRadius) {
            powerPellets.splice(index, 1);
            powerMode = true;
            powerModeTimer = 300; // Power mode lasts for 300 frames
        }
    });
}

function checkGhostCollision() {
    ghosts.forEach((ghost, index) => {
        const dist = Math.hypot(pacMan.x - ghost.x, pacMan.y - ghost.y);
        if (dist < pacMan.radius + ghost.radius) {
            if (powerMode) {
                ghosts.splice(index, 1); // Pac-Man eats the ghost
                score += 50;
            } else {
                // Game over logic here
                alert('Game Over!');
                document.location.reload();
            }
        }
    });
}

function drawScore() {
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.fillText(`Score: ${score}`, 10, 20);
}

function drawLives() {
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.fillText(`Lives: ${lives}`, 10, 40);
}

function drawLevel() {
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.fillText(`Level: ${level}`, 10, 60);
}

function startScreen() {
    ctx.fillStyle = 'white';
    ctx.font = '40px Arial';
    ctx.fillText('Press Enter to Start', canvas.width / 2 - 150, canvas.height / 2);
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

document.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && !gameStarted) {
        gameStarted = true;
        gameLoop();
    }
    if (event.key === 'ArrowRight') pacMan.direction = 'right';
    if (event.key === 'ArrowLeft') pacMan.direction = 'left';
    if (event.key === 'ArrowUp') pacMan.direction = 'up';
    if (event.key === 'ArrowDown') pacMan.direction = 'down';
});

function gameLoop() {
    if (!gameStarted) {
        startScreen();
        return;
    }

    clearCanvas();
    drawMap();
    drawPellets();
    drawPowerPellets();
    drawPacMan();
    drawGhosts();
    updatePacMan();
    updateGhosts();
    checkPelletCollision();
    checkPowerPelletCollision();
    checkGhostCollision();
    drawScore();
    drawLives();
    drawLevel();

    if (powerMode) {
        powerModeTimer--;
        if (powerModeTimer <= 0) {
            powerMode = false;
        }
    }

    requestAnimationFrame(gameLoop);
}

createPellets();
createPowerPellets();
gameLoop();