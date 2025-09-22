// Breakout Game
class BreakoutGame {
    constructor() {
        this.canvas = document.getElementById('breakout-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.scoreDisplay = document.getElementById('breakout-score');
        this.livesDisplay = document.getElementById('breakout-lives');
        this.levelDisplay = document.getElementById('breakout-level');
        this.statusDisplay = document.getElementById('breakout-status');
        
        this.init();
    }
    
    init() {
        this.gameRunning = false;
        this.score = 0;
        this.lives = 3;
        this.level = 1;
        
        // Game objects
        this.ball = {
            x: this.canvas.width / 2,
            y: this.canvas.height - 50,
            dx: 5,
            dy: -5,
            radius: 8
        };
        
        this.paddle = {
            x: this.canvas.width / 2 - 50,
            y: this.canvas.height - 20,
            width: 100,
            height: 15,
            speed: 8
        };
        
        this.brickRows = 5;
        this.brickCols = 8;
        this.brickWidth = 70;
        this.brickHeight = 20;
        this.brickPadding = 5;
        this.brickOffsetTop = 60;
        this.brickOffsetLeft = 30;
        
        this.keys = {};
        this.bricks = [];
        
        this.createBricks();
        this.setupEventListeners();
        this.updateDisplay();
        this.draw();
    }
    
    createBricks() {
        this.bricks = [];
        for (let r = 0; r < this.brickRows; r++) {
            this.bricks[r] = [];
            for (let c = 0; c < this.brickCols; c++) {
                this.bricks[r][c] = {
                    x: c * (this.brickWidth + this.brickPadding) + this.brickOffsetLeft,
                    y: r * (this.brickHeight + this.brickPadding) + this.brickOffsetTop,
                    status: 1,
                    color: this.getBrickColor(r)
                };
            }
        }
    }
    
    getBrickColor(row) {
        const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57'];
        return colors[row % colors.length];
    }
    
    setupEventListeners() {
        // Mouse movement for paddle
        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            this.paddle.x = mouseX - this.paddle.width / 2;
            
            // Keep paddle in bounds
            if (this.paddle.x < 0) this.paddle.x = 0;
            if (this.paddle.x > this.canvas.width - this.paddle.width) {
                this.paddle.x = this.canvas.width - this.paddle.width;
            }
        });
        
        // Click to start
        this.canvas.addEventListener('click', () => {
            if (!this.gameRunning) {
                this.start();
            }
        });
        
        // Keyboard controls
        document.addEventListener('keydown', (e) => {
            this.keys[e.key] = true;
            if (e.key === ' ' && !this.gameRunning) {
                this.start();
                e.preventDefault();
            }
        });
        
        document.addEventListener('keyup', (e) => {
            this.keys[e.key] = false;
        });
    }
    
    start() {
        this.gameRunning = true;
        this.statusDisplay.textContent = 'Playing... Break all the bricks!';
        this.gameLoop();
    }
    
    stop() {
        this.gameRunning = false;
    }
    
    update() {
        if (!this.gameRunning) return;
        
        // Handle keyboard controls for paddle
        if (this.keys['ArrowLeft'] || this.keys['a'] || this.keys['A']) {
            this.paddle.x -= this.paddle.speed;
        }
        if (this.keys['ArrowRight'] || this.keys['d'] || this.keys['D']) {
            this.paddle.x += this.paddle.speed;
        }
        
        // Keep paddle in bounds
        if (this.paddle.x < 0) this.paddle.x = 0;
        if (this.paddle.x > this.canvas.width - this.paddle.width) {
            this.paddle.x = this.canvas.width - this.paddle.width;
        }
        
        // Move ball
        this.ball.x += this.ball.dx;
        this.ball.y += this.ball.dy;
        
        // Ball collision with walls
        if (this.ball.x <= this.ball.radius || this.ball.x >= this.canvas.width - this.ball.radius) {
            this.ball.dx = -this.ball.dx;
        }
        
        if (this.ball.y <= this.ball.radius) {
            this.ball.dy = -this.ball.dy;
        }
        
        // Ball collision with paddle
        if (this.ball.y + this.ball.radius >= this.paddle.y &&
            this.ball.x >= this.paddle.x &&
            this.ball.x <= this.paddle.x + this.paddle.width &&
            this.ball.dy > 0) {
            
            this.ball.dy = -this.ball.dy;
            
            // Add angle based on where it hit the paddle
            const hitPos = (this.ball.x - this.paddle.x) / this.paddle.width;
            this.ball.dx = (hitPos - 0.5) * 10;
        }
        
        // Ball collision with bricks
        for (let r = 0; r < this.brickRows; r++) {
            for (let c = 0; c < this.brickCols; c++) {
                const brick = this.bricks[r][c];
                if (brick.status === 1) {
                    if (this.ball.x >= brick.x &&
                        this.ball.x <= brick.x + this.brickWidth &&
                        this.ball.y >= brick.y &&
                        this.ball.y <= brick.y + this.brickHeight) {
                        
                        this.ball.dy = -this.ball.dy;
                        brick.status = 0;
                        this.score += 10;
                        this.updateDisplay();
                        
                        // Check if all bricks are destroyed
                        if (this.checkAllBricksDestroyed()) {
                            this.nextLevel();
                        }
                    }
                }
            }
        }
        
        // Ball goes below paddle
        if (this.ball.y > this.canvas.height) {
            this.lives--;
            this.updateDisplay();
            
            if (this.lives === 0) {
                this.gameOver();
            } else {
                this.resetBall();
                this.statusDisplay.textContent = `Life lost! ${this.lives} lives remaining. Click to continue.`;
                this.gameRunning = false;
            }
        }
    }
    
    checkAllBricksDestroyed() {
        for (let r = 0; r < this.brickRows; r++) {
            for (let c = 0; c < this.brickCols; c++) {
                if (this.bricks[r][c].status === 1) {
                    return false;
                }
            }
        }
        return true;
    }
    
    nextLevel() {
        this.level++;
        this.createBricks();
        this.resetBall();
        
        // Increase ball speed slightly
        this.ball.dx *= 1.1;
        this.ball.dy *= 1.1;
        
        this.statusDisplay.textContent = `Level ${this.level}! Click to continue.`;
        this.gameRunning = false;
        this.updateDisplay();
    }
    
    resetBall() {
        this.ball.x = this.canvas.width / 2;
        this.ball.y = this.canvas.height - 50;
        this.ball.dx = 5 * (Math.random() > 0.5 ? 1 : -1);
        this.ball.dy = -5;
    }
    
    draw() {
        // Clear canvas
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw bricks
        for (let r = 0; r < this.brickRows; r++) {
            for (let c = 0; c < this.brickCols; c++) {
                const brick = this.bricks[r][c];
                if (brick.status === 1) {
                    this.ctx.fillStyle = brick.color;
                    this.ctx.fillRect(brick.x, brick.y, this.brickWidth, this.brickHeight);
                    
                    // Add border
                    this.ctx.strokeStyle = '#fff';
                    this.ctx.lineWidth = 1;
                    this.ctx.strokeRect(brick.x, brick.y, this.brickWidth, this.brickHeight);
                }
            }
        }
        
        // Draw paddle
        this.ctx.fillStyle = '#fff';
        this.ctx.fillRect(this.paddle.x, this.paddle.y, this.paddle.width, this.paddle.height);
        
        // Draw ball
        this.ctx.beginPath();
        this.ctx.arc(this.ball.x, this.ball.y, this.ball.radius, 0, Math.PI * 2);
        this.ctx.fill();
        
        if (!this.gameRunning && this.lives > 0) {
            this.ctx.font = '24px Orbitron';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('Click to Start', this.canvas.width / 2, this.canvas.height / 2);
        }
    }
    
    gameLoop() {
        this.update();
        this.draw();
        
        if (this.gameRunning) {
            requestAnimationFrame(() => this.gameLoop());
        }
    }
    
    updateDisplay() {
        this.scoreDisplay.textContent = this.score;
        this.livesDisplay.textContent = this.lives;
        this.levelDisplay.textContent = this.level;
    }
    
    gameOver() {
        this.gameRunning = false;
        this.statusDisplay.textContent = 'Game Over! Press Reset to play again.';
        Utils.saveScore('breakout', this.score);
    }
    
    reset() {
        this.score = 0;
        this.lives = 3;
        this.level = 1;
        this.gameRunning = false;
        this.createBricks();
        this.resetBall();
        this.updateDisplay();
        this.statusDisplay.textContent = 'Use mouse to control paddle. Click to start!';
        this.draw();
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.breakoutGame = new BreakoutGame();
});