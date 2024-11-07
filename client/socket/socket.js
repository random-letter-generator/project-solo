import { io } from 'socket.io-client';
import {
  joinRoom,
  gameStarted,
  playerLeft,
  makeMove,
  setWinner,
} from '../actions/actions';

class SocketManager {
  constructor() {
    this.socket = null;
    this.dispatch = null;
    this.playerName = null; // Store player name
  }

  connect(dispatch) {
    if (this.socket?.connected) return; // Prevent multiple connections

    this.dispatch = dispatch;
    this.socket = io('http://localhost:3000/gomoku', {
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      autoConnect: true,
      withCredentials: true,
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });

    // Move setupListeners here to ensure it's called only once
    this.setupListeners();

    this.socket.on('connect', () => {
      console.log('Connected to server with ID:', this.socket.id);
      // Emit 'setPlayerName' and 'findGame' if the player name is already set
      if (this.playerName) {
        console.log('Emitting setPlayerName with:', this.playerName);
        this.socket.emit('setPlayerName', { name: this.playerName });
        this.socket.emit('findGame');
      }
    });
  }

  setupListeners() {
    this.socket.on('gameStart', (gameState) => {
      console.log('Game started:', gameState);
      // Make sure we pass all necessary data
      this.dispatch(
        gameStarted({
          ...gameState,
          playerId: this.socket.id,
          players: gameState.players,
          roomId: gameState.roomId,
          currentPlayer: gameState.currentPlayer,
        })
      );
    });

    this.socket.on('moveMade', (moveData) => {
      console.log('Move received from server:', moveData);

      // Validate move data before dispatching
      if (
        typeof moveData.x === 'number' &&
        typeof moveData.y === 'number' &&
        moveData.player
      ) {
        this.dispatch(makeMove(moveData.x, moveData.y, moveData.player));

        if (moveData.winner) {
          setTimeout(() => {
            this.dispatch(setWinner(moveData.winner));
          }, 100);
        }
      } else {
        console.error('Invalid move data received:', moveData);
      }
    });

    this.socket.on('gameEnded', ({ winner }) => {
      console.log('Game ended, winner:', winner);
      this.dispatch(setWinner(winner));
    });

    this.socket.on('playerLeft', () => {
      console.log('Player left');
      this.dispatch(playerLeft());
    });
  }

  makeMove(x, y, roomId) {
    if (!roomId) {
      console.error('No room ID available');
      return;
    }
    console.log('Emitting move to server:', { x, y, roomId });
    this.socket.emit('move', { x, y, roomId });
  }

  setPlayerName(name) {
    console.log('Setting player name:', name);
    this.playerName = name;

    if (this.socket) {
      if (this.socket.connected) {
        console.log('Socket connected, emitting events immediately');
        this.socket.emit('setPlayerName', { name });
        this.socket.emit('findGame');
      } else {
        console.log('Socket not connected, waiting for connection');
        this.socket.connect();
      }
    }
    // If not connected yet, the 'connect' event handler will emit the events
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

export default new SocketManager();
