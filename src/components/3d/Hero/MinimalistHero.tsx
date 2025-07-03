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

  // Random positions for scattered placement covering 80% of screen space
  const randomPositions: { [key: string]: [number, number, number] } = useMemo(() => ({
    cube: [Math.random() * 10 - 5, Math.random() * 7 - 3.5, Math.random() * 8 - 4],
    grid: [Math.random() * 10 - 5, Math.random() * 7 - 3.5, Math.random() * 8 - 4],
    triangle: [Math.random() * 10 - 5, Math.random() * 7 - 3.5, Math.random() * 8 - 4],
    sphere: [Math.random() * 10 - 5, Math.random() * 7 - 3.5, Math.random() * 8 - 4],
    dodecahedron: [Math.random() * 10 - 5, Math.random() * 7 - 3.5, Math.random() * 8 - 4],
    connecting: [Math.random() * 8 - 4, Math.random() * 5 - 2.5, Math.random() * 8 - 4]
  }), []);

  useFrame(() => {
    if (groupRef.current) {
      // Subtle mouse influence
      groupRef.current.rotation.y = mousePosition.current.x * 0.1;
      groupRef.current.rotation.x = mousePosition.current.y * 0.05;
    }

    // Always show geometric shapes (full visibility)
    setAnimationProgress(1);
    console.log(`MinimalistHero - scrollProgress: ${scrollProgress.toFixed(2)}, scrollRange: [${scrollRange[0].toFixed(2)}, ${scrollRange[1].toFixed(2)}], animationProgress: ${animationProgress.toFixed(2)}`);
  });

  return (
    <group ref={groupRef}>
      {/* Geometric elements - pure shapes */}
      <GeometricShapes mousePosition={mousePosition} animationProgress={animationProgress} randomPositions={randomPositions} />
      
      {/* Additional geometric elements for richness */}
      <EnhancedGeometry mousePosition={mousePosition} animationProgress={animationProgress} randomPositions={randomPositions} />
    </group>
  );
};

// Clean geometric shapes as per spec
const GeometricShapes: React.FC<{ 
  mousePosition: React.MutableRefObject<{ x: number; y: number }>, 
  animationProgress: number,
  randomPositions: { [key: string]: [number, number, number] }
}> = ({ mousePosition, animationProgress, randomPositions }) => {
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
      (cubeRef.current.material as THREE.MeshBasicMaterial).transparent = true;
    }
    
    if (lineRef.current) {
      lineRef.current.rotation.z = time * 0.05;
      lineRef.current.position.x = -mousePosition.current.x * 0.3;
      lineRef.current.position.y = -mousePosition.current.y * 0.2;
      (lineRef.current.material as THREE.LineBasicMaterial).opacity = lineOpacity;
      (lineRef.current.material as THREE.LineBasicMaterial).transparent = true;
    }

    if (triangleRef.current) {
      (triangleRef.current.material as THREE.MeshBasicMaterial).opacity = opacity;
      (triangleRef.current.material as THREE.MeshBasicMaterial).transparent = true;
    }
  });

  // Create grid lines
  const gridGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    const vertices: number[] = [];
    
    // Horizontal lines (balanced grid)
    for (let i = -4; i <= 4; i++) {
      vertices.push(-4, i, 0, 4, i, 0);
    }
    
    // Vertical lines (balanced grid)
    for (let i = -4; i <= 4; i++) {
      vertices.push(i, -4, 0, i, 4, 0);
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
      <mesh ref={cubeRef} position={randomPositions.cube as [number, number, number]}>
        <boxGeometry args={[1.2, 1.2, 1.2]} />
        <meshBasicMaterial
          color={COLORS.accent}
          wireframe
          transparent
          opacity={0.8}
        />
      </mesh>
      
      {/* Grid lines */}
      <lineSegments ref={lineRef} position={randomPositions.grid as [number, number, number]}>
        <bufferGeometry {...gridGeometry} />
        <lineBasicMaterial
          color={COLORS.primary}
          transparent
          opacity={0.5}
        />
      </lineSegments>
      
      {/* Simple triangle */}
      <mesh ref={triangleRef} position={randomPositions.triangle as [number, number, number]}>
        <coneGeometry args={[0.8, 1.6, 3]} />
        <meshBasicMaterial
          color={COLORS.accent}
          wireframe
          transparent
          opacity={0.9}
        />
      </mesh>
    </group>
  );
};

// Enhanced geometry elements with more complex patterns
const EnhancedGeometry: React.FC<{ 
  mousePosition: React.MutableRefObject<{ x: number; y: number }>, 
  animationProgress: number,
  randomPositions: { [key: string]: [number, number, number] }
}> = ({ mousePosition, animationProgress, randomPositions }) => {
  const complexShapeRef = useRef<THREE.Group>(null);
  const wireSphereRef = useRef<THREE.Mesh>(null);
  const dodecahedronRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    const time = state.clock.elapsedTime;
    const opacity = 0.7; // Always show enhanced geometry with full opacity
    
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
      (wireSphereRef.current.material as THREE.MeshBasicMaterial).transparent = true;
    }
    
    if (dodecahedronRef.current) {
      dodecahedronRef.current.rotation.y = time * 0.04;
      dodecahedronRef.current.rotation.x = time * 0.07;
      (dodecahedronRef.current.material as THREE.MeshBasicMaterial).opacity = opacity;
      (dodecahedronRef.current.material as THREE.MeshBasicMaterial).transparent = true;
    }
  });
  
  return (
    <group ref={complexShapeRef}>
      {/* Wireframe sphere */}
      <mesh ref={wireSphereRef} position={randomPositions.sphere as [number, number, number]}>
        <sphereGeometry args={[1.4, 16, 16]} />
        <meshBasicMaterial
          color={COLORS.primary}
          wireframe
          transparent
          opacity={0.7}
        />
      </mesh>
      
      {/* Dodecahedron */}
      <mesh ref={dodecahedronRef} position={randomPositions.dodecahedron as [number, number, number]}>
        <dodecahedronGeometry args={[1]} />
        <meshBasicMaterial
          color={COLORS.accent}
          wireframe
          transparent
          opacity={0.7}
        />
      </mesh>
      
      {/* Additional connecting lines */}
      <ConnectingLines animationProgress={animationProgress} randomPositions={randomPositions} />
    </group>
  );
};

// Dynamic connecting lines between geometric shapes
const ConnectingLines: React.FC<{ animationProgress: number, randomPositions: { [key: string]: [number, number, number] } }> = ({ animationProgress, randomPositions }) => {
  const linesRef = useRef<THREE.LineSegments>(null);
  
  const lineGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    const vertices: number[] = [];
    
    // Create dynamic line patterns
    const lineCount = 16;
    for (let i = 0; i < lineCount; i++) {
      const angle = (i / lineCount) * Math.PI * 2;
      const radius1 = 2;
      const radius2 = 3.5;
      
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
      const opacity = THREE.MathUtils.lerp(0, 0.6, animationProgress); // Apply opacity based on animationProgress
      (linesRef.current.material as THREE.LineBasicMaterial).opacity = opacity;
      (linesRef.current.material as THREE.LineBasicMaterial).transparent = opacity < 0.6;
    }
  });
  
  return (
    <lineSegments ref={linesRef} position={randomPositions.connecting as [number, number, number]}>
      <bufferGeometry {...lineGeometry} />
      <lineBasicMaterial
        color={COLORS.primary}
        transparent
        opacity={0.6}
      />
    </lineSegments>
  );
};

export default MinimalistHero;