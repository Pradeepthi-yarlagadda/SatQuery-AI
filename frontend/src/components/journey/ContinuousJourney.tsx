'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import SpaceCanvas from './SpaceCanvas';
import {
  ArrowRight,
  ChevronDown,
  Eye,
  Radio,
  Layers,
  Clock,
  Sparkles,
  CheckCircle2,
  Cpu,
  Binary,
  Split,
  Compass,
  Terminal,
} from 'lucide-react';

export default function ContinuousJourney() {
  const router = useRouter();
  const [scrollProgress, setScrollProgress] = useState(0);

  // Scene 04 Typed Query state
  const [queryText, setQueryText] = useState('Where did urban expansion occur between 2022 and 2026?');
  const [isTypingComplete, setIsTypingComplete] = useState(false);

  // Scene 02 Signal selection
  const [activeSignal, setActiveSignal] = useState(0);

  // Scene 09 Split slider position
  const [evidenceSlider, setEvidenceSlider] = useState(50);

  // Track scroll position for continuous parallax
  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        setScrollProgress(Math.min(1, Math.max(0, window.scrollY / totalScroll)));
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const signals = [
    {
      id: 'optical',
      title: 'OPTICAL',
      subtitle: 'Visible & Near-Infrared Spectrum (RGB / NIR)',
      tag: 'SPECTRAL CONTEXT',
      desc: 'Measures reflected solar radiance across visible and near-infrared wavelengths. Essential for discerning vegetation vitality, agricultural health, urban boundaries, and surface color signatures.',
      image: '/images/scenarios/bangalore_2022.jpg',
      scenarioId: 'vqa-landcover',
    },
    {
      id: 'sar',
      title: 'SAR RADAR',
      subtitle: 'Active Microwave Radar (C-Band VV/VH)',
      tag: 'ALL-WEATHER RADAR',
      desc: 'Emits active microwave pulses to record dielectric surface roughness and structural backscatter. Pierces 100% of dense clouds and nighttime darkness to map flood extent and double-bounce buildings.',
      image: '/images/scenarios/sar_real.jpg',
      scenarioId: 'optical-sar-fusion',
    },
    {
      id: 'multispectral',
      title: 'MULTISPECTRAL',
      subtitle: '12 Discrete Spectral Bands (SWIR / Red-Edge)',
      tag: 'CHEMICAL & MOISTURE',
      desc: 'Captures narrow electromagnetic wavelengths invisible to the human eye. Differentiates soil moisture, active chlorophyll content, water absorption, and mineral composition.',
      image: '/images/scenarios/water_grounded.jpg',
      scenarioId: 'grounding-water',
    },
    {
      id: 'temporal',
      title: 'TIME',
      subtitle: 'Bi-Temporal Co-Registered Observations',
      tag: 'PLANETARY CHANGE',
      desc: 'Aligns multi-year satellite acquisitions to the exact same geographic sub-pixel coordinates. Tracks urban expansion, deforestation rates, and natural disaster evolution over years.',
      image: '/images/scenarios/bangalore_split_real.jpg',
      scenarioId: 'temporal-expansion',
    },
  ];

  const handleRunQuery = (e: React.FormEvent) => {
    e.preventDefault();
    if (queryText.trim()) {
      router.push(`/workspace?query=${encodeURIComponent(queryText.trim())}&scenario=temporal-expansion`);
    } else {
      router.push('/workspace');
    }
  };

  const scrollToNext = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="relative w-full bg-[#030712] text-slate-100 overflow-x-hidden selection:bg-cyan-400 selection:text-black">
      
      {/* 1. PERSISTENT CONTINUOUS COSMIC CANVAS */}
      <SpaceCanvas scrollProgress={scrollProgress} />

      {/* 2. THE 10-SCENE CONTINUOUS VISUAL JOURNEY */}
      <div className="relative z-10 w-full flex flex-col">

        {/* ========================================================= */}
        {/* SCENE 01 — ORBIT                                         */}
        {/* ========================================================= */}
        <section
          id="scene-01"
          className="min-h-screen w-full flex flex-col justify-between pt-32 sm:pt-40 pb-12 px-6 sm:px-12 lg:px-24"
        >
          {/* Main Hero Header */}
          <div className="max-w-4xl space-y-6 my-auto">
            <div className="inline-flex items-center space-x-2.5 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/10 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#00f0ff]" />
              <span className="text-xs font-mono tracking-widest text-cyan-300 uppercase font-semibold">
                ORBIT IQ · EARTH INTELLIGENCE SYSTEM
              </span>
            </div>

            <div className="space-y-2">
              <div className="text-sm font-mono tracking-[0.3em] text-cyan-400 uppercase font-bold">
                ORBIT IQ
              </div>
              <h1 className="text-6xl sm:text-8xl lg:text-9xl font-black tracking-tighter text-white font-sans uppercase leading-[0.88]">
                TALK TO<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-200 to-cyan-400 drop-shadow-[0_0_45px_rgba(0,240,255,0.4)]">
                  EARTH.
                </span>
              </h1>
            </div>

            <p className="text-base sm:text-xl text-gray-300 font-sans max-w-xl leading-relaxed font-normal pt-2">
              An interactive vision-language assistant for multimodal remote-sensing image analysis through natural-language queries.
            </p>

            <div className="pt-4 flex flex-wrap items-center gap-4">
              <Link
                href="/workspace"
                className="group flex items-center space-x-3 px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 hover:brightness-110 text-slate-950 font-bold text-sm sm:text-base font-sans tracking-wide transition-all shadow-[0_0_25px_rgba(0,240,255,0.4)]"
              >
                <span>ENTER ORBIT</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Bottom Scroll Cue */}
          <button
            onClick={() => scrollToNext('scene-02')}
            className="flex items-center space-x-2 text-xs font-mono text-gray-400 hover:text-cyan-400 transition-colors cursor-pointer group py-2"
          >
            <ChevronDown className="w-4 h-4 text-cyan-400 group-hover:translate-y-1 transition-transform" />
            <span className="tracking-widest uppercase">SCROLL TO EXPLORE JOURNEY</span>
          </button>
        </section>

        {/* ========================================================= */}
        {/* SCENE 02 — CONTINUE THE SAME WORLD (MULTIPLE SIGNALS)    */}
        {/* ========================================================= */}
        <section
          id="scene-02"
          className="min-h-screen w-full flex flex-col justify-center py-28 px-6 sm:px-12 lg:px-24"
        >
          <div className="max-w-7xl mx-auto w-full space-y-12">
            
            <div className="max-w-3xl space-y-4">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-xs font-mono text-cyan-300 uppercase tracking-widest">
                <span>02 · MODALITY UNIFICATION</span>
              </div>
              <h2 className="text-4xl sm:text-7xl font-black text-white font-sans tracking-tight uppercase leading-none">
                ONE QUESTION.<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400">
                  MULTIPLE SIGNALS.
                </span>
              </h2>
              <p className="text-base sm:text-lg text-gray-300 font-sans leading-relaxed">
                Earth cannot be understood through a single sensor. Orbit IQ harmonizes optical radiance, microwave radar backscatter, multispectral bands, and temporal observations into a singular intelligence fabric.
              </p>
            </div>

            {/* Large Visual Composition */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              
              {/* Left Selector List */}
              <div className="lg:col-span-5 flex flex-col justify-between space-y-3">
                {signals.map((sig, idx) => {
                  const isSelected = idx === activeSignal;
                  return (
                    <button
                      key={sig.id}
                      onClick={() => setActiveSignal(idx)}
                      className={`p-5 rounded-2xl text-left transition-all duration-300 border flex flex-col space-y-2 cursor-pointer ${
                        isSelected
                          ? 'bg-[#081330] border-cyan-400/80 shadow-[0_0_25px_rgba(0,240,255,0.2)]'
                          : 'bg-[#040816]/60 border-white/5 hover:border-white/20 hover:bg-[#071026]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <span className={`text-xs font-mono font-bold ${isSelected ? 'text-cyan-400' : 'text-gray-400'}`}>
                            0{idx + 1}
                          </span>
                          <h3 className="text-lg font-bold text-white font-sans tracking-wide">
                            {sig.title}
                          </h3>
                        </div>
                        <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded ${
                          isSelected ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/40' : 'text-gray-400'
                        }`}>
                          {sig.tag}
                        </span>
                      </div>
                      <p className="text-xs text-gray-300 font-sans line-clamp-2 leading-relaxed">
                        {sig.subtitle}
                      </p>
                    </button>
                  );
                })}
              </div>

              {/* Right Large Sensor Showcase Visual */}
              <div className="lg:col-span-7 rounded-3xl bg-[#060e22] border border-cyan-500/30 p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden shadow-2xl">
                <div className="space-y-3">
                  <span className="text-xs font-mono text-cyan-400 font-semibold tracking-widest uppercase">
                    ACTIVE SIGNAL: {signals[activeSignal].title}
                  </span>
                  <h4 className="text-xl sm:text-2xl font-bold text-white font-sans">
                    {signals[activeSignal].subtitle}
                  </h4>
                  <p className="text-xs sm:text-sm text-gray-300 font-sans leading-relaxed">
                    {signals[activeSignal].desc}
                  </p>
                </div>

                <div className="my-6 rounded-2xl overflow-hidden border border-white/15 h-64 sm:h-72 bg-black relative">
                  <img
                    src={signals[activeSignal].image}
                    alt={signals[activeSignal].title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-3 left-3 px-3 py-1 rounded-lg bg-black/80 border border-white/20 text-[10px] font-mono text-cyan-300 backdrop-blur-md">
                    SENSOR CAPTURE: {signals[activeSignal].title} · 10.0m GSD
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-white/10">
                  <span className="text-xs font-mono text-gray-400">Co-registered Spectral Raster</span>
                  <Link
                    href={`/workspace?scenario=${signals[activeSignal].scenarioId}`}
                    className="inline-flex items-center space-x-1.5 text-xs font-sans text-cyan-400 font-bold hover:underline"
                  >
                    <span>Inspect Modality in Mission Control</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

            </div>

          </div>
        </section>

        {/* ========================================================= */}
        {/* SCENE 03 — EARTH BECOMES DATA                             */}
        {/* ========================================================= */}
        <section
          id="scene-03"
          className="min-h-screen w-full flex flex-col justify-center py-28 px-6 sm:px-12 lg:px-24 border-t border-white/5"
        >
          <div className="max-w-7xl mx-auto w-full space-y-12">
            
            <div className="max-w-3xl space-y-3">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-xs font-mono text-cyan-300 uppercase tracking-widest">
                <span>03 · SPATIAL MATRIX TRANSITION</span>
              </div>
              <h2 className="text-4xl sm:text-7xl font-black text-white font-sans tracking-tight uppercase leading-none">
                EARTH BECOMES<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400">
                  DATA.
                </span>
              </h2>
              <p className="text-base sm:text-lg text-gray-300 font-sans leading-relaxed">
                Moving from viewing Earth to understanding Earth. Every pixel is decoded into multispectral reflectance, radar sigma backscatter, and spatial vectors.
              </p>
            </div>

            {/* Full-Width Visual Matrix */}
            <div className="rounded-3xl overflow-hidden border border-cyan-500/30 bg-[#060e22] p-4 sm:p-6 shadow-2xl relative">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                
                <div className="space-y-2">
                  <div className="rounded-xl overflow-hidden border border-white/10 h-52 sm:h-64 relative group">
                    <img src="/images/scenarios/bangalore_2022.jpg" alt="Optical" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded bg-black/80 text-[10px] font-mono text-white">
                      01 · OPTICAL RGB
                    </div>
                  </div>
                  <div className="text-xs font-mono text-gray-400 px-1">Visual context & land use</div>
                </div>

                <div className="space-y-2">
                  <div className="rounded-xl overflow-hidden border border-white/10 h-52 sm:h-64 relative group">
                    <img src="/images/scenarios/sar_real.jpg" alt="SAR" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded bg-black/80 text-[10px] font-mono text-cyan-300">
                      02 · SAR C-BAND
                    </div>
                  </div>
                  <div className="text-xs font-mono text-gray-400 px-1">Cloud-penetrating radar backscatter</div>
                </div>

                <div className="space-y-2">
                  <div className="rounded-xl overflow-hidden border border-white/10 h-52 sm:h-64 relative group">
                    <img src="/images/scenarios/change_map_real.jpg" alt="Change Map" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded bg-black/80 text-[10px] font-mono text-purple-300">
                      03 · SEMANTIC DIFFERENCE
                    </div>
                  </div>
                  <div className="text-xs font-mono text-gray-400 px-1">Calculated change tensor</div>
                </div>

              </div>
            </div>

          </div>
        </section>

        {/* ========================================================= */}
        {/* SCENE 04 — ASK                                            */}
        {/* ========================================================= */}
        <section
          id="scene-04"
          className="min-h-screen w-full flex flex-col justify-center py-28 px-6 sm:px-12 lg:px-24 border-t border-white/5"
        >
          <div className="max-w-4xl mx-auto w-full space-y-8 text-center">
            
            <div className="space-y-3">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-xs font-mono text-cyan-300 uppercase tracking-widest">
                <span>04 · NATURAL LANGUAGE INTERACTION</span>
              </div>
              <h2 className="text-5xl sm:text-7xl font-black text-white font-sans tracking-tight uppercase">
                ASK A QUESTION.
              </h2>
              <p className="text-base sm:text-lg text-gray-300 font-sans max-w-xl mx-auto">
                No complex query languages or GIS scripting. Talk directly to Earth in plain English.
              </p>
            </div>

            {/* Interactive Query Field */}
            <div className="max-w-2xl mx-auto w-full pt-4">
              <form onSubmit={handleRunQuery} className="relative group text-left">
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

          </div>
        </section>

        {/* ========================================================= */}
        {/* SCENE 05 — UNDERSTAND                                     */}
        {/* ========================================================= */}
        <section
          id="scene-05"
          className="min-h-screen w-full flex flex-col justify-center py-28 px-6 sm:px-12 lg:px-24 border-t border-white/5"
        >
          <div className="max-w-5xl mx-auto w-full space-y-8">
            
            <div className="space-y-3">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-xs font-mono text-emerald-400 uppercase tracking-widest">
                <span>05 · ORBIT IQ INTELLIGENCE LAYER</span>
              </div>
              <h2 className="text-4xl sm:text-6xl font-black text-white font-sans tracking-tight uppercase">
                UNDERSTANDING INTENT.
              </h2>
            </div>

            {/* Observable Execution Telemetry Box */}
            <div className="p-6 sm:p-8 rounded-3xl bg-[#060e22] border border-emerald-500/30 shadow-2xl space-y-5 font-mono text-xs">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center space-x-2 text-emerald-400 font-bold text-sm">
                  <Terminal className="w-4 h-4" />
                  <span>ORBIT IQ CORE · OBSERVABLE EXECUTION</span>
                </div>
                <span className="px-2.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/30 text-[10px]">
                  ✓ GATE PASSED
                </span>
              </div>

              <div className="space-y-3 text-gray-300">
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
                    <span className="text-white font-bold">INPUT VALIDATION:</span> 2 GeoTIFF Imagery Files · CRS: EPSG:4326 · GSD: 10.0m · Co-Registration Verified (RMSE &lt; 0.12px)
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* ========================================================= */}
        {/* SCENE 06 — SELECT                                         */}
        {/* ========================================================= */}
        <section
          id="scene-06"
          className="min-h-screen w-full flex flex-col justify-center py-28 px-6 sm:px-12 lg:px-24 border-t border-white/5"
        >
          <div className="max-w-5xl mx-auto w-full space-y-8">
            
            <div className="space-y-3">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-950/60 border border-purple-500/30 text-xs font-mono text-purple-300 uppercase tracking-widest">
                <span>06 · SPECIALIST ROUTING</span>
              </div>
              <h2 className="text-4xl sm:text-6xl font-black text-white font-sans tracking-tight uppercase">
                MODEL SELECTION.
              </h2>
            </div>

            {/* Specialist Model Container Card */}
            <div className="p-6 sm:p-8 rounded-3xl bg-[#060e22] border border-purple-500/30 shadow-2xl grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
              <div className="p-4 rounded-2xl bg-black/60 border border-white/5 space-y-1">
                <div className="text-gray-400 uppercase text-[10px]">Specialist Model</div>
                <div className="text-sm font-bold text-cyan-300">Change-VQA Container</div>
                <div className="text-[10px] text-gray-400 pt-1">Dual-Stream Siamese Transformer</div>
              </div>

              <div className="p-4 rounded-2xl bg-black/60 border border-white/5 space-y-1">
                <div className="text-gray-400 uppercase text-[10px]">Domain Adaptation</div>
                <div className="text-sm font-bold text-purple-300">CDVQA + BigEarthNet-MM</div>
                <div className="text-[10px] text-gray-400 pt-1">Fine-tuned LoRA weights</div>
              </div>

              <div className="p-4 rounded-2xl bg-black/60 border border-white/5 space-y-1">
                <div className="text-gray-400 uppercase text-[10px]">Input Configuration</div>
                <div className="text-sm font-bold text-emerald-300">Bi-Temporal Pair (2022 vs 2026)</div>
                <div className="text-[10px] text-gray-400 pt-1">Co-registered GeoTIFF rasters</div>
              </div>
            </div>

          </div>
        </section>

        {/* ========================================================= */}
        {/* SCENE 07 & 08 — ANALYZE & DISCOVER                        */}
        {/* ========================================================= */}
        <section
          id="scene-07"
          className="min-h-screen w-full flex flex-col justify-center py-28 px-6 sm:px-12 lg:px-24 border-t border-white/5"
        >
          <div className="max-w-7xl mx-auto w-full space-y-8">
            
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div className="space-y-3">
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-xs font-mono text-cyan-300 uppercase tracking-widest">
                  <span>07 & 08 · INFERENCE & DISCOVERY</span>
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

              {/* Telemetry overlay */}
              <div className="absolute bottom-4 left-4 px-4 py-2 rounded-xl bg-black/85 border border-white/15 text-xs font-mono text-gray-300 backdrop-blur-md space-y-0.5">
                <div className="text-white font-bold">BUILT-UP AREA INCREASED</div>
                <div className="text-[10px] text-cyan-300">Confidence: 89.4% · Ground Sampling Distance: 10.0m</div>
              </div>
            </div>

          </div>
        </section>

        {/* ========================================================= */}
        {/* SCENE 09 — EVIDENCE (LARGE SPLIT SLIDER)                  */}
        {/* ========================================================= */}
        <section
          id="scene-09"
          className="min-h-screen w-full flex flex-col justify-center py-28 px-6 sm:px-12 lg:px-24 border-t border-white/5"
        >
          <div className="max-w-7xl mx-auto w-full space-y-8">
            
            <div className="space-y-3">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-xs font-mono text-cyan-300 uppercase tracking-widest">
                <span>09 · GROUNDED VISUAL EVIDENCE</span>
              </div>
              <h2 className="text-4xl sm:text-6xl font-black text-white font-sans tracking-tight uppercase">
                SPATIAL PROOF.
              </h2>
              <p className="text-base sm:text-lg text-gray-300 font-sans max-w-2xl leading-relaxed">
                Drag the interactive slider to compare 2022 Baseline against 2026 Observation with pixel-accurate correspondence.
              </p>
            </div>

            {/* Interactive Evidence Comparison */}
            <div className="rounded-3xl overflow-hidden border border-white/15 bg-black relative h-96 sm:h-[500px] select-none shadow-2xl">
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

              {/* Invisible Range Drag Input */}
              <input
                type="range"
                min="10"
                max="90"
                value={evidenceSlider}
                onChange={(e) => setEvidenceSlider(Number(e.target.value))}
                className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-30"
              />

              {/* Central Divider Handle */}
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

          </div>
        </section>

        {/* ========================================================= */}
        {/* SCENE 10 — ENTER THE PRODUCT                              */}
        {/* ========================================================= */}
        <section
          id="scene-10"
          className="min-h-screen w-full flex flex-col justify-center py-28 px-6 sm:px-12 lg:px-24 border-t border-white/10 text-center"
        >
          <div className="max-w-4xl mx-auto w-full space-y-8 p-10 sm:p-16 rounded-3xl bg-gradient-to-b from-[#08122c] via-[#050b1d] to-[#02050f] border border-cyan-500/40 shadow-[0_0_50px_rgba(0,240,255,0.2)]">
            
            <div className="space-y-4">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-xs font-mono text-cyan-300 uppercase tracking-widest">
                <span>10 · COMPLETE PRODUCT TRANSITION</span>
              </div>

              <h2 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white font-sans tracking-tight uppercase leading-tight">
                ENTER THE<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400">
                  ORBIT IQ WORKSPACE.
                </span>
              </h2>

              <p className="max-w-2xl mx-auto text-sm sm:text-base text-gray-300 font-sans leading-relaxed">
                Upload your satellite observations. Ask natural-language questions. Inspect grounded spatial evidence with deterministic execution traces.
              </p>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/workspace"
                className="w-full sm:w-auto px-10 py-4 rounded-xl bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 text-slate-950 font-sans font-bold text-sm sm:text-base hover:brightness-110 transition-all shadow-[0_0_30px_rgba(0,240,255,0.4)] flex items-center justify-center space-x-2"
              >
                <Compass className="w-5 h-5" />
                <span>LAUNCH MISSION CONTROL NOW</span>
                <ArrowRight className="w-5 h-5" />
              </Link>

              <Link
                href="/new-analysis"
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/15 hover:border-cyan-400/50 text-white font-sans text-xs sm:text-sm font-semibold transition-all flex items-center justify-center space-x-2"
              >
                <span>Ingest GeoTIFF Data</span>
              </Link>
            </div>

          </div>
        </section>

      </div>

    </div>
  );
}
