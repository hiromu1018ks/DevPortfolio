'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import MinimalistHero from './Hero/MinimalistHero';
import ProjectObject from './Projects/ProjectObject';
import { ANIMATION_SETTINGS } from '@/constants/scene';
import * as THREE from 'three';

const Experience: React.FC = () => {
  const { scrollProgress } = useScrollAnimation();
  
  // Determine current section based on scroll progress
  const getCurrentSection = () => {
    if (scrollProgress < 0.3) return 'hero';
    if (scrollProgress < 0.7) return 'projects';
    return 'about';
  };
  
  const currentSection = getCurrentSection();

  const groupRef = useRef<THREE.Group>(null);
  const [prevSection, setPrevSection] = React.useState(currentSection);
  const transitionProgress = useRef(0);

  // Handle section transitions with three.js animation
  useFrame((state, delta) => {
    if (prevSection !== currentSection) {
      transitionProgress.current += delta * 2; // Transition speed
      if (transitionProgress.current >= 1) {
        setPrevSection(currentSection);
        transitionProgress.current = 0;
      }
    }

    if (groupRef.current) {
      // Smooth transitions based on scroll
      const targetOpacity = transitionProgress.current > 0 ? 
        1 - transitionProgress.current : 1;
      
      groupRef.current.traverse((child) => {
        if (child instanceof THREE.Mesh && child.material) {
          if ('opacity' in child.material) {
            (child.material as THREE.Material & { opacity: number }).opacity = targetOpacity;
          }
        }
      });
    }
  });

  return (
    <group ref={groupRef}>
      {/* Hero Section 3D Elements */}
      {(currentSection === 'hero' || prevSection === 'hero') && (
        <group 
          position={[0, currentSection === 'hero' ? 0 : -5, 0]}
        >
          <MinimalistHero />
        </group>
      )}
      
      {/* Projects Section 3D Elements */}
      {(currentSection === 'projects' || prevSection === 'projects') && (
        <group 
          position={[0, currentSection === 'projects' ? 0 : 5, 0]}
        >
          <ProjectObject 
            position={[-3, 0, 0]} 
            projectId="project-1"
            title="Project One"
          />
          <ProjectObject 
            position={[0, 0, 0]} 
            projectId="project-2"
            title="Project Two"
          />
          <ProjectObject 
            position={[3, 0, 0]} 
            projectId="project-3"
            title="Project Three"
          />
        </group>
      )}
      
      {/* About Section */}
      {(currentSection === 'about' || prevSection === 'about') && (
        <group 
          position={[0, currentSection === 'about' ? 0 : 10, 0]}
        >
          <mesh position={[0, 0, 0]}>
            <sphereGeometry args={[1, 32, 32]} />
            <meshStandardMaterial 
              color="#0055FF" 
              transparent={true}
              opacity={0.7}
              wireframe={true}
            />
          </mesh>
        </group>
      )}
      
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