'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Explore", href: "/workspace" },
  { label: "Features", href: "/#features" },
  { label: "About", href: "/technology" },
];

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2.5 group">
      <div className="relative flex h-9 w-9 items-center justify-center rounded-full orbit-ring bg-glass">
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-nebula/20 to-orbit/20" />
        <div className="relative h-5 w-5">
          <div className="absolute inset-0 rounded-full border-2 border-nebula" />
          <div className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-orbit" />
        </div>
      </div>
      <span className="text-lg font-semibold tracking-tight text-white font-sans">
        Orbit <span className="text-gradient">IQ</span>
      </span>
    </Link>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const isHome = pathname === '/';

  // The home page renders its own full-screen header (with dive/back-to-orbit
  // controls) inside a fixed overlay — this global navbar would sit on top of
  // it at a higher z-index and intercept clicks meant for that page's own UI.
  if (isHome) return null;

  return (
    <header className="fixed left-0 right-0 top-0 z-50">
      <div className="mx-auto max-w-7xl px-4 pt-4 sm:px-6 lg:px-8">
        <nav className="flex items-center justify-between rounded-full border border-glass-border bg-glass px-4 py-2.5 backdrop-blur-xl">
          <Logo />

          <ul className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => {
              const isActive = (link.href === '/' && isHome) || (link.href !== '/' && pathname.startsWith(link.href));
              return (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className={`relative px-4 py-2 text-sm font-medium transition-colors hover:text-white ${
                      isActive ? 'text-white' : 'text-gray-400'
                    }`}
                  >
                    {link.label}
                    {isActive && (
                      <span className="absolute bottom-0 left-1/2 h-0.5 w-4 -translate-x-1/2 rounded-full gradient-cta" />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>

          <Link
            href="/workspace"
            className="inline-flex items-center justify-center rounded-full gradient-cta px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition-all hover:shadow-primary/30 hover:-translate-y-0.5"
          >
            Get Started
          </Link>
        </nav>
      </div>
    </header>
  );
}
