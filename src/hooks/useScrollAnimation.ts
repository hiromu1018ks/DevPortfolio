'use client';

import { useState, useEffect } from 'react';

export interface ScrollData {
  scrollY: number;
  scrollProgress: number; // 0 to 1
  direction: 'up' | 'down';
  velocity: number;
}

export const useScrollAnimation = () => {
  const [scrollData, setScrollData] = useState<ScrollData>({
    scrollY: 0,
    scrollProgress: 0,
    direction: 'down',
    velocity: 0,
  });

  useEffect(() => {
    let lastScrollY = 0;
    let lastTime = Date.now();
    let velocity = 0;

    const handleScroll = () => {
      const currentTime = Date.now();
      const currentScrollY = window.scrollY;
      const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
      
      // Calculate velocity
      const deltaTime = currentTime - lastTime;
      const deltaY = currentScrollY - lastScrollY;
      
      if (deltaTime > 0) {
        velocity = deltaY / deltaTime;
      }
      
      // Determine direction
      const direction = currentScrollY > lastScrollY ? 'down' : 'up';
      
      // Calculate progress (0 to 1)
      const scrollProgress = documentHeight > 0 ? currentScrollY / documentHeight : 0;

      setScrollData({
        scrollY: currentScrollY,
        scrollProgress: Math.min(Math.max(scrollProgress, 0), 1),
        direction,
        velocity: Math.abs(velocity),
      });

      lastScrollY = currentScrollY;
      lastTime = currentTime;
    };

    // Throttle scroll events
    let ticking = false;
    const throttledScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', throttledScroll, { passive: true });
    
    // Initial call
    handleScroll();

    return () => {
      window.removeEventListener('scroll', throttledScroll);
    };
  }, []);

  return scrollData;
};