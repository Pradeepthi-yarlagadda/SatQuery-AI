'use client';

import React from 'react';
import { Cpu, Calendar, Sparkles, ShieldCheck } from 'lucide-react';
import { AnalysisReport } from '@/types/report';

export function ReportHeader({ report }: { report: AnalysisReport }) {
  return (
    <div className="border-b border-glass-border pb-6 space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">
          <Cpu size={14} />
          <span>Orbit IQ Core • Mission Intelligence Document</span>
        </div>
        <span className="text-xs font-mono text-gray-400">REF: {report.id}</span>
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
  );
}

export default ReportHeader;
