'use client';

import React, { useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';
import Link from 'next/link';
import {
  ArrowRight,
  Image as ImageIcon,
  Clock,
  ScanEye,
  Sparkles,
  MousePointer2,
} from 'lucide-react';
import type { EarthGlobeMapHandle } from '@/components/EarthGlobeMap';

// Dynamic SSR-safe MapLibre 3D Globe Map
const EarthGlobeMap = dynamic(
  () => import('@/components/EarthGlobeMap'),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full bg-[#02050e] flex items-center justify-center font-mono text-xs text-cyan-accent">
        INITIALIZING 3D SPHERICAL SATELLITE GLOBE...
      </div>
    ),
  }
);

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

export default function EarthDiveExperience() {
  const containerRef = useRef<HTMLDivElement>(null);
  const globeRef = useRef<EarthGlobeMapHandle>(null);
  const [isDived, setIsDived] = useState(false);

  // Framer Motion Scroll Progress for the 300vh Runway
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Track scroll position to auto-trigger the 3D camera dive
  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    if (latest >= 0.5 && !isDived) {
      setIsDived(true);
      globeRef.current?.diveToTarget();
    } else if (latest < 0.2 && isDived) {
      setIsDived(false);
      globeRef.current?.resetToSpace();
    }
  });

  // 1. Foreground UI Transforms (Progress 0.0 -> 0.45)
  const heroOpacity = useTransform(scrollYProgress, [0, 0.35, 0.48], [1, 0.3, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.45], [1, 0.9]);
  const heroY = useTransform(scrollYProgress, [0, 0.45], [0, -60]);

  // Cinematic Earth Dive Trigger
  const handleDiveClick = () => {
    if (typeof window !== 'undefined') {
      const targetY = window.innerHeight * 2.1;
      window.scrollTo({ top: targetY, behavior: 'smooth' });
    }
    setIsDived(true);
    globeRef.current?.diveToTarget();
  };

  return (
    <section ref={containerRef} className="relative h-[300vh] w-full bg-[#02050e]">
      
      {/* Sticky Viewport Frame */}
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        
        {/* ========================================================= */}
        {/* LAYER 1: FULL 3D SPHERICAL GLOBE MAP (MAPLIBRE GL JS)     */}
        {/* ========================================================= */}
        <div className="absolute inset-0 z-0 h-full w-full pointer-events-auto">
          <EarthGlobeMap ref={globeRef} isDived={isDived} onDivedChange={setIsDived} />
        </div>

        {/* ========================================================= */}
        {/* LAYER 2: FOREGROUND HERO TYPOGRAPHY & CARDS (FADES ON SCROLL) */}
        {/* ========================================================= */}
        <motion.div
          style={{
            opacity: heroOpacity,
            scale: heroScale,
            y: heroY,
          }}
          className={`relative z-20 flex h-full flex-col justify-between px-4 pt-24 pb-8 sm:px-6 lg:px-8 max-w-7xl mx-auto ${
            isDived ? 'pointer-events-none' : 'pointer-events-auto'
          }`}
        >
          
          {/* Main Hero Header */}
          <div className="max-w-3xl mt-10">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-glass-border bg-glass px-4 py-1.5 backdrop-blur-md">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-accent animate-pulse" />
              <span className="text-xs font-semibold tracking-widest text-white/90 uppercase font-mono">
                AI FOR EARTH INTELLIGENCE
              </span>
            </div>

            {/* Main Brand Title: Orbit IQ */}
            <h1 className="mt-6 text-6xl font-bold tracking-tight text-white sm:text-7xl lg:text-8xl font-sans">
              Orbit <span className="text-gradient">IQ</span>
            </h1>

            {/* Tagline: TALK TO EARTH. */}
            <h2 className="mt-2 text-xl font-semibold tracking-[0.2em] text-cyan-accent sm:text-2xl font-mono">
              TALK TO EARTH.
            </h2>

            {/* Description */}
            <p className="mt-6 max-w-xl text-base leading-relaxed text-gray-300 sm:text-lg font-sans">
              An interactive vision-language assistant for multimodal remote sensing image analysis through natural language queries.
            </p>

            {/* CTA Buttons */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={handleDiveClick}
                className="group inline-flex items-center justify-center gap-2 rounded-full gradient-cta px-7 py-3.5 text-base font-semibold text-white shadow-xl shadow-primary/25 transition-all hover:shadow-primary/40 hover:-translate-y-0.5 cursor-pointer font-sans"
              >
                <span>Dive to 3D Earth Globe</span>
                <ArrowRight
                  size={18}
                  className="transition-transform group-hover:translate-x-1"
                />
              </button>

              <Link
                href="/workspace"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-glass-border bg-white/[0.04] px-6 py-3.5 text-sm font-semibold text-white backdrop-blur-md transition-colors hover:bg-white/[0.08] hover:border-cyan-accent/40"
              >
                Mission Workspace
              </Link>
            </div>
          </div>

          {/* Bottom 4 Feature Cards */}
          <div className="w-full">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {featureCards.map((card) => (
                <Link
                  key={card.title}
                  href={`/workspace?scenario=${card.scenarioId}`}
                  className="group glass-card hero-glow rounded-2xl p-4 transition-all hover:border-slate-line/40 hover:bg-white/[0.06] block cursor-pointer"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-glass-border bg-white/[0.04] text-cyan-accent group-hover:bg-cyan-accent/10 transition-colors">
                      <card.icon size={18} strokeWidth={1.8} />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-white group-hover:text-cyan-300 transition-colors">
                        {card.title}
                      </h3>
                      <p className="mt-0.5 text-xs text-gray-400">
                        {card.description}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Clickable Scroll to Explore Cue */}
            <button
              type="button"
              onClick={handleDiveClick}
              className="mt-6 mx-auto flex flex-col items-center justify-center gap-1.5 text-xs font-medium tracking-widest text-gray-400 hover:text-white uppercase transition-colors cursor-pointer"
            >
              <span>SCROLL TO DIVE INTO 3D GLOBE</span>
              <MousePointer2 size={16} className="animate-bounce text-cyan-accent" />
            </button>
          </div>

        </motion.div>

        {/* Scroll Progress Bar at the top */}
        <motion.div
          style={{ scaleX: scrollYProgress }}
          className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-accent via-orbit to-purple-500 origin-left z-50 pointer-events-none"
        />

      </div>

    </section>
  );
}
