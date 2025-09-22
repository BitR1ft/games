// Pong Game
class PongGame {
    constructor() {
        this.canvas = document.getElementById('pong-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.playerScoreDisplay = document.getElementById('pong-player-score');
        this.computerScoreDisplay = document.getElementById('pong-computer-score');
        this.statusDisplay = document.getElementById('pong-status');
        
        this.init();
    }
    
    init() {
        this.gameRunning = false;
        this.playerScore = 0;
        this.computerScore = 0;
        
        // Game objects
        this.ball = {
            x: this.canvas.width / 2,
            y: this.canvas.height / 2,
            dx: 5,
            dy: 3,
            radius: 8
        };
        
        this.player = {
            x: 10,
            y: this.canvas.height / 2 - 50,
            width: 10,
            height: 100,
            speed: 8
        };
        
        this.computer = {
            x: this.canvas.width - 20,
            y: this.canvas.height / 2 - 50,
            width: 10,
            height: 100,
            speed: 6
        };
        
        this.keys = {};
        
        this.setupEventListeners();
        this.updateDisplay();
        this.draw();
    }
    
    setupEventListeners() {
        // Mouse movement for player paddle
        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const mouseY = e.clientY - rect.top;
            this.player.y = mouseY - this.player.height / 2;
            
            // Keep paddle in bounds
            if (this.player.y < 0) this.player.y = 0;
            if (this.player.y > this.canvas.height - this.player.height) {
                this.player.y = this.canvas.height - this.player.height;
            }
        });
        
        // Click to start
        this.canvas.addEventListener('click', () => {
            if (!this.gameRunning) {
                this.start();
            }
        });
        
        // Keyboard controls as backup
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
        this.statusDisplay.textContent = 'Playing... First to 5 wins!';
        this.gameLoop();
    }
    
    stop() {
        this.gameRunning = false;
    }
    
    update() {
        if (!this.gameRunning) return;
        
        // Handle keyboard controls for player paddle
        if (this.keys['ArrowUp'] || this.keys['w'] || this.keys['W']) {
            this.player.y -= this.player.speed;
        }
        if (this.keys['ArrowDown'] || this.keys['s'] || this.keys['S']) {
            this.player.y += this.player.speed;
        }
        
        // Keep player paddle in bounds
        if (this.player.y < 0) this.player.y = 0;
        if (this.player.y > this.canvas.height - this.player.height) {
            this.player.y = this.canvas.height - this.player.height;
        }
        
        // Move ball
        this.ball.x += this.ball.dx;
        this.ball.y += this.ball.dy;
        
        // Ball collision with top and bottom walls
        if (this.ball.y <= this.ball.radius || this.ball.y >= this.canvas.height - this.ball.radius) {
            this.ball.dy = -this.ball.dy;
        }
        
        // Ball collision with player paddle
        if (this.ball.x <= this.player.x + this.player.width &&
            this.ball.y >= this.player.y &&
            this.ball.y <= this.player.y + this.player.height &&
            this.ball.dx < 0) {
            
            this.ball.dx = -this.ball.dx;
            
            // Add some angle based on where it hit the paddle
            const hitPos = (this.ball.y - this.player.y) / this.player.height;
            this.ball.dy = (hitPos - 0.5) * 10;
        }
        
        // Ball collision with computer paddle
        if (this.ball.x >= this.computer.x &&
            this.ball.y >= this.computer.y &&
            this.ball.y <= this.computer.y + this.computer.height &&
            this.ball.dx > 0) {
            
            this.ball.dx = -this.ball.dx;
            
            // Add some angle based on where it hit the paddle
            const hitPos = (this.ball.y - this.computer.y) / this.computer.height;
            this.ball.dy = (hitPos - 0.5) * 10;
        }
        
        // Computer AI - simple follow the ball
        const computerCenter = this.computer.y + this.computer.height / 2;
        if (this.ball.y < computerCenter - 10) {
            this.computer.y -= this.computer.speed;
        } else if (this.ball.y > computerCenter + 10) {
            this.computer.y += this.computer.speed;
        }
        
        // Keep computer paddle in bounds
        if (this.computer.y < 0) this.computer.y = 0;
        if (this.computer.y > this.canvas.height - this.computer.height) {
            this.computer.y = this.canvas.height - this.computer.height;
        }
        
        // Check for scoring
        if (this.ball.x < 0) {
            this.computerScore++;
            this.resetBall();
            this.updateDisplay();
        } else if (this.ball.x > this.canvas.width) {
            this.playerScore++;
            this.resetBall();
            this.updateDisplay();
        }
        
        // Check for game end
        if (this.playerScore >= 5) {
            this.gameRunning = false;
            this.statusDisplay.textContent = 'You win! Click to play again.';
            Utils.saveScore('pong', this.playerScore);
        } else if (this.computerScore >= 5) {
            this.gameRunning = false;
            this.statusDisplay.textContent = 'Computer wins! Click to play again.';
        }
    }
    
    resetBall() {
        this.ball.x = this.canvas.width / 2;
        this.ball.y = this.canvas.height / 2;
        this.ball.dx = Math.random() > 0.5 ? 5 : -5;
        this.ball.dy = (Math.random() - 0.5) * 6;
    }
    
    draw() {
        // Clear canvas
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw center line
        this.ctx.strokeStyle = '#fff';
        this.ctx.lineWidth = 2;
        this.ctx.setLineDash([10, 10]);
        this.ctx.beginPath();
        this.ctx.moveTo(this.canvas.width / 2, 0);
        this.ctx.lineTo(this.canvas.width / 2, this.canvas.height);
        this.ctx.stroke();
        this.ctx.setLineDash([]);
        
        // Draw paddles
        this.ctx.fillStyle = '#fff';
        this.ctx.fillRect(this.player.x, this.player.y, this.player.width, this.player.height);
        this.ctx.fillRect(this.computer.x, this.computer.y, this.computer.width, this.computer.height);
        
        // Draw ball
        this.ctx.beginPath();
        this.ctx.arc(this.ball.x, this.ball.y, this.ball.radius, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Draw scores on canvas
        this.ctx.font = '48px Orbitron';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(this.playerScore, this.canvas.width / 4, 60);
        this.ctx.fillText(this.computerScore, (this.canvas.width * 3) / 4, 60);
        
        if (!this.gameRunning && this.playerScore === 0 && this.computerScore === 0) {
            this.ctx.font = '24px Orbitron';
            this.ctx.fillText('Click to Start', this.canvas.width / 2, this.canvas.height / 2 + 50);
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
        this.playerScoreDisplay.textContent = this.playerScore;
        this.computerScoreDisplay.textContent = this.computerScore;
    }
    
    reset() {
        this.playerScore = 0;
        this.computerScore = 0;
        this.gameRunning = false;
        this.resetBall();
        this.updateDisplay();
        this.statusDisplay.textContent = 'Use mouse to control paddle. Click to start!';
        this.draw();
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.pongGame = new PongGame();
});