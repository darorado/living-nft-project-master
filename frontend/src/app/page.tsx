"use client";
import React, { useState, useEffect } from 'react';
import NFTVisualizer from '../components/NFTVisualizer';
import VitalSigns from '../components/VitalSigns';
import NFTGenerator from '../components/NFTGenerator';
import CoinGenerator from '../components/CoinGenerator';

interface NFTData {
  tokenId: string;
  energy: number;
  isAlive: boolean;
  dna: string;
  owner: string;
  feedCount: number;
  mutationCount: number;
  age: number;
  ghostEndTimestamp: number | null;
  timestamp: number;
}

interface EnvironmentData {
  weather: { temp: number; condition: string; humidity: number };
  energyModifier: number;
  mutationChance: number;
  lastUpdated: number;
}

interface EnrichedData extends NFTData {
  environment: EnvironmentData;
}

export default function Page() {
  const [data, setData] = useState<EnrichedData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async (tokenId: string = '1') => {
    try {
      const res = await fetch(`http://localhost:3001/nft/${tokenId}`);
      const d: EnrichedData = await res.json();
      setData(d);
    } catch (e) {
      console.error("Failed to load NFT", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleFeed = async () => {
    if (!data) return;
    await fetch(`http://localhost:3001/nft/${data.tokenId}/feed`, { method: 'POST' });
    fetchData(data.tokenId);
  };

  const handleMutate = async () => {
    if (!data) return;
    const factor = Math.floor(Math.random() * 1000);
    await fetch(`http://localhost:3001/nft/${data.tokenId}/mutate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ factor })
    });
    fetchData(data.tokenId);
  };

  const handleRebirth = async () => {
    if (!data) return;
    await fetch(`http://localhost:3001/nft/${data.tokenId}/rebirth`, { method: 'POST' });
    fetchData(data.tokenId);
  };

  const handleAIAnalyze = async () => {
    if (!data) return;
    try {
      const response = await fetch('http://localhost:3001/ai/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: `Analyze NFT ${data.tokenId}: Energy ${data.energy}%, DNA ${data.dna.substring(0,10)}, Age ${data.age}d`,
          context: 'Bio-morphic analysis'
        })
      });
      const result = await response.json();
      alert('AI Analysis:\n\n' + result.analysis);
    } catch (e) {
      alert('AI analysis failed. Ensure Ollama is running.');
    }
  };

  if (loading) return <div className="min-h-screen bg-black text-white flex items-center justify-center">Initializing Living Organism...</div>;
  if (!data) return <div className="min-h-screen bg-black text-white flex items-center justify-center">Failed to load organism</div>;

  return (
    <main className="min-h-screen bg-black text-white p-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="text-center space-y-2">
          <h1 className="text-5xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">LIVING NFT</h1>
          <p className="text-gray-400">Bio-Digital Ecosystem & Tokenomics Forge</p>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <NFTVisualizer dna={data.dna} isAlive={data.isAlive} ghostEndTimestamp={data.ghostEndTimestamp} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <NFTGenerator onMinted={(id) => fetchData(id)} />
              <CoinGenerator />
            </div>
            <div className="flex justify-center gap-4">
              <button onClick={handleFeed} className="px-6 py-2.5 bg-green-600 hover:bg-green-500 rounded-full font-bold transition-all">Feed Organism</button>
              <button onClick={handleMutate} className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 rounded-full font-bold transition-all">Trigger Mutation</button>
              <button onClick={handleRebirth} className="px-6 py-2.5 bg-orange-600 hover:bg-orange-500 rounded-full font-bold transition-all">Rebirth</button>
            </div>
          </div>
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Biometrics</h2>
            <VitalSigns energy={data.energy} age={data.age} isAlive={data.isAlive} />
            <div className="p-4 bg-zinc-900 rounded-xl border border-zinc-800">
              <h3 className="text-sm font-bold text-gray-400 mb-2 uppercase">Genetic Code</h3>
              <code className="text-xs break-all text-green-400">{data.dna}</code>
            </div>
            <div className="p-4 bg-zinc-900 rounded-xl border border-zinc-800">
              <h3 className="text-sm font-bold text-gray-400 mb-2 uppercase">Stats</h3>
              <div className="text-xs text-gray-400 space-y-1">
                <p>Feedings: {data.feedCount}</p>
                <p>Mutations: {data.mutationCount}</p>
                <p>Age: {data.age} days</p>
                <p>Ghost End: {data.ghostEndTimestamp ? new Date(data.ghostEndTimestamp * 1000).toLocaleString() : 'N/A'}</p>
              </div>
            </div>
            <button onClick={handleAIAnalyze} className="w-full py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-lg transition-all">AI Analysis</button>
          </div>
        </div>
      </div>
    </main>
  );
}