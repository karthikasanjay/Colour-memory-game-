const startButton = document.getElementById('start-game');
const colorDisplay = document.getElementById('color-display');
const colorOrder = document.getElementById('color-order');
const scoreDisplay = document.getElementById('score');
const colors = ['#FF5733', '#33FF57', '#5733FF', '#FF33A1', '#FFD700', '#8A2BE2', '#7FFF00', '#FF1493'];
let shuffledColors = [];
let score = 0;
let timeLeft = 20; // Timer duration
let timer;
let currentDifficulty = 'medium';

startButton.addEventListener('click', startGame);

function startGame() {
    startButton.disabled = true;
    shuffledColors = shuffleColors(colors);
    displayColors();
    resetTimer();
    setTimeout(hideColors, 5000); // Hide colors after 5 seconds
}

function shuffleColors(array) {
    let shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

function displayColors() {
    colorDisplay.innerHTML = '';
    shuffledColors.forEach(color => {
        const colorBox = document.createElement('div');
        colorBox.style.backgroundColor = color;
        colorBox.classList.add('color-box');
        colorDisplay.appendChild(colorBox);
    });
    colorDisplay.classList.remove('hidden');
}

function hideColors() {
    colorDisplay.classList.add('hidden');
    initializeOrder();
}

function initializeOrder() {
    colorOrder.innerHTML = '';
    shuffledColors.forEach((color, index) => {
        const colorBox = document.createElement('div');
        colorBox.style.backgroundColor = color;
        colorBox.classList.add('color-box');
        colorBox.setAttribute('data-index', index);
        colorOrder.appendChild(colorBox);
    });

    document.addEventListener('keydown', reorderColors);
    startTimer();
}

function reorderColors(event) {
    const colorBoxes = Array.from(colorOrder.children);
    let currentBoxIndex = -1;

    colorBoxes.forEach((box, index) => {
        if (box === document.activeElement) {
            currentBoxIndex = index;
        }
    });

    if (currentBoxIndex !== -1) {
        let newIndex = currentBoxIndex;
        if (event.key === 'ArrowRight') {
            newIndex = Math.min(colorBoxes.length - 1, currentBoxIndex + 1);
        } else if (event.key === 'ArrowLeft') {
            newIndex = Math.max(0, currentBoxIndex - 1);
        }

        if (newIndex !== currentBoxIndex) {
            const movedBox = colorBoxes[currentBoxIndex];
            colorOrder.insertBefore(movedBox, colorBoxes[newIndex]);
        }
    }

    // Check answer after moving colors
    if (event.key === 'Enter') {
        checkAnswer();
    }
}

function checkAnswer() {
    const colorBoxes = Array.from(colorOrder.children);
    const correctOrder = shuffledColors.map((_, index) => colorOrder.children[index].style.backgroundColor);

    if (correctOrder.join(',') === shuffledColors.join(',')) {
        score += 10;
        alert('Correct! Your score: ' + score);
    } else {
        alert('Wrong order! Try again.');
    }
    scoreDisplay.textContent = 'Score: ' + score;
    startGame();
}

function startTimer() {
    timer = setInterval(() => {
        timeLeft--;
        if (timeLeft <= 0) {
            clearInterval(timer);
            alert('Time is up! Your score: ' + score);
            startGame(); // Start a new round
        }
    }, 1000);
}

function resetTimer() {
    timeLeft = currentDifficulty === 'easy' ? 20 : currentDifficulty === 'medium' ? 20 : 30;
    clearInterval(timer);
    startTimer();
}

function setDifficulty(level) {
    currentDifficulty = level;
    colors.length = 0;
    if (level === 'easy') {
        colors.push('#FF5733', '#33FF57', '#5733FF');
    } else if (level === 'medium') {
        colors.push('#FF5733', '#33FF57', '#5733FF', '#FF33A1', '#FFD700');
    } else {
        colors.push('#FF5733', '#33FF57', '#5733FF', '#FF33A1', '#FFD700', '#8A2BE2', '#7FFF00', '#FF1493');
    }
    score = 0;
    scoreDisplay.textContent = 'Score: ' + score;
}