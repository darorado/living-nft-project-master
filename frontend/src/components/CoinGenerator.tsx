"use client";
import React, { useState } from 'react';
import { Coins, TrendingUp, Loader2, CheckCircle2 } from 'lucide-react';
import { trpc } from '../utils/trpc';

const OWNER = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266';

export default function CoinGenerator() {
  const [amount, setAmount] = useState('100');
  const [recipient, setRecipient] = useState(OWNER);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ txHash: string; balance: any; supply: any } | null>(null);
  const [error, setError] = useState('');

  const handleMint = async () => {
    setLoading(true);
    setError('');
    try {
      const mint = await trpc.coin.mintReward({ 
        to: recipient, 
        amount: Number(amount), 
        reason: 'Living Coin forge' 
      });

      const [balance, supply] = await Promise.all([
        trpc.coin.getBalance({ address: recipient }),
        trpc.coin.getSupply()
      ]);

      setResult({ txHash: mint.txHash, balance: balance.balance, supply });
    } catch (e: any) {
      setError(e.message || 'Error forging coin');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-indigo-950 rounded-2xl border border-indigo-800 space-y-4 shadow-xl">
      <div className="flex items-center gap-2 mb-4">
        <Coins className="text-yellow-400" />
        <h3 className="text-xl font-bold text-indigo-100">Tokenomics Forge</h3>
      </div>

      <input
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Amount (LCOIN)"
        type="number"
        className="w-full bg-indigo-900/50 border border-indigo-700 p-3 rounded-lg text-white outline-none focus:border-yellow-500"
      />
      <input
        value={recipient}
        onChange={(e) => setRecipient(e.target.value)}
        placeholder="Recipient address"
        className="w-full bg-indigo-900/50 border border-indigo-700 p-3 rounded-lg text-white outline-none focus:border-yellow-500 font-mono text-xs"
      />
      <button
        onClick={handleMint}
        disabled={loading}
        className="w-full px-6 py-3 bg-yellow-500 hover:bg-yellow-400 text-indigo-950 rounded-lg font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50"
      >
        {loading ? <Loader2 className="animate-spin" /> : <Coins />}
        {loading ? 'Forging...' : 'Forge LCOIN'}
      </button>

      {error && <p className="text-red-400 text-sm">{error}</p>}

      {result && (
        <div className="mt-4 p-4 bg-indigo-900/40 rounded-lg border border-yellow-500/30">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle2 className="text-green-400" />
            <span className="text-green-400 font-bold text-sm">Minted!</span>
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-indigo-300">New balance:</span>
              <span className="text-white font-mono">{result.balance}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-indigo-300">Total supply:</span>
              <span className="text-white font-mono">{result.supply?.total}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-indigo-300">Minted:</span>
              <span className="text-white font-mono">{result.supply?.minted}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-indigo-300">Burned:</span>
              <span className="text-white font-mono">{result.supply?.burned}</span>
            </div>
            <p className="text-[10px] font-mono text-indigo-400 break-all pt-1">Tx: {result.txHash}</p>
          </div>
        </div>
      )}
    </div>
  );
}
