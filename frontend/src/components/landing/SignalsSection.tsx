'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Eye, Radio, Layers, Clock, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function SignalsSection() {
  const [activeSignal, setActiveSignal] = useState(0);

  const signals = [
    {
      id: 'optical',
      title: 'OPTICAL',
      subtitle: 'Visible & Near-Infrared Spectrum (RGB / NIR)',
      tag: 'SPECTRAL CONTEXT',
      description:
        'Measures reflected solar radiance across visible and near-infrared wavelengths. Essential for discerning vegetation vitality, agricultural health, urban boundaries, and surface color signatures under clear daylight.',
      image: '/images/scenarios/bangalore_2022.jpg',
      features: [
        'True-color composite visualization',
        'Normalized Difference Vegetation Index (NDVI)',
        '10m spatial Ground Sampling Distance',
        'High-resolution land-cover semantic segmentation',
      ],
      scenarioId: 'vqa-landcover',
    },
    {
      id: 'sar',
      title: 'SAR RADAR',
      subtitle: 'Active Microwave Radar (C-Band VV/VH)',
      tag: 'ALL-WEATHER / DAY & NIGHT',
      description:
        'Emits active microwave pulses to record dielectric roughness and structural reflection. Pierces through 100% of dense monsoon clouds, smog, and nighttime darkness to map flood inundations and structural double-bounce.',
      image: '/images/scenarios/sar_real.jpg',
      features: [
        'Zero cloud attenuation or atmospheric blockage',
        'Specular reflection detection for floodwaters',
        '+12 dB double-bounce returns for urban structures',
        'Dual-polarization (VV/VH) backscatter calibration',
      ],
      scenarioId: 'optical-sar-fusion',
    },
    {
      id: 'multispectral',
      title: 'MULTISPECTRAL',
      subtitle: '12 Discrete Spectral Bands (SWIR / Red-Edge)',
      tag: 'CHEMICAL & MOISTURE',
      description:
        'Captures narrow electromagnetic wavelengths invisible to the human eye. Differentiates soil moisture, active chlorophyll content, water absorption, and mineral composition with mathematical rigor.',
      image: '/images/scenarios/water_grounded.jpg',
      features: [
        'Short-Wave Infrared (SWIR) moisture indexing',
        'Normalized Difference Water Index (NDWI)',
        'Red-Edge chlorophyll absorption bands',
        'Thermal & mineral classification matrices',
      ],
      scenarioId: 'grounding-water',
    },
    {
      id: 'temporal',
      title: 'TIME',
      subtitle: 'Bi-Temporal Co-Registered Observations',
      tag: 'PLANETARY CHANGE',
      description:
        'Aligns multi-year satellite acquisitions to the exact same geographic sub-pixel coordinates. Tracks urban expansion, deforestation rates, infrastructure developments, and natural disaster evolution over years.',
      image: '/images/scenarios/bangalore_split_real.jpg',
      features: [
        'Sub-pixel geometric co-registration (RMSE < 0.12px)',
        'Deep difference tensor extraction',
        'Quantitative growth and loss calculation',
        'Natural-language temporal question answering',
      ],
      scenarioId: 'temporal-expansion',
    },
  ];

  return (
    <section id="signals" className="py-24 sm:py-32 px-6 sm:px-12 lg:px-20 max-w-7xl mx-auto w-full">
      
      {/* Section Header */}
      <div className="max-w-3xl space-y-4 mb-16">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-xs font-mono text-cyan-300 uppercase tracking-widest">
          <span>MULTIMODAL SENSING UNIFICATION</span>
        </div>
        <h2 className="text-4xl sm:text-6xl font-black text-white font-sans tracking-tight uppercase">
          ONE QUESTION.<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400">
            MULTIPLE SIGNALS.
          </span>
        </h2>
        <p className="text-base sm:text-lg text-gray-300 font-sans leading-relaxed">
          Earth cannot be understood through a single sensor. Orbit IQ harmonizes optical radiance, radar backscatter, multispectral wavelengths, and temporal shifts into a single conversational model.
        </p>
      </div>

      {/* Signal Explorer: Left Selector Tabs + Right Large Visual Composition */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Left Column: 4 Signal Selectors (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-3">
          {signals.map((sig, idx) => {
            const isSelected = idx === activeSignal;
            return (
              <button
                key={sig.id}
                onClick={() => setActiveSignal(idx)}
                className={`p-5 rounded-2xl text-left transition-all duration-300 border flex flex-col space-y-2 cursor-pointer ${
                  isSelected
                    ? 'bg-[#081330] border-cyan-400/70 shadow-[0_0_25px_rgba(0,240,255,0.2)]'
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

        {/* Right Column: Large Dynamic Visual Presentation (7 Cols) */}
        <div className="lg:col-span-7 rounded-3xl bg-[#060e22] border border-cyan-500/30 p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden shadow-2xl">
          
          {/* Active Signal Details Header */}
          <div className="relative z-10 space-y-3">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <span className="text-xs font-mono text-cyan-400 font-semibold tracking-widest uppercase">
                  ACTIVE MODALITY: {signals[activeSignal].title}
                </span>
                <h4 className="text-xl sm:text-2xl font-bold text-white font-sans mt-0.5">
                  {signals[activeSignal].subtitle}
                </h4>
              </div>
            </div>

            <p className="text-sm text-gray-300 font-sans leading-relaxed">
              {signals[activeSignal].description}
            </p>
          </div>

          {/* Real Satellite Sensor Imagery Display */}
          <div className="relative z-10 my-6 rounded-2xl overflow-hidden border border-white/15 h-64 sm:h-72 bg-black/80 flex items-center justify-center group">
            <img
              src={signals[activeSignal].image}
              alt={signals[activeSignal].title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#060e22] via-transparent to-transparent opacity-60" />
            
            <div className="absolute bottom-3 left-3 px-3 py-1 rounded-lg bg-black/80 border border-white/20 text-[10px] font-mono text-cyan-300 backdrop-blur-md">
              SENSOR CAPTURE: {signals[activeSignal].title} · 10.0m RESOLUTION
            </div>
          </div>

          {/* Key Capabilities Checklist + CTA */}
          <div className="relative z-10 pt-4 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-sans text-gray-300">
              {signals[activeSignal].features.slice(0, 2).map((feat, fIdx) => (
                <div key={fIdx} className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span className="text-[11px]">{feat}</span>
                </div>
              ))}
            </div>

            <Link
              href={`/workspace?scenario=${signals[activeSignal].scenarioId}`}
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-cyan-400/15 hover:bg-cyan-400/25 border border-cyan-400/40 text-cyan-300 font-sans text-xs font-bold transition-all shrink-0 hover:shadow-[0_0_15px_rgba(0,240,255,0.3)]"
            >
              <span>Test in Mission Control</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

        </div>

      </div>

    </section>
  );
}
