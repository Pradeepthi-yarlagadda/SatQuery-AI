'use client';

import React from 'react';
import { Bot } from 'lucide-react';
import AnalysisResultCard from '../analysis/AnalysisResultCard';
import { AnalysisResult } from '@/types/analysis';

export function OrbitMessage({
  text,
  result,
  timestamp,
}: {
  text: string;
  result?: AnalysisResult;
  timestamp?: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-cyan-400/40 bg-cyan-400/10 text-cyan-300">
        <Bot size={14} />
      </div>
      <div className="max-w-2xl rounded-2xl bg-white/[0.03] border border-glass-border p-4 text-xs sm:text-sm text-gray-200 space-y-3">
        <p className="leading-relaxed">{text}</p>
        {result && <AnalysisResultCard result={result} />}
        {timestamp && <div className="text-[10px] font-mono text-gray-500 text-right">{timestamp}</div>}
      </div>
    </div>
  );
}

export default OrbitMessage;
