'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MessageSquare, Cpu, Layers, Binary, Sparkles, CheckCircle2, Split, ArrowRight } from 'lucide-react';

export default function StoryWalkthrough() {
  const [activeStep, setActiveStep] = useState(0);
  const [sliderPos, setSliderPos] = useState(52);

  const steps = [
    {
      id: 'ask',
      num: '01',
      stage: 'ASK',
      title: 'Natural-Language Question',
      tagline: 'Conversation replaces complex GIS tooling',
      detail: 'The analyst queries in plain English without needing to configure remote sensing parameters: "Where did urban expansion occur between 2022 and 2026?"',
      icon: MessageSquare,
      badge: 'User Input',
      badgeColor: 'text-cyan-400 border-cyan-500/30 bg-cyan-950/60',
    },
    {
      id: 'understand',
      num: '02',
      stage: 'UNDERSTAND',
      title: 'Intent & Integrity Validation',
      tagline: 'Deterministic GeoTIFF validation gates',
      detail: 'Orbit IQ Core tokenizes intent and verifies input compatibility: 2 bi-temporal GeoTIFF scenes, EPSG:4326 CRS alignment, and sub-pixel co-registration (RMSE < 0.12px).',
      icon: Layers,
      badge: 'Task Routing',
      badgeColor: 'text-emerald-400 border-emerald-500/30 bg-emerald-950/60',
    },
    {
      id: 'select',
      num: '03',
      stage: 'SELECT',
      title: 'Specialist Model Dispatch',
      tagline: 'Autonomous model routing from registry',
      detail: 'Dispatches task to Change-VQA container (fine-tuned on CDVQA + BigEarthNet-MM), equipped with dual-stream Siamese Vision Transformers and Cross-Attention decoders.',
      icon: Cpu,
      badge: 'Model Selection',
      badgeColor: 'text-purple-400 border-purple-500/30 bg-purple-950/60',
    },
    {
      id: 'analyze',
      num: '04',
      stage: 'ANALYZE',
      title: 'Feature Extraction & Tensor Diff',
      tagline: 'Pixel-level spatial difference tensor',
      detail: 'Extracts deep visual token representations across 2022 and 2026 scenes, computing differential feature tensors while suppressing seasonal reflectance variance.',
      icon: Binary,
      badge: 'Inference Engine',
      badgeColor: 'text-amber-400 border-amber-500/30 bg-amber-950/60',
    },
    {
      id: 'discover',
      num: '05',
      stage: 'DISCOVER & EVIDENCE',
      title: 'Grounded Insight & Split Evidence',
      tagline: 'Auditable results with spatial proof',
      detail: 'Synthesizes quantitative answer: Built-up area expanded +28.4% (+14.6 km²) concentrated in the Eastern sector, accompanied by verifiable before/after split evidence.',
      icon: Sparkles,
      badge: 'Grounded Result',
      badgeColor: 'text-cyan-300 border-cyan-400/40 bg-cyan-950/80',
    },
  ];

  return (
    <section id="how-it-works" className="py-24 sm:py-32 px-6 sm:px-12 lg:px-20 max-w-7xl mx-auto w-full border-t border-white/10">
      
      {/* Section Header */}
      <div className="max-w-3xl space-y-4 mb-16">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-xs font-mono text-cyan-300 uppercase tracking-widest">
          <span>THE INTELLIGENCE PIPELINE</span>
        </div>
        <h2 className="text-4xl sm:text-6xl font-black text-white font-sans tracking-tight uppercase">
          HOW ORBIT IQ<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400">
            THINKS & DISCOVERS.
          </span>
        </h2>
        <p className="text-base sm:text-lg text-gray-300 font-sans leading-relaxed">
          From query tokenization to specialist model routing and spatial grounding. An observable, auditable workflow built for mission-critical geospatial decisions.
        </p>
      </div>

      {/* Step Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 mb-10">
        {steps.map((s, idx) => {
          const isSelected = idx === activeStep;
          return (
            <button
              key={s.id}
              onClick={() => setActiveStep(idx)}
              className={`p-3.5 rounded-2xl text-left border transition-all duration-300 flex flex-col justify-between space-y-2 cursor-pointer ${
                isSelected
                  ? 'bg-[#081536] border-cyan-400/80 shadow-[0_0_20px_rgba(0,240,255,0.25)]'
                  : 'bg-[#040816]/50 border-white/5 hover:border-white/20 hover:bg-[#07112c]'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-xs font-mono font-bold ${isSelected ? 'text-cyan-400' : 'text-gray-400'}`}>
                  {s.num}
                </span>
                <span className={`w-2 h-2 rounded-full ${isSelected ? 'bg-cyan-400 animate-ping' : 'bg-gray-400'}`} />
              </div>
              <div>
                <div className="text-xs font-bold text-white font-sans tracking-wider uppercase">{s.stage}</div>
                <div className="text-[10px] text-gray-400 font-sans truncate">{s.tagline}</div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Dynamic Main Stage Spotlight Card */}
      <div className="rounded-3xl bg-[#060e24] border border-cyan-500/30 p-6 sm:p-10 shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Left: Step Explanations (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-2">
            <span className={`inline-block text-[11px] font-mono px-3 py-1 rounded-full border ${steps[activeStep].badgeColor}`}>
              {steps[activeStep].badge}
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white font-sans">
              {steps[activeStep].title}
            </h3>
            <p className="text-xs font-mono text-cyan-400">
              {steps[activeStep].tagline}
            </p>
          </div>

          <p className="text-sm text-gray-300 font-sans leading-relaxed">
            {steps[activeStep].detail}
          </p>

          <div className="pt-4 border-t border-white/10 flex items-center space-x-3">
            <Link
              href="/workspace?scenario=temporal-expansion"
              className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-600 text-slate-950 font-sans font-bold text-xs hover:brightness-110 transition-all shadow-[0_0_20px_rgba(0,240,255,0.4)]"
            >
              <span>Launch Live Execution</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Right: Interactive Split-Slider Satellite Evidence Visualizer (7 Cols) */}
        <div className="lg:col-span-7 rounded-2xl overflow-hidden border border-white/15 bg-black relative h-72 sm:h-96 select-none">
          
          {/* Base 2026 Image */}
          <img
            src="/images/scenarios/bangalore_2026.jpg"
            alt="2026 After"
            className="absolute inset-0 w-full h-full object-cover"
          />

          {/* 2022 Clipped Before Image */}
          <div
            className="absolute inset-0 overflow-hidden border-r-2 border-cyan-400"
            style={{ width: `${sliderPos}%` }}
          >
            <img
              src="/images/scenarios/bangalore_2022.jpg"
              alt="2022 Before"
              className="absolute inset-0 w-full h-full object-cover max-w-none"
              style={{ width: '100%', minWidth: '600px' }}
            />
            <div className="absolute top-4 left-4 px-2.5 py-1 rounded bg-black/80 border border-white/20 text-[10px] font-mono text-white backdrop-blur-md">
              2022 · BEFORE
            </div>
          </div>

          {/* Top Right Tag */}
          <div className="absolute top-4 right-4 px-2.5 py-1 rounded bg-black/80 border border-cyan-500/40 text-[10px] font-mono text-cyan-300 backdrop-blur-md">
            2026 · AFTER (EXPANSION DETECTED)
          </div>

          {/* Interactive Drag Bar */}
          <input
            type="range"
            min="10"
            max="90"
            value={sliderPos}
            onChange={(e) => setSliderPos(Number(e.target.value))}
            className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-30"
          />

          {/* Central Slider Icon Handle */}
          <div
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-[#030712] border-2 border-cyan-400 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_#00f0ff] pointer-events-none z-20"
            style={{ left: `${sliderPos}%` }}
          >
            <Split className="w-4 h-4" />
          </div>

          {/* Bottom Telemetry Overlay */}
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between px-3 py-1.5 rounded-lg bg-black/80 border border-white/10 text-[10px] font-mono text-gray-300 backdrop-blur-md">
            <span>DRAG SLIDER TO INSPECT CHANGE</span>
            <span className="text-cyan-300 font-bold">BUILT-UP: +28.4%</span>
          </div>

        </div>

      </div>

    </section>
  );
}
