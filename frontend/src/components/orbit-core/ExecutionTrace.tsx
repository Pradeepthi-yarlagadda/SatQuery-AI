'use client';

import React from 'react';
import { ExecutionStep } from '@/types/analysis';
import { CheckCircle2, Loader2, Circle, AlertCircle } from 'lucide-react';

export function ExecutionTrace({ steps = [] }: { steps: ExecutionStep[] }) {
  return (
    <div className="space-y-1.5 font-mono text-xs">
      {steps.map((step) => {
        const isDone = step.status === 'completed';
        const isCurrent = step.status === 'running';
        const isFailed = step.status === 'failed';

        return (
          <div
            key={step.id}
            className={`flex items-center justify-between rounded-lg px-2.5 py-1.5 ${
              isCurrent
                ? 'bg-cyan-400/10 text-cyan-200 border border-cyan-400/30'
                : isDone
                ? 'bg-white/[0.02] text-gray-200'
                : isFailed
                ? 'bg-rose-500/10 text-rose-300'
                : 'text-gray-500'
            }`}
          >
            <div className="flex items-center gap-2 truncate">
              {isDone && <CheckCircle2 size={13} className="text-emerald-400 shrink-0" />}
              {isCurrent && <Loader2 size={13} className="animate-spin text-cyan-400 shrink-0" />}
              {isFailed && <AlertCircle size={13} className="text-rose-400 shrink-0" />}
              {!isDone && !isCurrent && !isFailed && <Circle size={13} className="text-gray-600 shrink-0" />}
              <span className="truncate">{step.message}</span>
            </div>
            {step.durationMs !== undefined && (
              <span className="text-[10px] text-gray-500 shrink-0">+{step.durationMs}ms</span>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default ExecutionTrace;
