'use client';

import React, { useEffect, useState } from 'react';
import { Cpu, CheckCircle2, Loader2, Sparkles, Binary, ShieldCheck, Layers, ArrowRight } from 'lucide-react';
import { AnalysisScenario } from '@/types/satellite';

interface AgentPipelineModalProps {
  isOpen: boolean;
  onComplete: () => void;
  scenario: AnalysisScenario;
  query: string;
}

export default function AgentPipelineModal({
  isOpen,
  onComplete,
  scenario,
  query,
}: AgentPipelineModalProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const steps = [
    {
      title: 'QUERY RECEIVED',
      desc: `Natural-language query detected: "${query || scenario.primaryQuery}"`,
      icon: Sparkles,
      color: 'text-indigo-300',
      border: 'border-indigo-500/40',
    },
    {
      title: 'INPUT VALIDATION',
      desc: `GeoTIFF compatibility verified: ${scenario.inputs.length} scene(s), EPSG:4326 CRS, 10.0m GSD parity.`,
      icon: ShieldCheck,
      color: 'text-emerald-400',
      border: 'border-emerald-500/40',
    },
    {
      title: 'TASK IDENTIFIED',
      desc: `Intent classified: ${scenario.detectedTask}.`,
      icon: Layers,
      color: 'text-purple-400',
      border: 'border-purple-500/40',
    },
    {
      title: 'MODEL SELECTED',
      desc: `Routed to ${scenario.selectedModel.name} (${scenario.selectedModel.dataset} weights).`,
      icon: Cpu,
      color: 'text-blue-400',
      border: 'border-blue-500/40',
    },
    {
      title: 'ANALYSIS IN PROGRESS',
      desc: 'Extracting deep spectral representations and computing spatial difference tensors.',
      icon: Binary,
      color: 'text-orange-400',
      border: 'border-orange-500/40',
    },
    {
      title: 'EVIDENCE GENERATION',
      desc: 'Synthesizing grounded masks, bounding polygons, and auditable confidence metrics.',
      icon: CheckCircle2,
      color: 'text-teal-400',
      border: 'border-teal-500/40',
    },
    {
      title: 'ANALYSIS COMPLETE',
      desc: `Grounded intelligence ready with ${scenario.confidence}% confidence score.`,
      icon: CheckCircle2,
      color: 'text-indigo-300',
      border: 'border-indigo-300',
    },
  ];

  useEffect(() => {
    if (!isOpen) {
      setCurrentStepIndex(0);
      return;
    }

    const intervals = [400, 500, 450, 500, 600, 500, 400];
    let step = 0;

    const runNextStep = () => {
      if (step < steps.length - 1) {
        step += 1;
        setCurrentStepIndex(step);
        setTimeout(runNextStep, intervals[step] || 450);
      } else {
        setTimeout(() => {
          onComplete();
        }, 600);
      }
    };

    const timer = setTimeout(runNextStep, intervals[0]);
    return () => clearTimeout(timer);
  }, [isOpen, onComplete, steps.length]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-space-950/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-lg p-6 rounded-2xl bg-space-900 border border-indigo-500/40 shadow-neon-indigo relative overflow-hidden space-y-6">
        
        {/* Glowing Radar Sweep Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-300">
              <Cpu className="w-4 h-4 animate-spin-slow" />
            </div>
            <div>
              <div className="text-xs font-mono font-bold text-white tracking-wider">ORBITIQ CORE</div>
              <div className="text-[10px] font-mono text-indigo-300">AGENTIC ORCHESTRATION ENGINE</div>
            </div>
          </div>

          <div className="flex items-center space-x-1 px-2.5 py-1 rounded bg-indigo-950/80 border border-indigo-500/30 text-[10px] font-mono text-indigo-300">
            <Loader2 className="w-3 h-3 animate-spin text-indigo-300" />
            <span>PROCESSING</span>
          </div>
        </div>

        {/* Stepped Process List */}
        <div className="space-y-3 font-mono">
          {steps.map((s, idx) => {
            const isFinished = idx < currentStepIndex;
            const isCurrent = idx === currentStepIndex;
            const isPending = idx > currentStepIndex;
            const Icon = s.icon;

            return (
              <div
                key={idx}
                className={`p-3 rounded-xl border transition-all duration-300 flex items-start space-x-3 ${
                  isCurrent
                    ? 'bg-space-850 border-indigo-500/50 shadow-neon-indigo scale-[1.02]'
                    : isFinished
                    ? 'bg-space-950/40 border-white/10 opacity-80'
                    : 'bg-space-950/20 border-white/5 opacity-30'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs mt-0.5 shrink-0 ${
                    isFinished
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : isCurrent
                      ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/50 animate-pulse'
                      : 'bg-white/5 text-gray-500 border border-white/10'
                  }`}
                >
                  {isFinished ? (
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  ) : isCurrent ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <span>{idx + 1}</span>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-bold tracking-wide ${
                        isCurrent ? 'text-white glow-text-cyan' : isFinished ? 'text-gray-300' : 'text-gray-500'
                      }`}
                    >
                      {s.title}
                    </span>
                    {isFinished && <span className="text-[10px] text-emerald-400">✓ OK</span>}
                  </div>
                  <p className="text-[11px] text-gray-400 font-sans mt-0.5 truncate">{s.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Progress Bar */}
        <div className="space-y-1.5 pt-2">
          <div className="flex justify-between text-[10px] font-mono text-gray-400">
            <span>Orchestrating Tool Pipeline</span>
            <span>{Math.round(((currentStepIndex + 1) / steps.length) * 100)}%</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-space-950 overflow-hidden border border-white/10">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-blue-600 transition-all duration-300 shadow-neon-indigo"
              style={{ width: `${((currentStepIndex + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>

      </div>
    </div>
  );
}
