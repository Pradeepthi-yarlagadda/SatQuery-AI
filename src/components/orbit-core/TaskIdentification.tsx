'use client';

import React from 'react';
import { Layers } from 'lucide-react';

export function TaskIdentification({ taskName }: { taskName?: string }) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-purple-500/30 bg-purple-500/10 px-3 py-1.5 text-xs font-mono text-purple-300">
      <Layers size={14} />
      <span>Task: <strong className="text-white">{taskName || 'Identifying intent...'}</strong></span>
    </div>
  );
}

export default TaskIdentification;
