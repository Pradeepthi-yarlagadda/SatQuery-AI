'use client';

import React, { useState } from 'react';
import { AnalysisScenario, ChatMessage } from '@/types/satellite';
import { Cpu, CheckCircle2, ShieldCheck, Sparkles, Send, ArrowUpRight, Layers, AlertCircle, FileText } from 'lucide-react';

interface AIAnalysisPanelProps {
  scenario: AnalysisScenario;
  onOpenTrace: () => void;
  onOpenReport: () => void;
  onEvidenceClick?: (type: string) => void;
}

export default function AIAnalysisPanel({
  scenario,
  onOpenTrace,
  onOpenReport,
  onEvidenceClick,
}: AIAnalysisPanelProps) {
  const [followUpInput, setFollowUpInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'orbitiq',
      timestamp: 'Just now',
      content: scenario.answerSummary,
      confidence: scenario.confidence,
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const handleSendFollowUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!followUpInput.trim() || isTyping) return;

    const userText = followUpInput.trim();
    setFollowUpInput('');

    const newMsgUser: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      timestamp: 'Now',
      content: userText,
    };
    setMessages((prev) => [...prev, newMsgUser]);
    setIsTyping(true);

    setTimeout(() => {
      let botResponse = '';
      if (userText.toLowerCase().includes('where') || userText.toLowerCase().includes('location')) {
        botResponse = `The expansion is geographically concentrated in the ${scenario.primaryChangeRegion || 'eastern sector'} (coordinates ${scenario.coordinates}). Grounding polygons pinpoint high-density construction clusters along former arterial farmland.`;
      } else if (userText.toLowerCase().includes('vegetation') || userText.toLowerCase().includes('tree')) {
        botResponse = `Vegetation canopy decreased by 16.8% (-11.2 km²) across the observation zone, predominantly due to land conversion into residential and transport infrastructure.`;
      } else if (userText.toLowerCase().includes('sar') || userText.toLowerCase().includes('radar')) {
        botResponse = `SAR C-Band backscatter confirmed double-bounce radar returns (+11.8 dB) from new concrete structural walls, verifying permanent construction over temporary soil disturbance.`;
      } else {
        botResponse = `Analysis confirmed by ${scenario.selectedModel.name}: detected ${scenario.detectedFeatures.map((f) => `${f.category} (${f.percentageChange || f.changeType})`).join(', ')}.`;
      }

      const newMsgBot: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'orbitiq',
        timestamp: 'Just now',
        content: botResponse,
        confidence: scenario.confidence,
      };
      setMessages((prev) => [...prev, newMsgBot]);
      setIsTyping(false);
    }, 600);
  };

  return (
    <div className="w-full h-full flex flex-col bg-space-900/90 border border-space-border rounded-2xl overflow-hidden shadow-2xl backdrop-blur-xl">

      {/* Top Header */}
      <div className="p-4 border-b border-white/10 flex items-center justify-between bg-space-950/60">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 rounded-md bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-orbit-cyan">
            <Cpu className="w-3.5 h-3.5" />
          </div>
          <div>
            <h3 className="text-xs font-mono font-bold text-white tracking-wider">AI ANALYSIS</h3>
            <span className="text-[10px] font-mono text-cyan-400">AGENTIC INTELLIGENCE</span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={onOpenTrace}
            className="px-2.5 py-1 rounded bg-space-850 hover:bg-space-800 border border-white/10 text-[10px] font-mono text-gray-300 hover:text-white transition-colors"
          >
            Trace Log
          </button>
          <button
            onClick={onOpenReport}
            className="px-2.5 py-1 rounded bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-[10px] font-mono text-orbit-cyan transition-colors flex items-center space-x-1"
          >
            <FileText className="w-3 h-3" />
            <span>Report</span>
          </button>
        </div>
      </div>

      {/* Main Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">

        {/* Model & Task Metadata Pill Grid */}
        <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
          <div className="p-2 rounded-lg bg-space-950/70 border border-white/5 space-y-0.5">
            <div className="text-gray-400 uppercase">Task Detected</div>
            <div className="font-bold text-white truncate">{scenario.detectedTask}</div>
          </div>

          <div className="p-2 rounded-lg bg-space-950/70 border border-white/5 space-y-0.5">
            <div className="text-gray-400 uppercase">Specialist Model</div>
            <div className="font-bold text-cyan-400 truncate">{scenario.selectedModel.name}</div>
          </div>
        </div>

        {/* Primary Result Card */}
        <div className="p-3.5 rounded-xl bg-space-950/80 border border-cyan-500/30 space-y-2 shadow-neon-cyan">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider flex items-center space-x-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              <span>PRIMARY RESULT</span>
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-500/30">
              ✓ Verified Analysis
            </span>
          </div>

          <p className="text-xs font-sans text-white leading-relaxed font-medium">
            {scenario.answerSummary}
          </p>

          {scenario.primaryChangeRegion && (
            <div className="text-[11px] font-mono text-gray-300 pt-1 border-t border-white/10 flex items-center justify-between">
              <span className="text-gray-400">Primary Region:</span>
              <span className="text-orbit-cyan font-bold">{scenario.primaryChangeRegion}</span>
            </div>
          )}
        </div>

        {/* Model Confidence Breakdown */}
        <div className="p-3 rounded-xl bg-space-950/50 border border-white/5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-gray-400 uppercase">Model Confidence</span>
            <span className="text-xs font-mono font-bold text-orbit-cyan">{scenario.confidence}%</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-space-900 overflow-hidden border border-white/10">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 rounded-full"
              style={{ width: `${scenario.confidence}%` }}
            />
          </div>
          <div className="text-[9px] font-mono text-gray-400">
            Calibrated against {scenario.selectedModel.dataset} ground-truth validations.
          </div>
        </div>

        {/* Detected Features Breakdown */}
        <div className="space-y-2">
          <div className="text-[10px] font-mono text-gray-400 uppercase tracking-wider">Semantic Findings</div>
          <div className="space-y-1.5 font-mono">
            {scenario.detectedFeatures.map((feat, idx) => (
              <div
                key={idx}
                className="p-2 rounded-lg bg-space-950/40 border border-white/5 flex items-center justify-between text-xs"
              >
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: feat.color }} />
                  <span className="text-gray-200">{feat.category}</span>
                </div>
                <div className="text-right">
                  {feat.percentageChange && (
                    <span
                      className={`text-[11px] font-bold ${
                        feat.changeType === 'increased'
                          ? 'text-rose-400'
                          : feat.changeType === 'decreased'
                          ? 'text-amber-400'
                          : 'text-cyan-400'
                      }`}
                    >
                      {feat.percentageChange}
                    </span>
                  )}
                  {feat.areaKm2 && (
                    <span className="text-[10px] text-gray-400 ml-1.5">({feat.areaKm2} km²)</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Visual Evidence Section */}
        <div className="space-y-2 pt-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider">Visual Evidence</span>
            <span className="text-[10px] font-mono text-cyan-400">{scenario.evidence.length} Artifacts</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {scenario.evidence.map((ev, idx) => (
              <div
                key={idx}
                onClick={() => onEvidenceClick && onEvidenceClick(ev.type)}
                className="p-2 rounded-lg bg-space-950/60 border border-white/10 hover:border-cyan-500/40 transition-colors cursor-pointer group"
              >
                <div className="text-[10px] font-mono font-bold text-white group-hover:text-orbit-cyan truncate">
                  {ev.title}
                </div>
                <div className="text-[9px] text-gray-400 font-sans mt-0.5 line-clamp-2">
                  {ev.description}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Thread History */}
        <div className="space-y-2 pt-2 border-t border-white/10">
          <div className="text-[10px] font-mono text-gray-400 uppercase tracking-wider">Conversation Log</div>
          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`p-2.5 rounded-xl text-xs font-sans leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-cyan-500/10 border border-cyan-500/20 text-cyan-200 ml-4'
                    : 'bg-space-950/70 border border-white/10 text-gray-200 mr-4'
                }`}
              >
                <div className="flex items-center justify-between text-[9px] font-mono text-gray-400 mb-1">
                  <span>{m.sender === 'user' ? 'YOU' : 'ORBITIQ'}</span>
                  <span>{m.timestamp}</span>
                </div>
                <p>{m.content}</p>
              </div>
            ))}
            {isTyping && (
              <div className="p-2 rounded-lg bg-space-950 border border-cyan-500/20 text-xs text-cyan-400 font-mono animate-pulse">
                OrbitIQ is analyzing remote-sensing features...
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Follow-Up Chat Input Footer */}
      <div className="p-3 border-t border-white/10 bg-space-950/80">
        <form onSubmit={handleSendFollowUp} className="relative flex items-center">
          <input
            type="text"
            value={followUpInput}
            onChange={(e) => setFollowUpInput(e.target.value)}
            placeholder="Ask a follow-up (e.g. 'Where exactly did change occur?')..."
            className="w-full bg-space-900 border border-white/15 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-400 font-mono focus:outline-none focus:border-cyan-400 pr-10"
          />
          <button
            type="submit"
            disabled={!followUpInput.trim() || isTyping}
            className="absolute right-1.5 p-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 disabled:opacity-40 transition-colors"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>

    </div>
  );
}
