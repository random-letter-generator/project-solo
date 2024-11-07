import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import gomokuImage from '../assets/doge-gomoku.webp';
import chatroomImage from '../assets/doge-amongus.webp';
import comingImage from '../assets/doge-coming-soon.webp';

const ProjectsContainer = () => {
  const navigate = useNavigate();

  const projects = [
    {
      id: 1,
      name: 'Gomoku',
      description: 'Five-in-a-row game',
      image: gomokuImage,
    },
    {
      id: 2,
      name: 'Among Us Chat Room',
      description: "Find out who's AI",
      image: chatroomImage,
    },
    {
      id: 3,
      name: 'Project 3',
      description: 'Coming soon',
      image: comingImage,
    },
    {
      id: 4,
      name: 'Project 4',
      description: 'Coming soon',
      image: comingImage,
    },
  ];

  return (
    <div className='w-full grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8'>
      {projects.map((project) => (
        <Link
          key={project.id}
          to={`/project${project.id}`}
          className='group relative p-8 bg-amber-50/80 rounded-lg
                     before:absolute before:inset-0 before:rounded-lg
                     before:border before:border-amber-200/40
                     after:absolute after:inset-[2px] after:rounded-lg
                     after:border after:border-amber-100/30
                     shadow-sm hover:shadow-md
                     transition-all duration-300
                     flex flex-col items-center
                     hover:before:border-amber-200/60
                     hover:after:border-amber-100/50'
        >
          <div
            className='w-48 h-48 sm:w-64 sm:h-64 mb-6 overflow-hidden
                         transition-transform duration-300 group-hover:scale-105'
            style={{
              maskImage: `
                linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%),
                linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)
              `,
              WebkitMaskImage: `
                linear-gradient(to right, transparent 0%, black 15%, black 85%,, transparent 100%),
                linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)
              `,
              maskComposite: 'intersect',
              WebkitMaskComposite: 'destination-in',
            }}
          >
            <img
              src={project.image}
              alt={project.name}
              className='w-full h-full object-cover'
            />
          </div>
          <h3
            className='text-xl font-light mb-3 text-amber-800/90
                         group-hover:text-amber-900
                         transition-colors duration-300'
          >
            {project.name}
          </h3>
          <p className='text-amber-600/70 text-sm'>{project.description}</p>
        </Link>
      ))}
    </div>
  );
};

export default ProjectsContainer;
