"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { Suspense, useRef, memo } from "react";

const AnimatedDragon = memo(function AnimatedDragon() {
  const dragonRef = useRef(null);
  
  try {
    const { scene } = useGLTF("/dragon.gltf");
    
    useFrame((_, delta) => {
      if (dragonRef.current) {
        dragonRef.current.rotation.y += delta * 0.3;
      }
    });

    return <primitive ref={dragonRef} object={scene} scale={3} />;
  } catch (error) {
    console.error("Failed to load dragon:", error);
    return null;
  }
});

function Loader() {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#3b82f6" wireframe />
    </mesh>
  );
}

export default function DragonScene() {
  return (
    <div className="h-full w-full shadow-2xl rounded-xl overflow-hidden bg-black">
      <Canvas 
        camera={{ 
          position: [0, 2, 12], // Moved back from [0, 1, 8] to [0, 2, 12]
          fov: 50,
          near: 0.1,
          far: 1000
        }} 
        shadows
        gl={{
          antialias: true,
          powerPreference: "high-performance",
          alpha: false,
          preserveDrawingBuffer: true,
        }}
        dpr={[1, 2]}
      >
        <color attach="background" args={['#000000']} />
        <fog attach="fog" args={['#000000', 15, 50]} />
        
        <ambientLight intensity={0.5} />
        <directionalLight 
          position={[5, 5, 5]} 
          intensity={1} 
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        <pointLight position={[-5, 3, -5]} intensity={0.3} color="#4a90e2" />
        
        <OrbitControls 
          enableZoom={false} 
          enablePan={false} 
          autoRotate={false}
          enableDamping
          dampingFactor={0.05}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 1.5}
          target={[0, 0, 0]} // Look at center
        />
        
        <Suspense fallback={<Loader />}>
          <AnimatedDragon />
        </Suspense>
      </Canvas>
    </div>
  );
}

useGLTF.preload("/dragon.gltf");
