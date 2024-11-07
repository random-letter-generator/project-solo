// Project1.jsx

import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeMove, resetGame } from '../actions/actions';
import '../stylesheets/gomoku.css';
import socketManager from '../socket/socket.js';
import WaitingRoom from './WaitingRoom.jsx';

const Project1 = () => {
  const dispatch = useDispatch();
  const gameState = useSelector((state) => state.gomoku);
  const [recentGames, setRecentGames] = useState([]);

  const fetchRecentGames = async () => {
    let response;
    try {
      response = await fetch('http://localhost:3000/api/recent-games'); // Updated URL
      console.log('Fetch response:', response); // Log the raw response
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log('Fetched recent games:', data); // Debug log
      setRecentGames(data);
    } catch (error) {
      console.error('Error fetching recent games:', error);
      if (response && !response.bodyUsed) {
        const responseText = await response.text();
        console.error('Response text:', responseText);
      }
    }
  };

  useEffect(() => {
    socketManager.connect(dispatch);
    fetchRecentGames(); // Initial fetch

    // Listen for 'gameResult' event to refresh recent games
    socketManager.socket?.on('gameResult', fetchRecentGames);

    // Clean up on unmount
    return () => {
      socketManager.socket?.off('gameResult', fetchRecentGames);
      socketManager.disconnect();
    };
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
    <div className='relative'>
      <div className='page-background'></div>
      {gameState.gameStatus === 'waiting' ? (
        <WaitingRoom />
      ) : (
        <div className='flex flex-col items-center min-h-screen relative'>
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
              ? `Winner: ${
                  gameState.winner === 'black' ? 'Dark Doge' : 'Cheems'
                }`
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
                          gameState.currentPlayer === 'black'
                            ? 'black'
                            : 'white'
                        }`}
                      ></div>
                    )}
                    {/* Placed Piece */}
                    {cell && (
                      <div
                        className={`piece ${
                          cell === 'black' ? 'black' : 'white'
                        }`}
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

          <div className='recent-games'>
            <h3 className='text-xl font-bold mb-4'>Recent Games</h3>
            {recentGames.map((game, index) => (
              <div key={index} className='recent-game-item'>
                <span>
                  Winner: {game.winner.name}, Loser: {game.loser.name}
                </span>
                <span>{new Date(game.date).toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Project1;
