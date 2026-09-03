'use client';

import React from 'react';
import { Send } from 'lucide-react';

export function ChatInput({
  value,
  onChange,
  onSubmit,
  disabled,
}: {
  value: string;
  onChange: (val: string) => void;
  onSubmit: (e?: React.FormEvent) => void;
  disabled?: boolean;
}) {
  return (
    <form onSubmit={onSubmit} className="flex items-center gap-3">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Ask Orbit IQ Core anything about earth observations..."
        disabled={disabled}
        className="flex-1 rounded-xl border border-glass-border bg-black/40 px-4 py-3 text-sm text-white placeholder-gray-500 focus:border-cyan-400/60 focus:outline-none font-sans"
      />
      <button
        type="submit"
        disabled={disabled || !value.trim()}
        className="inline-flex items-center gap-2 rounded-xl gradient-cta px-5 py-3 text-xs sm:text-sm font-semibold text-white shadow-xl hover:brightness-110 disabled:opacity-50 transition-all cursor-pointer"
      >
        <span>Send</span>
        <Send size={14} />
      </button>
    </form>
  );
}

export default ChatInput;
