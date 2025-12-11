// Tic Tac Toe Game Logic

let currentPlayer = 'X';
let gameMode = 'pvp'; // 'pvp' or 'pvc'
let gameActive = false;
let gameState = ['', '', '', '', '', '', '', '', ''];
let scores = {
    X: 0,
    O: 0,
    draws: 0
};

// Winning combinations
const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

// Start game with selected mode
function startGame(mode) {
    gameMode = mode;
    gameActive = true;
    currentPlayer = 'X';
    gameState = ['', '', '', '', '', '', '', '', ''];
    
    // Update UI
    document.getElementById('modeSelection').style.display = 'none';
    document.getElementById('gameBoard').style.display = 'block';
    document.getElementById('gameStats').style.display = 'block';
    
    // Update player O name if playing against computer
    const playerOName = document.getElementById('playerOName');
    if (mode === 'pvc') {
        playerOName.textContent = 'Computer';
    } else {
        playerOName.textContent = 'Player O';
    }
    
    // Initialize board
    initializeBoard();
    updateGameStatus();
}

// Initialize the game board
function initializeBoard() {
    const board = document.getElementById('board');
    const cells = board.querySelectorAll('.cell');
    
    cells.forEach((cell, index) => {
        cell.textContent = '';
        cell.className = 'cell';
        cell.onclick = () => handleCellClick(index);
    });
}

// Handle cell click
function handleCellClick(index) {
    if (!gameActive || gameState[index] !== '' || (gameMode === 'pvc' && currentPlayer === 'O')) {
        return;
    }
    
    makeMove(index);
}

// Make a move
function makeMove(index) {
    gameState[index] = currentPlayer;
    
    const cell = document.querySelector(`[data-index="${index}"]`);
    cell.textContent = currentPlayer;
    cell.classList.add('taken', currentPlayer.toLowerCase());
    
    // Check for win or draw
    if (checkWin()) {
        handleWin();
        return;
    }
    
    if (checkDraw()) {
        handleDraw();
        return;
    }
    
    // Switch player
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    updateGameStatus();
    updatePlayerCards();
    
    // If playing against computer and it's computer's turn
    if (gameMode === 'pvc' && currentPlayer === 'O') {
        setTimeout(computerMove, 500);
    }
}

// Computer AI move
function computerMove() {
    if (!gameActive) return;
    
    // Try to win
    let move = findBestMove('O');
    if (move === -1) {
        // Try to block player from winning
        move = findBestMove('X');
    }
    if (move === -1) {
        // Take center if available
        if (gameState[4] === '') {
            move = 4;
        }
    }
    if (move === -1) {
        // Take a corner
        const corners = [0, 2, 6, 8];
        const availableCorners = corners.filter(i => gameState[i] === '');
        if (availableCorners.length > 0) {
            move = availableCorners[Math.floor(Math.random() * availableCorners.length)];
        }
    }
    if (move === -1) {
        // Take any available cell
        const availableCells = gameState.map((cell, idx) => cell === '' ? idx : null).filter(val => val !== null);
        move = availableCells[Math.floor(Math.random() * availableCells.length)];
    }
    
    if (move !== -1) {
        makeMove(move);
    }
}

// Find best move for AI
function findBestMove(player) {
    for (let condition of winningConditions) {
        const [a, b, c] = condition;
        const cells = [gameState[a], gameState[b], gameState[c]];
        
        // Check if two cells are filled with player's symbol and one is empty
        if (cells.filter(cell => cell === player).length === 2 && cells.filter(cell => cell === '').length === 1) {
            if (gameState[a] === '') return a;
            if (gameState[b] === '') return b;
            if (gameState[c] === '') return c;
        }
    }
    return -1;
}

// Check for win
function checkWin() {
    for (let condition of winningConditions) {
        const [a, b, c] = condition;
        if (gameState[a] && gameState[a] === gameState[b] && gameState[a] === gameState[c]) {
            // Highlight winning cells
            highlightWinningCells([a, b, c]);
            return true;
        }
    }
    return false;
}

// Check for draw
function checkDraw() {
    return gameState.every(cell => cell !== '');
}

// Highlight winning cells
function highlightWinningCells(cells) {
    cells.forEach(index => {
        const cell = document.querySelector(`[data-index="${index}"]`);
        cell.classList.add('winner');
    });
}

// Handle win
function handleWin() {
    gameActive = false;
    scores[currentPlayer]++;
    updateScores();
    updateStats();
    
    // Show win modal after a short delay
    setTimeout(() => {
        const winnerText = document.getElementById('winnerText');
        if (gameMode === 'pvc') {
            winnerText.textContent = currentPlayer === 'X' ? 'Kamu Menang!' : 'Computer Menang!';
        } else {
            winnerText.textContent = `Player ${currentPlayer} Menang!`;
        }
        const winModal = new bootstrap.Modal(document.getElementById('winModal'));
        winModal.show();
    }, 1000);
}

// Handle draw
function handleDraw() {
    gameActive = false;
    scores.draws++;
    updateStats();
    
    // Show draw modal after a short delay
    setTimeout(() => {
        const drawModal = new bootstrap.Modal(document.getElementById('drawModal'));
        drawModal.show();
    }, 500);
}

// Update game status
function updateGameStatus() {
    const statusElement = document.getElementById('gameStatus');
    if (gameMode === 'pvc') {
        statusElement.textContent = currentPlayer === 'X' ? 'Giliran Kamu' : 'Giliran Computer';
    } else {
        statusElement.textContent = `Giliran Player ${currentPlayer}`;
    }
}

// Update player cards (active indicator)
function updatePlayerCards() {
    const playerXCard = document.getElementById('playerXCard');
    const playerOCard = document.getElementById('playerOCard');
    
    if (currentPlayer === 'X') {
        playerXCard.classList.add('active');
        playerOCard.classList.remove('active');
    } else {
        playerOCard.classList.add('active');
        playerXCard.classList.remove('active');
    }
}

// Update scores display
function updateScores() {
    document.getElementById('scoreX').textContent = scores.X;
    document.getElementById('scoreO').textContent = scores.O;
}

// Update game statistics
function updateStats() {
    if (gameMode === 'pvc') {
        document.getElementById('totalWins').textContent = scores.X;
        document.getElementById('totalLosses').textContent = scores.O;
    } else {
        document.getElementById('totalWins').textContent = scores.X + scores.O;
        document.getElementById('totalLosses').textContent = 0;
    }
    document.getElementById('totalDraws').textContent = scores.draws;
}

// Reset game
function resetGame() {
    gameActive = true;
    currentPlayer = 'X';
    gameState = ['', '', '', '', '', '', '', '', ''];
    
    initializeBoard();
    updateGameStatus();
    updatePlayerCards();
}

// Back to menu
function backToMenu() {
    // Reset scores
    scores = {
        X: 0,
        O: 0,
        draws: 0
    };
    
    updateScores();
    updateStats();
    
    // Show mode selection, hide game board
    document.getElementById('modeSelection').style.display = 'block';
    document.getElementById('gameBoard').style.display = 'none';
    document.getElementById('gameStats').style.display = 'none';
    
    gameActive = false;
}

// Keyboard support
document.addEventListener('keydown', (e) => {
    if (!gameActive || (gameMode === 'pvc' && currentPlayer === 'O')) return;
    
    const keyMap = {
        '1': 6, '2': 7, '3': 8,
        '4': 3, '5': 4, '6': 5,
        '7': 0, '8': 1, '9': 2
    };
    
    if (keyMap.hasOwnProperty(e.key)) {
        const index = keyMap[e.key];
        if (gameState[index] === '') {
            handleCellClick(index);
        }
    }
});

// Add sound effects (optional - using Web Audio API)
function playSound(type) {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    if (type === 'move') {
        oscillator.frequency.value = 800;
        gainNode.gain.value = 0.1;
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.1);
    } else if (type === 'win') {
        oscillator.frequency.value = 1000;
        gainNode.gain.value = 0.15;
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.3);
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    console.log('Tic Tac Toe Game loaded!');
    
    // Add fade-in animation
    document.querySelector('.game-container').style.opacity = '0';
    setTimeout(() => {
        document.querySelector('.game-container').style.transition = 'opacity 0.5s ease';
        document.querySelector('.game-container').style.opacity = '1';
    }, 100);
});
