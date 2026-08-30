"use client";
import { useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Sphere, MeshDistortMaterial, Text, Float } from '@react-three/drei';

interface Props {
  state: { phase: string; energy?: number; confidence?: number; marketSentiment?: string; loopId?: number; activeAgents?: string[] };
}

const NODES = [
  { id: 0, pos: [2, 0, 0] as [number,number,number], label: "OBSERWACJA" },
  { id: 1, pos: [1.4, 1.4, 0] as [number,number,number], label: "ANALIZA" },
  { id: 2, pos: [0, 2, 0] as [number,number,number], label: "PLANOWANIE" },
  { id: 3, pos: [-1.4, 1.4, 0] as [number,number,number], label: "DECYZJA" },
  { id: 4, pos: [-2, 0, 0] as [number,number,number], label: "AKCJA" },
  { id: 5, pos: [-1.4, -1.4, 0] as [number,number,number], label: "REFLEKSJA" },
  { id: 6, pos: [0, -2, 0] as [number,number,number], label: "SAMODOSKONALENIE" },
  { id: 7, pos: [1.4, -1.4, 0] as [number,number,number], label: "PAMIĘĆ" },
];

export default function Octagon3D({ state }: Props) {
  const activeIndex = useMemo(() => NODES.findIndex(n => n.label.toLowerCase().includes(state.phase?.toLowerCase() || '')), [state.phase]);
  const getColor = () => state.marketSentiment === 'bullish' ? '#00ff88' : state.marketSentiment === 'bearish' ? '#ff3333' : '#6d4aff';
  return (
    <div className="h-[500px] w-full bg-black rounded-lg overflow-hidden border border-zinc-800 relative">
      <Canvas camera={{ position: [0, 0, 6], fov: 50 }}>
        <ambientLight intensity={0.6} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        {NODES.map((node, i) => (
          <group key={node.id}>
            <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
              <Sphere args={[i===activeIndex?0.5:0.28, 32, 32]} position={node.pos}>
                <MeshDistortMaterial color={i===activeIndex?'#ffffff':getColor()} distort={0.4} speed={2} roughness={0.2} metalness={0.8} />
              </Sphere>
            </Float>
            <Text position={[node.pos[0], node.pos[1]+0.6, node.pos[2]]} fontSize={0.18} color={i===activeIndex?'#fff':'#888'} anchorX="center" anchorY="middle">{node.label}</Text>
          </group>
        ))}
        <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.6} />
        <Text position={[0,3.0,0]} fontSize={0.35} color="#fff">TECHNOPRIME v2.0</Text>
        <Text position={[0,-3.0,0]} fontSize={0.16} color="#aaa">Energy: {(state.energy||0).toFixed(1)}% | Conf: {((state.confidence||0)*100).toFixed(0)}% | Loop #{state.loopId||0}</Text>
      </Canvas>
      <div className="absolute bottom-3 left-3 bg-black/80 p-2 rounded border border-purple-500 text-xs font-mono text-green-400">
        <div>Faza: <span className="text-white">{(state.phase||'observation').toUpperCase()}</span></div>
        <div>Sentiment: <span className={state.marketSentiment==='bullish' ? 'text-green-400' : state.marketSentiment==='bearish' ? 'text-red-400' : 'text-purple-400'}>{(state.marketSentiment||'neutral').toUpperCase()}</span></div>
        <div>Agenci: {(state.activeAgents||[]).join(', ')}</div>
      </div>
    </div>
  );
}
