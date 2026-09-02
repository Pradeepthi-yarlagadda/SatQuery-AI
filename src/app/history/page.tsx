'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { History, FileText, ArrowUpRight, Clock, Search } from 'lucide-react';
import { MOCK_SCENARIOS } from '@/data/mockScenarios';
import ReportModal from '@/components/analysis/ReportModal';
import { AnalysisScenario } from '@/types/satellite';

export default function HistoryPage() {
  const [selectedReportScenario, setSelectedReportScenario] = useState<AnalysisScenario | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const historyItems = [
    {
      id: 'temporal-expansion',
      title: 'East Bangalore Urban Expansion Analysis',
      type: 'Bi-Temporal Change VQA',
      timeAgo: '2 hours ago',
      date: '2026-09-01 10:31 UTC',
      location: 'East Bangalore, Karnataka',
      model: 'Change-VQA (OrbitIQ-v2)',
      confidence: '89.4%',
      summary: 'Built-up area increased by +28.4% with primary growth in eastern sectors.',
      scenarioKey: 'temporal-expansion',
    },
    {
      id: 'grounding-water',
      title: 'Krishna River Basin Water Body Grounding',
      type: 'Text-Guided Grounding',
      timeAgo: 'Yesterday',
      date: '2026-08-31 11:14 UTC',
      location: 'Nagarjuna Sagar, Telangana/AP',
      model: 'RS-Grounding-VLM',
      confidence: '93.1%',
      summary: 'Segmented reservoir extent spanning 28.74 km² with high spectral precision.',
      scenarioKey: 'grounding-water',
    },
    {
      id: 'optical-sar-fusion',
      title: 'Ganga Floodplain Cross-Modal Inundation (Optical + SAR)',
      type: 'Optical + SAR Fusion',
      timeAgo: '2 days ago',
      date: '2026-08-30 14:22 UTC',
      location: 'Patna Corridor, Bihar',
      model: 'Cross-Modal Fusion Net',
      confidence: '91.8%',
      summary: 'Radar penetrated heavy cloud cover, mapping 38.2 km² flood inundation.',
      scenarioKey: 'optical-sar-fusion',
    },
    {
      id: 'vqa-landcover',
      title: 'Deccan Agricultural Dominance Classification',
      type: 'Single Image VQA',
      timeAgo: '3 days ago',
      date: '2026-08-29 16:05 UTC',
      location: 'Nashik Valley, Maharashtra',
      model: 'RS-VQA-LoRA',
      confidence: '95.2%',
      summary: 'Identified agricultural cropland occupying 64.8% of surveyed grid.',
      scenarioKey: 'vqa-landcover',
    },
    {
      id: 'caption-port',
      title: 'JNPT Maritime Port & Logistics Intelligence',
      type: 'Scene Captioning',
      timeAgo: '4 days ago',
      date: '2026-08-28 17:40 UTC',
      location: 'Nhava Sheva, Mumbai',
      model: 'VRSBench-Captioner',
      confidence: '92.7%',
      summary: 'Multi-scale coastal intelligence outlining container terminals and mangroves.',
      scenarioKey: 'caption-port',
    },
  ];

  const filteredItems = historyItems.filter(
    (item) =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex-1 py-12 px-6 sm:px-12 lg:px-20 max-w-7xl mx-auto w-full space-y-8 bg-[#030712]">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-6 pt-10">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-xs font-mono text-cyan-300 mb-2">
            <History className="w-3.5 h-3.5" />
            <span>MISSION DOSSIER REPOSITORY</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white font-sans tracking-tight">
            ANALYSIS HISTORY & DOSSIERS
          </h1>
          <p className="text-sm text-gray-400 font-sans mt-1">
            Browse previous remote-sensing intelligence runs, examine auditable traces, and export official analysis dossiers.
          </p>
        </div>

        {/* Search Bar */}
        <div className="w-full sm:w-72 relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search past missions..."
            className="w-full bg-[#07112c] border border-white/15 rounded-xl px-3 py-2.5 text-xs text-white placeholder-gray-400 font-sans focus:outline-none focus:border-cyan-400 pl-9"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* History Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item, idx) => {
          const matchedScenario = MOCK_SCENARIOS[item.scenarioKey];
          return (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-[#060e22] border border-white/10 hover:border-cyan-500/40 transition-all duration-300 flex flex-col justify-between space-y-4 group shadow-xl"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono px-2.5 py-0.5 rounded bg-cyan-950/80 text-cyan-400 border border-cyan-500/20">
                    {item.type}
                  </span>
                  <span className="text-[10px] font-mono text-gray-400 flex items-center space-x-1">
                    <Clock className="w-3 h-3 text-gray-400" />
                    <span>{item.timeAgo}</span>
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-white font-sans group-hover:text-cyan-300 transition-colors">
                    {item.title}
                  </h3>
                  <div className="text-xs font-mono text-gray-400 mt-0.5">{item.location}</div>
                </div>

                <p className="text-xs text-gray-300 font-sans leading-relaxed line-clamp-2">
                  {item.summary}
                </p>

                <div className="p-3 rounded-xl bg-[#030712]/80 border border-white/5 grid grid-cols-2 gap-2 text-[10px] font-mono">
                  <div>
                    <span className="text-gray-400 block">MODEL</span>
                    <span className="text-cyan-300 font-bold truncate block">{item.model}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block">CONFIDENCE</span>
                    <span className="text-emerald-400 font-bold">{item.confidence}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-2">
                <button
                  onClick={() => matchedScenario && setSelectedReportScenario(matchedScenario)}
                  className="flex-1 py-2 px-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-sans text-gray-200 hover:text-white transition-colors flex items-center justify-center space-x-1 cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5 text-cyan-400" />
                  <span>View Dossier</span>
                </button>

                <Link
                  href={`/workspace?scenario=${item.scenarioKey}`}
                  className="py-2 px-4 rounded-lg bg-cyan-400/15 hover:bg-cyan-400/25 border border-cyan-400/40 text-xs font-sans font-bold text-cyan-300 transition-colors flex items-center justify-center space-x-1"
                >
                  <span>Launch</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* Full Dossier Modal */}
      {selectedReportScenario && (
        <ReportModal
          isOpen={!!selectedReportScenario}
          onClose={() => setSelectedReportScenario(null)}
          scenario={selectedReportScenario}
        />
      )}

    </div>
  );
}
