'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, Terminal, Split } from 'lucide-react';

export default function PipelineStoryScene() {
  const router = useRouter();
  const [queryText, setQueryText] = useState('Where did urban expansion occur between 2022 and 2026?');
  const [evidenceSlider, setEvidenceSlider] = useState(50);

  const handleQuerySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (queryText.trim()) {
      router.push(`/workspace?query=${encodeURIComponent(queryText.trim())}&scenario=temporal-expansion`);
    } else {
      router.push('/workspace');
    }
  };

  return (
    <div id="pipeline" className="w-full space-y-32 py-24 sm:py-32 px-6 sm:px-12 lg:px-20 max-w-7xl mx-auto">
      
      {/* ========================================================= */}
      {/* SCENE 04 — ASK A QUESTION                                 */}
      {/* ========================================================= */}
      <section className="w-full space-y-8 text-center">
        <div className="max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-xs font-mono text-cyan-300 uppercase tracking-widest">
            <span>SCENE 04 · NATURAL LANGUAGE INTERACTION</span>
          </div>
          <h2 className="text-5xl sm:text-7xl font-black text-white font-sans tracking-tight uppercase">
            ASK A QUESTION.
          </h2>
          <p className="text-base sm:text-lg text-gray-300 font-sans max-w-xl mx-auto">
            No complex query languages or GIS scripting. Talk directly to Earth in plain English.
          </p>
        </div>

        {/* Interactive Query Input */}
        <div className="max-w-2xl mx-auto w-full pt-2">
          <form onSubmit={handleQuerySubmit} className="relative group text-left">
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 opacity-50 blur-md group-hover:opacity-80 transition duration-300" />
            
            <div className="relative flex items-center bg-[#071330] border border-cyan-400/80 rounded-2xl p-3 shadow-2xl backdrop-blur-xl">
              <input
                type="text"
                value={queryText}
                onChange={(e) => setQueryText(e.target.value)}
                className="w-full bg-transparent text-sm sm:text-base text-white placeholder-gray-400 focus:outline-none font-sans px-3 py-2"
              />
              <button
                type="submit"
                className="flex items-center space-x-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-600 hover:brightness-110 text-slate-950 font-sans font-bold text-xs sm:text-sm tracking-wide transition-all shadow-[0_0_20px_rgba(0,240,255,0.4)] shrink-0 cursor-pointer"
              >
                <span>DISPATCH</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* ========================================================= */}
      {/* SCENE 05 & 06 — UNDERSTAND & SELECT                       */}
      {/* ========================================================= */}
      <section className="w-full space-y-10 border-t border-white/10 pt-24">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-xs font-mono text-emerald-400 uppercase tracking-widest">
            <span>SCENE 05 & 06 · INTELLIGENCE & MODEL ROUTING</span>
          </div>
          <h2 className="text-4xl sm:text-6xl font-black text-white font-sans tracking-tight uppercase">
            ORBIT IQ CORE.
          </h2>
        </div>

        {/* Observable Execution Telemetry & Specialist Model Selection */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch font-mono text-xs">
          
          {/* Left: Observable Telemetry Steps (7 Cols) */}
          <div className="lg:col-span-7 p-6 sm:p-8 rounded-3xl bg-[#060e22] border border-emerald-500/30 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center space-x-2 text-emerald-400 font-bold text-sm">
                <Terminal className="w-4 h-4" />
                <span>OBSERVABLE EXECUTION TRACE</span>
              </div>
              <span className="px-2.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/30 text-[10px]">
                ✓ VERIFIED
              </span>
            </div>

            <div className="space-y-2.5 text-gray-300">
              <div className="flex items-start space-x-3 p-3 rounded-xl bg-black/50 border border-white/5">
                <span className="text-cyan-400 font-bold">[10:31:04.120]</span>
                <div>
                  <span className="text-white font-bold">QUERY RECEIVED:</span> "{queryText}"
                </div>
              </div>

              <div className="flex items-start space-x-3 p-3 rounded-xl bg-black/50 border border-white/5">
                <span className="text-emerald-400 font-bold">[10:31:04.168]</span>
                <div>
                  <span className="text-white font-bold">TASK IDENTIFIED:</span> Bi-Temporal Change-Based Visual Question Answering (Change-VQA)
                </div>
              </div>

              <div className="flex items-start space-x-3 p-3 rounded-xl bg-black/50 border border-white/5">
                <span className="text-purple-400 font-bold">[10:31:04.210]</span>
                <div>
                  <span className="text-white font-bold">INPUT VALIDATED:</span> 2 GeoTIFF Files · CRS: EPSG:4326 · GSD: 10.0m · Co-Registration Verified (RMSE &lt; 0.12px)
                </div>
              </div>
            </div>
          </div>

          {/* Right: Specialist Model Container (5 Cols) */}
          <div className="lg:col-span-5 p-6 sm:p-8 rounded-3xl bg-[#060e22] border border-purple-500/30 shadow-2xl flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="text-[10px] text-purple-400 uppercase tracking-wider font-bold">
                Specialist Model Selected
              </div>
              <div className="text-xl font-bold text-white font-sans">
                Change-VQA Container
              </div>
              <p className="text-xs text-gray-300 font-sans leading-relaxed">
                Siamese Vision Transformer with Cross-Attention decoders fine-tuned on CDVQA and BigEarthNet-MM.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-black/60 border border-white/5 text-[11px] space-y-1">
              <div className="flex justify-between">
                <span className="text-gray-400">Backbone:</span>
                <span className="text-cyan-300">Siamese ViT-L/14</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Input Mode:</span>
                <span className="text-emerald-300">Bi-Temporal GeoTIFF</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================= */}
      {/* SCENE 07 & 08 — ANALYZE & DISCOVER                        */}
      {/* ========================================================= */}
      <section className="w-full space-y-8 border-t border-white/10 pt-24">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-3">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-xs font-mono text-cyan-300 uppercase tracking-widest">
              <span>SCENE 07 & 08 · INFERENCE & DISCOVERY</span>
            </div>
            <h2 className="text-4xl sm:text-6xl font-black text-white font-sans tracking-tight uppercase">
              ANALYZING & DISCOVERING.
            </h2>
          </div>

          <div className="px-3.5 py-1 rounded-full bg-black/80 border border-white/10 text-xs font-mono text-gray-400">
            DEMO ANALYSIS · EAST BANGALORE CORRIDOR
          </div>
        </div>

        {/* Large Satellite Image with Dynamic Highlight Overlay */}
        <div className="rounded-3xl overflow-hidden border border-cyan-500/40 bg-black relative h-96 sm:h-[480px] shadow-2xl group">
          <img
            src="/images/scenarios/bangalore_2026.jpg"
            alt="Analyzed Satellite Scene"
            className="w-full h-full object-cover"
          />

          {/* Glowing Highlight on Detected Urban Expansion Region */}
          <div className="absolute top-[20%] right-[15%] w-[40%] h-[55%] rounded-2xl border-2 border-red-500 bg-red-500/25 shadow-[0_0_30px_rgba(239,68,68,0.5)] flex flex-col justify-between p-4 backdrop-blur-[1px]">
            <span className="px-2 py-0.5 rounded bg-black/80 text-[10px] font-mono font-bold text-red-400 border border-red-500/40 self-start">
              CHANGE DETECTED: BUILT-UP EXPANSION (+28.4%)
            </span>
            <span className="text-[10px] font-mono text-white/90">
              Primary Region: Eastern Sector (Grid E2–E5)
            </span>
          </div>

          <div className="absolute bottom-4 left-4 px-4 py-2 rounded-xl bg-black/85 border border-white/15 text-xs font-mono text-gray-300 backdrop-blur-md space-y-0.5">
            <div className="text-white font-bold">BUILT-UP AREA INCREASED</div>
            <div className="text-[10px] text-cyan-300">Confidence: 89.4% · Ground Sampling Distance: 10.0m</div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* SCENE 09 — EVIDENCE (LARGE SPLIT SLIDER)                  */}
      {/* ========================================================= */}
      <section className="w-full space-y-8 border-t border-white/10 pt-24">
        <div className="space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-xs font-mono text-cyan-300 uppercase tracking-widest">
            <span>SCENE 09 · GROUNDED VISUAL EVIDENCE</span>
          </div>
          <h2 className="text-4xl sm:text-6xl font-black text-white font-sans tracking-tight uppercase">
            SPATIAL PROOF.
          </h2>
          <p className="text-base sm:text-lg text-gray-300 font-sans max-w-2xl leading-relaxed">
            Drag the interactive slider to compare 2022 Baseline against 2026 Observation with pixel-accurate correspondence.
          </p>
        </div>

        {/* Large Interactive Comparison */}
        <div className="rounded-3xl overflow-hidden border border-white/15 bg-black relative h-96 sm:h-[520px] select-none shadow-2xl">
          <img
            src="/images/scenarios/bangalore_2026.jpg"
            alt="2026 Observation"
            className="absolute inset-0 w-full h-full object-cover"
          />

          <div
            className="absolute inset-0 overflow-hidden border-r-2 border-cyan-400"
            style={{ width: `${evidenceSlider}%` }}
          >
            <img
              src="/images/scenarios/bangalore_2022.jpg"
              alt="2022 Baseline"
              className="absolute inset-0 w-full h-full object-cover max-w-none"
              style={{ width: '100%', minWidth: '800px' }}
            />
            <div className="absolute top-4 left-4 px-3 py-1 rounded-lg bg-black/80 border border-white/20 text-xs font-mono text-white backdrop-blur-md">
              2022 · BEFORE
            </div>
          </div>

          <div className="absolute top-4 right-4 px-3 py-1 rounded-lg bg-black/80 border border-cyan-500/40 text-xs font-mono text-cyan-300 backdrop-blur-md">
            2026 · AFTER (EXPANSION)
          </div>

          <input
            type="range"
            min="10"
            max="90"
            value={evidenceSlider}
            onChange={(e) => setEvidenceSlider(Number(e.target.value))}
            className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-30"
          />

          <div
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-[#030712] border-2 border-cyan-400 flex items-center justify-center text-cyan-400 shadow-[0_0_20px_#00f0ff] pointer-events-none z-20"
            style={{ left: `${evidenceSlider}%` }}
          >
            <Split className="w-4 h-4" />
          </div>

          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between px-4 py-2 rounded-xl bg-black/80 border border-white/10 text-xs font-mono text-gray-300 backdrop-blur-md">
            <span>DRAG SLIDER TO INSPECT BI-TEMPORAL DIFFERENCE</span>
            <span className="text-cyan-300 font-bold">BUILT-UP: +28.4% · VEGETATION: -16.8%</span>
          </div>
        </div>
      </section>

    </div>
  );
}
