'use client';

import * as THREE from 'three';
import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { COLORS } from '@/constants/colors';

interface TransitioningParticlesProps {
  scrollProgress: number;
}

export const TransitioningParticles: React.FC<TransitioningParticlesProps> = ({
  scrollProgress,
}) => {
  const particlesRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.PointsMaterial>(null);
  
  const particleCount = 1000;

  // Generate particle positions for different sections
  const particleData = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    const heroPositions = new Float32Array(particleCount * 3);
    const projectPositions = new Float32Array(particleCount * 3);
    const aboutPositions = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
      // Initial scattered positions
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
      
      // Hero section: text-like formation
      const heroAngle = (i / particleCount) * Math.PI * 4;
      const heroRadius = 2 + Math.sin(i * 0.1) * 0.5;
      heroPositions[i * 3] = Math.cos(heroAngle) * heroRadius;
      heroPositions[i * 3 + 1] = Math.sin(heroAngle) * 0.5 + Math.sin(i * 0.05) * 0.2;
      heroPositions[i * 3 + 2] = (Math.random() - 0.5) * 0.5;
      
      // Project section: geometric shapes (cube, triangle, sphere)
      const shapeType = i % 3;
      if (shapeType === 0) {
        // Cube
        projectPositions[i * 3] = -2 + (Math.random() - 0.5) * 1;
        projectPositions[i * 3 + 1] = (Math.random() - 0.5) * 1;
        projectPositions[i * 3 + 2] = (Math.random() - 0.5) * 1;
      } else if (shapeType === 1) {
        // Triangle/Pyramid
        const triAngle = (i / particleCount) * Math.PI * 2;
        const triHeight = Math.random();
        projectPositions[i * 3] = Math.cos(triAngle) * (1 - triHeight) * 0.5;
        projectPositions[i * 3 + 1] = triHeight - 0.5;
        projectPositions[i * 3 + 2] = Math.sin(triAngle) * (1 - triHeight) * 0.5;
      } else {
        // Sphere
        const sphereAngle1 = Math.random() * Math.PI * 2;
        const sphereAngle2 = Math.random() * Math.PI;
        const sphereRadius = 0.8;
        projectPositions[i * 3] = 2 + Math.cos(sphereAngle1) * Math.sin(sphereAngle2) * sphereRadius;
        projectPositions[i * 3 + 1] = Math.cos(sphereAngle2) * sphereRadius;
        projectPositions[i * 3 + 2] = Math.sin(sphereAngle1) * Math.sin(sphereAngle2) * sphereRadius;
      }
      
      // About section: spiral formation
      const aboutAngle = (i / particleCount) * Math.PI * 6;
      const aboutRadius = (i / particleCount) * 3;
      aboutPositions[i * 3] = Math.cos(aboutAngle) * aboutRadius;
      aboutPositions[i * 3 + 1] = (i / particleCount - 0.5) * 2;
      aboutPositions[i * 3 + 2] = Math.sin(aboutAngle) * aboutRadius;
    }
    
    return {
      positions,
      heroPositions,
      projectPositions,
      aboutPositions,
    };
  }, [particleCount]);

  useFrame((state) => {
    if (particlesRef.current && materialRef.current) {
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
      const time = state.clock.elapsedTime;
      
      // Determine current section and animation progress
      let currentSection = 'hero';
      let animationProgress = 0;
      let targetPositions = particleData.heroPositions;
      let sourcePositions = particleData.positions;
      
      if (scrollProgress < 0.25) {
        // Hero section: construct from scattered to hero
        currentSection = 'hero';
        animationProgress = Math.min(scrollProgress / 0.25, 1);
        sourcePositions = particleData.positions;
        targetPositions = particleData.heroPositions;
      } else if (scrollProgress < 0.4) {
        // Hero to projects transition: deconstruct hero, construct projects
        currentSection = 'transition-to-projects';
        animationProgress = (scrollProgress - 0.25) / 0.15;
        sourcePositions = particleData.heroPositions;
        targetPositions = particleData.projectPositions;
      } else if (scrollProgress < 0.65) {
        // Projects section: maintain project formation
        currentSection = 'projects';
        animationProgress = 1;
        sourcePositions = particleData.projectPositions;
        targetPositions = particleData.projectPositions;
      } else if (scrollProgress < 0.8) {
        // Projects to about transition
        currentSection = 'transition-to-about';
        animationProgress = (scrollProgress - 0.65) / 0.15;
        sourcePositions = particleData.projectPositions;
        targetPositions = particleData.aboutPositions;
      } else {
        // About section: maintain about formation
        currentSection = 'about';
        animationProgress = 1;
        sourcePositions = particleData.aboutPositions;
        targetPositions = particleData.aboutPositions;
      }
      
      // Apply smooth easing
      const easedProgress = THREE.MathUtils.smoothstep(animationProgress, 0, 1);
      
      // Update particle positions
      for (let i = 0; i < particleCount; i++) {
        const index = i * 3;
        
        // Interpolate between source and target positions
        positions[index] = THREE.MathUtils.lerp(
          sourcePositions[index],
          targetPositions[index],
          easedProgress
        );
        positions[index + 1] = THREE.MathUtils.lerp(
          sourcePositions[index + 1],
          targetPositions[index + 1],
          easedProgress
        );
        positions[index + 2] = THREE.MathUtils.lerp(
          sourcePositions[index + 2],
          targetPositions[index + 2],
          easedProgress
        );
        
        // Add subtle floating motion
        positions[index + 1] += Math.sin(time + i * 0.1) * 0.01;
      }
      
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
      
      // Update material opacity based on section
      const opacity = currentSection.includes('transition') 
        ? 0.6 + Math.sin(time * 2) * 0.2  // Flickering during transitions
        : 0.8;
      materialRef.current.opacity = opacity;
    }
  });

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(particleData.positions, 3));
    return geo;
  }, [particleData]);

  return (
    <points ref={particlesRef} geometry={geometry}>
      <pointsMaterial
        ref={materialRef}
        color={COLORS.primary}
        size={0.03}
        transparent
        opacity={0.8}
      />
    </points>
  );
};