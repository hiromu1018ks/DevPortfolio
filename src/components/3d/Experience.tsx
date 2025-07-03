'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { TransitioningParticles } from './TransitioningParticles';
import MinimalistHero from './Hero/MinimalistHero';
import ProjectObject from './Projects/ProjectObject';
import AboutObject from './About/AboutObject';
import { ANIMATION_SETTINGS } from '@/constants/scene';
import * as THREE from 'three';

interface ExperienceProps {
  scrollProgress: number;
}

const Experience: React.FC<ExperienceProps> = ({ scrollProgress }) => {
  const groupRef = useRef<THREE.Group>(null);

  // Define scroll ranges for each section
  const heroScrollRange = [0, 0.4] as [number, number];
  const projectsScrollRange = [0.2, 0.8] as [number, number];
  const aboutScrollRange = [0.6, 1.0] as [number, number];

  useFrame(() => {
    // Main animation loop - individual components handle their own animations
  });

  return (
    <group ref={groupRef}>
      {/* Main transitioning particle system */}
      <TransitioningParticles scrollProgress={scrollProgress} />
      
      {/* Hero Section 3D Elements - Geometric shapes */}
      <group position={[0, 0, 0]}>
        <MinimalistHero scrollProgress={scrollProgress} scrollRange={heroScrollRange} />
      </group>

      {/* Projects Section 3D Elements - Multiple geometric objects */}
      <group position={[0, 0, 0]}>
        <ProjectObject
          position={[-3, 0, -2]}
          projectId="project-1"
          scrollProgress={scrollProgress}
          scrollRange={projectsScrollRange}
        />
        <ProjectObject
          position={[0, 0, -2]}
          projectId="project-2"
          scrollProgress={scrollProgress}
          scrollRange={projectsScrollRange}
        />
        <ProjectObject
          position={[3, 0, -2]}
          projectId="project-3"
          scrollProgress={scrollProgress}
          scrollRange={projectsScrollRange}
        />
      </group>

      {/* About Section 3D Elements */}
      <group position={[0, 0, 0]}>
        <AboutObject scrollProgress={scrollProgress} scrollRange={aboutScrollRange} />
      </group>
      
      {/* Background particles that react to scroll */}
      <ParticleField scrollProgress={scrollProgress} />
    </group>
  );
};

// Background particle system
const ParticleField: React.FC<{ scrollProgress: number }> = ({ scrollProgress: _scrollProgress }) => { // eslint-disable-line @typescript-eslint/no-unused-vars
  const particleCount = ANIMATION_SETTINGS.particleCount.medium;
  
  const positions = React.useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    return positions;
  }, [particleCount]);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial 
        color="#111111" 
        size={0.02} 
        transparent={true}
        opacity={0.5}
      />
    </points>
  );
};

export default Experience;