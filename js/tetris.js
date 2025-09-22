// Tetris Game
class TetrisGame {
    constructor() {
        this.canvas = document.getElementById('tetris-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.scoreDisplay = document.getElementById('tetris-score');
        this.levelDisplay = document.getElementById('tetris-level');
        this.linesDisplay = document.getElementById('tetris-lines');
        this.statusDisplay = document.getElementById('tetris-status');
        
        this.blockSize = 30;
        this.cols = 10;
        this.rows = 20;
        
        this.init();
    }
    
    init() {
        this.board = Array(this.rows).fill().map(() => Array(this.cols).fill(0));
        this.score = 0;
        this.level = 1;
        this.lines = 0;
        this.gameRunning = false;
        this.dropTime = 0;
        this.dropInterval = 1000; // milliseconds
        
        this.currentPiece = null;
        this.nextPiece = null;
        
        this.pieces = [
            { // I
                shape: [[1,1,1,1]],
                color: '#00ffff'
            },
            { // O
                shape: [[1,1],[1,1]],
                color: '#ffff00'
            },
            { // T
                shape: [[0,1,0],[1,1,1]],
                color: '#800080'
            },
            { // S
                shape: [[0,1,1],[1,1,0]],
                color: '#00ff00'
            },
            { // Z
                shape: [[1,1,0],[0,1,1]],
                color: '#ff0000'
            },
            { // J
                shape: [[1,0,0],[1,1,1]],
                color: '#0000ff'
            },
            { // L
                shape: [[0,0,1],[1,1,1]],
                color: '#ffa500'
            }
        ];
        
        this.setupEventListeners();
        this.updateDisplay();
        this.spawnPiece();
        this.draw();
    }
    
    setupEventListeners() {
        document.addEventListener('keydown', (e) => {
            if (!this.gameRunning) return;
            
            switch(e.key) {
                case 'ArrowLeft':
                    this.movePiece(-1, 0);
                    break;
                case 'ArrowRight':
                    this.movePiece(1, 0);
                    break;
                case 'ArrowDown':
                    this.movePiece(0, 1);
                    break;
                case 'ArrowUp':
                    this.rotatePiece();
                    break;
                case ' ':
                    this.hardDrop();
                    break;
            }
            e.preventDefault();
        });
    }
    
    spawnPiece() {
        if (!this.nextPiece) {
            this.nextPiece = this.getRandomPiece();
        }
        
        this.currentPiece = this.nextPiece;
        this.currentPiece.x = Math.floor(this.cols / 2) - Math.floor(this.currentPiece.shape[0].length / 2);
        this.currentPiece.y = 0;
        
        this.nextPiece = this.getRandomPiece();
        
        // Check game over
        if (this.checkCollision(this.currentPiece, this.currentPiece.x, this.currentPiece.y)) {
            this.gameOver();
            return;
        }
        
        this.gameRunning = true;
    }
    
    getRandomPiece() {
        const piece = JSON.parse(JSON.stringify(this.pieces[Math.floor(Math.random() * this.pieces.length)]));
        piece.x = 0;
        piece.y = 0;
        return piece;
    }
    
    movePiece(dx, dy) {
        if (!this.currentPiece) return;
        
        const newX = this.currentPiece.x + dx;
        const newY = this.currentPiece.y + dy;
        
        if (!this.checkCollision(this.currentPiece, newX, newY)) {
            this.currentPiece.x = newX;
            this.currentPiece.y = newY;
            this.draw();
        } else if (dy > 0) {
            // Piece has landed
            this.placePiece();
        }
    }
    
    rotatePiece() {
        if (!this.currentPiece) return;
        
        const rotated = this.rotateMatrix(this.currentPiece.shape);
        const originalShape = this.currentPiece.shape;
        
        this.currentPiece.shape = rotated;
        
        if (this.checkCollision(this.currentPiece, this.currentPiece.x, this.currentPiece.y)) {
            this.currentPiece.shape = originalShape;
        } else {
            this.draw();
        }
    }
    
    rotateMatrix(matrix) {
        const rows = matrix.length;
        const cols = matrix[0].length;
        const rotated = Array(cols).fill().map(() => Array(rows).fill(0));
        
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                rotated[c][rows - 1 - r] = matrix[r][c];
            }
        }
        
        return rotated;
    }
    
    hardDrop() {
        while (!this.checkCollision(this.currentPiece, this.currentPiece.x, this.currentPiece.y + 1)) {
            this.currentPiece.y++;
        }
        this.placePiece();
    }
    
    checkCollision(piece, x, y) {
        for (let r = 0; r < piece.shape.length; r++) {
            for (let c = 0; c < piece.shape[r].length; c++) {
                if (piece.shape[r][c]) {
                    const newX = x + c;
                    const newY = y + r;
                    
                    if (newX < 0 || newX >= this.cols || newY >= this.rows) {
                        return true;
                    }
                    
                    if (newY >= 0 && this.board[newY][newX]) {
                        return true;
                    }
                }
            }
        }
        return false;
    }
    
    placePiece() {
        if (!this.currentPiece) return;
        
        for (let r = 0; r < this.currentPiece.shape.length; r++) {
            for (let c = 0; c < this.currentPiece.shape[r].length; c++) {
                if (this.currentPiece.shape[r][c]) {
                    const x = this.currentPiece.x + c;
                    const y = this.currentPiece.y + r;
                    
                    if (y >= 0) {
                        this.board[y][x] = this.currentPiece.color;
                    }
                }
            }
        }
        
        this.clearLines();
        this.spawnPiece();
        this.draw();
    }
    
    clearLines() {
        let linesCleared = 0;
        
        for (let row = this.rows - 1; row >= 0; row--) {
            if (this.board[row].every(cell => cell !== 0)) {
                this.board.splice(row, 1);
                this.board.unshift(Array(this.cols).fill(0));
                linesCleared++;
                row++; // Check the same row again
            }
        }
        
        if (linesCleared > 0) {
            this.lines += linesCleared;
            this.score += linesCleared * 100 * this.level;
            this.level = Math.floor(this.lines / 10) + 1;
            this.dropInterval = Math.max(50, 1000 - (this.level - 1) * 50);
            this.updateDisplay();
        }
    }
    
    update(deltaTime) {
        if (!this.gameRunning || !this.currentPiece) return;
        
        this.dropTime += deltaTime;
        
        if (this.dropTime >= this.dropInterval) {
            this.movePiece(0, 1);
            this.dropTime = 0;
        }
    }
    
    draw() {
        // Clear canvas
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw board
        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                if (this.board[r][c]) {
                    this.ctx.fillStyle = this.board[r][c];
                    this.ctx.fillRect(c * this.blockSize, r * this.blockSize, this.blockSize - 1, this.blockSize - 1);
                }
            }
        }
        
        // Draw current piece
        if (this.currentPiece) {
            this.ctx.fillStyle = this.currentPiece.color;
            for (let r = 0; r < this.currentPiece.shape.length; r++) {
                for (let c = 0; c < this.currentPiece.shape[r].length; c++) {
                    if (this.currentPiece.shape[r][c]) {
                        const x = (this.currentPiece.x + c) * this.blockSize;
                        const y = (this.currentPiece.y + r) * this.blockSize;
                        this.ctx.fillRect(x, y, this.blockSize - 1, this.blockSize - 1);
                    }
                }
            }
        }
        
        // Draw grid lines
        this.ctx.strokeStyle = '#333';
        this.ctx.lineWidth = 1;
        for (let i = 0; i <= this.cols; i++) {
            this.ctx.beginPath();
            this.ctx.moveTo(i * this.blockSize, 0);
            this.ctx.lineTo(i * this.blockSize, this.canvas.height);
            this.ctx.stroke();
        }
        for (let i = 0; i <= this.rows; i++) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, i * this.blockSize);
            this.ctx.lineTo(this.canvas.width, i * this.blockSize);
            this.ctx.stroke();
        }
    }
    
    updateDisplay() {
        this.scoreDisplay.textContent = this.score;
        this.levelDisplay.textContent = this.level;
        this.linesDisplay.textContent = this.lines;
    }
    
    gameOver() {
        this.gameRunning = false;
        this.statusDisplay.textContent = 'Game Over! Press Reset to play again.';
        Utils.saveScore('tetris', this.score);
    }
    
    reset() {
        this.init();
        this.statusDisplay.textContent = 'Use arrow keys to play';
    }
    
    stop() {
        this.gameRunning = false;
    }
}

// Game loop
let lastTime = 0;
function gameLoop(currentTime) {
    const deltaTime = currentTime - lastTime;
    lastTime = currentTime;
    
    if (window.tetrisGame) {
        window.tetrisGame.update(deltaTime);
    }
    
    requestAnimationFrame(gameLoop);
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.tetrisGame = new TetrisGame();
    requestAnimationFrame(gameLoop);
});