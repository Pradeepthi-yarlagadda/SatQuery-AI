'use client';

import React from 'react';
import { Calendar } from 'lucide-react';

export function Timeline({
  date1 = '2022-04-10',
  date2 = '2026-03-15',
  interval = '3.9 Years',
}: {
  date1?: string;
  date2?: string;
  interval?: string;
}) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-glass-border bg-[#050814]/80 p-3 text-xs font-mono">
      <div className="flex items-center gap-2">
        <Calendar size={14} className="text-cyan-400" />
        <span className="text-gray-400">Baseline T1:</span>
        <span className="text-white font-bold">{date1}</span>
      </div>
      <div className="rounded-full bg-purple-500/20 px-2.5 py-0.5 text-[10px] text-purple-300 font-bold border border-purple-500/30">
        Δ {interval}
      </div>
      <div className="flex items-center gap-2">
        <span className="text-gray-400">Target T2:</span>
        <span className="text-white font-bold">{date2}</span>
      </div>
    </div>
  );
}

export default Timeline;
