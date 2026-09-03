'use client';

import React, { useState } from 'react';
import { Sparkles, ArrowRight, CornerDownLeft, Radio, Mic } from 'lucide-react';
import { AnalysisScenario } from '@/types/satellite';

interface QueryBoxProps {
  scenario: AnalysisScenario;
  onAnalyze: (query: string) => void;
  isAnalyzing: boolean;
}

export default function QueryBox({
  scenario,
  onAnalyze,
  isAnalyzing,
}: QueryBoxProps) {
  const [queryText, setQueryText] = useState(scenario.primaryQuery);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (queryText.trim() && !isAnalyzing) {
      onAnalyze(queryText.trim());
    }
  };

  const handleSuggestedClick = (q: string) => {
    setQueryText(q);
    onAnalyze(q);
  };

  return (
    <div className="w-full p-4 rounded-2xl bg-space-900/90 border border-space-border shadow-2xl backdrop-blur-xl space-y-3">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-orbit-cyan">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
          </div>
          <span className="text-xs font-mono font-bold text-white tracking-wider">ASK ORBITIQ</span>
          <span className="text-[10px] font-mono text-gray-400">· NATURAL LANGUAGE REMOTE SENSING</span>
        </div>

        <div className="text-[10px] font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/20">
          Agent Ready
        </div>
      </div>

      {/* Query Form Input */}
      <form onSubmit={handleSubmit} className="relative flex items-center">
        <input
          type="text"
          value={queryText}
          onChange={(e) => setQueryText(e.target.value)}
          placeholder="Ask anything about this satellite scene or temporal changes..."
          className="w-full bg-space-950/80 border border-cyan-500/30 rounded-xl px-4 py-3 text-xs sm:text-sm text-white placeholder-gray-400 font-mono focus:outline-none focus:border-cyan-400 focus:shadow-neon-cyan pr-28 transition-all"
        />

        <div className="absolute right-2 flex items-center space-x-1.5">
          <button
            type="submit"
            disabled={isAnalyzing || !queryText.trim()}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-mono font-bold text-xs shadow-neon-cyan disabled:opacity-50 transition-all cursor-pointer"
          >
            <span>ANALYZE</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </form>

      {/* Suggested Questions */}
      <div className="flex flex-wrap items-center gap-1.5 pt-1">
        <span className="text-[10px] font-mono text-gray-400 flex items-center space-x-1">
          <Sparkles className="w-3 h-3 text-orbit-cyan" />
          <span>TRY ASKING:</span>
        </span>
        {scenario.suggestedQueries.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSuggestedClick(q)}
            className="text-[10px] font-mono px-2 py-1 rounded bg-space-950/70 border border-white/10 text-gray-300 hover:text-orbit-cyan hover:border-cyan-500/40 hover:bg-space-850 transition-colors truncate max-w-[240px] sm:max-w-none text-left"
          >
            "{q}"
          </button>
        ))}
      </div>

    </div>
  );
}
