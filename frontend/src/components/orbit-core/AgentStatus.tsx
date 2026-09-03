'use client';

import React from 'react';
import { Badge } from '../ui/Badge';
import { Cpu, CheckCircle2, Loader2 } from 'lucide-react';

export function AgentStatus({ status = 'ready', name = 'Orbit IQ Core' }: { status?: string; name?: string }) {
  const isRunning = status === 'running';

  return (
    <div className="flex items-center gap-2">
      <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-cyan-400/40 bg-cyan-400/10 text-cyan-400">
        <Cpu size={14} />
      </div>
      <div>
        <div className="text-xs font-bold text-white font-sans">{name}</div>
        <div className="flex items-center gap-1 text-[10px] font-mono text-gray-400">
          {isRunning ? (
            <span className="text-cyan-300 flex items-center gap-1">
              <Loader2 size={10} className="animate-spin" />
              Active Analysis
            </span>
          ) : (
            <span className="text-emerald-400 flex items-center gap-1">
              <CheckCircle2 size={10} />
              Operational
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default AgentStatus;
