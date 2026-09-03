'use client';

import React from 'react';
import BeforeAfterViewer from '../temporal/BeforeAfterViewer';

export function FusionViewer({
  opticalUrl = '/images/assets/optical-multispectral.jpg',
  sarUrl = '/images/assets/sar-backscatter.jpg',
}: {
  opticalUrl?: string;
  sarUrl?: string;
}) {
  return (
    <BeforeAfterViewer
      beforeUrl={opticalUrl}
      afterUrl={sarUrl}
      beforeLabel="Optical Multispectral (Sentinel-2)"
      afterLabel="SAR C-Band Backscatter (Sentinel-1)"
    />
  );
}

export default FusionViewer;
