'use client';

import React from 'react';

export function SuggestedQueries({
  queries = [],
  onSelect,
}: {
  queries?: string[];
  onSelect: (q: string) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
      <span className="text-[10px] text-gray-500 uppercase">Suggested Queries:</span>
      {queries.map((q) => (
        <button
          key={q}
          type="button"
          onClick={() => onSelect(q)}
          className="px-2.5 py-1 rounded-lg border border-glass-border bg-white/[0.02] hover:bg-cyan-400/10 hover:border-cyan-400/40 text-gray-300 hover:text-cyan-300 text-[11px] transition-colors cursor-pointer"
        >
          {q}
        </button>
      ))}
    </div>
  );
}

export default SuggestedQueries;
