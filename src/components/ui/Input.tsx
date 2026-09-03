'use client';

import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, className = '', ...props }: InputProps) {
  return (
    <div className="w-full space-y-1.5">
      {label && <label className="text-xs font-mono text-gray-400 block">{label}</label>}
      <input
        className={`w-full rounded-xl border border-glass-border bg-black/40 px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-cyan-400/60 focus:outline-none transition-colors ${className}`}
        {...props}
      />
      {error && <span className="text-xs font-mono text-rose-400 block">{error}</span>}
    </div>
  );
}
