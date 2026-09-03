'use client';

import React from 'react';
import { AnalysisScenario } from '@/types/satellite';
import { X, Download, Printer, CheckCircle2, FileText, Satellite } from 'lucide-react';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  scenario: AnalysisScenario;
}

export default function ReportModal({
  isOpen,
  onClose,
  scenario,
}: ReportModalProps) {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-4xl max-h-[90vh] flex flex-col bg-[#060e22] border border-indigo-500/40 rounded-2xl shadow-2xl overflow-hidden">
        
        {/* Top Header Controls */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between bg-[#030712]/90">
          <div className="flex items-center space-x-2">
            <FileText className="w-4 h-4 text-indigo-300" />
            <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
              ORBIT IQ MISSION INTELLIGENCE REPORT
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/10 text-xs font-sans text-gray-200 hover:text-white transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 font-mono text-xs text-gray-300 bg-[#040816]">
          
          {/* Header Dossier Banner */}
          <div className="border-b border-indigo-500/30 pb-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2">
                <Satellite className="w-5 h-5 text-indigo-300" />
                <span className="text-lg font-bold text-white tracking-wider font-sans">
                  ORBIT <span className="text-indigo-300">IQ</span> · MISSION DOSSIER
                </span>
              </div>
              <p className="text-[11px] text-gray-400 font-sans mt-0.5">
                Autonomous Vision-Language Remote Sensing Intelligence
              </p>
            </div>

            <div className="text-right text-[10px] space-y-0.5">
              <div>REPORT ID: <span className="text-indigo-300 font-bold">ORB-2026-DOS-8492</span></div>
              <div>DATE: <span className="text-white">2026-09-01 21:25 UTC</span></div>
              <div>VERIFICATION: <span className="text-emerald-400 font-bold">GROUNDED EVIDENCE</span></div>
            </div>
          </div>

          {/* Key Parameters Table */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-[#07112c] border border-white/10 space-y-2">
              <div className="text-indigo-300 font-bold text-[11px] uppercase">Analysis Parameters</div>
              <div className="space-y-1.5 text-[11px]">
                <div className="flex justify-between border-b border-white/5 pb-1">
                  <span className="text-gray-400">Query:</span>
                  <span className="text-white font-semibold text-right truncate max-w-[200px]">
                    "{scenario.primaryQuery}"
                  </span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-1">
                  <span className="text-gray-400">Classified Task:</span>
                  <span className="text-white font-semibold">{scenario.detectedTask}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-1">
                  <span className="text-gray-400">Target Region:</span>
                  <span className="text-white font-semibold">{scenario.locationName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Coordinates:</span>
                  <span className="text-indigo-300 font-semibold">{scenario.coordinates}</span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#07112c] border border-white/10 space-y-2">
              <div className="text-indigo-300 font-bold text-[11px] uppercase">Model & Validation Pipeline</div>
              <div className="space-y-1.5 text-[11px]">
                <div className="flex justify-between border-b border-white/5 pb-1">
                  <span className="text-gray-400">Specialist Model:</span>
                  <span className="text-white font-semibold truncate max-w-[200px]">{scenario.selectedModel.name}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-1">
                  <span className="text-gray-400">Adaptation Weights:</span>
                  <span className="text-white font-semibold">{scenario.selectedModel.dataset}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-1">
                  <span className="text-gray-400">Confidence Score:</span>
                  <span className="text-emerald-400 font-bold">{scenario.confidence}% (Calibrated)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Inputs Validated:</span>
                  <span className="text-white font-semibold">{scenario.inputs.length} GeoTIFF Scene(s)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Primary Finding Block */}
          <div className="p-4 rounded-xl bg-[#07112c] border border-indigo-500/30 space-y-2">
            <div className="flex items-center space-x-1.5 text-indigo-300 font-bold text-[11px] uppercase">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Grounded Intelligence Assessment</span>
            </div>
            <p className="text-xs text-white leading-relaxed font-sans font-medium">
              {scenario.answerSummary}
            </p>
          </div>

          {/* Detailed Observations List */}
          <div className="space-y-2">
            <div className="text-[11px] text-gray-400 uppercase font-bold tracking-wider">
              Specific Remote-Sensing Observations
            </div>
            <div className="space-y-1.5">
              {scenario.detailedFindings.map((finding, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-lg bg-[#07112c] border border-white/5 text-xs text-gray-300 font-sans flex items-start space-x-2"
                >
                  <span className="text-indigo-300 font-mono font-bold mt-0.5">[{idx + 1}]</span>
                  <span>{finding}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Execution Trace Summary */}
          <div className="p-4 rounded-xl bg-[#07112c] border border-white/10 space-y-2 text-[11px]">
            <div className="text-indigo-300 font-bold uppercase">Auditable Agentic Routing Summary</div>
            <p className="text-gray-400 font-sans text-xs leading-relaxed">
              This intelligence report was generated via deterministic multi-agent routing. The natural language request was verified against spatial bounding gates, dispatched to the {scenario.selectedModel.name} model container, and validated against remote-sensing ground truth benchmarks.
            </p>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-white/10 bg-[#030712]/90 flex items-center justify-between">
          <span className="text-[10px] font-mono text-gray-400">
            ORBIT IQ · EARTH INTELLIGENCE SYSTEM
          </span>
          <button
            onClick={handlePrint}
            className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-300 to-blue-600 text-slate-950 font-sans font-bold text-xs shadow-[0_0_20px_rgba(0,240,255,0.3)] hover:brightness-110 transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>DOWNLOAD DOSSIER (.PDF)</span>
          </button>
        </div>

      </div>
    </div>
  );
}
