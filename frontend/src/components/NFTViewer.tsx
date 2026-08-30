import React, { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Sphere, MeshDistortMaterial } from '@react-three/drei';

function LivingEntity({ dna, energy }) {
  // Map DNA and energy to visual properties
  const distortion = 1 - (energy / 100);
  const color = dna.length > 5 ? '#8B5CF6' : '#3B82F6';

  return (
    <Sphere args={[1, 100, 200]} scale={1 + distortion * 0.5}>
      <MeshDistortMaterial
        color={color}
        speed={2}
        distort={distortion}
        radius={1}
      />
    </Sphere>
  );
}

export default function NFTViewer({ data }) {
  return (
    <div className="w-full h-[500px] bg-black rounded-xl overflow-hidden relative">
      <Canvas camera={{ position: [0, 0, 5] }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <LivingEntity dna={data.dna} energy={data.energy} />
        <OrbitControls enableZoom={false} />
      </Canvas>
      <div className="absolute bottom-4 left-4 text-white p-4 bg-black/50 rounded-lg backdrop-blur-md">
        <h3 className="text-xl font-bold">Entity Status</h3>
        <p>Energy: {data.energy}%</p>
        <p>DNA: {data.dna.substring(0, 10)}...</p>
        <p>Weather: {data.environment.weather.condition}</p>
      </div>
    </div>
  );
}
