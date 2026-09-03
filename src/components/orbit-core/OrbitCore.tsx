'use client';

import React from 'react';
import OrbitIqCoreStatus from '../analysis/OrbitIqCoreStatus';
import { ExecutionStep } from '@/types/analysis';

export function OrbitCore({
  steps = [],
  isRunning = false,
  specialistDisplayName,
  taskDisplayName,
}: {
  steps?: ExecutionStep[];
  isRunning?: boolean;
  specialistDisplayName?: string;
  taskDisplayName?: string;
}) {
  return (
    <OrbitIqCoreStatus
      steps={steps}
      isRunning={isRunning}
      specialistDisplayName={specialistDisplayName}
      taskDisplayName={taskDisplayName}
    />
  );
}

export default OrbitCore;
