// add a tic-tac-toe game (as a react component) here.
// this porject1.jsx game will be included as a component in the containers/ProjectsContainer.jsx file
// I want all of the code for the tic-tac-toe game in this file

import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { setProjects } from '../actions/actions';

const Project1 = () => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);

  const calculateWinner = (squares) => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8], // rows
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8], // columns
      [0, 4, 8],
      [2, 4, 6], // diagonals
    ];

    for (const [a, b, c] of lines) {
      if (
        squares[a] &&
        squares[a] === squares[b] &&
        squares[a] === squares[c]
      ) {
        return squares[a];
      }
    }
    return null;
  };

  const handleClick = (i) => {
    if (calculateWinner(board) || board[i]) return;

    const newBoard = board.slice();
    newBoard[i] = xIsNext ? 'X' : 'O';
    setBoard(newBoard);
    setXIsNext(!xIsNext);
  };

  const renderSquare = (i) => (
    <button
      className='w-20 h-20 border border-gray-400 text-2xl font-bold'
      onClick={() => handleClick(i)}
    >
      {board[i]}
    </button>
  );

  const winner = calculateWinner(board);
  const status = winner
    ? `Winner: ${winner}`
    : `Next player: ${xIsNext ? 'X' : 'O'}`;

  return (
    <div className='flex flex-col items-center gap-4'>
      <h2 className='text-2xl font-bold'>Tic Tac Toe</h2>
      <div className='text-xl'>{status}</div>
      <div className='grid grid-cols-3'>
        {[...Array(9)].map((_, i) => renderSquare(i))}
      </div>
    </div>
  );
};

export default Project1;
