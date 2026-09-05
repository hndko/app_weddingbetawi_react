import React from 'react';
import { AnimatedSpotifyCorner } from './AnimatedSpotifyCorner';
import { FloatingMusicNotes } from './FloatingMusicNotes';

export const AppFrame: React.FC = () => {
  return (
    <>
      <AnimatedSpotifyCorner color="#1DB954" />
      <FloatingMusicNotes count={8} />
    </>
  );
};
