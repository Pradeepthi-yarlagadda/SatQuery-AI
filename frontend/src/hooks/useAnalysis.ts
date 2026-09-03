'use client';

import { useState } from 'react';
import { AnalysisRequest, AnalysisResult, ExecutionStep } from '@/types/analysis';
import { OrbitIqCore } from '@/services/orbitIqCore';

export function useAnalysis() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [steps, setSteps] = useState<ExecutionStep[]>([]);

  const runAnalysis = async (request: AnalysisRequest) => {
    setIsAnalyzing(true);
    setError(null);
    setSteps([]);

    try {
      const res = await OrbitIqCore.executeAnalysis(request, (step) => {
        setSteps((prev) => {
          const idx = prev.findIndex((s) => s.message === step.message);
          if (idx >= 0) {
            const updated = [...prev];
            updated[idx] = step;
            return updated;
          }
          return [...prev, step];
        });
      });
      setResult(res);
      return res;
    } catch (err: any) {
      setError(err.message || 'Analysis execution failed');
      throw err;
    } finally {
      setIsAnalyzing(false);
    }
  };

  return {
    isAnalyzing,
    result,
    error,
    steps,
    runAnalysis,
    reset: () => {
      setResult(null);
      setError(null);
      setSteps([]);
    },
  };
}
