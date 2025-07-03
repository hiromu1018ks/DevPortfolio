'use client';

import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { COLORS } from '@/constants/colors';

interface AboutObjectProps {
  scrollProgress: number;
  scrollRange: [number, number];
}

const AboutObject: React.FC<AboutObjectProps> = ({
  scrollProgress,
  scrollRange,
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [animationProgress, setAnimationProgress] = useState(0);

  useFrame(() => {
    if (meshRef.current) {
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

      // Apply to scale
      const scale = THREE.MathUtils.lerp(0.1, 1, currentAnimationProgress);
      meshRef.current.scale.set(scale, scale, scale);

      // Apply to opacity
      const material = meshRef.current.material as THREE.MeshStandardMaterial;
      material.opacity = THREE.MathUtils.lerp(0, 0.7, currentAnimationProgress); // Max opacity 0.7
      material.transparent = material.opacity < 0.7; // Set transparent if not fully opaque

      console.log(`AboutObject - scrollProgress: ${scrollProgress.toFixed(2)}, normalizedScroll: ${normalizedScroll.toFixed(2)}, animationProgress: ${currentAnimationProgress.toFixed(2)}, scale: ${scale.toFixed(2)}, opacity: ${material.opacity.toFixed(2)}`);
    }
  });

  return (
    <mesh position={[0, 0, 0]} ref={meshRef} visible={animationProgress > 0}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial
        color={COLORS.accent}
        transparent={true}
        opacity={0.7}
        wireframe={true}
      />
    </mesh>
  );
};

export default AboutObject;
