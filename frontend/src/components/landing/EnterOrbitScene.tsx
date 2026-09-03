'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Compass } from 'lucide-react';

export default function EnterOrbitScene() {
  return (
    <section className="min-h-[85vh] w-full flex flex-col justify-center py-24 px-6 sm:px-12 lg:px-20 max-w-7xl mx-auto text-center border-t border-white/10">
      <div className="max-w-4xl mx-auto w-full space-y-8 p-10 sm:p-16 rounded-3xl bg-gradient-to-b from-[#08122c] via-[#050b1d] to-[#02050f] border border-cyan-500/40 shadow-[0_0_50px_rgba(0,240,255,0.2)]">
        
        <div className="space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-xs font-mono text-cyan-300 uppercase tracking-widest">
            <span>SCENE 10 · MISSION CONTROL TRANSITION</span>
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
            <span>LAUNCH MISSION CONTROL</span>
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
  );
}
