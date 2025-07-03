'use client';

import React from 'react';
import CanvasWrapper from './CanvasWrapper';
import Experience from './Experience';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

const Scene: React.FC = () => {
  const { scrollProgress } = useScrollAnimation();

  return (
    <CanvasWrapper 
      enableControls={false}
    >
      <Experience scrollProgress={scrollProgress} />
    </CanvasWrapper>
  );
};

export default Scene;