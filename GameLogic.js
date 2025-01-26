function isValidMove(room, index, player) {
    return (
        room.turn === player && // It's the player's turn
        index >= 0 && index < 9 && // Index is within bounds
        !room.board[index] // Cell is empty
    );
}

const winningCombos = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6] // Diagonals
];

function checkWinner(board) {
    for (const [a, b, c] of winningCombos) {
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return board[a]; // "X" or "O" wins
        }
    }
    return board.every(cell => cell) ? "draw" : null; // Check for draw
}

function makeMove(room, index, player) {
    if (isValidMove(room, index, player)) {
        room.board[index] = player;
        room.turn = player === "X" ? "O" : "X";
        room.winner = checkWinner(room.board);
    }
}

// Export the logic as a module
module.exports = {
    isValidMove,
    checkWinner,
    makeMove
};
