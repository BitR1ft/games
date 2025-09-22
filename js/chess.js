// Chess Game (Simplified)
class ChessGame {
    constructor() {
        this.board = document.getElementById('chess-board');
        this.currentPlayerDisplay = document.getElementById('chess-current-player');
        this.movesDisplay = document.getElementById('chess-moves');
        this.statusDisplay = document.getElementById('chess-status');
        
        this.init();
    }
    
    init() {
        this.currentPlayer = 'white';
        this.moves = 0;
        this.selectedSquare = null;
        this.gameActive = true;
        
        // Simplified chess board setup
        this.boardState = [
            ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
            ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
            ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R']
        ];
        
        this.pieceSymbols = {
            'K': '♔', 'Q': '♕', 'R': '♖', 'B': '♗', 'N': '♘', 'P': '♙',
            'k': '♚', 'q': '♛', 'r': '♜', 'b': '♝', 'n': '♞', 'p': '♟'
        };
        
        this.createBoard();
        this.updateDisplay();
    }
    
    createBoard() {
        this.board.innerHTML = '';
        
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const square = document.createElement('div');
                square.className = `chess-square ${(row + col) % 2 === 0 ? 'light' : 'dark'}`;
                square.dataset.row = row;
                square.dataset.col = col;
                
                const piece = this.boardState[row][col];
                if (piece) {
                    square.textContent = this.pieceSymbols[piece];
                }
                
                square.addEventListener('click', () => this.handleSquareClick(row, col));
                this.board.appendChild(square);
            }
        }
    }
    
    handleSquareClick(row, col) {
        if (!this.gameActive) return;
        
        const square = this.getSquare(row, col);
        const piece = this.boardState[row][col];
        
        if (this.selectedSquare) {
            // Try to move
            if (this.isValidMove(this.selectedSquare.row, this.selectedSquare.col, row, col)) {
                this.makeMove(this.selectedSquare.row, this.selectedSquare.col, row, col);
                this.clearSelection();
                this.switchPlayer();
            } else {
                this.clearSelection();
                if (piece && this.isPieceOwnedByCurrentPlayer(piece)) {
                    this.selectSquare(row, col);
                }
            }
        } else {
            // Select piece
            if (piece && this.isPieceOwnedByCurrentPlayer(piece)) {
                this.selectSquare(row, col);
            }
        }
    }
    
    selectSquare(row, col) {
        this.selectedSquare = { row, col };
        const square = this.getSquare(row, col);
        square.classList.add('selected');
        
        // Show possible moves (simplified)
        this.showPossibleMoves(row, col);
    }
    
    clearSelection() {
        if (this.selectedSquare) {
            const square = this.getSquare(this.selectedSquare.row, this.selectedSquare.col);
            square.classList.remove('selected');
            this.selectedSquare = null;
        }
        
        // Clear possible move highlights
        document.querySelectorAll('.chess-square.possible-move').forEach(square => {
            square.classList.remove('possible-move');
        });
    }
    
    showPossibleMoves(row, col) {
        const piece = this.boardState[row][col];
        if (!piece) return;
        
        // Simplified move validation - just show adjacent squares for demonstration
        for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
                if (dr === 0 && dc === 0) continue;
                
                const newRow = row + dr;
                const newCol = col + dc;
                
                if (this.isValidPosition(newRow, newCol) && 
                    this.isValidMove(row, col, newRow, newCol)) {
                    const square = this.getSquare(newRow, newCol);
                    square.classList.add('possible-move');
                }
            }
        }
    }
    
    isValidMove(fromRow, fromCol, toRow, toCol) {
        if (!this.isValidPosition(toRow, toCol)) return false;
        
        const piece = this.boardState[fromRow][fromCol];
        const targetPiece = this.boardState[toRow][toCol];
        
        if (!piece) return false;
        
        // Can't capture own piece
        if (targetPiece && this.isPieceOwnedByCurrentPlayer(targetPiece)) {
            return false;
        }
        
        // Simplified movement rules (just check if it's a valid position)
        const rowDiff = Math.abs(toRow - fromRow);
        const colDiff = Math.abs(toCol - fromCol);
        
        // Basic movement validation (simplified)
        switch (piece.toLowerCase()) {
            case 'p': // Pawn
                const direction = piece === 'P' ? -1 : 1;
                if (colDiff === 0 && !targetPiece) {
                    return toRow === fromRow + direction;
                } else if (colDiff === 1 && targetPiece) {
                    return toRow === fromRow + direction;
                }
                return false;
            case 'r': // Rook
                return (rowDiff === 0 || colDiff === 0);
            case 'n': // Knight
                return (rowDiff === 2 && colDiff === 1) || (rowDiff === 1 && colDiff === 2);
            case 'b': // Bishop
                return rowDiff === colDiff;
            case 'q': // Queen
                return (rowDiff === 0 || colDiff === 0 || rowDiff === colDiff);
            case 'k': // King
                return rowDiff <= 1 && colDiff <= 1;
            default:
                return false;
        }
    }
    
    makeMove(fromRow, fromCol, toRow, toCol) {
        const piece = this.boardState[fromRow][fromCol];
        const capturedPiece = this.boardState[toRow][toCol];
        
        // Move piece
        this.boardState[toRow][toCol] = piece;
        this.boardState[fromRow][fromCol] = null;
        
        // Update visual board
        const fromSquare = this.getSquare(fromRow, fromCol);
        const toSquare = this.getSquare(toRow, toCol);
        
        fromSquare.textContent = '';
        toSquare.textContent = this.pieceSymbols[piece];
        
        this.moves++;
        this.updateDisplay();
        
        // Check for game end (simplified)
        if (capturedPiece && capturedPiece.toLowerCase() === 'k') {
            this.gameActive = false;
            this.statusDisplay.textContent = `${this.currentPlayer} wins!`;
        }
    }
    
    switchPlayer() {
        this.currentPlayer = this.currentPlayer === 'white' ? 'black' : 'white';
        this.updateDisplay();
    }
    
    isPieceOwnedByCurrentPlayer(piece) {
        if (this.currentPlayer === 'white') {
            return piece === piece.toUpperCase();
        } else {
            return piece === piece.toLowerCase();
        }
    }
    
    isValidPosition(row, col) {
        return row >= 0 && row < 8 && col >= 0 && col < 8;
    }
    
    getSquare(row, col) {
        return this.board.children[row * 8 + col];
    }
    
    updateDisplay() {
        this.currentPlayerDisplay.textContent = this.currentPlayer;
        this.movesDisplay.textContent = this.moves;
        
        if (this.gameActive) {
            this.statusDisplay.textContent = `${this.currentPlayer} to move`;
        }
    }
    
    reset() {
        this.init();
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.chessGame = new ChessGame();
});