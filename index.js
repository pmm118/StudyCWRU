const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const { isValidMove, checkWinner, makeMove } = require("./GameLogic");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = 3000;

// In-memory storage for rooms
const rooms = {};

// Route for the root URL
app.get("/", (req, res) => {
    res.send("Welcome to the game server!");
});

io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    socket.on("joinRoom", ({ roomId, username }) => {
        if (!rooms[roomId]) {
            rooms[roomId] = { players: [], board: Array(9).fill(null), turn: "X", winner: null };
        }

        const room = rooms[roomId];
        if (room.players.length < 2) {
            room.players.push({ id: socket.id, username });
            socket.join(roomId);
            io.to(roomId).emit("roomUpdate", room);
        } else {
            socket.emit("roomFull", { message: "Room is full" });
        }
    });

    socket.on("makeMove", ({ roomId, index, player }) => {
        const room = rooms[roomId];
        if (room) {
            if (isValidMove(room, index, player)) {
                makeMove(room, index, player);
                io.to(roomId).emit("updateGame", room);
            } else {
                socket.emit("invalidMove", { message: "Invalid move" });
            }
        } else {
            socket.emit("error", { message: "Room does not exist" });
        }
    });

    socket.on("disconnect", () => {
        console.log("A user disconnected:", socket.id);
        for (const roomId in rooms) {
            const room = rooms[roomId];
            const playerIndex = room.players.findIndex((p) => p.id === socket.id);

            if (playerIndex !== -1) {
                room.players.splice(playerIndex, 1);

                if (room.players.length === 0) {
                    delete rooms[roomId];
                    console.log(`Room ${roomId} deleted (empty)`);
                } else {
                    io.to(roomId).emit("roomUpdate", room);
                }
                break;
            }
        }
    });
});

// Start the server
server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
