import React, { useState } from 'react';
import socketManager from '../socket/socket';

const WaitingRoom = () => {
  const [name, setName] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      console.log('Setting player name:', name);
      socketManager.setPlayerName(name);
      setIsSubmitted(true);
    }
  };

  return (
    <div className='flex flex-col items-center justify-center p-8'>
      {!isSubmitted ? (
        <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
          <input
            type='text'
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder='Enter your name'
            className='px-4 py-2 border rounded'
            required
          />
          <button
            type='submit'
            className='bg-amber-500 text-white px-4 py-2 rounded'
          >
            Join Game
          </button>
        </form>
      ) : (
        <>
          <div className='animate-spin rounded-full h-12 w-12 border-4 border-amber-500 border-t-transparent mb-4'></div>
          <h3 className='text-xl text-amber-800'>Waiting for opponent...</h3>
        </>
      )}
    </div>
  );
};

export default WaitingRoom;
