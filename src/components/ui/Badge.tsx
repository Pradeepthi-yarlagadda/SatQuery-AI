'use client';

import React from 'react';

interface BadgeProps {
  variant?: 'cyan' | 'purple' | 'emerald' | 'rose' | 'slate';
  children: React.ReactNode;
  className?: string;
}

export function Badge({ variant = 'cyan', children, className = '' }: BadgeProps) {
  const styles = {
    cyan: 'bg-cyan-400/10 border-cyan-400/30 text-cyan-300',
    purple: 'bg-purple-500/10 border-purple-500/30 text-purple-300',
    emerald: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300',
    rose: 'bg-rose-500/10 border-rose-500/30 text-rose-300',
    slate: 'bg-white/[0.05] border-glass-border text-gray-300',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-mono font-medium ${styles[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
