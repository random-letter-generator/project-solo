import React from 'react';
import logoImage from '../assets/logo.jpg';

const TopBar = () => {
  return (
    <nav className='w-full bg-amber-50/60 backdrop-blur-sm transition-all duration-300'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between items-center h-16'>
          {/* Logo */}
          <div className='flex-shrink-0 group'>
            <div
              className='w-10 h-10 overflow-hidden rounded-full
                          border border-amber-100/30
                          shadow-sm hover:shadow-md
                          transition-all duration-300'
            >
              <img
                src={logoImage}
                alt='Logo'
                className='w-full h-full object-cover object-center
                          transform group-hover:scale-105
                          transition-transform duration-300'
              />
            </div>
          </div>

          {/* Navigation */}
          <div className='hidden sm:flex sm:space-x-6'>
            {['Home', 'About', 'Contact'].map((item) => (
              <button
                key={item}
                className='text-amber-600/80 hover:text-amber-800
                          px-3 py-2 text-sm font-medium
                          transition-all duration-200
                          hover:bg-amber-100/20 rounded-md'
              >
                {item}
              </button>
            ))}
          </div>

          {/* Mobile menu button */}
          <div className='sm:hidden'>
            <button
              className='text-amber-600/80 hover:text-amber-800
                             p-2 rounded-md hover:bg-amber-100/20
                             transition-all duration-200'
            >
              <svg
                className='h-5 w-5'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={1.5}
                  d='M4 6h16M4 12h16M4 18h16'
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default TopBar;
