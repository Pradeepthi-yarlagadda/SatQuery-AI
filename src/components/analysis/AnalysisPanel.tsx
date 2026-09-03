'use client';

import React from 'react';
import AnalysisResultCard from './AnalysisResultCard';
import { AnalysisResult } from '@/types/analysis';

export function AnalysisPanel({ result }: { result: AnalysisResult }) {
  return <AnalysisResultCard result={result} />;
}

export default AnalysisPanel;
