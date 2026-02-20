// ---- Tic Tac Toe Minimax ----

function getAvailable(board) {
    return board.map((v, i) => (v === null ? i : null)).filter((v) => v !== null);
}

function checkWinnerTTT(board) {
    const lines = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6],
    ];
    for (const [a, b, c] of lines) {
        if (board[a] && board[a] === board[b] && board[a] === board[c]) return board[a];
    }
    return null;
}

function minimax(board, isMax) {
    const w = checkWinnerTTT(board);
    if (w === "O") return 10;
    if (w === "X") return -10;
    if (getAvailable(board).length === 0) return 0;

    if (isMax) {
        let best = -Infinity;
        for (const i of getAvailable(board)) {
            board[i] = "O";
            best = Math.max(best, minimax(board, false));
            board[i] = null;
        }
        return best;
    } else {
        let best = Infinity;
        for (const i of getAvailable(board)) {
            board[i] = "X";
            best = Math.min(best, minimax(board, true));
            board[i] = null;
        }
        return best;
    }
}

export function getTicTacToeMove(board) {
    let bestScore = -Infinity;
    let move = null;
    for (const i of getAvailable(board)) {
        board[i] = "O";
        const score = minimax(board, false);
        board[i] = null;
        if (score > bestScore) {
            bestScore = score;
            move = i;
        }
    }
    return move;
}

// ---- Rock Paper Scissors ----

export function getRPSMove() {
    const choices = ["rock", "paper", "scissors"];
    return choices[Math.floor(Math.random() * choices.length)];
}

export function getRPSResult(player, bot) {
    if (player === bot) return "draw";
    const wins = { rock: "scissors", paper: "rock", scissors: "paper" };
    return wins[player] === bot ? "win" : "lose";
}

// ---- Typing Test ----

export function generateBotWPM() {
    return Math.floor(Math.random() * 41) + 30; // 30–70 WPM
}

// ---- Math Battle ----

export function generateMathQuestion(difficulty = "medium") {
    const ops = difficulty === "easy" ? ["+", "-"]
        : difficulty === "medium" ? ["+", "-", "×"]
            : ["+", "-", "×", "÷"];

    const op = ops[Math.floor(Math.random() * ops.length)];

    let a, b, answer;
    switch (op) {
        case "+":
            a = Math.floor(Math.random() * 50) + 1;
            b = Math.floor(Math.random() * 50) + 1;
            answer = a + b;
            break;
        case "-":
            a = Math.floor(Math.random() * 50) + 10;
            b = Math.floor(Math.random() * a) + 1;
            answer = a - b;
            break;
        case "×":
            a = Math.floor(Math.random() * 12) + 1;
            b = Math.floor(Math.random() * 12) + 1;
            answer = a * b;
            break;
        case "÷":
            b = Math.floor(Math.random() * 10) + 2;
            answer = Math.floor(Math.random() * 10) + 1;
            a = b * answer; // ensures clean division
            break;
    }

    return { question: `${a} ${op} ${b}`, answer, a, b, op };
}

export function generateBotMathTime() {
    return +(Math.random() * 4 + 1).toFixed(2); // 1–5 seconds
}

// ---- Reaction Speed ----

export function generateBotReactionTime(difficulty = "medium") {
    if (difficulty === "easy") return Math.floor(Math.random() * 101) + 300;   // 300–400ms
    if (difficulty === "medium") return Math.floor(Math.random() * 151) + 200; // 200–350ms
    return Math.floor(Math.random() * 101) + 150;                              // 150–250ms (hard)
}

// ---- Memory Card Game ----

export function generateBotMemoryTime(difficulty = "medium") {
    if (difficulty === "easy") return Math.floor(Math.random() * 21) + 30;    // 30–50s
    if (difficulty === "medium") return Math.floor(Math.random() * 31) + 25;  // 25–55s
    return Math.floor(Math.random() * 21) + 20;                               // 20–40s (hard)
}
