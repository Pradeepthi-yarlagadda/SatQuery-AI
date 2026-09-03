'use client';

import React from 'react';
import { User } from 'lucide-react';

export function UserMessage({ text, timestamp }: { text: string; timestamp?: string }) {
  return (
    <div className="flex items-start gap-3 flex-row-reverse">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-purple-600 text-white text-xs font-bold">
        <User size={14} />
      </div>
      <div className="max-w-xl rounded-2xl bg-purple-600/20 border border-purple-500/30 p-4 text-xs sm:text-sm text-white space-y-1">
        <p>{text}</p>
        {timestamp && <div className="text-[10px] font-mono text-purple-300/60 text-right">{timestamp}</div>}
      </div>
    </div>
  );
}

export default UserMessage;
