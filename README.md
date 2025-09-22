# 🎮 Web Game Console

A modern, responsive web-based game console featuring multiple classic games with beautiful design and smooth animations.

![Web Game Console Main Screen](https://github.com/user-attachments/assets/bdeef9c6-5d96-4f95-9d56-3c11739fdfb9)

## 🎯 Features

- **4 Classic Games**: Tic-Tac-Toe, Snake, Memory Game (Simon Says), Rock Paper Scissors
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Modern UI**: Beautiful gradient backgrounds, smooth animations, and glass-morphism effects
- **Local High Scores**: Automatic score tracking using localStorage
- **Optimized Performance**: Lightweight, fast-loading, and efficient
- **Easy Deployment**: Static files, ready for any web server

## 🎮 Games Included

### 1. Tic-Tac-Toe
- Classic 3x3 grid strategy game
- Score tracking for X and O players
- Visual win animations

![Tic-Tac-Toe Game](https://github.com/user-attachments/assets/3a9ec554-dcff-4dd8-bcb4-d2701f88f1ab)

### 2. Snake
- Control the snake with arrow keys or touch buttons
- Eat food to grow longer and increase score
- High score persistence
- Game over detection

![Snake Game](https://github.com/user-attachments/assets/ce9d2d1c-e689-4eed-82c3-d5707ac13c32)

### 3. Memory Game (Simon Says)
- Remember and repeat color sequences
- Progressive difficulty levels
- Audio feedback for each color
- Score based on level completion

![Memory Game](https://github.com/user-attachments/assets/d270744c-b171-45ea-9b6f-496aea5f5b9f)

### 4. Rock Paper Scissors
- Play against the computer
- Animated countdown and reveal
- First to 5 wins takes the game
- Visual feedback for wins/losses

![Rock Paper Scissors](https://github.com/user-attachments/assets/076ee445-5709-42a5-8617-f35ac2de1769)

## 🚀 Getting Started

### Prerequisites
- Node.js (for development server)
- Modern web browser

### Installation

1. Clone the repository:
```bash
git clone https://github.com/BitR1ft/games.git
cd games
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open your browser and navigate to `http://localhost:8080`

### Alternative (Static File Serving)
You can also serve the files directly using any static file server:
```bash
# Using Python
python -m http.server 8080

# Using any web server
# Just point to the root directory containing index.html
```

## 📱 Mobile Support

The game console is fully responsive and includes:
- Touch-friendly controls for all games
- Optimized layouts for small screens
- Gesture support where applicable
- Virtual D-pad for Snake game

## 🛠 Technologies Used

- **HTML5**: Semantic structure and Canvas API
- **CSS3**: Modern styling, animations, and responsive design
- **JavaScript ES6+**: Game logic and interactivity
- **Web Audio API**: Sound effects for Memory game
- **localStorage**: High score persistence
- **CSS Grid & Flexbox**: Responsive layouts

## 🎨 Design Features

- **Glass-morphism**: Modern translucent card designs
- **Gradient Backgrounds**: Beautiful animated color gradients
- **Smooth Animations**: CSS transitions and keyframe animations
- **Responsive Typography**: Orbitron font for gaming aesthetic
- **Visual Feedback**: Hover effects, click animations, and game state indicators

## 📦 Deployment

### Static Hosting (Recommended)
Deploy to any static hosting service:

1. **Netlify**: Drag and drop the entire folder
2. **Vercel**: Connect your GitHub repository
3. **GitHub Pages**: Enable Pages in repository settings
4. **AWS S3**: Upload files to S3 bucket with static hosting
5. **Any Web Server**: Copy files to web root directory

### Using npm scripts:
```bash
npm run build  # Outputs static files (already static)
npm run start  # Development server
```

### Docker (Optional)
```dockerfile
FROM nginx:alpine
COPY . /usr/share/nginx/html
EXPOSE 80
```

## 🏗 Project Structure

```
games/
├── index.html              # Main HTML file
├── styles/
│   └── main.css           # All styling and animations
├── js/
│   ├── main.js            # Game console controller
│   ├── tic-tac-toe.js     # Tic-Tac-Toe game logic
│   ├── snake.js           # Snake game logic
│   ├── memory.js          # Memory game logic
│   └── rock-paper-scissors.js # RPS game logic
├── package.json           # Project configuration
└── README.md             # This file
```

## 🎯 Performance Optimizations

- **Minimal Dependencies**: No external libraries except dev server
- **Optimized Animations**: CSS transitions over JavaScript animations
- **Efficient Game Loops**: RequestAnimationFrame and optimized intervals
- **Lazy Loading**: Games initialize only when accessed
- **Small Bundle Size**: ~25KB total (HTML + CSS + JS)

## 🔧 Customization

### Adding New Games
1. Create HTML structure in `index.html`
2. Add styling in `styles/main.css`
3. Create game logic in `js/your-game.js`
4. Register in `main.js` game console

### Theming
Modify CSS variables in `main.css`:
```css
:root {
  --primary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  --card-background: rgba(255, 255, 255, 0.1);
  --border-color: rgba(255, 255, 255, 0.2);
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Google Fonts for the Orbitron typeface
- CSS-Tricks for design inspiration
- MDN Web Docs for API references

---

**Built with ❤️ for the love of classic games!**