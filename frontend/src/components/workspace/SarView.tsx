'use client';

import React, { useState } from 'react';
import {
  Building2,
  Droplets,
  Leaf,
  CheckCircle2,
  Download,
  Send,
  ArrowLeft,
  Radar,
  Sun,
} from 'lucide-react';

const findings = [
  { icon: Building2, label: 'Built-up Area', tone: 'text-red-400 bg-red-500/15 ring-red-500/30' },
  { icon: Droplets, label: 'Water Bodies', tone: 'text-sky-400 bg-sky-500/15 ring-sky-500/30' },
  { icon: Leaf, label: 'Vegetation', tone: 'text-emerald-400 bg-emerald-500/15 ring-emerald-500/30' },
];

const trace = [
  { label: 'Query classified as CHANGE_VQA', time: '10:31:04' },
  { label: 'Input validation completed', time: '10:31:05' },
  { label: 'Model selected: Change-VQA', time: '10:31:06' },
  { label: 'Analysis completed', time: '10:31:10' },
  { label: 'Report generated', time: '10:31:12' },
];

export function SarView({
  onExit,
  onOpenReport,
}: {
  onExit?: () => void;
  onOpenReport?: () => void;
}) {
  const [mode, setMode] = useState<'Optical' | 'SAR'>('Optical');
  const [draft, setDraft] = useState('');

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-3">
      {/* Top bar */}
      <div className="glass-card flex items-center justify-between rounded-2xl px-4 py-3">
        <div className="flex items-center gap-4">
          {onExit && (
            <button
              type="button"
              onClick={onExit}
              className="flex items-center gap-1.5 rounded-lg border border-glass-border bg-white/[0.04] px-2.5 py-1.5 text-xs font-medium text-gray-400 transition-colors hover:bg-white/[0.08] hover:text-white cursor-pointer"
            >
              <ArrowLeft size={13} />
              Map View
            </button>
          )}
          <div>
            <h2 className="text-base font-semibold text-white">
              Optical + SAR Analysis
            </h2>
            <p className="text-xs text-gray-400">
              Multi-sensor. More insights. Better decisions.
            </p>
          </div>
        </div>
        <div className="flex rounded-full border border-glass-border bg-white/[0.04] p-1">
          {(
            [
              { label: 'Optical' as const, icon: Sun },
              { label: 'SAR' as const, icon: Radar },
            ]
          ).map((m) => (
            <button
              key={m.label}
              type="button"
              onClick={() => setMode(m.label)}
              className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
                mode === m.label
                  ? 'gradient-cta text-white shadow-md shadow-primary/25'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <m.icon size={13} />
              {m.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex min-h-0 flex-1 gap-3">
        {/* Dual feed */}
        <div className="flex min-w-0 flex-1 flex-col gap-3">
          <div className="grid min-h-0 flex-1 grid-cols-2 gap-3">
            <figure className="glass-card relative min-h-0 overflow-hidden rounded-2xl">
              <img
                src="/images/assets/optical-multispectral.jpg"
                alt="Optical multispectral satellite imagery"
                className={`h-full w-full object-cover transition-opacity duration-300 ${
                  mode === 'Optical' ? 'opacity-100' : 'opacity-45'
                }`}
              />
              <figcaption className="absolute left-3 top-3 rounded-md bg-black/60 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm font-mono">
                Optical (Multispectral)
              </figcaption>
            </figure>
            <figure className="glass-card relative min-h-0 overflow-hidden rounded-2xl">
              <img
                src="/images/assets/sar-backscatter.jpg"
                alt="SAR backscatter radar imagery"
                className={`h-full w-full object-cover transition-opacity duration-300 ${
                  mode === 'SAR' ? 'opacity-100' : 'opacity-45'
                }`}
              />
              <figcaption className="absolute left-3 top-3 rounded-md bg-black/60 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm font-mono">
                SAR (Backscatter)
              </figcaption>
            </figure>
          </div>

          <form
            className="glass-card flex shrink-0 items-center gap-2 rounded-2xl p-2 pl-4"
            onSubmit={(e) => {
              e.preventDefault();
              setDraft('');
            }}
          >
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Ask about this region..."
              className="min-w-0 flex-1 bg-transparent text-sm text-white placeholder:text-gray-400 focus:outline-none font-sans"
            />
            <button
              type="submit"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full gradient-cta text-white shadow-md shadow-primary/30 transition-transform hover:scale-105 cursor-pointer"
              aria-label="Send message"
            >
              <Send size={15} />
            </button>
          </form>
        </div>

        {/* AI Findings */}
        <aside className="glass-card flex w-64 shrink-0 flex-col rounded-2xl p-4">
          <h3 className="text-sm font-semibold text-white">AI Findings</h3>
          <div className="mt-4 space-y-3">
            {findings.map((f) => (
              <div
                key={f.label}
                className="flex items-center gap-3 rounded-xl border border-glass-border bg-white/[0.03] p-3"
              >
                <span
                  className={`flex h-9 w-9 items-center justify-center rounded-full ring-1 ${f.tone}`}
                >
                  <f.icon size={16} />
                </span>
                <div>
                  <p className="text-sm font-medium text-white">{f.label}</p>
                  <p className="text-xs font-medium text-emerald-400">Detected</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-5">
            <p className="mb-2 text-sm font-semibold text-white">
              Fusion Result
            </p>
            <img
              src="/images/assets/change-map.jpg"
              alt="Optical and SAR fusion result preview"
              className="w-full rounded-xl border border-glass-border object-cover"
            />
          </div>
        </aside>

        {/* Execution Trace */}
        <aside className="glass-card flex w-72 shrink-0 flex-col rounded-2xl p-4">
          <h3 className="text-sm font-semibold text-white">
            Execution Trace
          </h3>
          <ol className="mt-4 space-y-4 font-mono text-xs">
            {trace.map((step, i) => (
              <li key={step.label} className="relative flex gap-3 pl-1">
                {i < trace.length - 1 && (
                  <span className="absolute left-[9px] top-5 h-[calc(100%-8px)] w-px bg-glass-border" />
                )}
                <CheckCircle2
                  size={17}
                  className="relative z-10 shrink-0 text-emerald-400"
                />
                <div className="flex flex-1 items-start justify-between gap-2">
                  <span className="text-xs leading-snug text-gray-200">
                    {step.label}
                  </span>
                  <span className="shrink-0 text-[11px] tabular-nums text-gray-400">
                    {step.time}
                  </span>
                </div>
              </li>
            ))}
          </ol>
          <div className="mt-auto pt-4">
            <button
              type="button"
              onClick={onOpenReport}
              className="flex w-full items-center justify-center gap-2 rounded-xl gradient-cta py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition-transform hover:scale-[1.02] cursor-pointer"
            >
              <Download size={15} />
              Download PDF
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
