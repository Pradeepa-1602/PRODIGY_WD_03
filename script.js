const boardEl = document.getElementById("board");
const statusEl = document.getElementById("status");
let board = Array(9).fill("");
let currentPlayer = "X";
let gameOver = false;

// Create cells
boardEl.innerHTML = "";
for (let i = 0; i < 9; i++) {
  const cell = document.createElement("div");
  cell.classList.add("cell");
  cell.addEventListener("click", () => makeMove(i));
  boardEl.appendChild(cell);
}

function makeMove(index) {
  if (board[index] !== "" || gameOver) return;
  board[index] = currentPlayer;
  updateBoard();
  if (checkWinner()) {
    statusEl.textContent = `Player ${currentPlayer} wins! 🎉`;
    gameOver = true;
    return;
  }
  if (board.every(cell => cell !== "")) {
    statusEl.textContent = "It's a draw!";
    gameOver = true;
    return;
  }

  // Switch player
  currentPlayer = currentPlayer === "X" ? "O" : "X";
  statusEl.textContent = `Player ${currentPlayer}'s turn`;

  // AI Move if in 1-player mode
  let mode = document.querySelector('input[name="gameMode"]:checked').value;
  if (mode === "ai" && currentPlayer === "O" && !gameOver) {
    setTimeout(aiMove, 500);
  }
}

function aiMove() {
  // Simple AI: pick random empty cell
  let emptyCells = board.map((val, idx) => val === "" ? idx : null).filter(v => v !== null);
  let move = emptyCells[Math.floor(Math.random() * emptyCells.length)];
  board[move] = "O";
  updateBoard();
  if (checkWinner()) {
    statusEl.textContent = `Player O (AI) wins! 🤖`;
    gameOver = true;
    return;
  }
  if (board.every(cell => cell !== "")) {
    statusEl.textContent = "It's a draw!";
    gameOver = true;
    return;
  }
  currentPlayer = "X";
  statusEl.textContent = `Player X's turn`;
}

function updateBoard() {
  const cells = document.querySelectorAll(".cell");
  board.forEach((val, idx) => {
    cells[idx].textContent = val;
    cells[idx].style.color = val === "X" ? "#e74c3c" : "#2980b9";
  });
}

function checkWinner() {
  const winPatterns = [
    [0,1,2], [3,4,5], [6,7,8], // rows
    [0,3,6], [1,4,7], [2,5,8], // cols
    [0,4,8], [2,4,6]           // diagonals
  ];
  return winPatterns.some(pattern => {
    const [a,b,c] = pattern;
    return board[a] && board[a] === board[b] && board[a] === board[c];
  });
}

function resetGame() {
  board = Array(9).fill("");
  currentPlayer = "X";
  gameOver = false;
  updateBoard();
  statusEl.textContent = "Player X's turn";
}
