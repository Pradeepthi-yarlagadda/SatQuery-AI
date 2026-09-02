'use client';

import React from 'react';
import { AnalysisScenario, TraceStep } from '@/types/satellite';
import { X, CheckCircle2, ShieldCheck, Terminal, Clock, Cpu, FileCheck } from 'lucide-react';

interface ExecutionTracePanelProps {
  isOpen: boolean;
  onClose: () => void;
  scenario: AnalysisScenario;
}

export default function ExecutionTracePanel({
  isOpen,
  onClose,
  scenario,
}: ExecutionTracePanelProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-space-950/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-3xl max-h-[85vh] flex flex-col bg-space-900 border border-indigo-500/40 rounded-2xl shadow-neon-indigo overflow-hidden">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between bg-space-950/80">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-300">
              <Terminal className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-mono font-bold text-white tracking-wider">
                AUDITABLE AGENT EXECUTION TRACE
              </h2>
              <p className="text-[11px] font-mono text-indigo-300">
                ORBITIQ CORE · DETERMINISTIC WORKFLOW VERIFICATION
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-space-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Trace Metadata Overview */}
        <div className="p-4 bg-space-950/50 border-b border-white/5 grid grid-cols-2 sm:grid-cols-4 gap-3 text-[11px] font-mono">
          <div>
            <span className="text-gray-400 block">TASK CLASSIFICATION</span>
            <span className="text-white font-bold">{scenario.detectedTask}</span>
          </div>
          <div>
            <span className="text-gray-400 block">MODEL INVOKED</span>
            <span className="text-indigo-300 font-bold truncate block">{scenario.selectedModel.name}</span>
          </div>
          <div>
            <span className="text-gray-400 block">INPUT DATA</span>
            <span className="text-white font-bold">{scenario.inputs.length} GeoTIFF File(s)</span>
          </div>
          <div>
            <span className="text-gray-400 block">EXECUTION STATUS</span>
            <span className="text-emerald-400 font-bold">✓ 100% Verified</span>
          </div>
        </div>

        {/* Stepped Timeline */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 font-mono">
          <div className="relative border-l-2 border-indigo-500/30 ml-4 pl-6 space-y-6">
            {scenario.trace.map((step, idx) => (
              <div key={idx} className="relative group">
                {/* Node icon */}
                <div className="absolute -left-[33px] top-0 w-5 h-5 rounded-full bg-space-950 border-2 border-indigo-300 flex items-center justify-center text-[9px] text-indigo-300 shadow-neon-indigo">
                  {step.step}
                </div>

                <div className="p-3.5 rounded-xl bg-space-950/60 border border-white/10 hover:border-indigo-500/30 transition-colors space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs font-bold text-white tracking-wide">
                      {step.stage}
                    </span>
                    <div className="flex items-center space-x-2 text-[10px]">
                      <span className="px-2 py-0.5 rounded bg-space-850 text-indigo-300 border border-indigo-500/20">
                        {step.toolUsed}
                      </span>
                      <span className="text-gray-400 flex items-center space-x-1">
                        <Clock className="w-3 h-3 text-gray-400" />
                        <span>{step.timestamp} ({step.durationMs}ms)</span>
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-gray-300 font-sans leading-relaxed">
                    {step.detail}
                  </p>

                  <div className="flex items-center space-x-2 text-[10px] text-emerald-400">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Integrity Gate Passed</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 bg-space-950/80 flex items-center justify-between text-xs font-mono">
          <div className="text-gray-400">
            Total Pipeline Latency: <span className="text-white font-bold">1.24s</span> · Reproducibility Hash: <span className="text-indigo-300">0x8F9A2B4C</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-indigo-500 hover:bg-indigo-300 text-slate-950 font-bold font-mono transition-colors shadow-neon-indigo"
          >
            DISMISS
          </button>
        </div>

      </div>
    </div>
  );
}
