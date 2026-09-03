'use client';

import React from 'react';

export function Progress({ value = 0, max = 100, className = '' }: { value: number; max?: number; className?: string }) {
  const percent = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className={`h-1.5 w-full overflow-hidden rounded-full bg-white/[0.08] ${className}`}>
      <div
        className="h-full rounded-full gradient-cta transition-all duration-500"
        style={{ width: `${percent}%` }}
      />
    </div>
  );
}
