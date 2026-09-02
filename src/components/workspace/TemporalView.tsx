'use client';

import React, { useCallback, useRef, useState } from 'react';
import {
  ArrowLeft,
  ChevronDown,
  Download,
  Plus,
  Send,
  User,
  Satellite,
  AlertTriangle,
} from 'lucide-react';

const years = ['2018', '2020', '2022', '2024', '2026'];

function YearSelect({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none rounded-lg border border-glass-border bg-white/[0.05] py-1.5 pl-3 pr-8 text-sm text-white outline-none transition-colors hover:bg-white/[0.08] focus:border-nebula/50"
      >
        {years.map((y) => (
          <option key={y} value={y} className="bg-[#050814] text-white">
            {y}
          </option>
        ))}
      </select>
      <ChevronDown
        size={14}
        className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400"
      />
    </div>
  );
}

function SplitComparison() {
  const [pos, setPos] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const updateFromClientX = useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPos(Math.min(96, Math.max(4, pct)));
  }, []);

  const onPointerDown = (e: React.PointerEvent) => {
    dragging.current = true;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    updateFromClientX(e.clientX);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (dragging.current) updateFromClientX(e.clientX);
  };
  const onPointerUp = () => {
    dragging.current = false;
  };

  return (
    <div
      ref={containerRef}
      className="relative min-h-0 flex-1 cursor-ew-resize select-none overflow-hidden rounded-xl border border-glass-border"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
    >
      {/* After (2026) — base layer */}
      <img
        src="/images/assets/temporal-2026.jpg"
        alt="Satellite imagery after, 2026"
        className="absolute inset-0 h-full w-full object-cover"
        draggable={false}
      />
      {/* Before (2022) — clipped layer */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ width: `${pos}%` }}
      >
        <img
          src="/images/assets/temporal-2022.jpg"
          alt="Satellite imagery before, 2022"
          className="absolute inset-0 h-full w-full max-w-none object-cover"
          style={{ width: containerRef.current?.clientWidth ?? '100%' }}
          draggable={false}
        />
      </div>

      {/* Divider */}
      <div
        className="absolute inset-y-0 z-10 w-0.5 bg-white/80 shadow-[0_0_12px_rgba(255,255,255,0.6)]"
        style={{ left: `${pos}%` }}
      >
        <div className="absolute left-1/2 top-1/2 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full gradient-cta text-white shadow-lg shadow-primary/40 ring-2 ring-white/40">
          <Plus size={16} />
        </div>
      </div>

      {/* Labels */}
      <span className="absolute bottom-3 left-3 rounded-md bg-black/60 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm font-mono">
        Before (2022)
      </span>
      <span className="absolute bottom-3 right-3 rounded-md bg-black/60 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm font-mono">
        After (2026)
      </span>
    </div>
  );
}

const legend = [
  { color: 'bg-red-500', label: 'Built-up (Increased)' },
  { color: 'bg-yellow-400', label: 'Vegetation (Decreased)' },
  { color: 'bg-zinc-500', label: 'No Change' },
];

function ChatColumn() {
  const [draft, setDraft] = useState('');
  return (
    <aside className="glass-card flex h-full w-[300px] shrink-0 flex-col rounded-2xl p-4">
      <div className="min-h-0 flex-1 space-y-5 overflow-y-auto pr-1">
        {/* User message */}
        <div>
          <div className="mb-2 flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-purple-500/20 text-purple-300 ring-1 ring-purple-400/40">
              <User size={14} />
            </span>
            <span className="text-sm font-medium text-white">You</span>
          </div>
          <div className="rounded-xl border border-glass-border bg-white/[0.04] p-3">
            <p className="text-sm text-gray-200">
              Compare these two images and tell me what changed.
            </p>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <div>
                <img
                  src="/images/assets/temporal-2022.jpg"
                  alt="2022 imagery thumbnail"
                  className="aspect-[4/3] w-full rounded-lg object-cover"
                />
                <p className="mt-1 text-center text-[11px] text-gray-400 font-mono">2022</p>
              </div>
              <div>
                <img
                  src="/images/assets/temporal-2026.jpg"
                  alt="2026 imagery thumbnail"
                  className="aspect-[4/3] w-full rounded-lg object-cover"
                />
                <p className="mt-1 text-center text-[11px] text-gray-400 font-mono">2026</p>
              </div>
            </div>
          </div>
        </div>

        {/* AI message */}
        <div>
          <div className="mb-2 flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-full orbit-ring bg-glass text-nebula">
              <Satellite size={14} />
            </span>
            <span className="text-sm font-medium text-white">Orbit IQ</span>
          </div>
          <div className="rounded-xl border border-glass-border bg-white/[0.04] p-3">
            <p className="text-xs font-medium text-gray-400">
              Here's what I found:
            </p>
            <p className="mt-1.5 text-sm leading-relaxed text-gray-200">
              The built-up area has increased in the eastern region. Vegetation
              has decreased, and new infrastructure (roads/buildings) is
              visible.
            </p>
            <div className="mt-3 flex items-center justify-between gap-2">
              <span className="flex items-center gap-1.5 rounded-md bg-red-500/15 px-2 py-1 text-[11px] font-medium text-red-400 ring-1 ring-red-500/30">
                <AlertTriangle size={12} />
                Change Detected
              </span>
              <span className="text-[11px] font-medium text-emerald-400 font-mono">
                Confidence: 87%
              </span>
            </div>
            <img
              src="/images/assets/change-map.jpg"
              alt="Detected change map preview"
              className="mt-3 w-full rounded-lg border border-glass-border object-cover"
            />
            <button
              type="button"
              className="mt-3 w-full rounded-lg border border-glass-border bg-white/[0.05] py-2 text-sm font-medium text-white transition-colors hover:bg-white/[0.1] cursor-pointer"
            >
              View Change Map
            </button>
          </div>
        </div>
      </div>

      {/* Input */}
      <form
        className="mt-3 flex items-center gap-2 rounded-xl border border-glass-border bg-white/[0.04] p-1.5 pl-3"
        onSubmit={(e) => {
          e.preventDefault();
          setDraft('');
        }}
      >
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Ask another question..."
          className="min-w-0 flex-1 bg-transparent text-sm text-white placeholder:text-gray-400 focus:outline-none font-sans"
        />
        <button
          type="submit"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg gradient-cta text-white shadow-md shadow-primary/30 transition-transform hover:scale-105 cursor-pointer"
          aria-label="Send message"
        >
          <Send size={14} />
        </button>
      </form>
    </aside>
  );
}

const summaryRows = [
  { label: 'Task', value: 'Change Analysis' },
  { label: 'Model', value: 'Change-VQA' },
  { label: 'Input', value: 'Bi-temporal (GeoTIFF)' },
  { label: 'Confidence', value: '87%' },
];

export function TemporalView({
  onExit,
  onOpenReport,
}: {
  onExit?: () => void;
  onOpenReport?: () => void;
}) {
  const [yearA, setYearA] = useState('2022');
  const [yearB, setYearB] = useState('2026');

  return (
    <div className="flex min-h-0 flex-1 gap-3">
      <ChatColumn />

      {/* Center */}
      <main className="flex min-w-0 flex-1 flex-col gap-3">
        <div className="glass-card flex items-center justify-between rounded-2xl px-4 py-2.5">
          <div className="flex items-center gap-3">
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
            <h2 className="text-sm font-semibold text-white">
              Temporal Analysis
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <YearSelect value={yearA} onChange={setYearA} />
            <YearSelect value={yearB} onChange={setYearB} />
          </div>
        </div>

        <div className="glass-card flex min-h-0 flex-1 flex-col rounded-2xl p-3">
          <SplitComparison />
        </div>

        <div className="glass-card flex h-44 shrink-0 gap-4 rounded-2xl p-3">
          <div className="min-w-0 flex-1">
            <p className="mb-2 text-sm font-semibold text-white">
              Change Map
            </p>
            <img
              src="/images/assets/change-map.jpg"
              alt="Change detection map with increased, decreased and no-change areas"
              className="h-[calc(100%-1.75rem)] w-full rounded-lg border border-glass-border object-cover"
            />
          </div>
          <div className="flex shrink-0 flex-col justify-center gap-2.5 pr-2">
            {legend.map((item) => (
              <span
                key={item.label}
                className="flex items-center gap-2 text-xs text-gray-400 font-mono"
              >
                <span className={`h-3 w-3 rounded-sm ${item.color}`} />
                {item.label}
              </span>
            ))}
          </div>
        </div>
      </main>

      {/* Right panel */}
      <aside className="glass-card flex h-full w-[300px] shrink-0 flex-col rounded-2xl p-4">
        <h3 className="text-sm font-semibold text-white">
          Analysis Summary
        </h3>
        <dl className="mt-4 space-y-3.5 font-mono text-xs">
          {summaryRows.map((row) => (
            <div
              key={row.label}
              className="flex items-center justify-between gap-3 text-sm"
            >
              <dt className="text-gray-400 font-sans">{row.label}</dt>
              <dd className="text-right font-medium text-white">
                {row.value}
              </dd>
            </div>
          ))}
        </dl>
        <div className="mt-auto pt-4">
          <button
            type="button"
            onClick={onOpenReport}
            className="flex w-full items-center justify-center gap-2 rounded-xl gradient-cta py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition-transform hover:scale-[1.02] cursor-pointer"
          >
            <Download size={15} />
            Download Report
          </button>
        </div>
      </aside>
    </div>
  );
}
