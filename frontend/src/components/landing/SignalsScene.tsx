'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

export default function SignalsScene() {
  const [activeSignal, setActiveSignal] = useState(0);

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

  return (
    <div id="signals" className="w-full space-y-28 py-24 sm:py-32 px-6 sm:px-12 lg:px-20 max-w-7xl mx-auto">
      
      {/* ========================================================= */}
      {/* SCENE 02 — ONE QUESTION. MULTIPLE SIGNALS.                */}
      {/* ========================================================= */}
      <section className="w-full space-y-12">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-xs font-mono text-cyan-300 uppercase tracking-widest">
            <span>SCENE 02 · MULTIMODAL UNIFICATION</span>
          </div>
          <h2 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white font-sans tracking-tight uppercase leading-none">
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
                ACTIVE SENSOR: {signals[activeSignal].title}
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
                <span>Inspect in Mission Control</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================= */}
      {/* SCENE 03 — EARTH BECOMES DATA                             */}
      {/* ========================================================= */}
      <section className="w-full space-y-12 border-t border-white/10 pt-24">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-xs font-mono text-cyan-300 uppercase tracking-widest">
            <span>SCENE 03 · SPATIAL MATRIX TRANSITION</span>
          </div>
          <h2 className="text-4xl sm:text-6xl font-black text-white font-sans tracking-tight uppercase leading-none">
            EARTH BECOMES<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400">
              DATA.
            </span>
          </h2>
          <p className="text-base sm:text-lg text-gray-300 font-sans leading-relaxed">
            Moving from viewing Earth to understanding Earth. Raw orbital pixels are mathematically decoded into spectral reflectance matrices, radar sigma-naught backscatter, and difference tensors.
          </p>
        </div>

        {/* Full-Width Visual Matrix */}
        <div className="rounded-3xl overflow-hidden border border-cyan-500/30 bg-[#060e22] p-4 sm:p-6 shadow-2xl relative">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            <div className="space-y-2">
              <div className="rounded-xl overflow-hidden border border-white/10 h-52 sm:h-64 relative group">
                <img src="/images/scenarios/bangalore_2022.jpg" alt="Optical" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded bg-black/80 text-[10px] font-mono text-white">
                  01 · OPTICAL RGB/NIR
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
      </section>

    </div>
  );
}
