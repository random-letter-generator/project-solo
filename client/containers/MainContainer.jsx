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
};

export default MainContainer;
