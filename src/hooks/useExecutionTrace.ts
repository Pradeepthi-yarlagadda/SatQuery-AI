'use client';

import { useState } from 'react';
import { ExecutionStep } from '@/types/analysis';

export function useExecutionTrace() {
  const [steps, setSteps] = useState<ExecutionStep[]>([]);

  const addStep = (step: ExecutionStep) => {
    setSteps((prev) => {
      const idx = prev.findIndex((s) => s.message === step.message);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = step;
        return updated;
      }
      return [...prev, step];
    });
  };

  const clearSteps = () => setSteps([]);

  return {
    steps,
    addStep,
    clearSteps,
    isComplete: steps.length > 0 && steps.every((s) => s.status === 'completed'),
  };
}
