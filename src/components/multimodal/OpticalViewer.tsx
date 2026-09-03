'use client';

import React from 'react';

export function OpticalViewer({ url = '/images/assets/optical-multispectral.jpg' }: { url?: string }) {
  return (
    <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl border border-glass-border bg-black">
      <img src={url} alt="Optical Imagery" className="h-full w-full object-cover" />
      <div className="absolute top-3 left-3 rounded-md bg-black/70 px-2.5 py-1 text-[10px] font-mono text-cyan-300 border border-cyan-500/30">
        Optical Multispectral (Sentinel-2)
      </div>
    </div>
  );
}

export default OpticalViewer;
