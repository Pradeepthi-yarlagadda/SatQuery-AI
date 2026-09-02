'use client';

import React, { useEffect, useRef, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Satellite, ShieldCheck } from 'lucide-react';
import { WorkspaceSidebar } from '@/components/workspace/WorkspaceSidebar';
import { MapCanvas } from '@/components/workspace/MapCanvas';
import { QueryBar } from '@/components/workspace/QueryBar';
import { AnalyticsPanel } from '@/components/workspace/AnalyticsPanel';
import { TemporalView } from '@/components/workspace/TemporalView';
import { SarView } from '@/components/workspace/SarView';
import ReportModal from '@/components/analysis/ReportModal';
import { MOCK_SCENARIOS } from '@/data/mockScenarios';

const views = ['Map View', 'Split View', 'Change Map', '3D View'] as const;

function WorkspaceContent() {
  const searchParams = useSearchParams();
  const scenarioParam = searchParams.get('scenario');
  const queryParam = searchParams.get('query');

  const [view, setView] = useState<(typeof views)[number]>('Map View');
  const [navActive, setNavActive] = useState('New Analysis');
  const [query, setQuery] = useState(
    queryParam || 'Has the built-up area increased? Show me where.'
  );
  const [loading, setLoading] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (scenarioParam === 'temporal-expansion') {
      setNavActive('Temporal Pair');
      setView('Split View');
    } else if (scenarioParam === 'optical-sar-fusion') {
      setNavActive('Optical + SAR');
    } else if (scenarioParam === 'grounding-water') {
      setNavActive('Single Image');
      setView('Map View');
    }
  }, [scenarioParam]);

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  const runAnalysis = (value: string) => {
    setQuery(value);
    setLoading(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setLoading(false), 1600);
  };

  const handleNavSelect = (label: string) => {
    setNavActive(label);
    if (label === 'Temporal Pair') setView('Split View');
    else if (view === 'Split View') setView('Map View');
  };

  const exitToMap = () => {
    setView('Map View');
    setNavActive('New Analysis');
  };

  const isTemporal = view === 'Split View' || navActive === 'Temporal Pair';
  const isSar = navActive === 'Optical + SAR';

  const currentScenario =
    MOCK_SCENARIOS[scenarioParam || 'temporal-expansion'] ||
    MOCK_SCENARIOS['temporal-expansion'];

  return (
    <div className="flex h-screen flex-col bg-[#050814] text-white select-none">
      {/* Workspace Header */}
      <header className="flex items-center justify-between border-b border-glass-border px-5 py-3 bg-[#050814]/90 backdrop-blur-md">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-full orbit-ring bg-glass">
            <Satellite size={18} className="text-nebula" />
          </div>
          <span className="text-lg font-semibold text-white font-sans">
            Orbit <span className="text-gradient">IQ</span>
          </span>
        </Link>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-2 text-xs text-gray-400 font-mono">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            System Online
          </span>
          <span className="flex h-8 w-8 items-center justify-center rounded-full border border-glass-border bg-white/[0.05] text-xs font-semibold text-white font-mono">
            OQ
          </span>
        </div>
      </header>

      {/* Main Workspace Workspace Layout */}
      <div className="flex min-h-0 flex-1 gap-3 p-3 overflow-hidden">
        {isSar ? (
          <>
            <WorkspaceSidebar active={navActive} onSelect={handleNavSelect} />
            <SarView onExit={exitToMap} onOpenReport={() => setIsReportOpen(true)} />
          </>
        ) : isTemporal ? (
          <TemporalView onExit={exitToMap} onOpenReport={() => setIsReportOpen(true)} />
        ) : (
          <>
            <WorkspaceSidebar active={navActive} onSelect={handleNavSelect} />

            <main className="flex min-w-0 flex-1 flex-col">
              <div className="glass-card flex min-h-0 flex-1 flex-col rounded-2xl p-3">
                <div className="mb-3 flex gap-1.5">
                  {views.map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setView(v)}
                      className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors cursor-pointer ${
                        view === v
                          ? 'gradient-cta text-white shadow-lg shadow-primary/20'
                          : 'text-gray-400 hover:bg-white/[0.06] hover:text-white'
                      }`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
                <MapCanvas />
              </div>

              <QueryBar
                query={query}
                onQueryChange={setQuery}
                onAnalyze={runAnalysis}
                loading={loading}
              />
            </main>

            <AnalyticsPanel
              loading={loading}
              onOpenReport={() => setIsReportOpen(true)}
            />
          </>
        )}
      </div>

      {/* Mission Dossier Modal */}
      {isReportOpen && (
        <ReportModal
          isOpen={isReportOpen}
          onClose={() => setIsReportOpen(false)}
          scenario={currentScenario}
        />
      )}
    </div>
  );
}

export default function WorkspacePage() {
  return (
    <Suspense fallback={<div className="h-screen w-screen bg-[#050814] flex items-center justify-center text-gray-400 font-mono">Loading Orbit IQ Workspace...</div>}>
      <WorkspaceContent />
    </Suspense>
  );
}
