const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

// Game State
let state = 'start'; // start, play, over
let score = 0;
let best = localStorage.getItem('flappyBest') || 0;
let frame = 0;
let canRestart = false;

// Bird
const bird = {
    x: 80,
    y: 250,
    w: 34,
    h: 24,
    vy: 0,
    gravity: 0.25,
    jump: -5.5
};

// Pipes
let pipes = [];
const pipeGap = 160;
const pipeWidth = 60;
const pipeSpeed = 2.5;
let pipeTimer = 0;

// Ground
const groundY = 520;
let groundX = 0;

// Colors
const sky = '#4ec0ca';
const pipeColor = '#5ebc67';
const groundColor = '#deaa5f';

// Init
document.getElementById('highScore').textContent = best;

// Controls
document.addEventListener('keydown', e => {
    if (e.code === 'Space') {
        e.preventDefault();
        handleInput();
    }
});

canvas.addEventListener('click', handleInput);

function handleInput() {
    if (state === 'play') {
        bird.vy = bird.jump;
    } else if (state === 'start') {
        startGame();
    } else if (state === 'over' && canRestart) {
        startGame();
    }
}

function startGame() {
    state = 'play';
    score = 0;
    frame = 0;
    bird.y = 250;
    bird.vy = 0;
    pipes = [];
    pipeTimer = 0;
    canRestart = false;
    
    document.getElementById('startScreen').classList.add('hidden');
    document.getElementById('gameOverScreen').classList.add('hidden');
    document.getElementById('scoreDisplay').classList.remove('hidden');
    document.getElementById('currentScore').textContent = 0;
    
    loop();
}

function loop() {
    if (state !== 'play') return;
    
    update();
    render();
    frame++;
    
    requestAnimationFrame(loop);
}

function update() {
    // Bird physics
    bird.vy += bird.gravity;
    bird.y += bird.vy;
    
    // Collisions
    if (bird.y + bird.h >= groundY || bird.y <= 0) {
        gameOver();
        return;
    }
    
    // Spawn pipes
    pipeTimer++;
    if (pipeTimer > 100) {
        spawnPipe();
        pipeTimer = 0;
    }
    
    // Update pipes
    for (let i = pipes.length - 1; i >= 0; i--) {
        const p = pipes[i];
        p.x -= pipeSpeed;
        
        // Remove offscreen
        if (p.x + pipeWidth < 0) {
            pipes.splice(i, 1);
            continue;
        }
        
        // Score
        if (!p.passed && p.x + pipeWidth < bird.x) {
            p.passed = true;
            score++;
            document.getElementById('currentScore').textContent = score;
        }
        
        // Collision
        if (bird.x + bird.w > p.x && bird.x < p.x + pipeWidth) {
            if (bird.y < p.top || bird.y + bird.h > p.bottom) {
                gameOver();
                return;
            }
        }
    }
    
    // Ground scroll
    groundX -= pipeSpeed;
    if (groundX <= -30) groundX = 0;
}

function render() {
    // Sky
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Clouds
    ctx.fillStyle = 'rgba(255,255,255,0.6)';
    drawCloud(100 - (frame % 400), 80);
    drawCloud(300 - (frame % 500), 150);
    
    // Pipes
    pipes.forEach(p => {
        ctx.fillStyle = pipeColor;
        
        // Top
        ctx.fillRect(p.x, 0, pipeWidth, p.top);
        ctx.fillRect(p.x - 5, p.top - 30, pipeWidth + 10, 30);
        
        // Bottom
        ctx.fillRect(p.x, p.bottom, pipeWidth, canvas.height - p.bottom);
        ctx.fillRect(p.x - 5, p.bottom, pipeWidth + 10, 30);
        
        // Borders
        ctx.strokeStyle = '#3d9943';
        ctx.lineWidth = 3;
        ctx.strokeRect(p.x, 0, pipeWidth, p.top);
        ctx.strokeRect(p.x - 5, p.top - 30, pipeWidth + 10, 30);
        ctx.strokeRect(p.x, p.bottom, pipeWidth, canvas.height - p.bottom);
        ctx.strokeRect(p.x - 5, p.bottom, pipeWidth + 10, 30);
    });
    
    // Ground
    ctx.fillStyle = groundColor;
    ctx.fillRect(0, groundY, canvas.width, canvas.height - groundY);
    
    ctx.fillStyle = '#c4914d';
    for (let i = 0; i < canvas.width; i += 30) {
        ctx.fillRect(groundX + i, groundY, 20, 10);
        ctx.fillRect(groundX + i + 10, groundY + 15, 15, 8);
    }
    
    // Bird
    ctx.save();
    ctx.translate(bird.x + bird.w / 2, bird.y + bird.h / 2);
    const rot = Math.min(Math.max(bird.vy * 3, -30), 90);
    ctx.rotate(rot * Math.PI / 180);
    
    ctx.fillStyle = '#ffd93d';
    ctx.beginPath();
    ctx.ellipse(0, 0, bird.w / 2, bird.h / 2, 0, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = '#ffb93d';
    ctx.beginPath();
    ctx.ellipse(-5, 0, 8, 12, -20 * Math.PI / 180, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.arc(10, -5, 5, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.arc(12, -5, 3, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = '#ff6b35';
    ctx.beginPath();
    ctx.moveTo(15, 0);
    ctx.lineTo(20, -3);
    ctx.lineTo(20, 3);
    ctx.closePath();
    ctx.fill();
    
    ctx.restore();
}

function drawCloud(x, y) {
    ctx.beginPath();
    ctx.arc(x, y, 20, 0, Math.PI * 2);
    ctx.arc(x + 25, y, 30, 0, Math.PI * 2);
    ctx.arc(x + 50, y, 20, 0, Math.PI * 2);
    ctx.fill();
}

function spawnPipe() {
    const minTop = 50;
    const maxTop = groundY - pipeGap - 50;
    const top = Math.random() * (maxTop - minTop) + minTop;
    
    pipes.push({
        x: canvas.width,
        top: top,
        bottom: top + pipeGap,
        passed: false
    });
}

function gameOver() {
    state = 'over';
    
    if (score > best) {
        best = score;
        localStorage.setItem('flappyBest', best);
    }
    
    setTimeout(() => {
        document.getElementById('scoreDisplay').classList.add('hidden');
        document.getElementById('score').textContent = score;
        document.getElementById('best').textContent = best;
        document.getElementById('gameOverScreen').classList.remove('hidden');
        
        setTimeout(() => {
            canRestart = true;
        }, 300);
    }, 500);
}

console.log('🐦 Flappy Bird Ready!');
