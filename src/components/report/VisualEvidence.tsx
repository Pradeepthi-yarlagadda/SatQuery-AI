'use client';

import React from 'react';
import { VisualEvidence as VisualEvidenceType } from '@/types/evidence';

export function VisualEvidence({ evidence }: { evidence: VisualEvidenceType }) {
  return (
    <div className="space-y-3">
      <h3 className="text-base font-bold text-cyan-300 font-mono border-b border-white/[0.06] pb-1">
        2. Visual Evidence & Spatial Mapping
      </h3>
      <p className="text-xs sm:text-sm text-gray-300 font-sans leading-relaxed">
        {evidence.description}
      </p>
      {evidence.baseImageUrl && (
        <div className="aspect-[16/9] w-full overflow-hidden rounded-2xl border border-glass-border bg-black">
          <img
            src={evidence.overlayImageUrl || evidence.baseImageUrl}
            alt={evidence.title}
            className="h-full w-full object-cover"
          />
        </div>
      )}
    </div>
  );
}

export default VisualEvidence;
