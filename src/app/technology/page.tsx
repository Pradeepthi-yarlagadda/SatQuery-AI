'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MODEL_REGISTRY_DATA } from '@/data/mockScenarios';
import { Cpu, Layers, Database, ShieldCheck, Binary, Terminal, Radio, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function TechnologyPage() {
  const [activeLayer, setActiveLayer] = useState(0);

  const layers = [
    {
      num: '01',
      title: 'Remote Sensing & Spectral Bands',
      tag: 'SPECTRAL FOUNDATION',
      desc: 'Unlike standard 3-channel RGB imagery, satellite sensors capture discrete electromagnetic wavelengths: Blue, Green, Red, Near-Infrared (NIR), and Short-Wave Infrared (SWIR). Each band reveals distinct biophysical signatures like chlorophyll absorption and water moisture.',
      keyConcepts: ['Ground Sampling Distance (GSD)', 'Spectral vs Spatial Resolution', 'Normalized Difference Indices (NDVI, NDWI)', 'Temporal Revisit Rate'],
    },
    {
      num: '02',
      title: 'Optical vs Synthetic Aperture Radar (SAR)',
      tag: 'CROSS-MODAL SENSORS',
      desc: 'Optical sensors capture reflected solar radiance, providing rich visual and spectral land-cover context. SAR sends active microwave radar pulses, penetrating through dense clouds and nighttime darkness while recording surface roughness, moisture, and double-bounce dihedral structures.',
      keyConcepts: ['C-Band VV/VH Polarization', 'Specular Reflection (Dark Water)', 'Double-Bounce Urban Returns (+12 dB)', 'All-Weather All-Day Inundation Mapping'],
    },
    {
      num: '03',
      title: 'GeoTIFF & Spatial Georeferencing',
      tag: 'GEOSPATIAL METADATA',
      desc: 'A GeoTIFF bundles raw spectral pixel matrices with precise cartographic coordinate reference systems (CRS, such as EPSG:4326 or UTM), spatial bounds, and ground resolution. Orbit IQ uses Rasterio pipelines to guarantee mathematical spatial integrity.',
      keyConcepts: ['Coordinate Reference System (CRS)', 'WGS 84 Projection Matrix', 'Affine Transform & Bounding BBoxes', 'Rasterio & GDAL Python Engines'],
    },
    {
      num: '04',
      title: 'Image Co-Registration & Alignment',
      tag: 'TEMPORAL INTEGRITY',
      desc: 'For bi-temporal change detection, two satellite observations must correspond to the exact same physical ground pixels. Even a 10-pixel shift causes false-positive change spikes. Orbit IQ validates geometric co-registration with RMSE < 0.15 pixel accuracy before inference.',
      keyConcepts: ['Sub-Pixel Reprojection', 'Resampling Matrices', 'Tie-Point Mutual Information', 'False Change Rejection'],
    },
    {
      num: '05',
      title: 'Remote-Sensing Vision-Language Models',
      tag: 'DOMAIN-ADAPTED AI',
      desc: 'Generic vision-language models fail when applied to satellite imagery because they lack remote-sensing token vocabularies. Orbit IQ adapts foundational VLMs using BigEarthNet-MM, RSVQA-HR, CDVQA, and Low-Rank Adaptation (LoRA) for high-precision geospatial reasoning.',
      keyConcepts: ['BigEarthNet-MM Multimodal Pretraining', 'RSVQA & VRSBench Fine-Tuning', 'LoRA / PEFT Parameter Efficiency', 'Dual-Stream Cross-Attention Decoders'],
    },
    {
      num: '06',
      title: 'Agentic Orchestration (Orbit IQ Core)',
      tag: 'AUTONOMOUS ROUTING',
      desc: 'The Orbit IQ Core agent acts as an intelligent traffic router. Instead of expecting the human analyst to know which deep model to choose, the agent parses query intent, verifies GeoTIFF integrity gates, invokes the specialist model container, and renders visual evidence.',
      keyConcepts: ['Natural Language Intent Parser', 'Deterministic GeoTIFF Validation Gates', 'Specialist Model Registry', 'Auditable Microsecond Execution Trace'],
    },
    {
      num: '07',
      title: 'Evidence-Grounded Intelligence & Dossiers',
      tag: 'MISSION INTEGRITY',
      desc: 'Every answer is anchored to spatial evidence (cyan grounding polygon masks, red/yellow bi-temporal change difference maps, and radar backscatter comparisons) rather than opaque hallucinations, exporting full intelligence dossiers.',
      keyConcepts: ['Vector Polygon Masks', 'Dynamic Split-Swipe Sliders', 'Calibrated Confidence Metric Gauges', 'Printable Analysis Dossiers'],
    },
  ];

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex-1 py-14 px-6 sm:px-12 lg:px-20 max-w-7xl mx-auto w-full space-y-12 bg-[#030712]">
      
      {/* Header */}
      <div className="text-center space-y-3 pt-6">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-xs font-mono text-cyan-300">
          <Cpu className="w-3.5 h-3.5" />
          <span>ORBIT IQ TECHNICAL BLUEPRINT</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-black text-white font-sans tracking-tight uppercase">
          THE INTELLIGENCE BEHIND ORBIT <span className="text-cyan-400">IQ</span>
        </h1>
        <p className="text-sm sm:text-base text-gray-400 font-sans max-w-2xl mx-auto">
          A comprehensive 7-layer architecture combining remote-sensing physics, multi-sensor spectral processing, and fine-tuned agentic vision-language transformers.
        </p>
      </div>

      {/* 7-Layer Architecture Interactive Explorer */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#060e22] border border-white/10 shadow-2xl space-y-6">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div>
            <h2 className="text-base font-mono font-bold text-white tracking-wide">
              7-LAYER REMOTE SENSING KNOWLEDGE STACK
            </h2>
            <p className="text-xs font-mono text-cyan-400">Click any layer to explore technical details</p>
          </div>
          <div className="text-xs font-mono text-gray-400">
            Selected Layer: <span className="text-white font-bold">{layers[activeLayer].num} / 07</span>
          </div>
        </div>

        {/* Layer Selector Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
          {layers.map((layer, idx) => {
            const isSelected = idx === activeLayer;
            return (
              <button
                key={idx}
                onClick={() => setActiveLayer(idx)}
                className={`p-3 rounded-xl text-left border transition-all space-y-1 cursor-pointer ${
                  isSelected
                    ? 'bg-[#081536] border-cyan-400/80 shadow-[0_0_15px_rgba(0,240,255,0.3)] text-white'
                    : 'bg-[#030712]/50 border-white/5 text-gray-400 hover:text-white hover:bg-[#07112c]'
                }`}
              >
                <div className="text-[10px] font-mono font-bold text-cyan-400">{layer.num}</div>
                <div className="text-xs font-bold font-mono truncate">{layer.title.split(' ')[0]}</div>
              </button>
            );
          })}
        </div>

        {/* Active Layer Deep Dive Card */}
        <div className="p-6 sm:p-8 rounded-2xl bg-[#030712]/80 border border-cyan-500/30 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center space-x-3">
              <span className="text-2xl font-mono font-bold text-cyan-400">{layers[activeLayer].num}</span>
              <div>
                <h3 className="text-xl font-bold text-white font-sans">{layers[activeLayer].title}</h3>
                <span className="text-[10px] font-mono uppercase text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-500/20">
                  {layers[activeLayer].tag}
                </span>
              </div>
            </div>
          </div>

          <p className="text-sm text-gray-300 font-sans leading-relaxed">
            {layers[activeLayer].desc}
          </p>

          <div className="pt-4 border-t border-white/10 space-y-2">
            <div className="text-xs font-mono text-gray-400 uppercase tracking-wider">
              Key Technical Concepts Implemented:
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {layers[activeLayer].keyConcepts.map((concept, cIdx) => (
                <div
                  key={cIdx}
                  className="p-3 rounded-lg bg-[#060e22] border border-white/5 flex items-center space-x-2 text-xs font-mono text-gray-300"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{concept}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Live Specialist Model Registry Table */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#060e22] border border-white/10 shadow-2xl space-y-6">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-mono font-bold text-white tracking-wide">
                SPECIALIST MODEL REGISTRY
              </h2>
              <p className="text-xs font-mono text-cyan-400">
                Domain-adapted AI backbones and benchmark performance
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>6/6 MODELS READY</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse font-mono text-xs">
            <thead>
              <tr className="border-b border-white/10 text-gray-400 text-[10px]">
                <th className="py-3 px-3">CAPABILITY</th>
                <th className="py-3 px-3">BENCHMARK / DATASET</th>
                <th className="py-3 px-3">ADAPTED ARCHITECTURE</th>
                <th className="py-3 px-3">ACCURACY / SCORE</th>
                <th className="py-3 px-3">LATENCY</th>
                <th className="py-3 px-3">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {MODEL_REGISTRY_DATA.map((model, idx) => (
                <tr key={idx} className="hover:bg-white/5 transition-colors">
                  <td className="py-3 px-3 font-bold text-white">
                    <div>{model.capability}</div>
                    <div className="text-[10px] text-gray-400 font-sans font-normal mt-0.5 line-clamp-1">
                      {model.description}
                    </div>
                  </td>
                  <td className="py-3 px-3 text-cyan-300">{model.benchmark}</td>
                  <td className="py-3 px-3 text-gray-300">{model.baseModel}</td>
                  <td className="py-3 px-3 text-emerald-400 font-bold">{model.accuracy}</td>
                  <td className="py-3 px-3 text-gray-400">{model.latency}</td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-500/30 text-[10px]">
                      ● Ready
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CTA Launch Banner */}
      <div className="text-center pt-4">
        <Link
          href="/workspace"
          className="inline-flex items-center space-x-2 px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 text-slate-950 font-sans font-bold text-sm shadow-[0_0_25px_rgba(0,240,255,0.4)] hover:brightness-110 transition-all"
        >
          <span>ENTER ORBIT & TEST PIPELINE</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

    </div>
  );
}
