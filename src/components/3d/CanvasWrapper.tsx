'use client';

import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { COLORS } from '@/constants/colors';
import { DEFAULT_CAMERA_POSITION, FOG_NEAR, FOG_FAR } from '@/constants/scene';

interface CanvasWrapperProps {
  children: React.ReactNode;
  enableControls?: boolean;
  cameraPosition?: [number, number, number];
}

const CanvasWrapper: React.FC<CanvasWrapperProps> = ({
  children,
  enableControls = false,
  cameraPosition = DEFAULT_CAMERA_POSITION
}) => {
  return (
    <div className="fixed top-0 left-0 w-full h-full z-0">
      <Canvas
        shadows
        camera={{ position: cameraPosition, fov: 75 }}
        gl={{ 
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
        flat
        color={COLORS.base}
        dpr={[1, 2]}
      >
        <Suspense fallback={null}>
          <PerspectiveCamera makeDefault position={cameraPosition} />
          
          {enableControls && (
            <OrbitControls 
              enableZoom={true}
              enablePan={true}
              enableRotate={true}
              maxDistance={20}
              minDistance={5}
            />
          )}
          
          {/* Lighting Setup */}
          <ambientLight intensity={0.4} />
          <directionalLight 
            position={[10, 10, 5]} 
            intensity={0.6}
            castShadow
            shadow-mapSize={[1024, 1024]}
          />
          <pointLight position={[-10, -10, -10]} intensity={0.2} />
          
          {/* Fog for depth */}
          <fog attach="fog" args={[COLORS.base, FOG_NEAR, FOG_FAR]} />
          
          {/* Set background color - use null for transparency */}
          
          {children}
        </Suspense>
      </Canvas>
    </div>
  );
};

export default CanvasWrapper;