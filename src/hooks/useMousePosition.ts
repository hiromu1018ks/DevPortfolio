'use client';

import { useState, useEffect } from 'react';

export interface MousePosition {
  x: number;
  y: number;
  normalizedX: number; // -1 to 1
  normalizedY: number; // -1 to 1
}

export const useMousePosition = () => {
  const [mousePosition, setMousePosition] = useState<MousePosition>({
    x: 0,
    y: 0,
    normalizedX: 0,
    normalizedY: 0,
  });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const x = event.clientX;
      const y = event.clientY;
      const normalizedX = (x / window.innerWidth) * 2 - 1;
      const normalizedY = -(y / window.innerHeight) * 2 + 1;

      setMousePosition({
        x,
        y,
        normalizedX,
        normalizedY,
      });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return mousePosition;
};