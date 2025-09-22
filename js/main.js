// Main Game Console Controller
class GameConsole {
    constructor() {
        this.currentGame = null;
        this.screens = {
            'game-selection': document.getElementById('game-selection'),
            'tic-tac-toe': document.getElementById('tic-tac-toe'),
            'snake': document.getElementById('snake'),
            'memory': document.getElementById('memory'),
            'rock-paper-scissors': document.getElementById('rock-paper-scissors')
        };
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.showScreen('game-selection');
    }
    
    setupEventListeners() {
        // Game selection cards
        document.querySelectorAll('.game-card').forEach(card => {
            card.addEventListener('click', (e) => {
                const gameType = card.dataset.game;
                this.startGame(gameType);
            });
        });
        
        // Back buttons
        document.querySelectorAll('.back-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.showGameSelection();
            });
        });
        
        // Reset buttons
        document.querySelectorAll('.reset-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const gameScreen = e.target.closest('.game-screen');
                const gameId = gameScreen.id;
                this.resetGame(gameId);
            });
        });
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.showGameSelection();
            }
        });
    }
    
    showScreen(screenId) {
        // Hide all screens
        Object.values(this.screens).forEach(screen => {
            screen.classList.remove('active');
        });
        
        // Show target screen
        if (this.screens[screenId]) {
            this.screens[screenId].classList.add('active');
            this.currentGame = screenId;
        }
    }
    
    startGame(gameType) {
        this.showScreen(gameType);
        
        // Initialize specific game
        switch(gameType) {
            case 'tic-tac-toe':
                if (window.ticTacToe) {
                    window.ticTacToe.reset();
                }
                break;
            case 'snake':
                if (window.snakeGame) {
                    window.snakeGame.reset();
                }
                break;
            case 'memory':
                if (window.memoryGame) {
                    window.memoryGame.reset();
                }
                break;
            case 'rock-paper-scissors':
                if (window.rpsGame) {
                    window.rpsGame.reset();
                }
                break;
        }
    }
    
    showGameSelection() {
        // Stop any running games
        if (this.currentGame === 'snake' && window.snakeGame) {
            window.snakeGame.stop();
        }
        
        this.showScreen('game-selection');
    }
    
    resetGame(gameId) {
        switch(gameId) {
            case 'tic-tac-toe':
                if (window.ticTacToe) {
                    window.ticTacToe.reset();
                }
                break;
            case 'snake':
                if (window.snakeGame) {
                    window.snakeGame.reset();
                }
                break;
            case 'memory':
                if (window.memoryGame) {
                    window.memoryGame.reset();
                }
                break;
            case 'rock-paper-scissors':
                if (window.rpsGame) {
                    window.rpsGame.reset();
                }
                break;
        }
    }
}

// Utility functions
const Utils = {
    // Save to localStorage
    saveScore: (game, score) => {
        const key = `${game}_high_score`;
        const currentHigh = parseInt(localStorage.getItem(key)) || 0;
        if (score > currentHigh) {
            localStorage.setItem(key, score.toString());
            return true; // New high score
        }
        return false;
    },
    
    // Load from localStorage
    loadScore: (game) => {
        const key = `${game}_high_score`;
        return parseInt(localStorage.getItem(key)) || 0;
    },
    
    // Animate element
    animate: (element, className, duration = 1000) => {
        element.classList.add(className);
        setTimeout(() => {
            element.classList.remove(className);
        }, duration);
    },
    
    // Random number generator
    random: (min, max) => {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    
    // Debounce function
    debounce: (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
};

// Initialize the game console when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.gameConsole = new GameConsole();
});

// Export for use in other files
window.Utils = Utils;