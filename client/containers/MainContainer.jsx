/**
 * ************************************
 *
 * @module  MainContainer
 * @author
 * @date
 * @description stateful component that renders TotalsDisplay and MarketsContainer
 *
 * ************************************
 */

import React from 'react';
import { useSelector } from 'react-redux';

import TopBar from '../components/TopBar.jsx';
import ProjectsContainer from './ProjectsContainer.jsx';

const MainContainer = () => {
  return (
    <div className='w-full flex flex-col space-y-6'>
      <div className='bg-amber-50/80 backdrop-blur-sm'>
        <TopBar />
      </div>

      <div className='text-center'>
        <h1
          className='text-3xl sm:text-4xl font-light tracking-tight
                    bg-gradient-to-r from-amber-700 to-amber-900
                    bg-clip-text text-transparent
                    transition-all duration-300'
        >
          Solo Project
        </h1>
        <p className='mt-2 text-amber-600/70 text-sm sm:text-base font-light'>
          A collection of fun demos
        </p>
      </div>

      <div
        className='border border-amber-100/30 rounded-lg bg-amber-50/80
                    backdrop-blur-sm shadow-sm p-4 sm:p-6'
      >
        <ProjectsContainer />
      </div>
    </div>
  );
};

export default MainContainer;
