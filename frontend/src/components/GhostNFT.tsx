"use client";
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial, Text } from '@react-three/drei';
import * as THREE from 'three';

export default function GhostNFT({ tokenId, timeLeft }: { tokenId: string; timeLeft: string }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    ref.current.rotation.z = Math.sin(t*2)*0.2;
    ref.current.scale.setScalar(0.85 + Math.sin(t*5)*0.08);
    const mat: any = ref.current.material;
    if (mat) { mat.transparent = true; mat.opacity = 0.3 + Math.abs(Math.sin(t*3))*0.4; }
  });
  return (
    <group>
      <Sphere ref={ref} args={[1, 32, 32]} position={[0,0,0]}>
        <MeshDistortMaterial color="#8888ff" distort={0.6} speed={3} roughness={0.1} metalness={0.5} />
      </Sphere>
      <Text position={[0,1.5,0]} fontSize={0.3} color="#fff">GHOST #{tokenId}</Text>
      <Text position={[0,-1.5,0]} fontSize={0.18} color="#aaa">Rebirth in: {timeLeft}</Text>
    </group>
  );
}
