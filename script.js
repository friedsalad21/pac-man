const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const pacMan = {
    x: 50,
    y: 50,
    radius: 20,
    speed: 5,
    angle1: 0.25 * Math.PI,
    angle2: 1.75 * Math.PI,
    direction: 'right'
};

const pellets = [];
const pelletRadius = 5;
const pelletCount = 50;
let score = 0;

const ghosts = [
    { x: 100, y: 100, radius: 20, speed: 2, direction: 'left', color: 'red' },
    { x: 200, y: 200, radius: 20, speed: 2, direction: 'up', color: 'pink' },
    // Add more ghosts as needed
];

const powerPellets = [];
const powerPelletRadius = 10;
const powerPelletCount = 4;
let powerMode = false;
let powerModeTimer = 0;

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

function updatePacMan() {
    if (pacMan.direction === 'right') {
        pacMan.x += pacMan.speed;
    } else if (pacMan.direction === 'left') {
        pacMan.x -= pacMan.speed;
    } else if (pacMan.direction === 'up') {
        pacMan.y -= pacMan.speed;
    } else if (pacMan.direction === 'down') {
        pacMan.y += pacMan.speed;
    }

    if (pacMan.x > canvas.width) pacMan.x = 0;
    if (pacMan.x < 0) pacMan.x = canvas.width;
    if (pacMan.y > canvas.height) pacMan.y = 0;
    if (pacMan.y < 0) pacMan.y = canvas.height;
}

function updateGhosts() {
    ghosts.forEach(ghost => {
        if (ghost.direction === 'right') ghost.x += ghost.speed;
        if (ghost.direction === 'left') ghost.x -= ghost.speed;
        if (ghost.direction === 'up') ghost.y -= ghost.speed;
        if (ghost.direction === 'down') ghost.y += ghost.speed;

        // Change direction randomly
        if (Math.random() < 0.01) {
            const directions = ['right', 'left', 'up', 'down'];
            ghost.direction = directions[Math.floor(Math.random() * directions.length)];
        }

        // Wrap around canvas edges
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

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function gameLoop() {
    clearCanvas();
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

    if (powerMode) {
        powerModeTimer--;
        if (powerModeTimer <= 0) {
            powerMode = false;
        }
    }

    requestAnimationFrame(gameLoop);
}

document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowRight') pacMan.direction = 'right';
    if (event.key === 'ArrowLeft') pacMan.direction = 'left';
    if (event.key === 'ArrowUp') pacMan.direction = 'up';
    if (event.key === 'ArrowDown') pacMan.direction = 'down';
});

createPellets();
createPowerPellets();
gameLoop();