'use client';

import React from 'react';
import Link from 'next/link';
import { Layers, Clock, Radio, Cpu, ArrowUpRight, CheckCircle2 } from 'lucide-react';

export default function FeatureCards() {
  const cards = [
    {
      title: 'SINGLE IMAGE ANALYSIS',
      tag: 'SCENE & OBJECT LEVEL',
      desc: 'Understand individual satellite scenes, multi-class land cover dominance, and text-guided spatial grounding.',
      features: ['Remote-Sensing VQA (RSVQA)', 'Multi-Scale Scene Captioning', 'Text-Conditioned Grounding Masks'],
      scenarioId: 'vqa-landcover',
      icon: Layers,
      color: 'from-blue-500/20 via-cyan-500/10 to-transparent',
      accent: 'text-orbit-cyan',
      border: 'border-cyan-500/30',
    },
    {
      title: 'TEMPORAL ANALYSIS',
      tag: 'BI-TEMPORAL CHANGE DETECTION',
      desc: 'Compare paired observations across years. Quantify urban expansion, deforestation, and infrastructure development.',
      features: ['Change-VQA (CDVQA Adapted)', 'Interactive Split-Swipe Comparison', 'Semantic Difference Tensors'],
      scenarioId: 'temporal-expansion',
      icon: Clock,
      color: 'from-purple-500/20 via-indigo-500/10 to-transparent',
      accent: 'text-purple-400',
      border: 'border-purple-500/30',
    },
    {
      title: 'OPTICAL + SAR FUSION',
      tag: 'ALL-WEATHER MULTIMODAL',
      desc: 'Combine optical spectral reflectance with cloud-penetrating synthetic aperture radar (SAR) backscatter.',
      features: ['Sentinel-1 SAR C-Band VV/VH', 'Cloud Penetration & Flood Inundation', 'Structural Backscatter Verification'],
      scenarioId: 'optical-sar-fusion',
      icon: Radio,
      color: 'from-emerald-500/20 via-teal-500/10 to-transparent',
      accent: 'text-emerald-400',
      border: 'border-emerald-500/30',
    },
    {
      title: 'AI-GUIDED ORCHESTRATION',
      tag: 'AGENTIC TRAFFIC POLICE',
      desc: 'Autonomous intent classification and specialist model routing with strict GeoTIFF input validation gates.',
      features: ['Observable 7-Stage Execution Trace', 'Auditable GeoTIFF Verification', 'Automated Dossier Report Export'],
      scenarioId: 'grounding-water',
      icon: Cpu,
      color: 'from-orange-500/20 via-amber-500/10 to-transparent',
      accent: 'text-orbit-saffron',
      border: 'border-orange-500/30',
    },
  ];

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center space-y-3 mb-12">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-space-900 border border-white/10 text-xs font-mono text-gray-300">
          <span className="text-orbit-cyan font-bold">CORE CAPABILITIES</span>
          <span>•</span>
          <span>ISRO REMOTE SENSING SUITE</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-white font-sans tracking-tight">
          BUILT FOR COMPLEX SATELLITE INTELLIGENCE
        </h2>
        <p className="text-sm sm:text-base text-gray-400 max-w-2xl mx-auto font-sans">
          From single scenes to multi-temporal sensor combinations, OrbitIQ handles high-dimensional geospatial data effortlessly.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {cards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className="relative rounded-2xl bg-space-900/50 border border-white/10 hover:border-cyan-500/50 p-6 transition-all duration-300 group flex flex-col justify-between overflow-hidden shadow-glass"
            >
              {/* Background gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-40 group-hover:opacity-70 transition-opacity`} />
              
              <div className="relative z-10 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-xl bg-space-950 border ${card.border} flex items-center justify-center ${card.accent}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/20">
                        {card.tag}
                      </span>
                      <h3 className="text-base font-bold text-white font-mono mt-1">{card.title}</h3>
                    </div>
                  </div>

                  <Link
                    href={`/workspace?scenario=${card.scenarioId}`}
                    className="p-2 rounded-lg bg-space-950 border border-white/10 text-gray-400 hover:text-white hover:border-cyan-500/50 transition-colors"
                  >
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>
                </div>

                <p className="text-xs text-gray-300 font-sans leading-relaxed">{card.desc}</p>

                <div className="space-y-1.5 pt-2 border-t border-white/5">
                  {card.features.map((feat, fIdx) => (
                    <div key={fIdx} className="flex items-center space-x-2 text-[11px] font-mono text-gray-400">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative z-10 pt-5 mt-4 flex items-center justify-between border-t border-white/10">
                <span className="text-[11px] font-mono text-gray-400">Mission-tested Architecture</span>
                <Link
                  href={`/workspace?scenario=${card.scenarioId}`}
                  className="inline-flex items-center space-x-1 text-xs font-mono text-orbit-cyan hover:underline"
                >
                  <span>Launch Interactive Demo</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
