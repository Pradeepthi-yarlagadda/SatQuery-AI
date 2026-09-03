'use client';

import React from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Image as ImageIcon,
  Clock,
  ScanEye,
  Sparkles,
  MousePointer2,
} from 'lucide-react';

const featureCards = [
  {
    icon: ImageIcon,
    title: 'Single Image',
    description: 'Understand any scene',
    scenarioId: 'grounding-water',
  },
  {
    icon: Clock,
    title: 'Temporal Analysis',
    description: 'Detect changes over time',
    scenarioId: 'temporal-expansion',
  },
  {
    icon: ScanEye,
    title: 'Optical + SAR',
    description: 'Multi-sensor intelligence',
    scenarioId: 'optical-sar-fusion',
  },
  {
    icon: Sparkles,
    title: 'AI-Powered',
    description: 'Agentic analysis & insights',
    scenarioId: 'vqa-landcover',
  },
];

export default function HeroSection() {
  const scrollToFeatures = () => {
    const el = document.getElementById('signals');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative flex min-h-screen flex-col justify-center overflow-hidden pt-24 bg-[#050814]">
      {/* Background Satellite & Earth Imagery */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/assets/hero-satellite.jpg"
          alt="Satellite orbiting Earth at night"
          className="h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#050814]/80 via-[#050814]/40 to-[#050814]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(99,102,241,0.15),_transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(139,92,246,0.12),_transparent_50%)]" />
      </div>

      {/* Hero Typography & CTA */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-12 mb-auto">
        <div className="max-w-3xl">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-glass-border bg-glass px-4 py-1.5 backdrop-blur-md">
            <span className="h-1.5 w-1.5 rounded-full bg-nebula" />
            <span className="text-xs font-semibold tracking-widest text-white/90 uppercase font-mono">
              AI FOR EARTH INTELLIGENCE
            </span>
          </div>

          {/* Main Title: Orbit IQ */}
          <h1 className="mt-6 text-6xl font-bold tracking-tight text-white sm:text-7xl lg:text-8xl font-sans">
            Orbit <span className="text-gradient">IQ</span>
          </h1>

          {/* Subtitle: TALK TO EARTH. */}
          <h2 className="mt-2 text-xl font-semibold tracking-[0.2em] text-nebula sm:text-2xl font-mono">
            TALK TO EARTH.
          </h2>

          {/* Paragraph */}
          <p className="mt-6 max-w-xl text-base leading-relaxed text-gray-300 sm:text-lg font-sans">
            An interactive vision-language assistant for multimodal remote
            sensing image analysis through natural language queries.
          </p>

          {/* Explore Button */}
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              href="/workspace"
              className="group inline-flex items-center justify-center gap-2 rounded-full gradient-cta px-7 py-3.5 text-base font-semibold text-white shadow-xl shadow-primary/25 transition-all hover:shadow-primary/40 hover:-translate-y-0.5 font-sans"
            >
              Explore Orbit IQ
              <ArrowRight
                size={18}
                className="transition-transform group-hover:translate-x-0.5"
              />
            </Link>
          </div>

        </div>
      </div>

      {/* Feature Cards Grid (4 Cards) */}
      <div id="features" className="relative z-10 mt-auto w-full px-4 pb-12 pt-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {featureCards.map((card) => (
            <Link
              key={card.title}
              href={`/workspace?scenario=${card.scenarioId}`}
              className="group glass-card hero-glow rounded-2xl p-5 transition-all hover:border-slate-line/40 hover:bg-white/[0.06] block cursor-pointer"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-glass-border bg-white/[0.04] text-nebula group-hover:bg-nebula/10 transition-colors">
                  <card.icon size={20} strokeWidth={1.8} />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white group-hover:text-cyan-300 transition-colors">
                    {card.title}
                  </h3>
                  <p className="mt-0.5 text-sm text-gray-400">
                    {card.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Scroll Indicator */}
        <button
          onClick={scrollToFeatures}
          className="mt-10 mx-auto flex flex-col items-center justify-center gap-2 text-xs font-medium tracking-widest text-gray-400 hover:text-white uppercase transition-colors cursor-pointer"
        >
          <span>Scroll to explore</span>
          <MousePointer2 size={16} className="animate-bounce text-nebula" />
        </button>
      </div>
    </section>
  );
}
