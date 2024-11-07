// Project1.jsx

import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { io } from 'socket.io-client';
import { makeMove, resetGame, setWinner } from '../actions/actions';
import '../stylesheets/gomoku.css'; // Ensure gomoku.css is imported
import socketManager from '../socket/socket.js';

const Project1 = () => {
  const dispatch = useDispatch();
  const gameState = useSelector((state) => state.gomoku);

  useEffect(() => {
    socketManager.connect(dispatch);
    return () => socketManager.disconnect();
  }, []);

  const handleCellClick = (x, y) => {
    console.log('Cell clicked:', {
      x,
      y,
      isMyTurn: gameState.isMyTurn,
      gameStatus: gameState.gameStatus,
      roomId: gameState.roomId,
    });

    if (
      !gameState.isMyTurn ||
      gameState.board[y][x] ||
      gameState.winner ||
      gameState.gameStatus !== 'playing'
    ) {
      return;
    }

    socketManager.makeMove(x, y, gameState.roomId);
  };

  // Render waiting room if game hasn't started
  if (gameState.gameStatus === 'waiting') {
    return (
      <div className='flex items-center justify-center h-screen'>
        <div className='text-xl'>Waiting for opponent...</div>
      </div>
    );
  }

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

  // Add game status display
  const getGameStatus = () => {
    if (gameState.gameStatus === 'waiting') return 'Waiting for opponent...';
    if (gameState.gameStatus === 'playing') {
      return gameState.isMyTurn ? 'Your turn' : "Opponent's turn";
    }
    return gameState.winner ? `Winner: ${gameState.winner}` : '';
  };

  // Determine the winner's class
  const winnerClass =
    gameState.winner === 'cheems'
      ? 'winner-cheems'
      : gameState.winner === 'darkdoge'
      ? 'winner-darkdoge'
      : '';

  const getPlayerRole = () => {
    if (!gameState.playerId || !gameState.players) return '';
    return gameState.players[0] === gameState.playerId ? 'Dark Doge' : 'Cheems';
  };

  return (
    <div className='flex flex-col items-center bg-yellow-50 min-h-screen'>
      <h2
        className={`text-2xl font-medium mb-4 ${
          gameState.winner
            ? gameState.winner === 'cheems'
              ? 'winner-cheems'
              : 'winner-darkdoge'
            : ''
        }`}
      >
        {gameState.winner
          ? `Winner: ${gameState.winner === 'black' ? 'Dark Doge' : 'Cheems'}`
          : `Current Player: ${
              gameState.currentPlayer === 'black' ? 'Dark Doge' : 'Cheems'
            }`}
      </h2>

      {/* Add player role display */}
      <div className='mb-4 text-lg text-amber-700'>
        You are playing as: {getPlayerRole()}
      </div>

      {/* Status display */}
      <div className='mb-4 text-lg text-amber-600'>
        {gameState.winner
          ? `Game Over! ${
              gameState.winner === 'black' ? 'Dark Doge' : 'Cheems'
            } wins!`
          : gameState.isMyTurn
          ? 'Your turn!'
          : "Opponent's turn"}
      </div>

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
          {gameState.board.map((row, y) =>
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
                {!cell && !gameState.winner && (
                  <div
                    className={`piece hover ${
                      gameState.currentPlayer === 'black' ? 'black' : 'white'
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

      {/* Only show reset button if game is over */}
      {gameState.winner && (
        <button
          onClick={handleReset}
          className='mt-4 px-4 py-2 bg-amber-500 text-white rounded hover:bg-amber-600'
        >
          New Game
        </button>
      )}
    </div>
  );
};

export default Project1;
