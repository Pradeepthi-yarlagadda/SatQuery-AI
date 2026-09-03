'use client';

import React, { useState } from 'react';
import { Sliders } from 'lucide-react';

interface BeforeAfterViewerProps {
  beforeUrl: string;
  afterUrl: string;
  beforeLabel?: string;
  afterLabel?: string;
}

export function BeforeAfterViewer({
  beforeUrl,
  afterUrl,
  beforeLabel = 'Observation T1 (2022)',
  afterLabel = 'Observation T2 (2026)',
}: BeforeAfterViewerProps) {
  const [sliderPos, setSliderPos] = useState(50);

  return (
    <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl border border-glass-border bg-space select-none">
      <img
        src={beforeUrl}
        alt={beforeLabel}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ clipPath: `inset(0 0 0 ${sliderPos}%)` }}
      >
        <img
          src={afterUrl}
          alt={afterLabel}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute top-3 right-3 rounded-md bg-black/70 px-2.5 py-1 text-[10px] font-mono text-purple-300 border border-purple-500/30 backdrop-blur-md">
          {afterLabel}
        </div>
      </div>

      <div className="absolute top-3 left-3 rounded-md bg-black/70 px-2.5 py-1 text-[10px] font-mono text-cyan-300 border border-cyan-500/30 backdrop-blur-md">
        {beforeLabel}
      </div>

      <div
        className="absolute top-0 bottom-0 w-0.5 bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)] pointer-events-none"
        style={{ left: `${sliderPos}%` }}
      >
        <div className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 flex h-7 w-7 items-center justify-center rounded-full bg-[#050814] border border-white text-white shadow-xl">
          <Sliders size={12} />
        </div>
      </div>

      <input
        type="range"
        min="0"
        max="100"
        value={sliderPos}
        onChange={(e) => setSliderPos(Number(e.target.value))}
        aria-label="Before/After split slider"
        className="absolute inset-0 h-full w-full opacity-0 cursor-ew-resize z-20"
      />
    </div>
  );
}

export default BeforeAfterViewer;
