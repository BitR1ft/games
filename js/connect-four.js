// Connect Four Game
class ConnectFourGame {
    constructor() {
        this.board = document.getElementById('connect-four-board');
        this.currentPlayerDisplay = document.getElementById('connect-four-current-player');
        this.redScoreDisplay = document.getElementById('connect-four-red-score');
        this.yellowScoreDisplay = document.getElementById('connect-four-yellow-score');
        this.statusDisplay = document.getElementById('connect-four-status');
        
        this.rows = 6;
        this.cols = 7;
        
        this.init();
    }
    
    init() {
        this.currentPlayer = 'red';
        this.gameActive = true;
        this.scores = { red: 0, yellow: 0 };
        
        // Initialize board state
        this.boardState = Array(this.rows).fill().map(() => Array(this.cols).fill(null));
        
        this.createBoard();
        this.updateDisplay();
    }
    
    createBoard() {
        this.board.innerHTML = '';
        
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                const cell = document.createElement('div');
                cell.className = 'connect-four-cell';
                cell.dataset.row = row;
                cell.dataset.col = col;
                
                // Only add click listeners to top row for column selection
                if (row === 0) {
                    cell.addEventListener('click', () => this.dropPiece(col));
                    cell.style.cursor = 'pointer';
                }
                
                this.board.appendChild(cell);
            }
        }
    }
    
    dropPiece(col) {
        if (!this.gameActive) return;
        
        // Find the lowest empty row in this column
        let targetRow = -1;
        for (let row = this.rows - 1; row >= 0; row--) {
            if (this.boardState[row][col] === null) {
                targetRow = row;
                break;
            }
        }
        
        // Column is full
        if (targetRow === -1) {
            this.statusDisplay.textContent = 'Column is full! Try another column.';
            return;
        }
        
        // Drop the piece
        this.boardState[targetRow][col] = this.currentPlayer;
        this.updateCell(targetRow, col);
        
        // Check for win
        if (this.checkWin(targetRow, col)) {
            this.gameActive = false;
            this.scores[this.currentPlayer]++;
            this.statusDisplay.textContent = `${this.currentPlayer.toUpperCase()} wins!`;
            this.updateDisplay();
        } else if (this.checkDraw()) {
            this.gameActive = false;
            this.statusDisplay.textContent = "It's a draw!";
        } else {
            this.switchPlayer();
        }
    }
    
    updateCell(row, col) {
        const cellIndex = row * this.cols + col;
        const cell = this.board.children[cellIndex];
        cell.classList.add(this.currentPlayer);
    }
    
    checkWin(row, col) {
        const player = this.currentPlayer;
        
        // Check horizontal
        if (this.checkDirection(row, col, 0, 1, player) ||
            this.checkDirection(row, col, 0, -1, player)) {
            return true;
        }
        
        // Check vertical
        if (this.checkDirection(row, col, 1, 0, player) ||
            this.checkDirection(row, col, -1, 0, player)) {
            return true;
        }
        
        // Check diagonal (top-left to bottom-right)
        if (this.checkDirection(row, col, 1, 1, player) ||
            this.checkDirection(row, col, -1, -1, player)) {
            return true;
        }
        
        // Check diagonal (top-right to bottom-left)
        if (this.checkDirection(row, col, 1, -1, player) ||
            this.checkDirection(row, col, -1, 1, player)) {
            return true;
        }
        
        return false;
    }
    
    checkDirection(row, col, deltaRow, deltaCol, player) {
        let count = 1; // Count the current piece
        
        // Check in one direction
        let r = row + deltaRow;
        let c = col + deltaCol;
        while (r >= 0 && r < this.rows && c >= 0 && c < this.cols && 
               this.boardState[r][c] === player) {
            count++;
            r += deltaRow;
            c += deltaCol;
        }
        
        // Check in the opposite direction
        r = row - deltaRow;
        c = col - deltaCol;
        while (r >= 0 && r < this.rows && c >= 0 && c < this.cols && 
               this.boardState[r][c] === player) {
            count++;
            r -= deltaRow;
            c -= deltaCol;
        }
        
        return count >= 4;
    }
    
    checkDraw() {
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                if (this.boardState[row][col] === null) {
                    return false;
                }
            }
        }
        return true;
    }
    
    switchPlayer() {
        this.currentPlayer = this.currentPlayer === 'red' ? 'yellow' : 'red';
        this.updateDisplay();
    }
    
    updateDisplay() {
        this.currentPlayerDisplay.textContent = this.currentPlayer.toUpperCase();
        this.redScoreDisplay.textContent = this.scores.red;
        this.yellowScoreDisplay.textContent = this.scores.yellow;
        
        if (this.gameActive) {
            this.statusDisplay.textContent = `${this.currentPlayer.toUpperCase()}'s turn - Click a column to drop your piece`;
        }
    }
    
    reset() {
        this.currentPlayer = 'red';
        this.gameActive = true;
        this.boardState = Array(this.rows).fill().map(() => Array(this.cols).fill(null));
        
        // Reset visual board
        Array.from(this.board.children).forEach(cell => {
            cell.classList.remove('red', 'yellow');
        });
        
        this.updateDisplay();
        this.statusDisplay.textContent = 'Click a column to drop your piece';
    }
    
    resetScores() {
        this.scores = { red: 0, yellow: 0 };
        this.updateDisplay();
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.connectFourGame = new ConnectFourGame();
});