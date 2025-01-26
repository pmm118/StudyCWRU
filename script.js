// script.js
const socket = io();

// Select all cells in the game board
const cells = document.querySelectorAll('.cell');
const currentPlayerElement = document.getElementById('current-player');

// Chat elements
const chatInput = document.getElementById('chat-input');
const sendButton = document.getElementById('send-button');
const messages = document.getElementById('messages');

// Update the game board based on the current state
socket.on('gameState', ({ board, currentPlayer }) => {
    board.forEach((value, index) => {
        cells[index].textContent = value;
    });
    currentPlayerElement.textContent = currentPlayer;
});

// Handle move made by another player
socket.on('moveMade', ({ board, currentPlayer }) => {
    board.forEach((value, index) => {
        cells[index].textContent = value;
    });
    currentPlayerElement.textContent = currentPlayer;
});

// Add click event listeners to each cell
cells.forEach((cell, index) => {
    cell.addEventListener('click', () => {
        socket.emit('makeMove', index);
    });
});

// Handle sending chat messages
sendButton.addEventListener('click', () => {
    const message = chatInput.value;
    socket.emit('sendMessage', message);
    chatInput.value = '';
});

// Handle receiving chat messages
socket.on('receiveMessage', (message) => {
    const messageElement = document.createElement('div');
    messageElement.textContent = message;
    messages.appendChild(messageElement);
});