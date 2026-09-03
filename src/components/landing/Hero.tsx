'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export function Hero({ onExplore }: { onExplore?: () => void }) {
  return (
    <div className="relative z-10 max-w-3xl pt-24 sm:pt-32">
      <div className="inline-flex items-center gap-2 rounded-full border border-glass-border bg-glass px-4 py-1.5 backdrop-blur-md">
        <span className="h-1.5 w-1.5 rounded-full bg-nebula animate-pulse" />
        <span className="text-xs font-semibold tracking-widest text-foreground/90 uppercase font-mono">
          • AI FOR EARTH INTELLIGENCE
        </span>
      </div>

      <h1 className="mt-6 text-6xl font-bold tracking-tight text-foreground sm:text-7xl lg:text-8xl">
        Orbit <span className="text-gradient">IQ</span>
      </h1>

      <h2 className="mt-2 text-xl font-semibold tracking-[0.2em] text-nebula sm:text-2xl font-mono">
        TALK TO EARTH.
      </h2>

      <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
        An interactive vision-language assistant for multimodal remote sensing image analysis through natural language queries.
      </p>

      <div className="mt-8 flex flex-wrap items-center gap-4">
        {onExplore ? (
          <button
            type="button"
            onClick={onExplore}
            className="group inline-flex items-center justify-center gap-2 rounded-full gradient-cta px-7 py-3.5 text-base font-semibold text-primary-foreground shadow-xl shadow-primary/25 transition-all hover:shadow-primary/40 hover:-translate-y-0.5 cursor-pointer"
          >
            <span>Explore Orbit IQ</span>
            <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
          </button>
        ) : (
          <Link
            href="/workspace"
            className="group inline-flex items-center justify-center gap-2 rounded-full gradient-cta px-7 py-3.5 text-base font-semibold text-primary-foreground shadow-xl shadow-primary/25 transition-all hover:shadow-primary/40 hover:-translate-y-0.5"
          >
            <span>Explore Orbit IQ</span>
            <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
          </Link>
        )}
      </div>
    </div>
  );
}

export default Hero;
