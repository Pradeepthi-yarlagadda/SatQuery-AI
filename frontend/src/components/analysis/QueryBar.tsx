'use client';

import React from 'react';
import { Bot, ArrowRight, Loader2 } from 'lucide-react';

export function QueryBar({
  query,
  setQuery,
  onSubmit,
  isAnalyzing,
  placeholder = 'Ask Orbit IQ Core anything about this remote sensing scene...',
}: {
  query: string;
  setQuery: (q: string) => void;
  onSubmit: (e?: React.FormEvent) => void;
  isAnalyzing: boolean;
  placeholder?: string;
}) {
  return (
    <form onSubmit={onSubmit} className="flex items-center gap-3 rounded-2xl border border-cyan-400/30 bg-[#050814]/90 p-3 shadow-xl">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-cyan-400/30 bg-cyan-400/15 text-cyan-400">
        <Bot size={16} />
      </div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="flex-1 bg-transparent text-sm text-white placeholder-gray-500 focus:outline-none"
      />
      <button
        type="submit"
        disabled={isAnalyzing || !query.trim()}
        className="inline-flex items-center gap-2 rounded-xl gradient-cta px-5 py-2.5 text-xs font-semibold text-white cursor-pointer hover:brightness-110 disabled:opacity-50 transition-all"
      >
        {isAnalyzing ? <Loader2 size={14} className="animate-spin" /> : <span>Run Analysis</span>}
        <ArrowRight size={14} />
      </button>
    </form>
  );
}

export default QueryBar;
