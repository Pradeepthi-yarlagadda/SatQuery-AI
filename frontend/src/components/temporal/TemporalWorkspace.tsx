'use client';

import React from 'react';
import AnalysisWorkspaceView from '../analysis/AnalysisWorkspaceView';

export function TemporalWorkspace() {
  return <AnalysisWorkspaceView initialMode="temporal" initialScenario="temporal-expansion" />;
}

export default TemporalWorkspace;
