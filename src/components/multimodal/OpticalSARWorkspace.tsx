'use client';

import React from 'react';
import AnalysisWorkspaceView from '../analysis/AnalysisWorkspaceView';

export function OpticalSARWorkspace() {
  return <AnalysisWorkspaceView initialMode="multimodal" initialScenario="optical-sar-fusion" />;
}

export default OpticalSARWorkspace;
