'use client';

import React from 'react';
import VisualEvidenceViewer from './VisualEvidenceViewer';
import { VisualEvidence } from '@/types/evidence';

export function EvidenceGallery({ evidence }: { evidence: VisualEvidence }) {
  return <VisualEvidenceViewer evidence={evidence} />;
}

export default EvidenceGallery;
