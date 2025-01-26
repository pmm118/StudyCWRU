const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static('public'))

let board = Array(9).fill(null);
let currentPlayer = 'X';

io.on('connection', (socket) => {
    console.log('A user connected');

    socket.emit('gameState', {board, currentPlayer })

    socket.on('makeMove', (index) => {
        if (board[index] === null) {
            board[index] = currentPlayer;
            io.emit('moveMade', { index, player: currentPlayer });
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        }
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });

    socket.on('sendMessage', (message) => {
        io.emit('receiveMessage', message);
    });
});


server.listen(3000, () => {
    console.log('Server is running on port 3000');
});
/*import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

import App from "./App";

const root = createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);*/