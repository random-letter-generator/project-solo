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

export const makeMove = (x, y, player) => ({
  type: types.MAKE_MOVE,
  payload: { x, y, player },
});

export const resetGame = () => ({
  type: types.RESET_GAME,
});

export const setWinner = (winner) => ({
  type: types.SET_WINNER,
  payload: winner,
});
