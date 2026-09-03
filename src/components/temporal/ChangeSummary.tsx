'use client';

import React from 'react';
import { ChangeCategory } from '@/types/evidence';

export function ChangeSummary({
  categories = [],
  netChange = '+28.4% Built-Up',
}: {
  categories?: ChangeCategory[];
  netChange?: string;
}) {
  return (
    <div className="space-y-3 rounded-2xl border border-glass-border bg-[#050814]/90 p-4 font-mono text-xs">
      <div className="flex items-center justify-between border-b border-glass-border pb-2">
        <span className="text-gray-400 uppercase">Net Spatial Delta</span>
        <span className="font-bold text-rose-400">{netChange}</span>
      </div>

      <div className="space-y-2">
        {categories.map((cat) => (
          <div
            key={cat.category}
            className="flex items-center justify-between rounded-lg bg-white/[0.02] p-2"
          >
            <div className="flex items-center gap-2">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: cat.color }}
              />
              <span className="text-white">{cat.label}</span>
            </div>
            <span className="font-bold text-cyan-300">
              {cat.deltaPercentage > 0 ? `+${cat.deltaPercentage}%` : `${cat.deltaPercentage}%`} ({cat.areaKm2} km²)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ChangeSummary;
