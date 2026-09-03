'use client';

import React from 'react';
import { ExecutionStep } from '@/types/analysis';

export function ReportExecutionTrace({ trace = [] }: { trace: ExecutionStep[] }) {
  return (
    <div className="space-y-3">
      <h3 className="text-base font-bold text-cyan-300 font-mono border-b border-white/[0.06] pb-1">
        3. Observable Execution Log
      </h3>
      <div className="rounded-xl border border-glass-border bg-black/40 p-4 font-mono text-xs text-gray-300 space-y-1.5">
        {trace.map((step) => (
          <div key={step.id} className="flex items-center justify-between">
            <span>• {step.message}</span>
            <span className="text-[10px] text-gray-500">[{step.capability}]</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ReportExecutionTrace;
