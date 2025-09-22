// Tic-Tac-Toe Game
class TicTacToe {
    constructor() {
        this.board = Array(9).fill('');
        this.currentPlayer = 'X';
        this.gameActive = true;
        this.scores = { X: 0, O: 0 };
        
        this.winningCombinations = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
            [0, 4, 8], [2, 4, 6] // Diagonals
        ];
        
        this.cells = document.querySelectorAll('#tic-tac-toe .cell');
        this.currentPlayerDisplay = document.getElementById('current-player');
        this.scoreXDisplay = document.getElementById('score-x');
        this.scoreODisplay = document.getElementById('score-o');
        this.statusDisplay = document.getElementById('game-status');
        
        this.init();
    }
    
    init() {
        this.cells.forEach((cell, index) => {
            cell.addEventListener('click', () => this.makeMove(index));
        });
        
        this.updateDisplay();
    }
    
    makeMove(index) {
        if (!this.gameActive || this.board[index] !== '') {
            return;
        }
        
        this.board[index] = this.currentPlayer;
        this.cells[index].textContent = this.currentPlayer;
        this.cells[index].classList.add(this.currentPlayer.toLowerCase());
        
        // Add click animation
        Utils.animate(this.cells[index], 'scale-animation', 300);
        
        if (this.checkWinner()) {
            this.gameActive = false;
            this.scores[this.currentPlayer]++;
            this.statusDisplay.textContent = `Player ${this.currentPlayer} wins! 🎉`;
            this.statusDisplay.style.color = this.currentPlayer === 'X' ? '#ff6b6b' : '#4ecdc4';
            this.highlightWinningCells();
            this.updateScoreDisplay();
        } else if (this.board.every(cell => cell !== '')) {
            this.gameActive = false;
            this.statusDisplay.textContent = "It's a tie! 🤝";
            this.statusDisplay.style.color = '#ffa502';
        } else {
            this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
            this.updateDisplay();
        }
    }
    
    checkWinner() {
        return this.winningCombinations.some(combination => {
            const [a, b, c] = combination;
            return this.board[a] && 
                   this.board[a] === this.board[b] && 
                   this.board[a] === this.board[c];
        });
    }
    
    highlightWinningCells() {
        this.winningCombinations.forEach(combination => {
            const [a, b, c] = combination;
            if (this.board[a] && 
                this.board[a] === this.board[b] && 
                this.board[a] === this.board[c]) {
                
                this.cells[a].style.background = 'rgba(255, 255, 255, 0.3)';
                this.cells[b].style.background = 'rgba(255, 255, 255, 0.3)';
                this.cells[c].style.background = 'rgba(255, 255, 255, 0.3)';
                
                this.cells[a].style.transform = 'scale(1.1)';
                this.cells[b].style.transform = 'scale(1.1)';
                this.cells[c].style.transform = 'scale(1.1)';
            }
        });
    }
    
    updateDisplay() {
        this.currentPlayerDisplay.textContent = this.currentPlayer;
        this.currentPlayerDisplay.style.color = this.currentPlayer === 'X' ? '#ff6b6b' : '#4ecdc4';
        
        if (this.gameActive) {
            this.statusDisplay.textContent = `Player ${this.currentPlayer}'s turn`;
            this.statusDisplay.style.color = '#fff';
        }
    }
    
    updateScoreDisplay() {
        this.scoreXDisplay.textContent = this.scores.X;
        this.scoreODisplay.textContent = this.scores.O;
    }
    
    reset() {
        this.board = Array(9).fill('');
        this.currentPlayer = 'X';
        this.gameActive = true;
        
        this.cells.forEach(cell => {
            cell.textContent = '';
            cell.className = 'cell';
            cell.style.background = '';
            cell.style.transform = '';
        });
        
        this.updateDisplay();
        this.statusDisplay.textContent = '';
    }
    
    resetScores() {
        this.scores = { X: 0, O: 0 };
        this.updateScoreDisplay();
    }
}

// CSS for animations
const style = document.createElement('style');
style.textContent = `
    .scale-animation {
        animation: cellClick 0.3s ease;
    }
    
    @keyframes cellClick {
        0% { transform: scale(1); }
        50% { transform: scale(1.2); }
        100% { transform: scale(1); }
    }
`;
document.head.appendChild(style);

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.ticTacToe = new TicTacToe();
});