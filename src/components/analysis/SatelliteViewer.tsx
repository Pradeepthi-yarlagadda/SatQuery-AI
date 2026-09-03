'use client';

import React from 'react';

export function SatelliteViewer({
  url = '/images/assets/map-satellite.jpg',
  alt = 'Satellite Observation',
}: {
  url?: string;
  alt?: string;
}) {
  return (
    <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl border border-glass-border bg-black">
      <img src={url} alt={alt} className="h-full w-full object-cover" />
    </div>
  );
}

export default SatelliteViewer;
