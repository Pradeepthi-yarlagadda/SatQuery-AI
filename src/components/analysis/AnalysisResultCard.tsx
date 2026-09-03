'use client';

import React from 'react';
import Link from 'next/link';
import { AnalysisResult } from '@/types/analysis';
import VisualEvidenceViewer from './VisualEvidenceViewer';
import OrbitIqCoreStatus from './OrbitIqCoreStatus';
import {
  Sparkles,
  FileText,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Layers,
  ArrowRight,
} from 'lucide-react';

interface AnalysisResultCardProps {
  result: AnalysisResult;
  onGenerateReport?: (result: AnalysisResult) => void;
}

export default function AnalysisResultCard({
  result,
  onGenerateReport,
}: AnalysisResultCardProps) {
  const confidencePercent = Math.round(result.confidence.overall * 100);

  return (
    <div className="space-y-6">
      
      {/* 1. Main Answer Card */}
      <div className="rounded-2xl border border-glass-border bg-[#050814]/90 p-6 shadow-2xl backdrop-blur-xl space-y-5">
        
        {/* Header Badges */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-glass-border pb-4">
          <div className="flex flex-wrap items-center gap-2">
            {/* Task Badge */}
            <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-500/10 border border-purple-500/30 px-3 py-1 text-xs font-mono font-semibold text-purple-300">
              <Layers size={13} />
              {result.taskDisplayName}
            </span>

            {/* Specialist Capability Badge */}
            <span className="inline-flex items-center gap-1.5 rounded-full bg-cyan-400/10 border border-cyan-400/30 px-3 py-1 text-xs font-mono font-semibold text-cyan-300">
              <Sparkles size={13} />
              Specialist: {result.specialistDisplayName}
            </span>
          </div>

          {/* Confidence Meter */}
          <div className="flex items-center gap-2 text-xs font-mono">
            <ShieldCheck size={16} className="text-emerald-400" />
            <span className="text-gray-400">Confidence:</span>
            <span className="font-bold text-white">{confidencePercent}%</span>
            <span className="rounded bg-emerald-500/20 px-1.5 py-0.5 text-[10px] text-emerald-300 font-bold">
              {result.confidence.level}
            </span>
          </div>
        </div>

        {/* User Query Echo */}
        <div className="text-xs font-mono text-gray-400">
          <span className="text-cyan-400 uppercase tracking-wider font-bold">Query: </span>
          <span className="text-gray-200">"{result.query}"</span>
        </div>

        {/* Core Answer */}
        <div className="rounded-xl border border-cyan-400/30 bg-cyan-400/[0.04] p-4 space-y-2">
          <div className="text-[10px] font-mono tracking-widest text-cyan-400 uppercase font-bold">
            ORBIT IQ CORE FINDING
          </div>
          <p className="text-base sm:text-lg font-medium text-white leading-relaxed font-sans">
            {result.answer}
          </p>
        </div>

        {/* Key Findings List */}
        {result.keyFindings && result.keyFindings.length > 0 && (
          <div className="space-y-2">
            <div className="text-xs font-mono text-gray-400 uppercase tracking-wider">
              Key Quantitative Findings
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              {result.keyFindings.map((finding, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2.5 rounded-xl border border-glass-border bg-white/[0.02] p-3 text-xs font-mono text-gray-300"
                >
                  <CheckCircle2 size={14} className="mt-0.5 shrink-0 text-cyan-400" />
                  <span>{finding}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-glass-border">
          <div className="text-[10px] font-mono text-gray-500">
            Execution Duration: {result.executionDurationMs}ms • Completed: {new Date(result.completedAt).toLocaleTimeString()}
          </div>

          <div className="flex items-center gap-3">
            <Link
              href={`/report?analysisId=${result.id}`}
              className="inline-flex items-center gap-2 rounded-xl gradient-cta px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-primary/20 hover:brightness-110 transition-all cursor-pointer"
            >
              <FileText size={14} />
              <span>Generate Mission Report</span>
            </Link>
          </div>
        </div>

      </div>

      {/* 2. Visual Evidence Display */}
      {result.evidence && <VisualEvidenceViewer evidence={result.evidence} />}

      {/* 3. Observable Execution Pipeline Summary */}
      {result.executionTrace && result.executionTrace.length > 0 && (
        <OrbitIqCoreStatus
          steps={result.executionTrace}
          specialistDisplayName={result.specialistDisplayName}
          taskDisplayName={result.taskDisplayName}
        />
      )}

    </div>
  );
}
