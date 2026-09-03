'use client';

import { useAnalysis } from './useAnalysis';
import { ImageInput } from '@/types/image';

export function useMultimodalAnalysis() {
  const { isAnalyzing, result, error, steps, runAnalysis, reset } = useAnalysis();

  const analyzeMultimodal = async (opticalImage: ImageInput, sarImage: ImageInput, query: string) => {
    return runAnalysis({
      inputs: [opticalImage, sarImage],
      query,
      mode: 'multimodal',
    });
  };

  return {
    isAnalyzing,
    result,
    error,
    steps,
    analyzeMultimodal,
    reset,
  };
}
