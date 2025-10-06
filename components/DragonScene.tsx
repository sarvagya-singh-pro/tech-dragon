"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { useRef } from "react";

function AnimatedDragon() {
  const dragonRef = useRef(null);
  const { scene } = useGLTF("/dragon.gltf");

  useFrame((state, delta) => {
    if (dragonRef.current) {
      dragonRef.current.rotation.y += delta * 0.5;
    }
  });

  return <primitive ref={dragonRef} object={scene} scale={3} />;
}

export default function DragonScene() {
  return (
    <div className="h-[500px] shadow-2xl rounded-xl overflow-hidden">
      <Canvas camera={{ position: [0, 1, 8] }} shadows>
        <ambientLight intensity={0.7} />
        <directionalLight position={[5, 5, 5]} intensity={1.2} castShadow />
        <OrbitControls enableZoom={false} enablePan={false} autoRotate={false} />
        <AnimatedDragon />
      </Canvas>
    </div>
  );
}
