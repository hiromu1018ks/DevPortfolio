'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import MinimalistHero from './Hero/MinimalistHero';
import * as THREE from 'three';

interface ExperienceProps {
  scrollProgress: number;
}

const Experience: React.FC<ExperienceProps> = ({ scrollProgress }) => {
  const groupRef = useRef<THREE.Group>(null);

  // Define scroll ranges for each section
  const heroScrollRange = [0, 0.4] as [number, number];

  // Simple scroll-based animation loop
  useFrame(() => {
    // Individual components handle their own animations based on scroll progress
  });

  return (
    <group ref={groupRef}>
      {/* Clean geometric shapes - consistent across all sections */}
      <group position={[0, 0, 0]}> {/* Fixed position relative to parent */}
        <MinimalistHero scrollProgress={scrollProgress} scrollRange={heroScrollRange} />
      </group>


      
    </group>
  );
};


export default Experience;