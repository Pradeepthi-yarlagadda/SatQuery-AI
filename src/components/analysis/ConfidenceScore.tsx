'use client';

import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { AnalysisConfidence } from '@/types/analysis';

export function ConfidenceScore({ confidence }: { confidence: AnalysisConfidence }) {
  const percent = Math.round(confidence.overall * 100);

  return (
    <div className="flex items-center gap-2 text-xs font-mono">
      <ShieldCheck size={16} className="text-emerald-400" />
      <span className="text-gray-400">Confidence:</span>
      <span className="font-bold text-white">{percent}%</span>
      <span className="rounded bg-emerald-500/20 px-1.5 py-0.5 text-[10px] text-emerald-300 font-bold">
        {confidence.level}
      </span>
    </div>
  );
}

export default ConfidenceScore;
