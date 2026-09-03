'use client';

import React from 'react';

export function QuerySummary({ query, task }: { query: string; task: string }) {
  return (
    <div className="rounded-xl border border-glass-border bg-white/[0.02] p-4 text-xs font-mono space-y-1">
      <div className="text-gray-400 uppercase text-[10px]">Mission Directives</div>
      <div className="text-white font-medium text-sm font-sans">"{query}"</div>
      <div className="text-purple-300 text-[11px]">Task Classification: {task}</div>
    </div>
  );
}

export default QuerySummary;
