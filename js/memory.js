// Memory Game (Simon Says style)
class MemoryGame {
    constructor() {
        this.buttons = document.querySelectorAll('#memory .memory-button');
        this.levelDisplay = document.getElementById('memory-level');
        this.scoreDisplay = document.getElementById('memory-score');
        this.statusDisplay = document.getElementById('memory-status');
        
        // Game state
        this.sequence = [];
        this.playerSequence = [];
        this.level = 1;
        this.score = 0;
        this.isPlaying = false;
        this.isPlayerTurn = false;
        this.currentStep = 0;
        
        // Colors
        this.colors = ['red', 'blue', 'green', 'yellow'];
        
        this.init();
    }
    
    init() {
        this.setupControls();
        this.updateDisplay();
        this.startNextLevel();
    }
    
    setupControls() {
        this.buttons.forEach(button => {
            button.addEventListener('click', (e) => {
                if (this.isPlayerTurn) {
                    const color = button.dataset.color;
                    this.playerInput(color);
                }
            });
            
            // Add visual feedback
            button.addEventListener('mousedown', () => {
                this.activateButton(button);
            });
            
            button.addEventListener('mouseup', () => {
                setTimeout(() => this.deactivateButton(button), 100);
            });
            
            button.addEventListener('mouseleave', () => {
                this.deactivateButton(button);
            });
        });
    }
    
    startNextLevel() {
        this.isPlaying = true;
        this.isPlayerTurn = false;
        this.playerSequence = [];
        this.currentStep = 0;
        
        // Add new color to sequence
        const randomColor = this.colors[Math.floor(Math.random() * this.colors.length)];
        this.sequence.push(randomColor);
        
        this.statusDisplay.textContent = `Level ${this.level} - Watch the pattern!`;
        this.updateDisplay();
        
        // Play sequence after a delay
        setTimeout(() => {
            this.playSequence();
        }, 1000);
    }
    
    playSequence() {
        let index = 0;
        
        const playNext = () => {
            if (index < this.sequence.length) {
                const color = this.sequence[index];
                const button = document.querySelector(`[data-color="${color}"]`);
                
                this.activateButton(button);
                this.playSound(color);
                
                setTimeout(() => {
                    this.deactivateButton(button);
                    index++;
                    setTimeout(playNext, 400);
                }, 600);
            } else {
                // Sequence finished, player's turn
                this.isPlayerTurn = true;
                this.statusDisplay.textContent = 'Your turn! Repeat the pattern.';
            }
        };
        
        playNext();
    }
    
    playerInput(color) {
        const button = document.querySelector(`[data-color="${color}"]`);
        this.activateButton(button);
        this.playSound(color);
        
        setTimeout(() => {
            this.deactivateButton(button);
        }, 200);
        
        this.playerSequence.push(color);
        
        // Check if input is correct
        if (this.playerSequence[this.currentStep] !== this.sequence[this.currentStep]) {
            this.gameOver();
            return;
        }
        
        this.currentStep++;
        
        // Check if sequence is complete
        if (this.currentStep === this.sequence.length) {
            this.levelComplete();
        }
    }
    
    levelComplete() {
        this.isPlayerTurn = false;
        this.score += this.level * 100;
        this.level++;
        
        this.statusDisplay.textContent = `Level ${this.level - 1} complete! 🎉`;
        this.updateDisplay();
        
        // Flash all buttons
        this.buttons.forEach(button => {
            this.activateButton(button);
        });
        
        setTimeout(() => {
            this.buttons.forEach(button => {
                this.deactivateButton(button);
            });
            
            // Start next level
            setTimeout(() => {
                this.startNextLevel();
            }, 1000);
        }, 500);
    }
    
    gameOver() {
        this.isPlaying = false;
        this.isPlayerTurn = false;
        
        this.statusDisplay.textContent = `Game Over! Final Score: ${this.score}`;
        
        // Flash red
        this.buttons.forEach(button => {
            button.style.background = '#ff4757';
            button.style.opacity = '1';
        });
        
        setTimeout(() => {
            this.buttons.forEach(button => {
                this.resetButtonStyle(button);
            });
        }, 1000);
        
        // Check for high score
        if (Utils.saveScore('memory', this.score)) {
            this.statusDisplay.textContent += ' 🎉 NEW HIGH SCORE!';
        }
    }
    
    activateButton(button) {
        button.classList.add('active');
        button.style.opacity = '1';
        button.style.transform = 'scale(1.1)';
    }
    
    deactivateButton(button) {
        button.classList.remove('active');
        button.style.opacity = '0.6';
        button.style.transform = 'scale(1)';
    }
    
    resetButtonStyle(button) {
        const color = button.dataset.color;
        button.classList.remove('active');
        button.style.opacity = '0.6';
        button.style.transform = 'scale(1)';
        
        // Reset to original color
        switch(color) {
            case 'red':
                button.style.background = '#ff4757';
                break;
            case 'blue':
                button.style.background = '#3742fa';
                break;
            case 'green':
                button.style.background = '#2ed573';
                break;
            case 'yellow':
                button.style.background = '#ffa502';
                break;
        }
    }
    
    playSound(color) {
        // Create simple audio feedback using Web Audio API
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        // Different frequencies for different colors
        const frequencies = {
            red: 330,
            blue: 415,
            green: 523,
            yellow: 622
        };
        
        oscillator.frequency.setValueAtTime(frequencies[color], audioContext.currentTime);
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.3);
    }
    
    updateDisplay() {
        this.levelDisplay.textContent = this.level;
        this.scoreDisplay.textContent = this.score;
    }
    
    reset() {
        this.sequence = [];
        this.playerSequence = [];
        this.level = 1;
        this.score = 0;
        this.isPlaying = false;
        this.isPlayerTurn = false;
        this.currentStep = 0;
        
        this.buttons.forEach(button => {
            this.resetButtonStyle(button);
        });
        
        this.updateDisplay();
        this.statusDisplay.textContent = 'Watch the pattern and repeat it!';
        
        // Start first level
        setTimeout(() => {
            this.startNextLevel();
        }, 1000);
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.memoryGame = new MemoryGame();
});