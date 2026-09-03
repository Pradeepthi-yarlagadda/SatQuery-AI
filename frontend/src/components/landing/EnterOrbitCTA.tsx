'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Compass, Satellite } from 'lucide-react';

export default function EnterOrbitCTA() {
  return (
    <section className="py-24 sm:py-36 px-6 sm:px-12 lg:px-20 max-w-7xl mx-auto w-full text-center relative overflow-hidden">
      
      {/* Deep Space Glowing Aura */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-cyan-500/10 blur-[140px] rounded-full pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto space-y-8 p-10 sm:p-16 rounded-3xl bg-gradient-to-b from-[#08122c] via-[#050b1d] to-[#02050f] border border-cyan-500/30 shadow-[0_0_40px_rgba(0,240,255,0.15)]">
        
        <div className="space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-xs font-mono text-cyan-300 uppercase tracking-widest">
            <span>GET STARTED WITH ORBIT IQ</span>
          </div>

          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white font-sans tracking-tight uppercase leading-tight">
            THE FUTURE OF EARTH OBSERVATION<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400">
              IS CONVERSATIONAL.
            </span>
          </h2>

          <p className="max-w-2xl mx-auto text-sm sm:text-base text-gray-300 font-sans leading-relaxed">
            Upload your GeoTIFF observations. Ask what you want to discover. Inspect grounded visual evidence and deterministic traces.
          </p>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/workspace"
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 text-slate-950 font-sans font-bold text-sm hover:brightness-110 transition-all shadow-[0_0_25px_rgba(0,240,255,0.4)] flex items-center justify-center space-x-2"
          >
            <Compass className="w-4 h-4" />
            <span>ENTER ORBIT NOW</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            href="/new-analysis"
            className="w-full sm:w-auto px-6 py-4 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/15 hover:border-cyan-400/50 text-white font-sans text-xs font-semibold transition-all flex items-center justify-center space-x-2"
          >
            <Satellite className="w-4 h-4 text-cyan-400" />
            <span>Ingest Satellite Data</span>
          </Link>
        </div>

      </div>

    </section>
  );
}
