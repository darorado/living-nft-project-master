"use client";
import { useState, useEffect } from 'react';
import Octagon3D from '../../components/Octagon3D';

export default function TechnocratDashboard() {
  const [state, setState] = useState({ phase: 'observation', energy: 95, confidence: 0.82, marketSentiment: 'neutral', loopId: 0, activeAgents: ['Strategist'] } as any);
  const [logs, setLogs] = useState<string[]>(['[init] System ready']);
  const [status, setStatus] = useState<any>(null);

  useEffect(() => {
    let ws: WebSocket | null = null;
    try {
      ws = new WebSocket('ws://localhost:3001');
      ws.onmessage = (e) => {
        try {
          const d = JSON.parse(e.data);
          if (d.type === 'OCTAGON_STATE') setState((s:any)=>({...s, ...d.payload}));
          if (d.type === 'GHOST_ALERT') setLogs(p=>[...p.slice(-8), `GHOST #${d.payload.tokenId} died`]);
          if (d.type === 'REBORN_AUTO') setLogs(p=>[...p.slice(-8), `REBORN #${d.payload.tokenId} genome ${d.payload.genome.slice(0,8)}`]);
          if (d.type === 'OCTAGON_CYCLE') setLogs(p=>[...p.slice(-8), `Loop #${d.payload.loopId} -> ${d.payload.result?.executed}`]);
        } catch {}
      };
    } catch {}
    const iv = setInterval(async ()=>{
      try {
        const r = await fetch('http://localhost:3001/technocrat/status');
        const j = await r.json();
        setStatus(j);
        if (j.phase) setState((s:any)=>({...s, ...j}));
      } catch {}
    }, 2500);
    return ()=> { if(ws) ws.close(); clearInterval(iv); };
  }, []);

  const trigger = async ()=>{
    setLogs(p=>[...p, 'triggering cycle...']);
    const r = await fetch('http://localhost:3001/technocrat/cycle', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ tokenId:'1' })});
    const j = await r.json();
    setLogs(p=>[...p.slice(-8), `manual loop #${j.loopId} ${j.result?.executed}`]);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-6">
      <header className="mb-6">
        <h1 className="text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">🧬 Technocratic Octagonal Engine</h1>
        <p className="text-gray-400">Live visualization of self-improving agent loop + Ghost Protocol</p>
      </header>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Octagon3D state={state} />
          <div className="mt-4 p-3 bg-zinc-900 rounded border border-zinc-800 text-xs font-mono">
            <div>Loop: {status?.loopId ?? state.loopId} | Ollama: {status?.ollama ?? '?'} ({status?.ollamaUrl})</div>
            <div className="text-gray-400 truncate">Thought: {state.lastThought || status?.lastThought || '-'}</div>
          </div>
        </div>
        <div className="space-y-4">
          <div className="bg-zinc-900 p-4 rounded border border-zinc-800">
            <h2 className="font-bold text-purple-400 mb-2">System Status</h2>
            <pre className="text-xs overflow-auto max-h-40">{JSON.stringify(status||state, null, 2)}</pre>
          </div>
          <button onClick={trigger} className="w-full bg-purple-600 hover:bg-purple-700 py-3 rounded font-bold">🚀 Forced Cycle Execution</button>
          <button onClick={async()=>{
            const r=await fetch('http://localhost:3001/technocrat/ghost-rebirth',{method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({tokenId:'1'})});
            const j=await r.json(); setLogs(p=>[...p,`ghost-rebirth: ${j.genome?.slice(0,12) || j.error}`]);
          }} className="w-full bg-orange-600 hover:bg-orange-700 py-2 rounded font-bold">👻 Test Ghost Rebirth #1</button>
          <div className="bg-black p-3 rounded border border-zinc-800 h-56 overflow-auto font-mono text-xs">
            <div className="text-gray-500 mb-1">Live Logs:</div>
            {logs.map((l,i)=><div key={i} className="text-green-400">{l}</div>)}
          </div>
        </div>
      </div>
    </div>
  );
}
