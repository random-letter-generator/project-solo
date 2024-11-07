// gomokuReducer.js

import * as types from '../constants/actionTypes';

const initialState = {
  board: Array(15)
    .fill(null)
    .map(() => Array(15).fill(null)),
  currentPlayer: 'black',
  winner: null,
  roomId: null,
  playerId: null,
  players: [],
  isMyTurn: false,
  gameStatus: 'waiting', // 'waiting', 'playing', 'ended'
};

const gomokuReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.MAKE_MOVE:
      if (!action.payload || state.winner) return state;

      const { x, y, player } = action.payload;
      if (typeof x !== 'number' || typeof y !== 'number' || !player)
        return state;

      const newBoard = state.board.map((row) => [...row]);
      newBoard[y][x] = player;

      return {
        ...state,
        board: newBoard,
        currentPlayer: player === 'black' ? 'white' : 'black',
        isMyTurn: state.playerId === state.players[player === 'black' ? 1 : 0],
      };

    case types.SET_WINNER:
      return {
        ...state,
        winner: action.payload,
        gameStatus: 'ended',
        isMyTurn: false, // Prevent further moves
      };

    case types.RESET_GAME:
      return initialState;

    case types.JOIN_ROOM:
      return {
        ...state,
        roomId: action.payload.roomId,
        playerId: action.payload.playerId,
      };

    case types.GAME_STARTED:
      console.log('Reducer: Game started', action.payload);
      return {
        ...state,
        gameStatus: 'playing',
        roomId: action.payload.roomId,
        players: action.payload.players,
        playerId: action.payload.playerId,
        isMyTurn: action.payload.players[0] === action.payload.playerId, // First player (black) goes first
      };

    case types.PLAYER_LEFT:
      return {
        ...state,
        gameStatus: 'ended',
        winner: 'opponent left',
      };

    default:
      return state;
  }
};

export default gomokuReducer;
