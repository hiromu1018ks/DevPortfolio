'use client';

import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { COLORS } from '@/constants/colors';

interface ProjectObjectProps {
  position: [number, number, number];
  projectId: string;
  description?: string;
  onClick?: () => void;
}

const ProjectObject: React.FC<ProjectObjectProps> = ({
  position,
  projectId: _projectId, // eslint-disable-line @typescript-eslint/no-unused-vars
  description: _description, // eslint-disable-line @typescript-eslint/no-unused-vars
  onClick
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      // Rotation animation
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.2;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
      
      // Hover effect
      if (hovered) {
        meshRef.current.scale.lerp(new THREE.Vector3(1.2, 1.2, 1.2), 0.1);
      } else {
        meshRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
      }
      
      // Click effect
      if (clicked) {
        meshRef.current.rotation.x += 0.1;
        meshRef.current.rotation.y += 0.1;
      }
    }
  });

  const handleClick = () => {
    setClicked(true);
    setTimeout(() => setClicked(false), 300);
    if (onClick) {
      onClick();
    }
  };

  return (
    <group position={position}>
      {/* Main project object */}
      <mesh
        ref={meshRef}
        onClick={handleClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial
          color={hovered ? COLORS.accent : COLORS.primary}
          wireframe={false}
          transparent={false}
          opacity={1}
          roughness={0.4}
          metalness={0.6}
        />
        <lineSegments>
          <edgesGeometry args={[new THREE.BoxGeometry(1, 1, 1)]} />
          <lineBasicMaterial color={0xffffff} />
        </lineSegments>
      </mesh>
      
      {/* Orbiting elements */}
      <OrbitingElements hovered={hovered} />
    </group>
  );
};

// Small elements that orbit around the main object
const OrbitingElements: React.FC<{ hovered: boolean }> = ({ hovered }) => {
  const orbitRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (orbitRef.current) {
      orbitRef.current.rotation.y = state.clock.elapsedTime * (hovered ? 2 : 1);
    }
  });
  
  return (
    <group ref={orbitRef}>
      {/* Small cubes orbiting around */}
      <mesh position={[1.5, 0, 0]}>
        <boxGeometry args={[0.1, 0.1, 0.1]} />
        <meshStandardMaterial
          color={COLORS.accent}
          transparent={true}
          opacity={0.8}
        />
      </mesh>
      
      <mesh position={[-1.5, 0, 0]}>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshStandardMaterial
          color={COLORS.primary}
          transparent={true}
          opacity={0.8}
        />
      </mesh>
      
      <mesh position={[0, 1.5, 0]}>
        <tetrahedronGeometry args={[0.08]} />
        <meshStandardMaterial
          color={COLORS.accent}
          transparent={true}
          opacity={0.8}
        />
      </mesh>
      
      <mesh position={[0, -1.5, 0]}>
        <octahedronGeometry args={[0.08]} />
        <meshStandardMaterial
          color={COLORS.primary}
          transparent={true}
          opacity={0.8}
        />
      </mesh>
    </group>
  );
};

export default ProjectObject;