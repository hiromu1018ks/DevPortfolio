'use client';

import React, { useRef, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';

import * as THREE from 'three';
import { COLORS } from '@/constants/colors';

interface MinimalistHeroProps {
  scrollProgress: number;
  scrollRange: [number, number];
}

const MinimalistHero: React.FC<MinimalistHeroProps> = ({
  scrollProgress,
  scrollRange,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const particlesRef = useRef<THREE.Points>(null);
  const mousePosition = useRef({ x: 0, y: 0 });
  const [animationProgress, setAnimationProgress] = useState(0);

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
    const initialPositions = new Float32Array(particleCount * 3);
    const targetPositions = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
      // Random initial positions
      initialPositions[i * 3] = (Math.random() - 0.5) * 10;
      initialPositions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      initialPositions[i * 3 + 2] = (Math.random() - 0.5) * 5;

      positions[i * 3] = initialPositions[i * 3];
      positions[i * 3 + 1] = initialPositions[i * 3 + 1];
      positions[i * 3 + 2] = initialPositions[i * 3 + 2];
      
      // Target positions forming text-like structure
      const angle = (i / particleCount) * Math.PI * 2;
      const radius = 3;
      targetPositions[i * 3] = Math.cos(angle) * radius + (Math.random() - 0.5) * 0.5;
      targetPositions[i * 3 + 1] = Math.sin(angle) * 0.5 + (Math.random() - 0.5) * 0.5;
      targetPositions[i * 3 + 2] = (Math.random() - 0.5) * 0.5;
    }
    
    return { positions, initialPositions, targetPositions };
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

      const [startScroll, endScroll] = scrollRange;
      const normalizedScroll = THREE.MathUtils.clamp(
        (scrollProgress - startScroll) / (endScroll - startScroll),
        0,
        1
      );

      let currentAnimationProgress = 0;
      if (normalizedScroll < 0.5) {
        currentAnimationProgress = normalizedScroll * 2; // 0 to 1
      } else {
        currentAnimationProgress = (1 - normalizedScroll) * 2; // 1 to 0
      }
      setAnimationProgress(currentAnimationProgress);

      // Deconstruction/Reconstruction based on animationProgress
      const scatterFactor = 1 - currentAnimationProgress; // 0 when formed, 1 when scattered

      for (let i = 0; i < particleCount; i++) {
        const index = i * 3;
        const initialX = particles.initialPositions[index];
        const initialY = particles.initialPositions[index + 1];
        const initialZ = particles.initialPositions[index + 2];

        const targetX = particles.targetPositions[index];
        const targetY = particles.targetPositions[index + 1];
        const targetZ = particles.targetPositions[index + 2];

        // Interpolate between initial (scattered) and target (formed) positions
        let currentX = THREE.MathUtils.lerp(initialX, targetX, currentAnimationProgress);
        let currentY = THREE.MathUtils.lerp(initialY, targetY, currentAnimationProgress);
        let currentZ = THREE.MathUtils.lerp(initialZ, targetZ, currentAnimationProgress);

        // Add scattering effect when animationProgress is low
        const scatterStrength = 5; // How far particles scatter
        const randomOffsetX = (Math.random() - 0.5) * scatterStrength;
        const randomOffsetY = (Math.random() - 0.5) * scatterStrength;
        const randomOffsetZ = (Math.random() - 0.5) * scatterStrength;

        currentX += randomOffsetX * scatterFactor;
        currentY += randomOffsetY * scatterFactor;
        currentZ += randomOffsetZ * scatterFactor;

        positions[index] = currentX;
        positions[index + 1] = currentY;
        positions[index + 2] = currentZ;

        // Add subtle floating motion
        positions[index + 1] += Math.sin(time + i * 0.1) * 0.001;
      }
      
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <group ref={groupRef} visible={animationProgress > 0}>
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
          opacity={THREE.MathUtils.lerp(0, 0.8, animationProgress)} // Apply opacity based on animationProgress
        />
      </points>

      {/* Geometric elements - pure shapes */}
      <GeometricShapes mousePosition={mousePosition} animationProgress={animationProgress} />
      
      {/* Additional geometric elements for richness */}
      <EnhancedGeometry mousePosition={mousePosition} animationProgress={animationProgress} />
    </group>
  );
};

// Clean geometric shapes as per spec
const GeometricShapes: React.FC<{ mousePosition: React.MutableRefObject<{ x: number; y: number }>, animationProgress: number }> = ({ mousePosition, animationProgress }) => {
  const cubeRef = useRef<THREE.Mesh>(null);
  const lineRef = useRef<THREE.LineSegments>(null);
  const triangleRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    const time = state.clock.elapsedTime;
    
    // Fade out geometric shapes as sectionProgress goes from 1 to 0
    const opacity = THREE.MathUtils.lerp(0, 0.7, animationProgress); // Max opacity for triangle
    const cubeOpacity = THREE.MathUtils.lerp(0, 0.6, animationProgress); // Max opacity for cube
    const lineOpacity = THREE.MathUtils.lerp(0, 0.2, animationProgress); // Max opacity for line

    if (cubeRef.current) {
      // Subtle rotation with mouse influence
      cubeRef.current.rotation.x = time * 0.1 + mousePosition.current.y * 0.1;
      cubeRef.current.rotation.y = time * 0.15 + mousePosition.current.x * 0.1;
      cubeRef.current.position.x = Math.sin(time * 0.5) * 2 + mousePosition.current.x * 0.5;
      cubeRef.current.position.y = Math.cos(time * 0.3) * 1 + mousePosition.current.y * 0.3;
      (cubeRef.current.material as THREE.MeshBasicMaterial).opacity = cubeOpacity;
      (cubeRef.current.material as THREE.MeshBasicMaterial).transparent = cubeOpacity < 0.6;
    }
    
    if (lineRef.current) {
      lineRef.current.rotation.z = time * 0.05;
      lineRef.current.position.x = -mousePosition.current.x * 0.3;
      lineRef.current.position.y = -mousePosition.current.y * 0.2;
      (lineRef.current.material as THREE.LineBasicMaterial).opacity = lineOpacity;
      (lineRef.current.material as THREE.LineBasicMaterial).transparent = lineOpacity < 0.2;
    }

    if (triangleRef.current) {
      (triangleRef.current.material as THREE.MeshBasicMaterial).opacity = opacity;
      (triangleRef.current.material as THREE.MeshBasicMaterial).transparent = opacity < 0.7;
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
      <mesh ref={triangleRef} position={[-2, 1, -1]}>
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

// Enhanced geometry elements with more complex patterns
const EnhancedGeometry: React.FC<{ mousePosition: React.MutableRefObject<{ x: number; y: number }>, animationProgress: number }> = ({ mousePosition, animationProgress }) => {
  const complexShapeRef = useRef<THREE.Group>(null);
  const wireSphereRef = useRef<THREE.Mesh>(null);
  const dodecahedronRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    const time = state.clock.elapsedTime;
    const opacity = THREE.MathUtils.lerp(0, 0.4, animationProgress);
    
    if (complexShapeRef.current) {
      complexShapeRef.current.rotation.x = time * 0.02 + mousePosition.current.y * 0.05;
      complexShapeRef.current.rotation.y = time * 0.03 + mousePosition.current.x * 0.05;
      complexShapeRef.current.position.x = Math.sin(time * 0.2) * 0.5;
      complexShapeRef.current.position.y = Math.cos(time * 0.15) * 0.3;
    }
    
    if (wireSphereRef.current) {
      wireSphereRef.current.rotation.x = time * 0.08;
      wireSphereRef.current.rotation.z = time * 0.06;
      (wireSphereRef.current.material as THREE.MeshBasicMaterial).opacity = opacity;
      (wireSphereRef.current.material as THREE.MeshBasicMaterial).transparent = opacity < 0.4;
    }
    
    if (dodecahedronRef.current) {
      dodecahedronRef.current.rotation.y = time * 0.04;
      dodecahedronRef.current.rotation.x = time * 0.07;
      (dodecahedronRef.current.material as THREE.MeshBasicMaterial).opacity = opacity;
      (dodecahedronRef.current.material as THREE.MeshBasicMaterial).transparent = opacity < 0.4;
    }
  });
  
  return (
    <group ref={complexShapeRef}>
      {/* Wireframe sphere */}
      <mesh ref={wireSphereRef} position={[4, 2, -4]}>
        <sphereGeometry args={[1.2, 16, 16]} />
        <meshBasicMaterial
          color={COLORS.primary}
          wireframe
          transparent
          opacity={0.4}
        />
      </mesh>
      
      {/* Dodecahedron */}
      <mesh ref={dodecahedronRef} position={[-4, -1, -3]}>
        <dodecahedronGeometry args={[0.8]} />
        <meshBasicMaterial
          color={COLORS.accent}
          wireframe
          transparent
          opacity={0.4}
        />
      </mesh>
      
      {/* Additional connecting lines */}
      <ConnectingLines animationProgress={animationProgress} />
    </group>
  );
};

// Dynamic connecting lines between geometric shapes
const ConnectingLines: React.FC<{ animationProgress: number }> = ({ animationProgress }) => {
  const linesRef = useRef<THREE.LineSegments>(null);
  
  const lineGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    const vertices: number[] = [];
    
    // Create dynamic line patterns
    const lineCount = 20;
    for (let i = 0; i < lineCount; i++) {
      const angle = (i / lineCount) * Math.PI * 2;
      const radius1 = 2;
      const radius2 = 4;
      
      vertices.push(
        Math.cos(angle) * radius1, Math.sin(angle) * radius1, 0,
        Math.cos(angle) * radius2, Math.sin(angle) * radius2, -2
      );
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
  
  useFrame(() => {
    if (linesRef.current) {
      const opacity = THREE.MathUtils.lerp(0, 0.3, animationProgress);
      (linesRef.current.material as THREE.LineBasicMaterial).opacity = opacity;
      (linesRef.current.material as THREE.LineBasicMaterial).transparent = opacity < 0.3;
    }
  });
  
  return (
    <lineSegments ref={linesRef} position={[0, 0, -5]}>
      <bufferGeometry {...lineGeometry} />
      <lineBasicMaterial
        color={COLORS.primary}
        transparent
        opacity={0.3}
      />
    </lineSegments>
  );
};

export default MinimalistHero;