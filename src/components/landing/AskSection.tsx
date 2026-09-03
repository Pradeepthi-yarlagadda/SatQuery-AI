'use client';

import React from 'react';
import { Bot, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export function AskSection() {
  return (
    <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6">
      <div className="rounded-3xl border border-cyan-400/30 bg-[#050814]/90 p-8 sm:p-12 shadow-2xl backdrop-blur-xl text-center space-y-6">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-400/40 bg-cyan-400/10 text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.3)]">
          <Bot size={24} />
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold text-white font-sans">
          TALK TO EARTH WITH ORBIT IQ
        </h2>
        <p className="max-w-2xl mx-auto text-sm sm:text-base text-gray-300">
          Query petabytes of satellite imagery with plain natural language. Orbit IQ Core identifies intent, validates sensors, and routes to specialist capabilities.
        </p>
        <div>
          <Link
            href="/chat"
            className="inline-flex items-center gap-2 rounded-full gradient-cta px-7 py-3 text-sm font-semibold text-white shadow-xl hover:brightness-110 transition-all"
          >
            <span>Start Dialogue</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}

export default AskSection;
