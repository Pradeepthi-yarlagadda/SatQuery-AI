'use client';

import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'glass';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}: ButtonProps) {
  const base =
    'inline-flex items-center justify-center font-semibold rounded-xl transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed';

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  const variants = {
    primary: 'gradient-cta text-white shadow-lg shadow-primary/20 hover:brightness-110',
    secondary: 'bg-white/[0.08] hover:bg-white/[0.15] text-white border border-glass-border',
    outline: 'border border-cyan-400/40 text-cyan-300 hover:bg-cyan-400/10',
    ghost: 'text-gray-300 hover:text-white hover:bg-white/[0.04]',
    glass: 'glass-panel text-white hover:border-cyan-400/50',
  };

  return (
    <button
      className={`${base} ${sizeStyles[size]} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
