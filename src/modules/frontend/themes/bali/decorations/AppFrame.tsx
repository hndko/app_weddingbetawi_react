import React from 'react';
import { AnimatedBalineseFiligree } from './AnimatedBalineseFiligree';
import { FloatingJepun } from './FloatingJepun';

export const AppFrame: React.FC = () => {
  return (
    <>
      <AnimatedBalineseFiligree color="#D4AF37" />
      <FloatingJepun count={8} />
    </>
  );
};
