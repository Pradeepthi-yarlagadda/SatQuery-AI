'use client';

import React from 'react';
import Link from 'next/link';
import {
  Home,
  Plus,
  FolderOpen,
  Database,
  Clock,
  Settings,
  Image as ImageIcon,
  Layers2,
  Radar,
} from 'lucide-react';

const navItems = [
  { label: 'Home', icon: Home, href: '/' },
  { label: 'New Analysis', icon: Plus },
  { label: 'My Projects', icon: FolderOpen },
  { label: 'Datasets', icon: Database },
  { label: 'History', icon: Clock },
  { label: 'Settings', icon: Settings },
];

const quickAccess = [
  { label: 'Single Image', icon: ImageIcon },
  { label: 'Temporal Pair', icon: Layers2 },
  { label: 'Optical + SAR', icon: Radar },
];

export function WorkspaceSidebar({
  active,
  onSelect,
}: {
  active: string;
  onSelect: (label: string) => void;
}) {
  return (
    <aside className="glass-card flex h-full w-60 shrink-0 flex-col rounded-2xl p-3">
      <nav className="space-y-1">
        {navItems.map((item) => {
          const isSelected = active === item.label;
          const classes = `flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors ${
            isSelected
              ? 'bg-nebula/15 text-white ring-1 ring-nebula/30'
              : 'text-gray-400 hover:bg-white/[0.05] hover:text-white'
          }`;
          const inner = (
            <>
              <item.icon size={17} strokeWidth={1.8} />
              <span>{item.label}</span>
            </>
          );
          return item.href ? (
            <Link key={item.label} href={item.href} className={classes}>
              {inner}
            </Link>
          ) : (
            <button
              key={item.label}
              type="button"
              onClick={() => onSelect(item.label)}
              className={classes}
            >
              {inner}
            </button>
          );
        })}
      </nav>

      <div className="mt-7">
        <p className="px-3 pb-2 text-xs font-medium tracking-wide text-nebula/80 font-mono uppercase">
          Quick Access
        </p>
        <div className="space-y-2">
          {quickAccess.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => onSelect(item.label)}
              className={`flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-sm transition-colors ${
                active === item.label
                  ? 'border-nebula/40 bg-nebula/15 text-white'
                  : 'border-glass-border bg-white/[0.03] text-gray-400 hover:bg-white/[0.06] hover:text-white'
              }`}
            >
              <item.icon size={16} strokeWidth={1.8} className="text-nebula" />
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}
