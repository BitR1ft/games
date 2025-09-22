// 2048 Game
class Game2048 {
    constructor() {
        this.board = document.getElementById('2048-board');
        this.scoreDisplay = document.getElementById('2048-score');
        this.bestDisplay = document.getElementById('2048-best');
        this.statusDisplay = document.getElementById('2048-status');
        
        this.size = 4;
        this.init();
    }
    
    init() {
        this.grid = Array(this.size).fill().map(() => Array(this.size).fill(0));
        this.score = 0;
        this.best = Utils.loadScore('2048') || 0;
        this.gameActive = true;
        
        this.createBoard();
        this.addRandomTile();
        this.addRandomTile();
        this.setupEventListeners();
        this.updateDisplay();
    }
    
    createBoard() {
        this.board.innerHTML = '';
        
        for (let row = 0; row < this.size; row++) {
            for (let col = 0; col < this.size; col++) {
                const tile = document.createElement('div');
                tile.className = 'tile-2048';
                tile.dataset.row = row;
                tile.dataset.col = col;
                this.board.appendChild(tile);
            }
        }
    }
    
    setupEventListeners() {
        document.addEventListener('keydown', (e) => {
            if (!this.gameActive) return;
            
            switch(e.key) {
                case 'ArrowUp':
                    this.move('up');
                    break;
                case 'ArrowDown':
                    this.move('down');
                    break;
                case 'ArrowLeft':
                    this.move('left');
                    break;
                case 'ArrowRight':
                    this.move('right');
                    break;
                default:
                    return;
            }
            e.preventDefault();
        });
    }
    
    addRandomTile() {
        const emptyCells = [];
        
        for (let row = 0; row < this.size; row++) {
            for (let col = 0; col < this.size; col++) {
                if (this.grid[row][col] === 0) {
                    emptyCells.push({ row, col });
                }
            }
        }
        
        if (emptyCells.length > 0) {
            const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
            this.grid[randomCell.row][randomCell.col] = Math.random() < 0.9 ? 2 : 4;
        }
    }
    
    move(direction) {
        const originalGrid = this.grid.map(row => [...row]);
        let moved = false;
        
        switch(direction) {
            case 'left':
                moved = this.moveLeft();
                break;
            case 'right':
                moved = this.moveRight();
                break;
            case 'up':
                moved = this.moveUp();
                break;
            case 'down':
                moved = this.moveDown();
                break;
        }
        
        if (moved) {
            this.addRandomTile();
            this.updateDisplay();
            
            if (this.checkWin()) {
                this.statusDisplay.textContent = 'You won! Keep playing for a higher score.';
            } else if (this.checkGameOver()) {
                this.gameOver();
            }
        }
    }
    
    moveLeft() {
        let moved = false;
        
        for (let row = 0; row < this.size; row++) {
            const line = this.grid[row].filter(cell => cell !== 0);
            
            // Merge tiles
            for (let i = 0; i < line.length - 1; i++) {
                if (line[i] === line[i + 1]) {
                    line[i] *= 2;
                    this.score += line[i];
                    line.splice(i + 1, 1);
                }
            }
            
            // Pad with zeros
            while (line.length < this.size) {
                line.push(0);
            }
            
            // Check if row changed
            for (let col = 0; col < this.size; col++) {
                if (this.grid[row][col] !== line[col]) {
                    moved = true;
                }
                this.grid[row][col] = line[col];
            }
        }
        
        return moved;
    }
    
    moveRight() {
        let moved = false;
        
        for (let row = 0; row < this.size; row++) {
            const line = this.grid[row].filter(cell => cell !== 0);
            
            // Merge tiles (from right)
            for (let i = line.length - 1; i > 0; i--) {
                if (line[i] === line[i - 1]) {
                    line[i] *= 2;
                    this.score += line[i];
                    line.splice(i - 1, 1);
                    i--;
                }
            }
            
            // Pad with zeros at the beginning
            while (line.length < this.size) {
                line.unshift(0);
            }
            
            // Check if row changed
            for (let col = 0; col < this.size; col++) {
                if (this.grid[row][col] !== line[col]) {
                    moved = true;
                }
                this.grid[row][col] = line[col];
            }
        }
        
        return moved;
    }
    
    moveUp() {
        let moved = false;
        
        for (let col = 0; col < this.size; col++) {
            const line = [];
            for (let row = 0; row < this.size; row++) {
                if (this.grid[row][col] !== 0) {
                    line.push(this.grid[row][col]);
                }
            }
            
            // Merge tiles
            for (let i = 0; i < line.length - 1; i++) {
                if (line[i] === line[i + 1]) {
                    line[i] *= 2;
                    this.score += line[i];
                    line.splice(i + 1, 1);
                }
            }
            
            // Pad with zeros
            while (line.length < this.size) {
                line.push(0);
            }
            
            // Check if column changed
            for (let row = 0; row < this.size; row++) {
                if (this.grid[row][col] !== line[row]) {
                    moved = true;
                }
                this.grid[row][col] = line[row];
            }
        }
        
        return moved;
    }
    
    moveDown() {
        let moved = false;
        
        for (let col = 0; col < this.size; col++) {
            const line = [];
            for (let row = 0; row < this.size; row++) {
                if (this.grid[row][col] !== 0) {
                    line.push(this.grid[row][col]);
                }
            }
            
            // Merge tiles (from bottom)
            for (let i = line.length - 1; i > 0; i--) {
                if (line[i] === line[i - 1]) {
                    line[i] *= 2;
                    this.score += line[i];
                    line.splice(i - 1, 1);
                    i--;
                }
            }
            
            // Pad with zeros at the beginning
            while (line.length < this.size) {
                line.unshift(0);
            }
            
            // Check if column changed
            for (let row = 0; row < this.size; row++) {
                if (this.grid[row][col] !== line[row]) {
                    moved = true;
                }
                this.grid[row][col] = line[row];
            }
        }
        
        return moved;
    }
    
    checkWin() {
        for (let row = 0; row < this.size; row++) {
            for (let col = 0; col < this.size; col++) {
                if (this.grid[row][col] === 2048) {
                    return true;
                }
            }
        }
        return false;
    }
    
    checkGameOver() {
        // Check for empty cells
        for (let row = 0; row < this.size; row++) {
            for (let col = 0; col < this.size; col++) {
                if (this.grid[row][col] === 0) {
                    return false;
                }
            }
        }
        
        // Check for possible merges
        for (let row = 0; row < this.size; row++) {
            for (let col = 0; col < this.size; col++) {
                const current = this.grid[row][col];
                
                // Check right
                if (col < this.size - 1 && this.grid[row][col + 1] === current) {
                    return false;
                }
                
                // Check down
                if (row < this.size - 1 && this.grid[row + 1][col] === current) {
                    return false;
                }
            }
        }
        
        return true;
    }
    
    updateDisplay() {
        this.scoreDisplay.textContent = this.score;
        
        if (this.score > this.best) {
            this.best = this.score;
            Utils.saveScore('2048', this.best);
        }
        this.bestDisplay.textContent = this.best;
        
        // Update tiles
        for (let row = 0; row < this.size; row++) {
            for (let col = 0; col < this.size; col++) {
                const tile = this.board.children[row * this.size + col];
                const value = this.grid[row][col];
                
                tile.textContent = value === 0 ? '' : value;
                tile.className = `tile-2048${value > 0 ? ' tile-' + value : ''}`;
            }
        }
    }
    
    gameOver() {
        this.gameActive = false;
        this.statusDisplay.textContent = 'Game Over! Press Reset to play again.';
    }
    
    reset() {
        this.init();
        this.statusDisplay.textContent = 'Use arrow keys to move tiles';
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.game2048 = new Game2048();
});