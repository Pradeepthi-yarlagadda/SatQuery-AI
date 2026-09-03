'use client';

import React from 'react';

export function AnalysisSummary({
  summary,
  keyFindings = [],
}: {
  summary: string;
  keyFindings?: string[];
}) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-base font-bold text-cyan-300 font-mono border-b border-white/[0.06] pb-1">
          1. Executive Summary & Findings
        </h3>
        <p className="mt-2 text-xs sm:text-sm text-gray-200 leading-relaxed font-sans">
          {summary}
        </p>
      </div>

      {keyFindings.length > 0 && (
        <div className="space-y-2">
          <div className="text-xs font-mono text-gray-400 uppercase">Key Evidence Points:</div>
          <ul className="list-disc pl-5 text-xs text-gray-300 space-y-1">
            {keyFindings.map((f, i) => (
              <li key={i}>{f}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default AnalysisSummary;
