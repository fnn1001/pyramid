const pyramid = document.getElementById('pyramid');
const startGameButton = document.getElementById('start-game');
const levelsInput = document.getElementById('levels');
const scoreboard = document.getElementById('scoreboard');
const timer = document.getElementById('timer');

let correctPath = [];
let currentElementIndex = 0;
let score = 0;
let timerId = null;
let isTimedMode = false;

function createPyramid() {
    pyramid.innerHTML = '';
    correctPath = [];
    const levels = parseInt(levelsInput.value);
    const totalElements = levels * 2 - 1;
    let currentCorrectIndex = Math.floor(Math.random() * 2);

    for (let i = 1; i <= totalElements; i += 2) {
        const floor = document.createElement('div');
        floor.className = 'floor';
        currentCorrectIndex = Math.max(Math.min(currentCorrectIndex + Math.floor(Math.random() * i) - 1, i - 1), 0);

        for (let j = 0; j < i; j++) {
            const element = document.createElement('div');
            element.className = 'element';
            element.addEventListener('click', () => checkElement(element));
            floor.appendChild(element);

            if (j === currentCorrectIndex) {
                correctPath.unshift(element);
            }
        }

        pyramid.appendChild(floor);
    }
}

function startGame() {
    startGameButton.disabled = true;
    createPyramid();
    showPath();

    score = 0; // Reset score
    updateScoreDisplay();

    if (isTimedMode) {
        startTimer();
    }
}

function showPath() {
    for (let i = 0; i < correctPath.length; i++) {
        setTimeout(() => {
            correctPath[i].style.backgroundColor = '#00ff00';
            setTimeout(() => {
                correctPath[i].style.backgroundColor = '#ffffff';
                if (i === correctPath.length - 1) {
                    startGameButton.disabled = false;
                }
            }, 1000);
        }, i * 1000);
    }
}

function checkElement(element) {
    if (element === correctPath[currentElementIndex]) {
        element.style.backgroundColor = '#00ff00';
        currentElementIndex++;
        if (currentElementIndex === correctPath.length) {
            alert('You won!');
            onWin();
            resetGame();
        }

        score += 100 * currentElementIndex; // Increase score
        updateScoreDisplay();
    } else {
        element.style.backgroundColor = '#ff0000';
        shatterElements();
        alert('You lost!');
        resetGame();

        score -= 50; // Decrease score
        updateScoreDisplay();
    }
}

function updateScoreDisplay() {
    scoreboard.textContent = 'Score: ' + score;
}

function resetGame() {
    for (const element of correctPath) {
        element.style.backgroundColor = '#ffffff';
        element.classList.remove('shatter');
    }
    currentElementIndex = 0;
}

function shatterElements() {
    const elements = document.getElementsByClassName('element');

    for (let i = 0; i < elements.length; i++) {
        elements[i].classList.add('shatter');
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

startGameButton.addEventListener('click', startGame);

function onWin() {
    for (let i = 0; i < 52; i++) {
        const card = document.createElement('div');
        card.className = 'card';
        card.style.top = `${Math.random() * window.innerHeight}px`;
        card.style.left = `${Math.random() * window.innerWidth}px`;
        card.style.animation = `cascade ${window.innerHeight}px 2s linear infinite`;
        document.body.appendChild(card);
    }

    setTimeout(() => {
        const cards = document.getElementsByClassName('card');
        while (cards.length > 0) {
            cards[0].parentNode.removeChild(cards[0]);
        }
    }, 2000);
}

function startTimer() {
    const timeLimit = 60; // 60 seconds, or however long you want
    let timeLeft = timeLimit;

    // Update the timer display every second
    timerId = setInterval(() => {
        timeLeft--;
        updateTimerDisplay(timeLeft);

        if (timeLeft <= 0) {
            endGame();
        }
    }, 1000);
}

function updateTimerDisplay(timeLeft) {
    timer.textContent = 'Time Left: ' + timeLeft;
}

function endGame() {
    clearInterval(timerId);
    alert('Time is up!');
    resetGame();
}
const timedModeCheckbox = document.getElementById('timedMode');

