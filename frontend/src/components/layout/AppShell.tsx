'use client';

import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-space text-foreground font-sans">
      <Navbar />
      <main className="flex-1 pt-20">{children}</main>
      <Footer />
    </div>
  );
}

export default AppShell;
