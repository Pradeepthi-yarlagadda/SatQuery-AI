'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Footer() {
  const pathname = usePathname();

  // The home page is a self-contained, full-screen fixed layout (3D globe +
  // its own header) with no scrolling document — a footer underneath it has
  // no visible place to go and previously bled through the hero due to
  // `relative` positioning stacking ties.
  if (pathname === '/') return null;

  return (
    <footer className="border-t border-white/10 bg-[#02050e] text-gray-400 py-16 px-6 sm:px-12 lg:px-20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto space-y-12">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* Brand & Manifesto */}
          <div className="md:col-span-6 space-y-4">
            <div className="flex items-center space-x-2.5">
              <div className="w-6 h-6 rounded-full bg-cyan-400 shadow-[0_0_10px_#00f0ff]" />
              <span className="font-extrabold text-xl tracking-tight text-white font-sans">
                ORBIT <span className="text-cyan-400">IQ</span>
              </span>
            </div>
            <p className="text-xs sm:text-sm text-gray-400 max-w-md font-sans leading-relaxed">
              Talk to Earth. An interactive vision-language assistant for multimodal remote-sensing image analysis, bi-temporal change detection, and spatial grounding.
            </p>
          </div>

          {/* Platform Links */}
          <div className="md:col-span-3 space-y-3 font-sans text-xs">
            <div className="font-mono text-white text-[11px] font-bold uppercase tracking-wider">Platform</div>
            <ul className="space-y-2.5">
              <li><Link href="/" className="hover:text-cyan-300 transition-colors">Overview</Link></li>
              <li><Link href="/workspace" className="hover:text-cyan-300 transition-colors">Mission Control</Link></li>
              <li><Link href="/new-analysis" className="hover:text-cyan-300 transition-colors">Data Ingestion</Link></li>
              <li><Link href="/history" className="hover:text-cyan-300 transition-colors">History & Dossiers</Link></li>
            </ul>
          </div>

          {/* Research & Benchmarks */}
          <div className="md:col-span-3 space-y-3 font-sans text-xs">
            <div className="font-mono text-white text-[11px] font-bold uppercase tracking-wider">Intelligence</div>
            <ul className="space-y-2.5">
              <li><Link href="/technology" className="hover:text-cyan-300 transition-colors">Model Registry</Link></li>
              <li><Link href="/technology" className="hover:text-cyan-300 transition-colors">BigEarthNet Adaptation</Link></li>
              <li><Link href="/technology" className="hover:text-cyan-300 transition-colors">Change-VQA Architecture</Link></li>
              <li><Link href="/technology" className="hover:text-cyan-300 transition-colors">Spatial Grounding VLM</Link></li>
            </ul>
          </div>

        </div>

        {/* Bottom copyright line */}
        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-gray-400 space-y-2 sm:space-y-0">
          <div>© 2026 ORBIT IQ · TALK TO EARTH. ALL RIGHTS RESERVED.</div>
          <div className="text-gray-400">SENTINEL-1/2 · LANDSAT-9 · CARTOSAT-3 COMPLIANT</div>
        </div>

      </div>
    </footer>
  );
}
