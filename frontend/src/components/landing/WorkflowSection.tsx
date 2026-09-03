import React from 'react';
import { UploadCloud, MessageSquareCode, Cpu, Binary, Compass, ArrowRight } from 'lucide-react';

export default function WorkflowSection() {
  const steps = [
    {
      num: '01',
      title: 'UPLOAD',
      subtitle: 'Ingest Satellite Data',
      desc: 'Drop optical, multispectral, or SAR GeoTIFF files. OrbitIQ verifies CRS, GSD resolution, and co-registration.',
      icon: UploadCloud,
      color: 'text-cyan-400',
      border: 'border-cyan-500/30',
      bg: 'bg-cyan-500/10',
    },
    {
      num: '02',
      title: 'ASK',
      subtitle: 'Natural Language Query',
      desc: 'Ask freely in natural language: "Has built-up area increased?", "Highlight the water body", or "Faceted flood analysis".',
      icon: MessageSquareCode,
      color: 'text-blue-400',
      border: 'border-blue-500/30',
      bg: 'bg-blue-500/10',
    },
    {
      num: '03',
      title: 'UNDERSTAND',
      subtitle: 'Agentic Task Routing',
      desc: 'The OrbitIQ Core agent classifies intent, verifies input compatibility gates, and selects the specialist remote-sensing model.',
      icon: Cpu,
      color: 'text-purple-400',
      border: 'border-purple-500/30',
      bg: 'bg-purple-500/10',
    },
    {
      num: '04',
      title: 'ANALYZE',
      subtitle: 'Specialist Execution',
      desc: 'Run fine-tuned remote sensing architectures (Change-VQA, RS-Grounding-VLM, Optical-SAR Cross-Modal Fusion).',
      icon: Binary,
      color: 'text-emerald-400',
      border: 'border-emerald-500/30',
      bg: 'bg-emerald-500/10',
    },
    {
      num: '05',
      title: 'DISCOVER',
      subtitle: 'Evidence & Full Trace',
      desc: 'Inspect grounded polygon masks, split-swipe temporal maps, quantitative metrics, and auditable timestamped traces.',
      icon: Compass,
      color: 'text-orange-400',
      border: 'border-orange-500/30',
      bg: 'bg-orange-500/10',
    },
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative">
      <div className="text-center space-y-3 mb-14">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-space-900 border border-white/10 text-xs font-mono text-gray-300">
          <span className="text-orbit-cyan font-bold">WORKFLOW PIPELINE</span>
          <span>•</span>
          <span>HOW ORBITIQ OPERATES</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-white font-sans tracking-tight">
          FROM QUESTION TO EARTH INTELLIGENCE
        </h2>
        <p className="text-sm sm:text-base text-gray-400 max-w-2xl mx-auto font-sans">
          Earth is full of answers. Satellite imagery captures them. OrbitIQ helps you ask the right questions with autonomous model selection.
        </p>
      </div>

      {/* 5-Step Process Pipeline */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          return (
            <div
              key={idx}
              className="relative p-5 rounded-xl bg-space-900/60 border border-white/10 hover:border-cyan-500/40 transition-all duration-300 group flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xl font-bold text-gray-400 group-hover:text-orbit-cyan transition-colors">
                    {step.num}
                  </span>
                  <div className={`w-9 h-9 rounded-lg ${step.bg} ${step.border} border flex items-center justify-center ${step.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                </div>

                <div>
                  <h3 className="font-mono text-sm font-bold text-white tracking-wide">{step.title}</h3>
                  <div className="text-[11px] font-mono text-cyan-400 mb-2">{step.subtitle}</div>
                  <p className="text-xs text-gray-400 leading-relaxed font-sans">{step.desc}</p>
                </div>
              </div>

              {idx < steps.length - 1 && (
                <div className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 z-20 text-gray-400">
                  <ArrowRight className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
