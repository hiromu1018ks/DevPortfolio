'use client';

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Sphere, Box, Torus, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { COLORS } from '@/constants/colors';

const ModernHero: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null);
  const particlesRef = useRef<THREE.Points>(null);

  // Advanced particle system
  const particleCount = 1000;
  const particles = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    
    for (let i = 0; i < particleCount; i++) {
      // Create a galaxy-like distribution
      const radius = Math.random() * 10 + 5;
      const angle = Math.random() * Math.PI * 2;
      const height = (Math.random() - 0.5) * 4;
      
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = height;
      positions[i * 3 + 2] = Math.sin(angle) * radius;
      
      // Gradient colors from center to edge
      const intensity = 1 - radius / 15;
      colors[i * 3] = 0; // R
      colors[i * 3 + 1] = 1; // G - accent green
      colors[i * 3 + 2] = intensity * 0.6; // B
      
      sizes[i] = Math.random() * 2 + 0.5;
    }
    
    return { positions, colors, sizes };
  }, []);

  useFrame((state) => {
    if (groupRef.current) {
      // Subtle rotation for the entire group
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.1;
    }
    
    if (particlesRef.current) {
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
      
      // Animate particles in spiral motion
      for (let i = 0; i < particleCount; i++) {
        const index = i * 3;
        const time = state.clock.elapsedTime;
        
        // Create flowing spiral effect
        const angle = time * 0.5 + i * 0.01;
        const radius = Math.sqrt(positions[index] ** 2 + positions[index + 2] ** 2);
        
        positions[index] = Math.cos(angle) * radius;
        positions[index + 2] = Math.sin(angle) * radius;
        positions[index + 1] += Math.sin(time + i * 0.1) * 0.002;
      }
      
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Advanced particle system */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[particles.positions, 3]}
            count={particleCount}
            array={particles.positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[particles.colors, 3]}
            count={particleCount}
            array={particles.colors}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-size"
            args={[particles.sizes, 1]}
            count={particleCount}
            array={particles.sizes}
            itemSize={1}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.05}
          transparent
          opacity={0.8}
          vertexColors
          blending={THREE.AdditiveBlending}
          sizeAttenuation
        />
      </points>

      {/* Modern floating geometric elements */}
      <FloatingElements />
      
      {/* Holographic grid plane */}
      <HolographicGrid />
      
      {/* Central focal point */}
      <CentralCore />
    </group>
  );
};

// Floating geometric elements with modern materials
const FloatingElements: React.FC = () => {
  return (
    <group>
      {/* Floating distorted sphere */}
      <Float
        speed={2}
        rotationIntensity={1}
        floatIntensity={2}
        floatingRange={[-0.5, 0.5]}
      >
        <Sphere args={[1.2, 64, 64]} position={[-4, 2, -2]}>
          <MeshDistortMaterial
            color={COLORS.accent}
            transparent
            opacity={0.6}
            distort={0.3}
            speed={2}
            roughness={0}
            metalness={0.8}
          />
        </Sphere>
      </Float>

      {/* Rotating wireframe torus */}
      <Float
        speed={1.5}
        rotationIntensity={2}
        floatIntensity={1}
        floatingRange={[-0.3, 0.3]}
      >
        <Torus args={[1.5, 0.3, 16, 32]} position={[4, -1, -3]}>
          <meshStandardMaterial
            color={COLORS.primary}
            wireframe
            transparent
            opacity={0.7}
          />
        </Torus>
      </Float>

      {/* Glowing boxes */}
      {Array.from({ length: 5 }, (_, i) => (
        <Float
          key={i}
          speed={1 + i * 0.2}
          rotationIntensity={1}
          floatIntensity={1.5}
          floatingRange={[-0.4, 0.4]}
        >
          <Box 
            args={[0.5, 0.5, 0.5]} 
            position={[
              (Math.random() - 0.5) * 8,
              (Math.random() - 0.5) * 4,
              (Math.random() - 0.5) * 6
            ]}
          >
            <meshStandardMaterial
              color={i % 2 === 0 ? COLORS.accent : COLORS.text}
              transparent
              opacity={0.4}
              emissive={i % 2 === 0 ? COLORS.accent : COLORS.text}
              emissiveIntensity={0.2}
            />
          </Box>
        </Float>
      ))}
    </group>
  );
};

// Holographic grid effect
const HolographicGrid: React.FC = () => {
  const gridRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (gridRef.current) {
      gridRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      gridRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.2 - 2;
    }
  });

  return (
    <mesh ref={gridRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]}>
      <planeGeometry args={[20, 20, 20, 20]} />
      <meshStandardMaterial
        color={COLORS.accent}
        transparent
        opacity={0.1}
        wireframe
        side={THREE.DoubleSide}
      />
    </mesh>
  );
};

// Central core element
const CentralCore: React.FC = () => {
  const coreRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (coreRef.current) {
      coreRef.current.rotation.y = state.clock.elapsedTime * 0.5;
      coreRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
    }
  });

  return (
    <group ref={coreRef}>
      {/* Inner glowing core */}
      <Sphere args={[0.3, 32, 32]}>
        <meshStandardMaterial
          color={COLORS.accent}
          emissive={COLORS.accent}
          emissiveIntensity={0.5}
          transparent
          opacity={0.8}
        />
      </Sphere>
      
      {/* Outer energy rings */}
      {Array.from({ length: 3 }, (_, i) => (
        <Torus
          key={i}
          args={[1 + i * 0.5, 0.02, 16, 32]}
          rotation={[Math.PI / 2 * i, 0, 0]}
        >
          <meshStandardMaterial
            color={COLORS.accent}
            emissive={COLORS.accent}
            emissiveIntensity={0.3}
            transparent
            opacity={0.6}
          />
        </Torus>
      ))}
    </group>
  );
};

export default ModernHero;