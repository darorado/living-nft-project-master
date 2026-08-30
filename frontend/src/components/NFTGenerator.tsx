"use client";
import React, { useState } from 'react';
import { Sparkles, Loader2, CheckCircle2 } from 'lucide-react';
import { trpc } from '../utils/trpc';

const OWNER = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266';

export default function NFTGenerator({ onMinted }: { onMinted?: (tokenId: string) => void }) {
  const [prompt, setPrompt] = useState('');
  const [recipient, setRecipient] = useState(OWNER);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ tokenId: string; genome: string; txHash: string; description: string } | null>(null);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    setLoading(true);
    setError('');
    try {
      const genome = String(Math.floor(Math.random() * 1_000_000_000));

      const mint = await trpc.nft.mint({ to: recipient, genome });

      let description = 'A newly forged bio-digital organism.';
      try {
        const aiRes = await trpc.ai.analyze({
          text: `Describe a living NFT with genome ${genome} inspired by: ${prompt || 'a random organism'}`,
          context: 'Short creative organism description'
        });
        description = aiRes.analysis;
      } catch { /* AI optional */ }

      setResult({ tokenId: mint.tokenId, genome, txHash: mint.txHash, description });
      onMinted?.(String(mint.tokenId));
    } catch (e: any) {
      setError(e.message || 'Error generating NFT');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-900 rounded-2xl border border-gray-800 space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="text-yellow-400" />
        <h3 className="text-xl font-bold">AI Genesis Generator</h3>
      </div>

      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Describe your organism (e.g. 'Fire-breathing crystalline dragon')..."
        rows={2}
        className="w-full bg-black border border-gray-700 p-3 rounded-lg text-white outline-none focus:border-blue-500 resize-none"
      />
      <input
        value={recipient}
        onChange={(e) => setRecipient(e.target.value)}
        placeholder="Recipient address"
        className="w-full bg-black border border-gray-700 p-3 rounded-lg text-white outline-none focus:border-blue-500 font-mono text-xs"
      />
      <button
        onClick={handleGenerate}
        disabled={loading}
        className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg font-bold flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50 transition-all"
      >
        {loading ? <Loader2 className="animate-spin" /> : <Sparkles />}
        {loading ? 'Minting on-chain...' : 'Generate & Mint'}
      </button>

      {error && <p className="text-red-400 text-sm">{error}</p>}

      {result && (
        <div className="mt-4 p-4 bg-black rounded-lg border border-blue-900/40">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 className="text-green-400" />
            <p className="text-green-400 font-bold">🧬 Genesis Successful!</p>
          </div>
          <p className="text-gray-300 text-sm mb-3">{result.description}</p>
          <div className="space-y-1 text-[11px] font-mono text-gray-500 break-all">
            <p>Token ID: <span className="text-blue-300">{result.tokenId}</span></p>
            <p>DNA: <span className="text-blue-300">{result.genome}</span></p>
            <p>Tx: <span className="text-blue-300">{result.txHash}</span></p>
          </div>
          <button
            onClick={() => onMinted?.(String(result.tokenId))}
            className="mt-3 w-full py-2 bg-blue-900/40 hover:bg-blue-900/70 text-blue-300 rounded-lg text-xs font-bold transition-all"
          >
            Load in Viewer →
          </button>
        </div>
      )}
    </div>
  );
}
