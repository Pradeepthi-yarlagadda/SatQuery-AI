'use client';

import React from 'react';

export function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <div className="animate-in fade-in duration-500 ease-out">
      {children}
    </div>
  );
}

export default PageTransition;
