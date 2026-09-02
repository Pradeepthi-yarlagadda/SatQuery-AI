'use client';

import React from 'react';
import { ArrowRight, Bot, Loader2 } from 'lucide-react';

const suggestions = [
  'What type of land cover is present?',
  'Highlight the water body',
  'What changed between these dates?',
  'Use optical and SAR to identify buildings',
];

export function QueryBar({
  query,
  onQueryChange,
  onAnalyze,
  loading,
}: {
  query: string;
  onQueryChange: (value: string) => void;
  onAnalyze: (value: string) => void;
  loading: boolean;
}) {
  return (
    <div className="glass-card mt-3 rounded-2xl p-4">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-nebula/30 bg-nebula/15 text-nebula">
          <Bot size={19} />
        </div>
        <div className="flex-1">
          <label
            htmlFor="orbit-query"
            className="text-[11px] text-gray-400 font-mono"
          >
            Ask Orbit IQ...
          </label>
          <input
            id="orbit-query"
            type="text"
            value={query}
            disabled={loading}
            onChange={(e) => onQueryChange(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && onAnalyze(query)}
            placeholder="Has the built-up area increased? Show me where."
            className="mt-1 w-full rounded-lg border border-glass-border bg-white/[0.04] px-3 py-2 text-sm text-white placeholder:text-gray-400 focus:border-nebula/50 focus:outline-none focus:ring-1 focus:ring-nebula/30 disabled:opacity-60"
          />
        </div>
        <button
          type="button"
          onClick={() => onAnalyze(query)}
          disabled={loading}
          className="inline-flex shrink-0 items-center gap-2 self-end rounded-xl gradient-cta px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition-all hover:shadow-primary/40 disabled:opacity-70 cursor-pointer"
        >
          {loading ? (
            <>
              <Loader2 size={15} className="animate-spin" />
              Analyzing
            </>
          ) : (
            <>
              Analyze
              <ArrowRight size={15} />
            </>
          )}
        </button>
      </div>

      <p className="mt-4 text-[11px] text-gray-400 font-mono">Suggested Queries</p>
      <div className="mt-2 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        {suggestions.map((s) => (
          <button
            key={s}
            type="button"
            disabled={loading}
            onClick={() => onAnalyze(s)}
            className="rounded-lg border border-glass-border bg-white/[0.03] px-3 py-2.5 text-left text-xs text-gray-400 transition-colors hover:border-nebula/40 hover:bg-nebula/10 hover:text-white disabled:opacity-60 cursor-pointer"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}
