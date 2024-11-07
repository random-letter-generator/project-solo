// gomokuReducer.js

import * as types from '../constants/actionTypes';

const initialState = {
  board: Array(15)
    .fill(null)
    .map(() => Array(15).fill(null)),
  currentPlayer: 'black',
  winner: null,
};

const gomokuReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.MAKE_MOVE:
      if (state.winner) return state;
      const { x, y, player } = action.payload;
      if (state.board[y][x]) return state;

      const newBoard = state.board.map((row, rowIndex) =>
        row.map((cell, colIndex) =>
          rowIndex === y && colIndex === x ? player : cell
        )
      );

      return {
        ...state,
        board: newBoard,
        currentPlayer: player === 'black' ? 'white' : 'black',
      };

    case types.SET_WINNER:
      return {
        ...state,
        winner: action.payload,
      };

    case types.RESET_GAME:
      return initialState;

    default:
      return state;
  }
};

export default gomokuReducer;
