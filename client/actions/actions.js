/**
 * ************************************
 *
 * @module  actions.js
 * @author
 * @date
 * @description Action Creators
 *
 * ************************************
 */

// import actionType constants
import * as types from '../constants/actionTypes';

// export const addActionCreator = () => ({
//   type: types.ADD,
//   payload: null,
// });

// export const minusActionCreator = () => ({
//   type: types.MINUS,
//   payload: null,
// });

export const makeMove = (x, y, player) => {
  // Validate inputs before creating action
  if (typeof x !== 'number' || typeof y !== 'number' || !player) {
    console.error('Invalid move parameters:', { x, y, player });
    return { type: 'INVALID_MOVE' }; // Add this to your action types if needed
  }

  return {
    type: types.MAKE_MOVE,
    payload: { x, y, player },
  };
};

export const resetGame = () => ({
  type: types.RESET_GAME,
});

export const setWinner = (winner) => ({
  type: types.SET_WINNER,
  payload: winner,
});

export const joinRoom = (roomId, playerId) => ({
  type: types.JOIN_ROOM,
  payload: { roomId, playerId },
});

export const gameStarted = (gameState) => ({
  type: types.GAME_STARTED,
  payload: gameState,
});

export const playerLeft = () => ({
  type: types.PLAYER_LEFT,
});

export const updateGameState = (gameState) => ({
  type: types.UPDATE_GAME_STATE,
  payload: gameState,
});
