// Project1.jsx

import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeMove, resetGame, setWinner } from '../actions/actions';
import '../stylesheets/gomoku.css'; // Ensure gomoku.css is imported

const Project1 = () => {
  const dispatch = useDispatch();
  const board = useSelector((state) => state.gomoku.board);
  const currentPlayer = useSelector((state) => state.gomoku.currentPlayer);
  const winner = useSelector((state) => state.gomoku.winner);

  const handleCellClick = (x, y) => {
    console.log(`Cell clicked at (${x}, ${y})`);
    if (board[y][x] || winner) return;
    dispatch(makeMove(x, y, currentPlayer));
    if (checkWinner(board, x, y, currentPlayer)) {
      dispatch(setWinner(currentPlayer));
    }
  };

  const handleReset = () => {
    console.log('Game reset');
    dispatch(resetGame());
  };

  const checkWinner = (board, x, y, player) => {
    const directions = [
      { dx: 1, dy: 0 }, // Horizontal
      { dx: 0, dy: 1 }, // Vertical
      { dx: 1, dy: 1 }, // Diagonal down-right
      { dx: 1, dy: -1 }, // Diagonal up-right
    ];

    for (const { dx, dy } of directions) {
      let count = 1;
      // Positive direction
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
        } else {
          break;
        }
      }
      // Negative direction
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
        } else {
          break;
        }
      }
      if (count >= 5) {
        return true;
      }
    }
    return false;
  };

  // Determine the winner's class
  const winnerClass =
    winner === 'cheems'
      ? 'winner-cheems'
      : winner === 'darkdoge'
      ? 'winner-darkdoge'
      : '';

  return (
    <div className='flex flex-col items-center bg-yellow-50 min-h-screen'>
      <h2
        className={`text-2xl font-medium mb-4 ${
          winner
            ? winner === 'cheems'
              ? 'winner-cheems'
              : 'winner-darkdoge'
            : ''
        }`}
      >
        {winner
          ? `Winner: ${winner === 'black' ? 'Dark Doge' : 'Cheems'}`
          : `Current Player: ${
              currentPlayer === 'black' ? 'Dark Doge' : 'Cheems'
            }`}
      </h2>
      <div className='board-container'>
        {/* Grid Lines */}
        {[...Array(15)].map((_, i) => (
          <React.Fragment key={i}>
            <div
              className='board-line horizontal'
              style={{ top: `${(i * 100) / 14}%` }}
            ></div>
            <div
              className='board-line vertical'
              style={{ left: `${(i * 100) / 14}%` }}
            ></div>
          </React.Fragment>
        ))}

        {/* Pieces */}
        <div className='pieces-grid'>
          {board.map((row, y) =>
            row.map((cell, x) => (
              <div
                key={`${x}-${y}`}
                onClick={() => handleCellClick(x, y)}
                className='absolute'
                style={{
                  top: `${(y * 100) / 14}%`,
                  left: `${(x * 100) / 14}%`,
                  width: '30px' /* Adjusted size */,
                  height: '30px' /* Adjusted size */,
                  transform: 'translate(-50%, -50%)',
                }}
              >
                {/* Hover Effect */}
                {!cell && !winner && (
                  <div
                    className={`piece hover ${
                      currentPlayer === 'black' ? 'black' : 'white'
                    }`}
                  ></div>
                )}
                {/* Placed Piece */}
                {cell && (
                  <div
                    className={`piece ${cell === 'black' ? 'black' : 'white'}`}
                  ></div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
      <button
        onClick={handleReset}
        className='mt-4 px-4 py-2 bg-amber-500 text-white rounded'
      >
        Reset Game
      </button>
    </div>
  );
};

export default Project1;
