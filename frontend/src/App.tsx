'use client';

import React, { useState } from 'react';
import LandingPage from './pages/LandingPage';
import AnalysisPage from './pages/AnalysisPage';
import TemporalPage from './pages/TemporalPage';
import MultimodalPage from './pages/MultimodalPage';
import ChatPage from './pages/ChatPage';
import ReportPage from './pages/ReportPage';
import HistoryPage from './pages/HistoryPage';

export default function App() {
  const [currentPage, setCurrentPage] = useState<'landing' | 'workspace' | 'analysis' | 'temporal' | 'multimodal' | 'chat' | 'report' | 'history'>('landing');

  return (
    <div className="min-h-screen bg-space text-foreground">
      {currentPage === 'landing' && <LandingPage />}
      {currentPage === 'analysis' && <AnalysisPage />}
      {currentPage === 'temporal' && <TemporalPage />}
      {currentPage === 'multimodal' && <MultimodalPage />}
      {currentPage === 'chat' && <ChatPage />}
      {currentPage === 'report' && <ReportPage />}
      {currentPage === 'history' && <HistoryPage />}
    </div>
  );
}
