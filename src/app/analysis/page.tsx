'use client';

import React, { Suspense } from 'react';
import Navbar from '@/components/layout/Navbar';
import AnalysisWorkspaceView from '@/components/analysis/AnalysisWorkspaceView';

export default function AnalysisPage() {
  return (
    <div className="min-h-screen bg-space text-foreground font-sans">
      <Navbar />
      <div className="pt-20">
        <Suspense
          fallback={
            <div className="flex h-64 items-center justify-center font-mono text-xs text-cyan-400">
              LOADING SINGLE IMAGE WORKSPACE...
            </div>
          }
        >
          <AnalysisWorkspaceView initialMode="single" />
        </Suspense>
      </div>
    </div>
  );
}
