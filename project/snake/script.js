// Snake Game Logic

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game variables
const gridSize = 20;
const tileCount = canvas.width / gridSize;

let snake = [{ x: 10, y: 10 }];
let apple = { x: 15, y: 15 };
let dx = 0;
let dy = 0;
let score = 0;
let highScore = localStorage.getItem('snakeHighScore') || 0;
let gameSpeed = 150;
let gameLoop;
let isPaused = false;
let gameActive = false;

// Initialize
document.getElementById('highScore').textContent = highScore;

// Set difficulty
function setDifficulty(speed, button) {
    gameSpeed = speed;
    
    // Update active button
    document.querySelectorAll('.btn-difficulty').forEach(btn => {
        btn.classList.remove('active');
    });
    button.classList.add('active');
}

// Start game
function startGame() {
    document.getElementById('startScreen').style.display = 'none';
    document.getElementById('gameScreen').style.display = 'block';
    
    resetGameState();
    gameActive = true;
    gameLoop = setInterval(updateGame, gameSpeed);
}

// Reset game state
function resetGameState() {
    snake = [{ x: 10, y: 10 }];
    dx = 1;
    dy = 0;
    score = 0;
    isPaused = false;
    updateScore();
    placeApple();
    drawGame();
}

// Update game
function updateGame() {
    if (isPaused || !gameActive) return;
    
    moveSnake();
    
    if (checkCollision()) {
        gameOver();
        return;
    }
    
    if (checkAppleCollision()) {
        score += 10;
        updateScore();
        growSnake();
        placeApple();
        playSound('eat');
        
        // Increase speed every 50 points
        if (score % 50 === 0 && gameSpeed > 50) {
            clearInterval(gameLoop);
            gameSpeed -= 10;
            gameLoop = setInterval(updateGame, gameSpeed);
            updateSpeedLevel();
        }
    }
    
    drawGame();
}

// Move snake
function moveSnake() {
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
    snake.unshift(head);
    snake.pop();
}

// Grow snake
function growSnake() {
    const tail = { ...snake[snake.length - 1] };
    snake.push(tail);
}

// Check collision with walls or self
function checkCollision() {
    const head = snake[0];
    
    // Wall collision
    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
        return true;
    }
    
    // Self collision
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            return true;
        }
    }
    
    return false;
}

// Check apple collision
function checkAppleCollision() {
    return snake[0].x === apple.x && snake[0].y === apple.y;
}

// Place apple at random position
function placeApple() {
    let validPosition = false;
    
    while (!validPosition) {
        apple.x = Math.floor(Math.random() * tileCount);
        apple.y = Math.floor(Math.random() * tileCount);
        
        // Check if apple is not on snake
        validPosition = !snake.some(segment => segment.x === apple.x && segment.y === apple.y);
    }
}

// Draw game
function drawGame() {
    // Clear canvas
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw grid
    drawGrid();
    
    // Draw snake
    drawSnake();
    
    // Draw apple
    drawApple();
}

// Draw grid
function drawGrid() {
    ctx.strokeStyle = '#2a2a2a';
    ctx.lineWidth = 1;
    
    for (let i = 0; i <= tileCount; i++) {
        // Vertical lines
        ctx.beginPath();
        ctx.moveTo(i * gridSize, 0);
        ctx.lineTo(i * gridSize, canvas.height);
        ctx.stroke();
        
        // Horizontal lines
        ctx.beginPath();
        ctx.moveTo(0, i * gridSize);
        ctx.lineTo(canvas.width, i * gridSize);
        ctx.stroke();
    }
}

// Draw snake
function drawSnake() {
    snake.forEach((segment, index) => {
        // Gradient for snake body
        const gradient = ctx.createRadialGradient(
            segment.x * gridSize + gridSize / 2,
            segment.y * gridSize + gridSize / 2,
            0,
            segment.x * gridSize + gridSize / 2,
            segment.y * gridSize + gridSize / 2,
            gridSize / 2
        );
        
        if (index === 0) {
            // Head
            gradient.addColorStop(0, '#10b981');
            gradient.addColorStop(1, '#059669');
        } else {
            // Body
            gradient.addColorStop(0, '#34d399');
            gradient.addColorStop(1, '#10b981');
        }
        
        ctx.fillStyle = gradient;
        ctx.fillRect(
            segment.x * gridSize + 1,
            segment.y * gridSize + 1,
            gridSize - 2,
            gridSize - 2
        );
        
        // Draw eyes on head
        if (index === 0) {
            ctx.fillStyle = 'white';
            const eyeSize = 3;
            const eyeOffset = 5;
            
            // Determine eye position based on direction
            if (dx === 1) { // Right
                ctx.fillRect(segment.x * gridSize + gridSize - eyeOffset, segment.y * gridSize + 5, eyeSize, eyeSize);
                ctx.fillRect(segment.x * gridSize + gridSize - eyeOffset, segment.y * gridSize + gridSize - 8, eyeSize, eyeSize);
            } else if (dx === -1) { // Left
                ctx.fillRect(segment.x * gridSize + 2, segment.y * gridSize + 5, eyeSize, eyeSize);
                ctx.fillRect(segment.x * gridSize + 2, segment.y * gridSize + gridSize - 8, eyeSize, eyeSize);
            } else if (dy === 1) { // Down
                ctx.fillRect(segment.x * gridSize + 5, segment.y * gridSize + gridSize - eyeOffset, eyeSize, eyeSize);
                ctx.fillRect(segment.x * gridSize + gridSize - 8, segment.y * gridSize + gridSize - eyeOffset, eyeSize, eyeSize);
            } else if (dy === -1) { // Up
                ctx.fillRect(segment.x * gridSize + 5, segment.y * gridSize + 2, eyeSize, eyeSize);
                ctx.fillRect(segment.x * gridSize + gridSize - 8, segment.y * gridSize + 2, eyeSize, eyeSize);
            }
        }
    });
}

// Draw apple
function drawApple() {
    // Apple body
    const gradient = ctx.createRadialGradient(
        apple.x * gridSize + gridSize / 2,
        apple.y * gridSize + gridSize / 2,
        0,
        apple.x * gridSize + gridSize / 2,
        apple.y * gridSize + gridSize / 2,
        gridSize / 2
    );
    gradient.addColorStop(0, '#ef4444');
    gradient.addColorStop(1, '#dc2626');
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(
        apple.x * gridSize + gridSize / 2,
        apple.y * gridSize + gridSize / 2,
        gridSize / 2 - 2,
        0,
        Math.PI * 2
    );
    ctx.fill();
    
    // Apple leaf
    ctx.fillStyle = '#10b981';
    ctx.beginPath();
    ctx.ellipse(
        apple.x * gridSize + gridSize / 2 + 2,
        apple.y * gridSize + 3,
        3,
        5,
        Math.PI / 4,
        0,
        Math.PI * 2
    );
    ctx.fill();
}

// Update score display
function updateScore() {
    document.getElementById('currentScore').textContent = score;
    document.getElementById('currentScore').classList.add('score-increase');
    setTimeout(() => {
        document.getElementById('currentScore').classList.remove('score-increase');
    }, 300);
}

// Update speed level
function updateSpeedLevel() {
    const level = Math.floor(score / 50) + 1;
    document.getElementById('speedLevel').textContent = level;
}

// Toggle pause
function togglePause() {
    if (!gameActive) return;
    
    isPaused = !isPaused;
    const pauseOverlay = document.getElementById('pauseOverlay');
    pauseOverlay.style.display = isPaused ? 'flex' : 'none';
}

// Change direction (for mobile controls)
function changeDirection(direction) {
    switch (direction) {
        case 'up':
            if (dy !== 1) {
                dx = 0;
                dy = -1;
            }
            break;
        case 'down':
            if (dy !== -1) {
                dx = 0;
                dy = 1;
            }
            break;
        case 'left':
            if (dx !== 1) {
                dx = -1;
                dy = 0;
            }
            break;
        case 'right':
            if (dx !== -1) {
                dx = 1;
                dy = 0;
            }
            break;
    }
}

// Keyboard controls
document.addEventListener('keydown', (e) => {
    if (!gameActive) return;
    
    // Pause
    if (e.code === 'Space') {
        e.preventDefault();
        togglePause();
        return;
    }
    
    if (isPaused) return;
    
    // Direction controls
    switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
            if (dy !== 1) {
                dx = 0;
                dy = -1;
            }
            break;
        case 'ArrowDown':
        case 's':
        case 'S':
            if (dy !== -1) {
                dx = 0;
                dy = 1;
            }
            break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
            if (dx !== 1) {
                dx = -1;
                dy = 0;
            }
            break;
        case 'ArrowRight':
        case 'd':
        case 'D':
            if (dx !== -1) {
                dx = 1;
                dy = 0;
            }
            break;
    }
});

// Game over
function gameOver() {
    clearInterval(gameLoop);
    gameActive = false;
    
    // Update high score
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('snakeHighScore', highScore);
        document.getElementById('highScore').textContent = highScore;
        document.getElementById('newHighScore').style.display = 'block';
    } else {
        document.getElementById('newHighScore').style.display = 'none';
    }
    
    // Show game over modal
    document.getElementById('finalScore').textContent = score;
    const gameOverModal = new bootstrap.Modal(document.getElementById('gameOverModal'));
    gameOverModal.show();
    
    playSound('gameOver');
}

// End game manually
function endGame() {
    if (confirm('Yakin ingin berhenti bermain?')) {
        gameOver();
    }
}

// Restart game
function restartGame() {
    const modal = bootstrap.Modal.getInstance(document.getElementById('gameOverModal'));
    modal.hide();
    resetGameState();
    gameActive = true;
    gameLoop = setInterval(updateGame, gameSpeed);
}

// Back to menu
function backToMenu() {
    clearInterval(gameLoop);
    gameActive = false;
    
    const modal = bootstrap.Modal.getInstance(document.getElementById('gameOverModal'));
    if (modal) {
        modal.hide();
    }
    
    document.getElementById('gameScreen').style.display = 'none';
    document.getElementById('startScreen').style.display = 'block';
}

// Sound effects (using Web Audio API)
function playSound(type) {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    if (type === 'eat') {
        oscillator.frequency.value = 800;
        gainNode.gain.value = 0.1;
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.1);
    } else if (type === 'gameOver') {
        oscillator.frequency.value = 200;
        gainNode.gain.value = 0.15;
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.3);
    }
}

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    console.log('Snake Game loaded!');
    
    // Draw initial canvas
    drawGame();
    
    // Add fade-in animation
    document.querySelector('.game-container').style.opacity = '0';
    setTimeout(() => {
        document.querySelector('.game-container').style.transition = 'opacity 0.5s ease';
        document.querySelector('.game-container').style.opacity = '1';
    }, 100);
});

// Prevent scrolling with arrow keys
window.addEventListener('keydown', (e) => {
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) {
        e.preventDefault();
    }
});
