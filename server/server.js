const express = require('express');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');
const gomokuController = require('./controllers/gomokuController');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:8080',
    methods: ['GET', 'POST'],
  },
});

const PORT = 3000;

// Game state store
const games = new Map();

// Gomoku namespace
const gomokuIO = io.of('/gomoku');

gomokuIO.on('connection', (socket) => {
  console.log('Player connected to Gomoku:', socket.id);

  socket.on('findGame', () => {
    let roomId = findAvailableRoom(games);
    socket.join(roomId);

    const room = games.get(roomId) || {
      players: [],
      board: Array(15)
        .fill(null)
        .map(() => Array(15).fill(null)),
      currentPlayer: 'black',
      roomId: roomId, // Add roomId to room object
    };

    room.players.push(socket.id);
    games.set(roomId, room);

    console.log(
      `Player ${socket.id} joined room ${roomId}. Players: ${room.players.length}`
    );

    // If room is full, start game
    if (room.players.length === 2) {
      console.log(`Game starting in room ${roomId}`);
      gomokuIO.to(roomId).emit('gameStart', {
        players: room.players,
        board: room.board,
        currentPlayer: room.currentPlayer,
        roomId: roomId,
      });
    }
  });

  socket.on('setPlayerName', ({ name }) => {
    const playerId = socket.id;
    // Store player name in socket
    socket.playerName = name;
  });

  socket.on('move', async ({ x, y, roomId }) => {
    console.log('Move received:', { x, y, roomId, playerId: socket.id });
    const game = games.get(roomId);
    if (!game) return;

    const playerIndex = game.players.indexOf(socket.id);
    const player = playerIndex === 0 ? 'black' : 'white';
    if (player !== game.currentPlayer) return;

    // Make the move
    game.board[y][x] = player;

    // Check for winner
    const isWinner = checkWinner(game.board, x, y, player);

    // Always emit the move
    gomokuIO.to(roomId).emit('moveMade', {
      x,
      y,
      player,
      currentPlayer: player === 'black' ? 'white' : 'black',
      winner: isWinner ? player : null,
    });

    // If there's a winner, clean up after emitting the move
    if (isWinner) {
      console.log('Winner found:', player);
      const winnerId = socket.id;
      const loserId = game.players.find((id) => id !== winnerId);
      const winnerSocket = await gomokuIO
        .fetchSockets()
        .then((sockets) => sockets.find((s) => s.id === winnerId));
      const loserSocket = await gomokuIO
        .fetchSockets()
        .then((sockets) => sockets.find((s) => s.id === loserId));

      // Save game result
      const gameResult = {
        roomId,
        winner: {
          name: winnerSocket.playerName,
          id: winnerId,
        },
        loser: {
          name: loserSocket.playerName,
          id: loserId,
        },
      };

      // Emit event to trigger frontend update
      gomokuIO.to(roomId).emit('gameResult', gameResult);

      games.delete(roomId);
      return;
    }

    // Update game state if continuing
    game.currentPlayer = player === 'black' ? 'white' : 'black';
  });

  socket.on('disconnect', () => {
    // Clean up games/rooms
    for (const [roomId, game] of games.entries()) {
      if (game.players.includes(socket.id)) {
        gomokuIO.to(roomId).emit('playerLeft');
        games.delete(roomId);
      }
    }
  });
});

// Helper function to find available room
function findAvailableRoom(games) {
  for (const [roomId, game] of games.entries()) {
    if (game.players.length < 2) return roomId;
  }
  return 'room_' + Date.now();
}

// Add this helper function for checking winner
function checkWinner(board, x, y, player) {
  const directions = [
    { dx: 1, dy: 0 }, // horizontal
    { dx: 0, dy: 1 }, // vertical
    { dx: 1, dy: 1 }, // diagonal down-right
    { dx: 1, dy: -1 }, // diagonal up-right
  ];

  for (const { dx, dy } of directions) {
    let count = 1;
    // Check positive direction
    for (let i = 1; i < 5; i++) {
      const nx = x + dx * i;
      const ny = y + dy * i;
      if (
        nx >= 0 &&
        nx < 15 &&
        ny >= 0 &&
        ny < 15 &&
        board[ny][nx] === player
      ) {
        count++;
      } else break;
    }
    // Check negative direction
    for (let i = 1; i < 5; i++) {
      const nx = x - dx * i;
      const ny = y - dy * i;
      if (
        nx >= 0 &&
        nx < 15 &&
        ny >= 0 &&
        ny < 15 &&
        board[ny][nx] === player
      ) {
        count++;
      } else break;
    }
    if (count >= 5) return true;
  }
  return false;
}

// Parse JSON bodies
app.use(express.json());
// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// API routes must come before static files
app.post('/api/game-results', gomokuController.saveGameResult);
app.get('/api/recent-games', gomokuController.getRecentGames);

// Static files and catch-all route should come last
app.use(express.static(path.join(__dirname, '../dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist', 'index.html'));
});

// Add this line to help with debugging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Global error handler
app.use((err, req, res, next) => {
  const defaultErr = {
    log: 'Express error handler caught unknown middleware error',
    status: 500,
    message: { err: 'An error occurred' },
  };
  const errorObj = Object.assign({}, defaultErr, err);
  console.log(errorObj.log);
  return res.status(errorObj.status).json(errorObj.message);
});

// Start server
server.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`);
});

module.exports = app;
