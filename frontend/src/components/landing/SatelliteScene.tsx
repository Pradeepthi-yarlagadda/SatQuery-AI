'use client';

import React from 'react';

export function SatelliteScene() {
  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-3xl border border-glass-border bg-black">
      <img
        src="/images/assets/hero-satellite.jpg"
        alt="Satellite Scene"
        className="h-full w-full object-cover"
      />
    </div>
  );
}

export default SatelliteScene;
