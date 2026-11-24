
const cells = document.querySelectorAll(".cell");

const statusText = document.getElementById("status");
const messageText = document.getElementById("message");
const turnIndicator = document.getElementById("turnIndicator");
const resultText = document.getElementById("result");

const scoreXText = document.getElementById("scoreX");
const scoreOText = document.getElementById("scoreO");
const scoreDrawText = document.getElementById("scoreDraw");

const playerXText = document.getElementById("playerX");
const playerOText = document.getElementById("playerO");

const pvpButton = document.getElementById("pvp");
const pvcButton = document.getElementById("pvc");

const restartButton = document.getElementById("restartBtn");
const resetButton = document.getElementById("resetBtn");

let board = ["", "", "", "", "", "", "", "", ""];

let currentPlayer = "X";
let gameActive = true;
let gameMode = "pvp";

let scores = {
    X: 0,
    O: 0,
    draw: 0
};

const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

// Switch game mode
pvpButton.addEventListener("click", () => {
    gameMode = "pvp";
    pvpButton.classList.add("active");
    pvcButton.classList.remove("active");

    playerXText.textContent = "Player X";
    playerOText.textContent = "Player O";

    updateScores();
    resetGame();
});

pvcButton.addEventListener("click", () => {
    gameMode = "pvc";
    pvcButton.classList.add("active");
    pvpButton.classList.remove("active");

    playerXText.textContent = "You";
    playerOText.textContent = "Computer";

    updateScores();
    resetGame();
});

// Handle player clicks
cells.forEach(cell => {
    cell.addEventListener("click", () => {

        const index = Number(cell.dataset.index);

        if (!gameActive || board[index] !== "") {
            return;
        }

        if (gameMode === "pvc" && currentPlayer === "O") {
            return;
        }

        makeMove(index);

        if (gameActive && gameMode === "pvc") {
            setTimeout(computerMove, 450);
        }
    });
});

// Make a move
function makeMove(index) {

    board[index] = currentPlayer;

    cells[index].textContent = currentPlayer;
    cells[index].classList.add(currentPlayer.toLowerCase());
    cells[index].disabled = true;

    checkWinner();
}

// Check winning conditions
function checkWinner() {

    let winningCombination = null;

    for (let combination of winningCombinations) {

        const [a, b, c] = combination;

        if (
            board[a] !== "" &&
            board[a] === board[b] &&
            board[b] === board[c]
        ) {
            winningCombination = combination;
            break;
        }
    }

    if (winningCombination) {

        gameActive = false;

        winningCombination.forEach(index => {
            cells[index].classList.add("winner");
        });

        scores[currentPlayer]++;

        updateScores();

        let winnerName =
            gameMode === "pvc" && currentPlayer === "O"
                ? "Computer"
                : `Player ${currentPlayer}`;

        statusText.textContent = `${winnerName} Wins! 🎉`;
        messageText.textContent = "Amazing game! Well played.";
        resultText.textContent = `🏆 ${winnerName} is the winner!`;

        turnIndicator.textContent = "✓";

        return;
    }

    // Check draw
    if (!board.includes("")) {

        gameActive = false;
        scores.draw++;

        updateScores();

        statusText.textContent = "It's a Draw! 🤝";
        messageText.textContent = "Nobody wins this round.";
        resultText.textContent = "🤝 Great match!";

        turnIndicator.textContent = "=";

        return;
    }

    // Switch player
    currentPlayer = currentPlayer === "X" ? "O" : "X";

    updateTurn();
}

// Update turn display
function updateTurn() {

    const name =
        gameMode === "pvc" && currentPlayer === "O"
            ? "Computer"
            : `Player ${currentPlayer}`;

    statusText.textContent = `${name}'s Turn`;
    messageText.textContent = "Choose a square to play!";

    turnIndicator.textContent = currentPlayer;
}

// Computer move using Minimax AI
function computerMove() {

    if (!gameActive || gameMode !== "pvc") {
        return;
    }

    let bestScore = -Infinity;
    let bestMove = -1;

    for (let i = 0; i < 9; i++) {

        if (board[i] === "") {

            board[i] = "O";

            let score = minimax(board, 0, false);

            board[i] = "";

            if (score > bestScore) {
                bestScore = score;
                bestMove = i;
            }
        }
    }

    if (bestMove !== -1) {
        makeMove(bestMove);
    }
}

// Minimax algorithm
function minimax(currentBoard, depth, isMaximizing) {

    const winner = getWinner(currentBoard);

    if (winner === "O") return 10 - depth;
    if (winner === "X") return depth;
    if (!currentBoard.includes("")) return 0;

    if (isMaximizing) {

        let bestScore = -Infinity;

        for (let i = 0; i < 9; i++) {

            if (currentBoard[i] === "") {

                currentBoard[i] = "O";

                let score = minimax(
                    currentBoard,
                    depth + 1,
                    false
                );

                currentBoard[i] = "";

                bestScore = Math.max(bestScore, score);
            }
        }

        return bestScore;

    } else {

        let bestScore = Infinity;

        for (let i = 0; i < 9; i++) {

            if (currentBoard[i] === "") {

                currentBoard[i] = "X";

                let score = minimax(
                    currentBoard,
                    depth + 1,
                    true
                );

                currentBoard[i] = "";

                bestScore = Math.min(bestScore, score);
            }
        }

        return bestScore;
    }
}

// Find winner for AI
function getWinner(currentBoard) {

    for (let combination of winningCombinations) {

        const [a, b, c] = combination;

        if (
            currentBoard[a] !== "" &&
            currentBoard[a] === currentBoard[b] &&
            currentBoard[b] === currentBoard[c]
        ) {
            return currentBoard[a];
        }
    }

    return null;
}

// Update scoreboard
function updateScores() {

    scoreXText.textContent = scores.X;
    scoreOText.textContent = scores.O;
    scoreDrawText.textContent = scores.draw;
}

// Restart current round
function resetGame() {

    board = ["", "", "", "", "", "", "", "", ""];

    currentPlayer = "X";
    gameActive = true;

    cells.forEach(cell => {
        cell.textContent = "";
        cell.disabled = false;
        cell.classList.remove("x", "o", "winner");
    });

    resultText.textContent = "";

    statusText.textContent = "Player X's Turn";
    messageText.textContent = "Choose a square to make your move";

    turnIndicator.textContent = "X";
}

// Restart button
restartButton.addEventListener("click", resetGame);

// Reset scores button
resetButton.addEventListener("click", () => {

    scores = {
        X: 0,
        O: 0,
        draw: 0
    };

    updateScores();
    resetGame();
});
