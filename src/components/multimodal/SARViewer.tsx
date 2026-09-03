'use client';

import React from 'react';

export function SARViewer({ url = '/images/assets/sar-backscatter.jpg' }: { url?: string }) {
  return (
    <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl border border-glass-border bg-black">
      <img src={url} alt="SAR Backscatter" className="h-full w-full object-cover" />
      <div className="absolute top-3 left-3 rounded-md bg-black/70 px-2.5 py-1 text-[10px] font-mono text-purple-300 border border-purple-500/30">
        SAR Sentinel-1 (C-Band VV/VH)
      </div>
    </div>
  );
}

export default SARViewer;
