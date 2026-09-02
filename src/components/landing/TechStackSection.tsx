import React from 'react';
import Link from 'next/link';
import { Database, Binary, ShieldCheck, Cpu, ArrowRight } from 'lucide-react';

export default function TechStackSection() {
  const benchmarks = [
    {
      name: 'BigEarthNet-MM',
      desc: 'Multimodal Remote-Sensing foundation dataset for cross-modal image-text representation adaptation.',
      tag: 'VLM Fine-Tuning',
    },
    {
      name: 'RSVQA-HR',
      desc: 'High-resolution remote-sensing visual question answering for object counts and scene relationships.',
      tag: 'RS-VQA Benchmark',
    },
    {
      name: 'CDVQA',
      desc: 'Bi-temporal change visual question answering explaining contextual shifts across acquisition dates.',
      tag: 'Change Intelligence',
    },
    {
      name: 'VRSBench',
      desc: 'Benchmark suite for fine-grained multi-scale remote-sensing captioning and text-guided grounding.',
      tag: 'Grounding & Captions',
    },
  ];

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/10">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Left Intro */}
        <div className="lg:col-span-5 space-y-4">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-space-900 border border-cyan-500/30 text-xs font-mono text-orbit-cyan">
            <Cpu className="w-3.5 h-3.5" />
            <span>MODEL ADAPTATION ARCHITECTURE</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-sans tracking-tight">
            NOT JUST A GENERIC VLM. ADAPTED FOR REMOTE SENSING.
          </h2>

          <p className="text-xs sm:text-sm text-gray-300 font-sans leading-relaxed">
            Generic vision-language models fail on multi-band spectral reflectance and SAR radar geometry. OrbitIQ is specialized using remote-sensing datasets, low-rank adaptation (LoRA), and spatial co-registration validation.
          </p>

          <div className="pt-2">
            <Link
              href="/technology"
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-lg bg-space-850 hover:bg-space-800 border border-cyan-500/30 text-xs font-mono text-orbit-cyan transition-colors"
            >
              <span>Explore Specialist Model Registry</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Right Benchmarks Grid */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {benchmarks.map((item, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-space-900/60 border border-white/10 hover:border-cyan-500/40 transition-colors space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-white font-mono">{item.name}</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-400 border border-cyan-500/20">
                  {item.tag}
                </span>
              </div>
              <p className="text-xs text-gray-400 font-sans leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
