// Snake Game
class SnakeGame {
    constructor() {
        this.canvas = document.getElementById('snake-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.scoreDisplay = document.getElementById('snake-score');
        this.highScoreDisplay = document.getElementById('snake-high-score');
        this.statusDisplay = document.getElementById('snake-status');
        
        // Game settings
        this.gridSize = 20;
        this.tileCount = this.canvas.width / this.gridSize;
        
        // Game state
        this.snake = [{ x: 10, y: 10 }];
        this.food = { x: 15, y: 15 };
        this.dx = 0;
        this.dy = 0;
        this.score = 0;
        this.highScore = Utils.loadScore('snake');
        this.gameRunning = false;
        this.gameLoop = null;
        
        this.init();
    }
    
    init() {
        this.setupControls();
        this.updateHighScore();
        this.drawGame();
        this.statusDisplay.textContent = 'Press any arrow key to start!';
    }
    
    setupControls() {
        // Keyboard controls
        document.addEventListener('keydown', (e) => {
            if (document.getElementById('snake').classList.contains('active')) {
                this.handleKeyPress(e);
            }
        });
        
        // Touch controls
        document.querySelectorAll('#snake .control-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const direction = btn.dataset.direction;
                this.changeDirection(direction);
            });
        });
    }
    
    handleKeyPress(e) {
        const key = e.key;
        
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(key)) {
            e.preventDefault();
            
            if (!this.gameRunning) {
                this.start();
            }
            
            switch(key) {
                case 'ArrowUp':
                    this.changeDirection('up');
                    break;
                case 'ArrowDown':
                    this.changeDirection('down');
                    break;
                case 'ArrowLeft':
                    this.changeDirection('left');
                    break;
                case 'ArrowRight':
                    this.changeDirection('right');
                    break;
            }
        }
    }
    
    changeDirection(direction) {
        if (!this.gameRunning) {
            this.start();
        }
        
        switch(direction) {
            case 'up':
                if (this.dy === 0) { this.dx = 0; this.dy = -1; }
                break;
            case 'down':
                if (this.dy === 0) { this.dx = 0; this.dy = 1; }
                break;
            case 'left':
                if (this.dx === 0) { this.dx = -1; this.dy = 0; }
                break;
            case 'right':
                if (this.dx === 0) { this.dx = 1; this.dy = 0; }
                break;
        }
    }
    
    start() {
        if (this.gameRunning) return;
        
        this.gameRunning = true;
        this.statusDisplay.textContent = 'Game started! Use arrows to control.';
        this.gameLoop = setInterval(() => this.update(), 150);
    }
    
    update() {
        this.moveSnake();
        
        if (this.checkCollision()) {
            this.gameOver();
            return;
        }
        
        if (this.checkFoodCollision()) {
            this.eatFood();
        }
        
        this.drawGame();
    }
    
    moveSnake() {
        const head = { x: this.snake[0].x + this.dx, y: this.snake[0].y + this.dy };
        this.snake.unshift(head);
        
        // Remove tail if no food was eaten
        if (head.x !== this.food.x || head.y !== this.food.y) {
            this.snake.pop();
        }
    }
    
    checkCollision() {
        const head = this.snake[0];
        
        // Wall collision
        if (head.x < 0 || head.x >= this.tileCount || 
            head.y < 0 || head.y >= this.tileCount) {
            return true;
        }
        
        // Self collision
        for (let i = 1; i < this.snake.length; i++) {
            if (head.x === this.snake[i].x && head.y === this.snake[i].y) {
                return true;
            }
        }
        
        return false;
    }
    
    checkFoodCollision() {
        const head = this.snake[0];
        return head.x === this.food.x && head.y === this.food.y;
    }
    
    eatFood() {
        this.score += 10;
        this.scoreDisplay.textContent = this.score;
        this.generateFood();
        
        // Add visual feedback
        this.canvas.style.boxShadow = '0 0 20px #4ecdc4';
        setTimeout(() => {
            this.canvas.style.boxShadow = '';
        }, 200);
    }
    
    generateFood() {
        let newFood;
        do {
            newFood = {
                x: Math.floor(Math.random() * this.tileCount),
                y: Math.floor(Math.random() * this.tileCount)
            };
        } while (this.snake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
        
        this.food = newFood;
    }
    
    drawGame() {
        // Clear canvas
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw snake
        this.ctx.fillStyle = '#4ecdc4';
        this.snake.forEach((segment, index) => {
            if (index === 0) {
                // Head with gradient
                const gradient = this.ctx.createLinearGradient(
                    segment.x * this.gridSize, segment.y * this.gridSize,
                    (segment.x + 1) * this.gridSize, (segment.y + 1) * this.gridSize
                );
                gradient.addColorStop(0, '#4ecdc4');
                gradient.addColorStop(1, '#44a08d');
                this.ctx.fillStyle = gradient;
            } else {
                this.ctx.fillStyle = '#4ecdc4';
            }
            
            this.ctx.fillRect(
                segment.x * this.gridSize + 1,
                segment.y * this.gridSize + 1,
                this.gridSize - 2,
                this.gridSize - 2
            );
        });
        
        // Draw food
        this.ctx.fillStyle = '#ff6b6b';
        this.ctx.fillRect(
            this.food.x * this.gridSize + 2,
            this.food.y * this.gridSize + 2,
            this.gridSize - 4,
            this.gridSize - 4
        );
        
        // Add food glow effect
        this.ctx.shadowColor = '#ff6b6b';
        this.ctx.shadowBlur = 10;
        this.ctx.fillRect(
            this.food.x * this.gridSize + 2,
            this.food.y * this.gridSize + 2,
            this.gridSize - 4,
            this.gridSize - 4
        );
        this.ctx.shadowBlur = 0;
    }
    
    gameOver() {
        this.stop();
        this.statusDisplay.textContent = `Game Over! Final Score: ${this.score}`;
        
        // Check for high score
        if (Utils.saveScore('snake', this.score)) {
            this.statusDisplay.textContent += ' 🎉 NEW HIGH SCORE!';
            this.updateHighScore();
        }
        
        // Add game over effect
        this.canvas.style.boxShadow = '0 0 20px #ff6b6b';
        setTimeout(() => {
            this.canvas.style.boxShadow = '';
        }, 1000);
    }
    
    stop() {
        this.gameRunning = false;
        if (this.gameLoop) {
            clearInterval(this.gameLoop);
            this.gameLoop = null;
        }
    }
    
    reset() {
        this.stop();
        this.snake = [{ x: 10, y: 10 }];
        this.food = { x: 15, y: 15 };
        this.dx = 0;
        this.dy = 0;
        this.score = 0;
        this.scoreDisplay.textContent = this.score;
        this.statusDisplay.textContent = 'Press any arrow key to start!';
        this.drawGame();
    }
    
    updateHighScore() {
        this.highScore = Utils.loadScore('snake');
        this.highScoreDisplay.textContent = this.highScore;
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.snakeGame = new SnakeGame();
});