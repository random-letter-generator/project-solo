/**
 * ************************************
 *
 * @module  App.jsx
 * @author
 * @date
 * @description
 *
 * ************************************
 */

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainContainer from './containers/MainContainer.jsx';
import Project1 from './components/Project1.jsx';
import Project2 from './components/Project2.jsx';
import Project3 from './components/Project3.jsx';
import Project4 from './components/Project4.jsx';

const App = () => {
  return (
    <div className='min-h-screen w-full flex flex-col bg-gradient-to-br from-amber-50 to-amber-100/50'>
      <Routes>
        <Route path='/' element={<MainContainer />} />
        <Route path='/project1' element={<Project1 />} />
        <Route path='/project2' element={<Project2 />} />
        <Route path='/project3' element={<Project3 />} />
        <Route path='/project4' element={<Project4 />} />
      </Routes>
    </div>
  );
};

export default App;
