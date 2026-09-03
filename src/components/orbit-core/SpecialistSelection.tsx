'use client';

import React from 'react';
import { Sparkles } from 'lucide-react';

export function SpecialistSelection({ specialistName }: { specialistName?: string }) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-cyan-400/30 bg-cyan-400/10 px-3 py-1.5 text-xs font-mono text-cyan-300">
      <Sparkles size={14} />
      <span>Specialist: <strong className="text-white">{specialistName || 'Autonomous routing...'}</strong></span>
    </div>
  );
}

export default SpecialistSelection;
