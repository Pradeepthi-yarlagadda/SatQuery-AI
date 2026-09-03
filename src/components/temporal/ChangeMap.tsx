'use client';

import React from 'react';
import VisualEvidenceViewer from '../analysis/VisualEvidenceViewer';
import { VisualEvidence } from '@/types/evidence';

export function ChangeMap({ evidence }: { evidence: VisualEvidence }) {
  return <VisualEvidenceViewer evidence={evidence} />;
}

export default ChangeMap;
