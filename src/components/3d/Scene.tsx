'use client';

import React from 'react';
import CanvasWrapper from './CanvasWrapper';
import Experience from './Experience';

const Scene: React.FC = () => {
  return (
    <CanvasWrapper 
      enableControls={false}
    >
      <Experience />
    </CanvasWrapper>
  );
};

export default Scene;