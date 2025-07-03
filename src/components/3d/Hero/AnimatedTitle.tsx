'use client';

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Center } from '@react-three/drei';
import * as THREE from 'three';
import { COLORS } from '@/constants/colors';
import { ANIMATION_SETTINGS } from '@/constants/scene';

const AnimatedTitle: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null);
  const particlesRef = useRef<THREE.Points>(null);
  const mousePosition = useRef({ x: 0, y: 0 });

  // Particle system for title formation
  const particleCount = ANIMATION_SETTINGS.particleCount.high;
  const particles = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
      // Random initial positions
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
      
      // Colors
      colors[i * 3] = Math.random() * 0.5 + 0.5; // R
      colors[i * 3 + 1] = Math.random() * 0.5 + 0.5; // G
      colors[i * 3 + 2] = 1; // B
    }
    
    return { positions, colors };
  }, [particleCount]);

  React.useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      mousePosition.current = {
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: -(event.clientY / window.innerHeight) * 2 + 1,
      };
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useFrame((state) => {
    if (groupRef.current) {
      // Subtle rotation based on time and mouse position
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * ANIMATION_SETTINGS.rotationSpeed.slow) * ANIMATION_SETTINGS.mouseInfluence.rotation + mousePosition.current.x * ANIMATION_SETTINGS.mouseInfluence.rotation;
      groupRef.current.rotation.x = Math.cos(state.clock.elapsedTime * ANIMATION_SETTINGS.rotationSpeed.slow) * 0.05 + mousePosition.current.y * 0.05;
    }
    
    if (particlesRef.current) {
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
      
      // Animate particles to form letters (simplified animation)
      for (let i = 0; i < particleCount; i++) {
        const time = state.clock.elapsedTime;
        const index = i * 3;
        
        // Create wave-like motion
        positions[index] += Math.sin(time + i * 0.1) * 0.002;
        positions[index + 1] += Math.cos(time + i * 0.1) * 0.002;
        positions[index + 2] += Math.sin(time * 0.5 + i * 0.05) * 0.001;
      }
      
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Particle system */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particleCount}
            array={particles.positions}
            itemSize={3}
            args={[particles.positions, 3]}
          />
          <bufferAttribute
            attach="attributes-color"
            count={particleCount}
            array={particles.colors}
            itemSize={3}
            args={[particles.colors, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.03}
          transparent={true}
          opacity={0.8}
          vertexColors={true}
          blending={THREE.AdditiveBlending}
        />
      </points>
      
      {/* 3D Text placeholder - using basic geometry for now */}
      <Center>
        <group position={[0, 0.5, 0]}>
          {/* PORTFOLIO - represented as connected boxes */}
          {Array.from({ length: 9 }, (_, i) => (
            <mesh key={i} position={[(i - 4) * 0.8, 0, 0]}>
              <boxGeometry args={[0.6, 0.8, 0.1]} />
              <meshStandardMaterial
                color={COLORS.accent}
                transparent={true}
                opacity={0.9}
                roughness={0.1}
                metalness={0.1}
              />
            </mesh>
          ))}
        </group>
        
        <group position={[0, -0.5, 0]}>
          {/* GEOMETRIC CANVAS - represented as smaller connected boxes */}
          {Array.from({ length: 15 }, (_, i) => (
            <mesh key={i} position={[(i - 7) * 0.4, 0, 0]}>
              <boxGeometry args={[0.3, 0.4, 0.05]} />
              <meshStandardMaterial
                color={COLORS.primary}
                transparent={true}
                opacity={0.8}
                roughness={0.2}
                metalness={0.05}
              />
            </mesh>
          ))}
        </group>
      </Center>
      
      {/* Geometric shapes that react to mouse */}
      <GeometricElements mousePosition={mousePosition} />
    </group>
  );
};

// Geometric elements that complement the title
const GeometricElements: React.FC<{ mousePosition: React.MutableRefObject<{ x: number; y: number }> }> = ({ mousePosition }) => {
  const cubeRef = useRef<THREE.Mesh>(null);
  const sphereRef = useRef<THREE.Mesh>(null);
  const torusRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (cubeRef.current) {
      cubeRef.current.rotation.x += 0.01;
      cubeRef.current.rotation.y += 0.01;
      cubeRef.current.position.x = Math.sin(state.clock.elapsedTime) * 2 + mousePosition.current.x * 0.5;
    }
    
    if (sphereRef.current) {
      sphereRef.current.position.y = Math.cos(state.clock.elapsedTime * 0.8) * 1.5;
      sphereRef.current.position.x = Math.sin(state.clock.elapsedTime * 0.6) * 1.8 + mousePosition.current.x * 0.3;
    }
    
    if (torusRef.current) {
      torusRef.current.rotation.z += 0.02;
      torusRef.current.position.x = Math.cos(state.clock.elapsedTime * 0.4) * 2.5 + mousePosition.current.x * 0.4;
      torusRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.3) * 1.2 + mousePosition.current.y * 0.3;
    }
  });
  
  return (
    <group>
      {/* Wireframe cube */}
      <mesh ref={cubeRef} position={[3, 1, -2]}>
        <boxGeometry args={[0.5, 0.5, 0.5]} />
        <meshStandardMaterial
          color={COLORS.accent}
          wireframe={true}
          transparent={true}
          opacity={0.6}
        />
      </mesh>
      
      {/* Sphere */}
      <mesh ref={sphereRef} position={[-3, 0, -1]}>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshStandardMaterial
          color={COLORS.primary}
          transparent={true}
          opacity={0.7}
          roughness={0.1}
          metalness={0.2}
        />
      </mesh>
      
      {/* Torus */}
      <mesh ref={torusRef} position={[0, -2, -1]}>
        <torusGeometry args={[0.4, 0.1, 16, 32]} />
        <meshStandardMaterial
          color={COLORS.accent}
          transparent={true}
          opacity={0.8}
          roughness={0.2}
          metalness={0.1}
        />
      </mesh>
    </group>
  );
};

export default AnimatedTitle;