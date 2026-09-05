import React from 'react';
import { AnimatedBatakFiligree } from './AnimatedBatakFiligree';
import { FloatingGorgaPetals } from './FloatingGorgaPetals';

export const AppFrame: React.FC = () => {
  return (
    <>
      <AnimatedBatakFiligree color="#D4AF37" />
      <FloatingGorgaPetals count={8} />
    </>
  );
};
