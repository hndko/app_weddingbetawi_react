import React from 'react';
import { AnimatedNetflixCorner } from './AnimatedNetflixCorner';
import { FloatingCinemaParticles } from './FloatingCinemaParticles';

export const AppFrame: React.FC = () => {
  return (
    <>
      <AnimatedNetflixCorner color="#E50914" />
      <FloatingCinemaParticles count={8} />
    </>
  );
};
