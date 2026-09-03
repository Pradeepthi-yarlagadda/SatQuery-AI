'use client';

import { useAnalysis } from './useAnalysis';
import { ImageInput } from '@/types/image';

export function useTemporalAnalysis() {
  const { isAnalyzing, result, error, steps, runAnalysis, reset } = useAnalysis();

  const analyzeTemporal = async (imageA: ImageInput, imageB: ImageInput, query: string) => {
    return runAnalysis({
      inputs: [imageA, imageB],
      query,
      mode: 'temporal',
    });
  };

  return {
    isAnalyzing,
    result,
    error,
    steps,
    analyzeTemporal,
    reset,
  };
}
