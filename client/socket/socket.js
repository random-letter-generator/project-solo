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
  }

  connect(dispatch) {
    if (this.socket?.connected) return; // Prevent multiple connections

    this.dispatch = dispatch;
    this.socket = io('http://localhost:3000/gomoku', {
      transports: ['websocket'],
      reconnection: true,
    });
    this.setupListeners();
  }

  setupListeners() {
    this.socket.on('connect', () => {
      console.log('Connected to server with ID:', this.socket.id);
      // Do not emit findGame here anymore
    });

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
    if (this.socket) {
      this.socket.emit('setPlayerName', { name });
      this.socket.emit('findGame'); // Start finding game after setting name
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

export default new SocketManager();
