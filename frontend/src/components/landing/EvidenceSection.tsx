'use client';

import React from 'react';
import FeatureCards from './FeatureCards';

export function EvidenceSection() {
  return (
    <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6">
      <div className="text-center space-y-3 mb-12">
        <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest">
          Multimodal Evidence Suite
        </span>
        <h2 className="text-3xl sm:text-4xl font-bold text-white font-sans">
          Proven Earth Intelligence Capabilities
        </h2>
      </div>
      <FeatureCards />
    </section>
  );
}

export default EvidenceSection;
