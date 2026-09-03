'use client';

import React from 'react';
import { ShieldCheck, CheckCircle2 } from 'lucide-react';

export function MultimodalFindings({
  findings = [
    'SAR double-bounce isolates 84 structural high-rises undetectable in shadowed optical channels.',
    'Specular reflection in SAR confirms exact water line with 0% cloud interference.',
    'Cross-polarized VH/VV ratio differentiates dense urban vs low-profile vegetative canopy.',
  ],
  confidence = '96.2%',
}: {
  findings?: string[];
  confidence?: string;
}) {
  return (
    <div className="space-y-4 rounded-2xl border border-glass-border bg-[#050814]/90 p-5 font-mono text-xs">
      <div className="flex items-center justify-between border-b border-glass-border pb-3">
        <span className="text-gray-400 uppercase">Cross-Modal Synthesis</span>
        <div className="flex items-center gap-1.5 text-emerald-400">
          <ShieldCheck size={14} />
          <span>Confidence: {confidence}</span>
        </div>
      </div>

      <div className="space-y-2">
        {findings.map((f, i) => (
          <div key={i} className="flex items-start gap-2 text-gray-200">
            <CheckCircle2 size={14} className="mt-0.5 text-cyan-400 shrink-0" />
            <span>{f}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MultimodalFindings;
