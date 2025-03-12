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

function drawPacMan() {
    ctx.beginPath();
    ctx.arc(pacMan.x, pacMan.y, pacMan.radius, pacMan.angle1, pacMan.angle2, false);
    ctx.lineTo(pacMan.x, pacMan.y);
    ctx.fillStyle = 'yellow';
    ctx.fill();
    ctx.closePath();
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

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function gameLoop() {
    clearCanvas();
    drawPacMan();
    updatePacMan();
    requestAnimationFrame(gameLoop);
}

document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowRight') pacMan.direction = 'right';
    if (event.key === 'ArrowLeft') pacMan.direction = 'left';
    if (event.key === 'ArrowUp') pacMan.direction = 'up';
    if (event.key === 'ArrowDown') pacMan.direction = 'down';
});

gameLoop();