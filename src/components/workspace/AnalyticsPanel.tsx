'use client';

import React, { useState } from 'react';
import { Loader2, FileText, CheckCircle2, Circle } from 'lucide-react';

const traceSteps = [
  { label: 'Parsed natural language query', done: true },
  { label: 'Detected task: Change-based VQA', done: true },
  { label: 'Loaded bi-temporal optical scenes', done: true },
  { label: 'Ran Change-VQA (Orbit IQ) inference', done: true },
  { label: 'Generated evidence crops', done: true },
];

function Gauge({ value }: { value: number }) {
  const r = 30;
  const c = 2 * Math.PI * r;
  return (
    <svg width="76" height="76" viewBox="0 0 76 76" className="-rotate-90">
      <circle
        cx="38"
        cy="38"
        r={r}
        fill="none"
        stroke="rgba(148,163,184,0.2)"
        strokeWidth="6"
      />
      <circle
        cx="38"
        cy="38"
        r={r}
        fill="none"
        stroke="url(#gaugeGrad)"
        strokeWidth="6"
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={c * (1 - value / 100)}
        className="transition-all duration-700"
      />
      <defs>
        <linearGradient id="gaugeGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#6366f1" />
          <stop offset="100%" stopColor="#c084fc" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function AnalyticsPanel({
  loading,
  onOpenReport,
}: {
  loading: boolean;
  onOpenReport?: () => void;
}) {
  const [tab, setTab] = useState<'analysis' | 'trace'>('analysis');

  return (
    <aside className="glass-card flex h-full w-[22rem] shrink-0 flex-col overflow-hidden rounded-2xl">
      <div className="grid grid-cols-2 border-b border-glass-border">
        {(['analysis', 'trace'] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`relative px-4 py-3.5 text-sm font-medium transition-colors ${
              tab === t
                ? 'text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            {t === 'analysis' ? 'Analysis' : 'Execution Trace'}
            {tab === t && (
              <span className="absolute inset-x-4 bottom-0 h-0.5 rounded-full bg-nebula" />
            )}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {loading ? (
          <div className="flex h-full flex-col items-center justify-center gap-3 text-gray-400">
            <Loader2 size={26} className="animate-spin text-nebula" />
            <p className="text-sm font-mono">Running Orbit IQ analysis...</p>
          </div>
        ) : tab === 'trace' ? (
          <ol className="space-y-4 font-mono text-xs">
            {traceSteps.map((step, i) => (
              <li key={step.label} className="flex gap-3">
                {step.done ? (
                  <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-nebula" />
                ) : (
                  <Circle size={16} className="mt-0.5 shrink-0 text-gray-400" />
                )}
                <div>
                  <p className="text-white">{step.label}</p>
                  <p className="text-[11px] text-gray-400">
                    step {i + 1} · {120 + i * 45} ms
                  </p>
                </div>
              </li>
            ))}
          </ol>
        ) : (
          <div className="space-y-5">
            <section>
              <p className="text-xs text-nebula/80 font-mono">Detected Task</p>
              <div className="mt-1.5 flex items-center justify-between gap-2">
                <p className="text-[15px] font-medium text-white">
                  Change-based VQA
                </p>
                <span className="rounded-full border border-nebula/30 bg-nebula/15 px-2.5 py-1 text-[11px] text-nebula font-mono">
                  Automatic
                </span>
              </div>
            </section>

            <div className="h-px bg-glass-border" />

            <section>
              <p className="text-xs text-nebula/80 font-mono">Model Selected</p>
              <p className="mt-1.5 text-[15px] font-medium text-white">
                Change-VQA (Orbit IQ)
              </p>
            </section>

            <div className="h-px bg-glass-border" />

            <section>
              <p className="text-xs text-nebula/80 font-mono">Confidence Score</p>
              <div className="mt-2 flex items-center gap-4">
                <div className="relative">
                  <Gauge value={87} />
                  <span className="absolute inset-0 flex items-center justify-center text-sm font-semibold text-white">
                    87%
                  </span>
                </div>
                <p className="text-sm text-emerald-400 font-medium">High Confidence</p>
              </div>
            </section>

            <div className="h-px bg-glass-border" />

            <section>
              <p className="text-xs text-nebula/80 font-mono">Result</p>
              <p className="mt-1.5 text-sm leading-relaxed text-white">
                Built-up area increased in the eastern region between 2022 and
                2026.
              </p>
            </section>

            <section>
              <p className="text-xs text-nebula/80 font-mono">Evidence</p>
              <div className="mt-2 grid grid-cols-3 gap-2">
                {[0, 1, 2].map((i) => (
                  <img
                    key={i}
                    src="/images/assets/map-satellite.jpg"
                    alt={`Evidence crop ${i + 1}`}
                    className="h-16 w-full rounded-lg border border-glass-border object-cover brightness-[0.7]"
                    style={{ objectPosition: `${20 + i * 30}% ${30 + i * 15}%` }}
                  />
                ))}
              </div>
            </section>

            <button
              type="button"
              onClick={onOpenReport}
              className="mt-1 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-glass-border bg-white/[0.04] px-4 py-3 text-sm font-medium text-white transition-colors hover:border-nebula/40 hover:bg-nebula/10 cursor-pointer"
            >
              <FileText size={15} />
              View Full Report
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
