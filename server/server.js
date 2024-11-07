const express = require('express');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');
const gomokuController = require('./controllers/gomokuController');
const { connection, GameResult } = require('./models/gomokuModels');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ['http://localhost:8080', 'http://localhost:3000'],
    methods: ['GET', 'POST'],
    credentials: true,
    allowedHeaders: ['Content-Type'],
  },
  transports: ['websocket', 'polling'],
});

// Add debug logging for socket connections
io.engine.on('connection_error', (err) => {
  console.log('Connection error:', err);
});

const PORT = 3000;

// Game state store
const games = new Map();

// Gomoku namespace
const gomokuIO = io.of('/gomoku');

gomokuIO.on('connection', (socket) => {
  console.log('Player connected to Gomoku:', socket.id);

  // Initialize playerName as null
  socket.playerName = null;

  socket.on('setPlayerName', ({ name }) => {
    socket.playerName = name;
    console.log(`Player ${socket.id} set name to ${name}`);
  });

  socket.on('findGame', () => {
    if (!socket.playerName) {
      console.log(`Player ${socket.id} has not set a name yet.`);
      return;
    }

    console.log('findGame event received from', socket.id);
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

      // Save game result directly to the database
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

      try {
        await GameResult.create(gameResult);
        console.log('Game result saved:', gameResult);
      } catch (err) {
        console.error('Error saving game result:', err);
      }

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

// Move this before other middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// Parse JSON bodies
app.use(express.json());
// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// Add this middleware before your routes
app.use((req, res, next) => {
  if (connection.readyState !== 1) {
    console.log('Database connection state:', connection.readyState);
    if (req.path.startsWith('/api/')) {
      return res.status(503).json({ error: 'Database connection not ready' });
    }
  }
  next();
});

// Move the API routes BEFORE the static file middleware
app.use('/api', express.json());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// API routes
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
