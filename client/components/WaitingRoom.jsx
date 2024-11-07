import React from 'react';

const WaitingRoom = () => {
  return (
    <div className='flex flex-col items-center justify-center p-8'>
      <div className='animate-spin rounded-full h-12 w-12 border-4 border-amber-500 border-t-transparent mb-4'></div>
      <h3 className='text-xl text-amber-800'>Waiting for opponent...</h3>
    </div>
  );
};

export default WaitingRoom;
