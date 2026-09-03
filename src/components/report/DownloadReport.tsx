'use client';

import React from 'react';
import { Download, Printer } from 'lucide-react';

export function DownloadReport() {
  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <div className="flex items-center gap-3 print:hidden">
      <button
        type="button"
        onClick={handlePrint}
        className="flex items-center gap-2 rounded-xl border border-glass-border bg-white/[0.04] px-4 py-2 text-xs font-mono text-gray-200 hover:bg-white/[0.08] transition-all cursor-pointer"
      >
        <Printer size={14} />
        <span>Print Report</span>
      </button>

      <button
        type="button"
        onClick={handlePrint}
        className="flex items-center gap-2 rounded-xl gradient-cta px-4 py-2 text-xs font-semibold text-white shadow-lg hover:brightness-110 transition-all cursor-pointer"
      >
        <Download size={14} />
        <span>Export PDF</span>
      </button>
    </div>
  );
}

export default DownloadReport;
