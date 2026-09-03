'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import { DEMO_ANALYSIS_SCENARIOS } from '@/data/demoResults';
import { ReportService } from '@/services/reportService';
import {
  FileText,
  Printer,
  Download,
  ArrowLeft,
  ShieldCheck,
  Calendar,
  Layers,
  Sparkles,
  Cpu,
} from 'lucide-react';

function ReportContent() {
  const searchParams = useSearchParams();
  const analysisId = searchParams.get('analysisId');
  const scenarioKey = searchParams.get('scenario') || 'temporal-expansion';

  // Find scenario result by ID or key
  const targetResult =
    Object.values(DEMO_ANALYSIS_SCENARIOS).find((r) => r.id === analysisId) ||
    DEMO_ANALYSIS_SCENARIOS[scenarioKey] ||
    DEMO_ANALYSIS_SCENARIOS['temporal-expansion'];

  const report = ReportService.generateReport(targetResult);

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-sans">
      
      {/* Top Action Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-glass-border pb-4 print:hidden">
        <Link
          href="/workspace"
          className="flex items-center gap-2 rounded-xl border border-glass-border bg-[#050814]/90 px-4 py-2 text-xs font-mono font-bold text-cyan-400 hover:bg-cyan-400/20 transition-all cursor-pointer"
        >
          <ArrowLeft size={14} />
          <span>← Back to Workspace</span>
        </Link>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handlePrint}
            className="flex items-center gap-2 rounded-xl border border-glass-border bg-white/[0.04] px-4 py-2 text-xs font-mono text-gray-200 hover:bg-white/[0.08] transition-all cursor-pointer"
          >
            <Printer size={14} />
            <span>Print Report</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="flex items-center gap-2 rounded-xl gradient-cta px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-primary/25 hover:brightness-110 transition-all cursor-pointer"
          >
            <Download size={14} />
            <span>Export PDF</span>
          </button>
        </div>
      </div>

      {/* Main Document Paper Container */}
      <div className="rounded-3xl border border-glass-border bg-[#050814]/95 p-8 sm:p-12 shadow-2xl backdrop-blur-xl space-y-8 print:bg-white print:text-black print:border-none print:shadow-none">
        
        {/* Document Header */}
        <div className="border-b border-glass-border pb-6 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">
              <Cpu size={14} />
              <span>Orbit IQ Core • Mission Intelligence Document</span>
            </div>
            <span className="text-xs font-mono text-gray-400">
              REF: {report.id}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-white print:text-black">
            {report.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-gray-400 pt-1">
            <div className="flex items-center gap-1.5">
              <Calendar size={13} className="text-cyan-400" />
              <span>Generated: {new Date(report.generatedAt).toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Sparkles size={13} className="text-purple-400" />
              <span>Specialist Capability: {report.specialistUsed}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck size={13} className="text-emerald-400" />
              <span>Confidence: {(report.overallConfidence * 100).toFixed(1)}%</span>
            </div>
          </div>
        </div>

        {/* Report Sections */}
        {report.sections.map((section) => (
          <div key={section.id} className="space-y-3">
            <h3 className="text-base font-bold text-cyan-300 print:text-blue-900 border-b border-white/[0.06] pb-1 font-mono">
              {section.title}
            </h3>

            <div className="text-xs sm:text-sm text-gray-200 leading-relaxed print:text-gray-900 whitespace-pre-line font-sans">
              {section.content}
            </div>

            {/* Section Metrics Data Points */}
            {section.dataPoints && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2">
                {Object.entries(section.dataPoints).map(([k, v]) => (
                  <div
                    key={k}
                    className="rounded-xl border border-glass-border bg-white/[0.02] p-3 text-xs font-mono"
                  >
                    <div className="text-[10px] text-gray-400 uppercase truncate">{k}</div>
                    <div className="text-xs font-bold text-cyan-300 print:text-blue-800 truncate mt-0.5">
                      {v}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Section Image Attachment */}
            {section.imageUrl && (
              <div className="aspect-[16/9] w-full overflow-hidden rounded-2xl border border-glass-border bg-black mt-3">
                <img
                  src={section.imageUrl}
                  alt={section.title}
                  className="h-full w-full object-cover object-center"
                />
              </div>
            )}
          </div>
        ))}

        {/* Verification Sign-Off Footer */}
        <div className="border-t border-glass-border pt-6 flex flex-wrap items-center justify-between text-[11px] font-mono text-gray-500">
          <div>
            Authored by: <span className="text-gray-300 font-semibold">{report.author}</span>
          </div>
          <div>
            Analytical Integrity: <span className="text-emerald-400 font-semibold">VERIFIED</span>
          </div>
        </div>

      </div>

    </div>
  );
}

export default function ReportPage() {
  return (
    <div className="min-h-screen bg-space text-foreground font-sans">
      <Navbar />
      <div className="pt-20">
        <Suspense
          fallback={
            <div className="flex h-64 items-center justify-center font-mono text-xs text-cyan-400">
              SYNTHESIZING REPORT DOCUMENT...
            </div>
          }
        >
          <ReportContent />
        </Suspense>
      </div>
    </div>
  );
}
