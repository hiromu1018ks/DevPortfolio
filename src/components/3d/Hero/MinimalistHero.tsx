'use client';

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';

import * as THREE from 'three';
import { COLORS } from '@/constants/colors';

const MinimalistHero: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null);
  const particlesRef = useRef<THREE.Points>(null);
  const mousePosition = useRef({ x: 0, y: 0 });

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

  // Particle system for morphing text formation
  const particleCount = 200;
  const particles = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    const targetPositions = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
      // Random initial positions
      positions[i * 3] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 5;
      
      // Target positions forming text-like structure
      const angle = (i / particleCount) * Math.PI * 2;
      const radius = 3;
      targetPositions[i * 3] = Math.cos(angle) * radius + (Math.random() - 0.5) * 0.5;
      targetPositions[i * 3 + 1] = Math.sin(angle) * 0.5 + (Math.random() - 0.5) * 0.5;
      targetPositions[i * 3 + 2] = (Math.random() - 0.5) * 0.5;
    }
    
    return { positions, targetPositions };
  }, []);

  useFrame((state) => {
    if (groupRef.current) {
      // Subtle mouse influence
      groupRef.current.rotation.y = mousePosition.current.x * 0.1;
      groupRef.current.rotation.x = mousePosition.current.y * 0.05;
    }
    
    if (particlesRef.current) {
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
      const time = state.clock.elapsedTime;
      
      // Morphing animation towards target positions
      for (let i = 0; i < particleCount; i++) {
        const index = i * 3;
        const targetX = particles.targetPositions[index];
        const targetY = particles.targetPositions[index + 1];
        const targetZ = particles.targetPositions[index + 2];
        
        // Lerp towards target with mouse influence
        const mouseInfluenceX = mousePosition.current.x * 0.5;
        const mouseInfluenceY = mousePosition.current.y * 0.3;
        
        positions[index] += (targetX + mouseInfluenceX - positions[index]) * 0.02;
        positions[index + 1] += (targetY + mouseInfluenceY - positions[index + 1]) * 0.02;
        positions[index + 2] += (targetZ - positions[index + 2]) * 0.02;
        
        // Add subtle floating motion
        positions[index + 1] += Math.sin(time + i * 0.1) * 0.001;
      }
      
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Minimalist particle system */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[particles.positions, 3]}
            count={particleCount}
            array={particles.positions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          color={COLORS.primary}
          size={0.02}
          transparent
          opacity={0.8}
        />
      </points>

      {/* Geometric elements - pure shapes */}
      <GeometricShapes mousePosition={mousePosition} />
    </group>
  );
};

// Clean geometric shapes as per spec
const GeometricShapes: React.FC<{ mousePosition: React.MutableRefObject<{ x: number; y: number }> }> = ({ mousePosition }) => {
  const cubeRef = useRef<THREE.Mesh>(null);
  const lineRef = useRef<THREE.LineSegments>(null);
  
  useFrame((state) => {
    const time = state.clock.elapsedTime;
    
    if (cubeRef.current) {
      // Subtle rotation with mouse influence
      cubeRef.current.rotation.x = time * 0.1 + mousePosition.current.y * 0.1;
      cubeRef.current.rotation.y = time * 0.15 + mousePosition.current.x * 0.1;
      cubeRef.current.position.x = Math.sin(time * 0.5) * 2 + mousePosition.current.x * 0.5;
      cubeRef.current.position.y = Math.cos(time * 0.3) * 1 + mousePosition.current.y * 0.3;
    }
    
    if (lineRef.current) {
      lineRef.current.rotation.z = time * 0.05;
      lineRef.current.position.x = -mousePosition.current.x * 0.3;
      lineRef.current.position.y = -mousePosition.current.y * 0.2;
    }
  });

  // Create grid lines
  const gridGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    const vertices: number[] = [];
    
    // Horizontal lines
    for (let i = -5; i <= 5; i++) {
      vertices.push(-5, i, 0, 5, i, 0);
    }
    
    // Vertical lines
    for (let i = -5; i <= 5; i++) {
      vertices.push(i, -5, 0, i, 5, 0);
    }
    
    geometry.setFromPoints(vertices.map((v, i) => 
      new THREE.Vector3(
        vertices[i * 3] || 0,
        vertices[i * 3 + 1] || 0,
        vertices[i * 3 + 2] || 0
      )
    ));
    
    return geometry;
  }, []);

  return (
    <group>
      {/* Wireframe cube */}
      <mesh ref={cubeRef} position={[2, 0, -2]}>
        <boxGeometry args={[0.8, 0.8, 0.8]} />
        <meshBasicMaterial
          color={COLORS.accent}
          wireframe
          transparent
          opacity={0.6}
        />
      </mesh>
      
      {/* Grid lines */}
      <lineSegments ref={lineRef} position={[-3, -1, -3]}>
        <bufferGeometry {...gridGeometry} />
        <lineBasicMaterial
          color={COLORS.primary}
          transparent
          opacity={0.2}
        />
      </lineSegments>
      
      {/* Simple triangle */}
      <mesh position={[-2, 1, -1]}>
        <coneGeometry args={[0.5, 1, 3]} />
        <meshBasicMaterial
          color={COLORS.accent}
          wireframe
          transparent
          opacity={0.7}
        />
      </mesh>
    </group>
  );
};

export default MinimalistHero;