// Rock Paper Scissors Game
class RockPaperScissors {
    constructor() {
        this.buttons = document.querySelectorAll('#rock-paper-scissors .rps-btn');
        this.playerScoreDisplay = document.getElementById('rps-player-score');
        this.computerScoreDisplay = document.getElementById('rps-computer-score');
        this.playerChoiceDisplay = document.getElementById('player-choice');
        this.computerChoiceDisplay = document.getElementById('computer-choice');
        this.statusDisplay = document.getElementById('rps-status');
        
        // Game state
        this.playerScore = 0;
        this.computerScore = 0;
        this.choices = ['rock', 'paper', 'scissors'];
        this.choiceEmojis = {
            rock: '🗿',
            paper: '📄',
            scissors: '✂️'
        };
        
        this.init();
    }
    
    init() {
        this.setupControls();
        this.updateDisplay();
    }
    
    setupControls() {
        this.buttons.forEach(button => {
            button.addEventListener('click', (e) => {
                const playerChoice = button.dataset.choice;
                this.playRound(playerChoice);
            });
        });
    }
    
    playRound(playerChoice) {
        // Disable buttons during animation
        this.setButtonsEnabled(false);
        
        // Generate computer choice
        const computerChoice = this.getComputerChoice();
        
        // Show countdown animation
        this.showCountdown(() => {
            this.revealChoices(playerChoice, computerChoice);
            this.determineWinner(playerChoice, computerChoice);
            
            // Re-enable buttons
            setTimeout(() => {
                this.setButtonsEnabled(true);
            }, 2000);
        });
    }
    
    showCountdown(callback) {
        let count = 3;
        this.statusDisplay.textContent = 'Rock...';
        this.playerChoiceDisplay.textContent = '🗿';
        this.computerChoiceDisplay.textContent = '🗿';
        
        const countdownInterval = setInterval(() => {
            count--;
            if (count === 2) {
                this.statusDisplay.textContent = 'Paper...';
                this.playerChoiceDisplay.textContent = '📄';
                this.computerChoiceDisplay.textContent = '📄';
            } else if (count === 1) {
                this.statusDisplay.textContent = 'Scissors...';
                this.playerChoiceDisplay.textContent = '✂️';
                this.computerChoiceDisplay.textContent = '✂️';
            } else if (count === 0) {
                this.statusDisplay.textContent = 'SHOOT!';
                clearInterval(countdownInterval);
                setTimeout(callback, 500);
            }
        }, 800);
    }
    
    revealChoices(playerChoice, computerChoice) {
        // Animate reveal
        this.playerChoiceDisplay.style.transform = 'scale(1.2)';
        this.computerChoiceDisplay.style.transform = 'scale(1.2)';
        
        this.playerChoiceDisplay.textContent = this.choiceEmojis[playerChoice];
        this.computerChoiceDisplay.textContent = this.choiceEmojis[computerChoice];
        
        setTimeout(() => {
            this.playerChoiceDisplay.style.transform = 'scale(1)';
            this.computerChoiceDisplay.style.transform = 'scale(1)';
        }, 300);
    }
    
    getComputerChoice() {
        const randomIndex = Math.floor(Math.random() * this.choices.length);
        return this.choices[randomIndex];
    }
    
    determineWinner(playerChoice, computerChoice) {
        if (playerChoice === computerChoice) {
            this.statusDisplay.textContent = "It's a tie! 🤝";
            this.statusDisplay.style.color = '#ffa502';
            this.addTieEffect();
        } else if (this.isPlayerWinner(playerChoice, computerChoice)) {
            this.playerScore++;
            this.statusDisplay.textContent = 'You win this round! 🎉';
            this.statusDisplay.style.color = '#2ed573';
            this.addWinEffect('player');
        } else {
            this.computerScore++;
            this.statusDisplay.textContent = 'Computer wins this round! 😔';
            this.statusDisplay.style.color = '#ff4757';
            this.addWinEffect('computer');
        }
        
        this.updateScoreDisplay();
        this.checkGameEnd();
    }
    
    isPlayerWinner(playerChoice, computerChoice) {
        return (
            (playerChoice === 'rock' && computerChoice === 'scissors') ||
            (playerChoice === 'paper' && computerChoice === 'rock') ||
            (playerChoice === 'scissors' && computerChoice === 'paper')
        );
    }
    
    addWinEffect(winner) {
        const winnerElement = winner === 'player' ? 
            this.playerChoiceDisplay : this.computerChoiceDisplay;
        
        winnerElement.style.boxShadow = '0 0 30px #2ed573';
        winnerElement.style.background = 'rgba(46, 213, 115, 0.2)';
        
        setTimeout(() => {
            winnerElement.style.boxShadow = '';
            winnerElement.style.background = '';
        }, 1500);
    }
    
    addTieEffect() {
        this.playerChoiceDisplay.style.boxShadow = '0 0 20px #ffa502';
        this.computerChoiceDisplay.style.boxShadow = '0 0 20px #ffa502';
        this.playerChoiceDisplay.style.background = 'rgba(255, 165, 2, 0.1)';
        this.computerChoiceDisplay.style.background = 'rgba(255, 165, 2, 0.1)';
        
        setTimeout(() => {
            this.playerChoiceDisplay.style.boxShadow = '';
            this.computerChoiceDisplay.style.boxShadow = '';
            this.playerChoiceDisplay.style.background = '';
            this.computerChoiceDisplay.style.background = '';
        }, 1500);
    }
    
    checkGameEnd() {
        const maxScore = 5;
        if (this.playerScore >= maxScore || this.computerScore >= maxScore) {
            setTimeout(() => {
                if (this.playerScore >= maxScore) {
                    this.statusDisplay.textContent = `🎉 YOU WIN THE GAME! ${this.playerScore}-${this.computerScore}`;
                    this.statusDisplay.style.color = '#2ed573';
                } else {
                    this.statusDisplay.textContent = `😔 Computer wins the game! ${this.computerScore}-${this.playerScore}`;
                    this.statusDisplay.style.color = '#ff4757';
                }
                
                // Save score if player won
                if (this.playerScore >= maxScore) {
                    Utils.saveScore('rps', this.playerScore);
                }
                
                // Auto-reset after showing result
                setTimeout(() => {
                    this.reset();
                }, 3000);
            }, 2000);
        }
    }
    
    setButtonsEnabled(enabled) {
        this.buttons.forEach(button => {
            button.disabled = !enabled;
            button.style.opacity = enabled ? '1' : '0.5';
            button.style.cursor = enabled ? 'pointer' : 'not-allowed';
        });
    }
    
    updateDisplay() {
        this.updateScoreDisplay();
        this.statusDisplay.textContent = 'Make your choice!';
        this.statusDisplay.style.color = '#fff';
    }
    
    updateScoreDisplay() {
        this.playerScoreDisplay.textContent = this.playerScore;
        this.computerScoreDisplay.textContent = this.computerScore;
    }
    
    reset() {
        this.playerScore = 0;
        this.computerScore = 0;
        
        this.playerChoiceDisplay.textContent = '?';
        this.computerChoiceDisplay.textContent = '?';
        this.playerChoiceDisplay.style.transform = 'scale(1)';
        this.computerChoiceDisplay.style.transform = 'scale(1)';
        this.playerChoiceDisplay.style.boxShadow = '';
        this.computerChoiceDisplay.style.boxShadow = '';
        this.playerChoiceDisplay.style.background = '';
        this.computerChoiceDisplay.style.background = '';
        
        this.setButtonsEnabled(true);
        this.updateDisplay();
    }
}

// Add button animation styles
const style = document.createElement('style');
style.textContent = `
    .rps-btn:disabled {
        pointer-events: none;
    }
    
    .choice-display {
        transition: all 0.3s ease;
    }
    
    .rps-btn:active {
        transform: scale(0.95);
    }
    
    @keyframes bounce {
        0%, 20%, 60%, 100% {
            transform: translateY(0);
        }
        40% {
            transform: translateY(-10px);
        }
        80% {
            transform: translateY(-5px);
        }
    }
    
    .bounce {
        animation: bounce 1s;
    }
`;
document.head.appendChild(style);

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.rpsGame = new RockPaperScissors();
});