"use client";
import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

function NFTModel({ dna }: { dna: string }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  // Simple visual representation based on DNA string
  const color = new THREE.Color(parseInt(dna.slice(2, 8), 16) || 0x00ff00);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01;
    }
  });

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2}>
      <mesh ref={meshRef}>
        <sphereGeometry args={[1, 64, 64]} />
        <MeshDistortMaterial 
          color={color} 
          speed={3} 
          distort={0.4} 
          radius={1} 
        />
      </mesh>
    </Float>
  );
}

export default function NFTVisualizer({ dna, isAlive, ghostEndTimestamp }: { dna: string; isAlive?: boolean; ghostEndTimestamp?: number | null }) {
  const isGhost = isAlive === false;
  const ghostSec = ghostEndTimestamp ? Math.max(0, ghostEndTimestamp - Math.floor(Date.now()/1000)) : 0;
  const ghostLabel = ghostSec > 0 ? `${Math.floor(ghostSec/86400)}d ${Math.floor((ghostSec%86400)/3600)}h` : 'ready for rebirth';
  if (isGhost) {
    return (
      <div className="h-[400px] w-full bg-black rounded-xl overflow-hidden relative">
        <Canvas camera={{ position: [0, 0, 5] }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          <Float speed={3} rotationIntensity={0.3} floatIntensity={0.8}>
            <mesh>
              <sphereGeometry args={[1, 64, 64]} />
              <MeshDistortMaterial color="#8888ff" speed={4} distort={0.6} transparent opacity={0.35} />
            </mesh>
          </Float>
          <OrbitControls enableZoom={false} />
        </Canvas>
        <div className="absolute bottom-3 left-3 bg-purple-900/60 px-3 py-1 rounded text-xs font-mono">GHOST — Rebirth in: {ghostLabel}</div>
      </div>
    );
  }
  return (
    <div className="h-[400px] w-full bg-black rounded-xl overflow-hidden">
      <Canvas camera={{ position: [0, 0, 5] }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <NFTModel dna={dna} />
        <OrbitControls enableZoom={false} />
      </Canvas>
    </div>
  );
}
