'use client';

import React from 'react';
import { ExecutionStep } from '@/types/analysis';
import { CheckCircle2, Circle, Loader2, Sparkles, Cpu, AlertCircle } from 'lucide-react';

interface OrbitIqCoreStatusProps {
  steps: ExecutionStep[];
  isRunning?: boolean;
  specialistDisplayName?: string;
  taskDisplayName?: string;
}

export default function OrbitIqCoreStatus({
  steps,
  isRunning = false,
  specialistDisplayName,
  taskDisplayName,
}: OrbitIqCoreStatusProps) {
  return (
    <div className="rounded-2xl border border-glass-border bg-[#050814]/90 p-5 shadow-2xl backdrop-blur-xl space-y-4">
      
      {/* Orbit IQ Core Header */}
      <div className="flex items-center justify-between border-b border-glass-border pb-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-cyan-400/40 bg-cyan-400/10 text-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.25)]">
            <Cpu size={16} />
          </div>
          <div>
            <div className="text-[10px] font-mono tracking-widest text-cyan-400 font-bold uppercase">
              MASTER CONTROLLER
            </div>
            <h3 className="text-sm font-bold text-white font-sans">
              ORBIT IQ CORE
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isRunning ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-cyan-400/10 border border-cyan-400/30 px-2.5 py-1 text-[11px] font-mono text-cyan-300 animate-pulse">
              <Loader2 size={12} className="animate-spin" />
              Executing
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 text-[11px] font-mono text-emerald-300">
              <CheckCircle2 size={12} />
              Ready
            </span>
          )}
        </div>
      </div>

      {/* Identified Task & Selected Specialist Badges */}
      {(taskDisplayName || specialistDisplayName) && (
        <div className="grid grid-cols-2 gap-2.5 bg-white/[0.02] border border-glass-border rounded-xl p-3 text-xs font-mono">
          <div>
            <div className="text-[10px] text-gray-400 uppercase">Task Identified</div>
            <div className="font-semibold text-purple-300 truncate">
              {taskDisplayName || 'Analyzing intent...'}
            </div>
          </div>
          <div>
            <div className="text-[10px] text-gray-400 uppercase">Specialist Capability</div>
            <div className="font-semibold text-cyan-300 flex items-center gap-1 truncate">
              <Sparkles size={12} className="shrink-0" />
              <span>{specialistDisplayName || 'Selecting specialist...'}</span>
            </div>
          </div>
        </div>
      )}

      {/* Observable Execution Steps */}
      <div className="space-y-2">
        <div className="text-[10px] font-mono tracking-wider text-gray-400 uppercase">
          Observable Execution Pipeline
        </div>

        <div className="space-y-1.5">
          {steps.map((step) => {
            const isDone = step.status === 'completed';
            const isCurrent = step.status === 'running';
            const isFailed = step.status === 'failed';

            return (
              <div
                key={step.id}
                className={`flex items-start gap-2.5 rounded-lg px-2.5 py-1.5 text-xs font-mono transition-colors ${
                  isCurrent
                    ? 'bg-cyan-400/10 text-cyan-200 border border-cyan-400/30'
                    : isDone
                    ? 'text-gray-200 bg-white/[0.02]'
                    : isFailed
                    ? 'text-rose-300 bg-rose-500/10 border border-rose-500/30'
                    : 'text-gray-500'
                }`}
              >
                <div className="mt-0.5 shrink-0">
                  {isDone && <CheckCircle2 size={13} className="text-emerald-400" />}
                  {isCurrent && <Loader2 size={13} className="animate-spin text-cyan-400" />}
                  {isFailed && <AlertCircle size={13} className="text-rose-400" />}
                  {!isDone && !isCurrent && !isFailed && <Circle size={13} className="text-gray-600" />}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{step.message}</div>
                  {step.detail && (
                    <div className="text-[10px] text-gray-400 truncate mt-0.5">
                      {step.detail}
                    </div>
                  )}
                </div>

                {step.durationMs !== undefined && (
                  <div className="text-[10px] text-gray-500 shrink-0">
                    +{step.durationMs}ms
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
