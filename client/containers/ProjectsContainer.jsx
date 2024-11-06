// App.jsx
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setProjects } from './actions/projectActions';
import ProjectList from './containers/ProjectList';

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const projects = [
      {
        id: 1,
        title: 'Project One',
        description: 'This is a placeholder for Project One.',
        link: 'https://example.com/project-one',
      },
      {
        id: 2,
        title: 'Project Two',
        description: 'This is a placeholder for Project Two.',
        link: 'https://example.com/project-two',
      },
      {
        id: 3,
        title: 'Project Three',
        description: 'This is a placeholder for Project Three.',
        link: 'https://example.com/project-three',
      },
    ];
    dispatch(setProjects(projects));
  }, [dispatch]);

  return (
    <div className='relative h-screen bg-gray-100'>
      <ProjectList />
    </div>
  );
};

export default App;
