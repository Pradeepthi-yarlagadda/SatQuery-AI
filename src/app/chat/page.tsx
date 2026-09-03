'use client';

import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import { OrbitIqCore } from '@/services/orbitIqCore';
import { DEMO_ANALYSIS_SCENARIOS } from '@/data/demoResults';
import { AnalysisResult, ExecutionStep } from '@/types/analysis';
import OrbitIqCoreStatus from '@/components/analysis/OrbitIqCoreStatus';
import AnalysisResultCard from '@/components/analysis/AnalysisResultCard';
import { Bot, User, Send, Sparkles, Loader2, Cpu, ArrowRight } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'orbit_iq';
  text: string;
  timestamp: string;
  result?: AnalysisResult;
  steps?: ExecutionStep[];
}

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-init',
      sender: 'orbit_iq',
      text: 'Greetings. I am Orbit IQ Core, your master remote sensing intelligence orchestrator. Ask me any question about single-image scene understanding, bi-temporal changes, or Optical + SAR sensor fusion.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeSteps, setActiveSteps] = useState<ExecutionStep[]>([]);

  const handleSend = async (e?: React.FormEvent, customPrompt?: string) => {
    if (e) e.preventDefault();
    const prompt = customPrompt || inputText;
    if (!prompt.trim() || isProcessing) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: prompt,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsProcessing(true);
    setActiveSteps([]);

    try {
      // Resolve appropriate imagery inputs based on prompt intent
      const isTemporal = prompt.toLowerCase().includes('change') || prompt.toLowerCase().includes('2022');
      const isMultimodal = prompt.toLowerCase().includes('sar') || prompt.toLowerCase().includes('fusion');
      const scenarioKey = isMultimodal
        ? 'optical-sar-fusion'
        : isTemporal
        ? 'temporal-expansion'
        : 'grounding-water';
      const inputs = DEMO_ANALYSIS_SCENARIOS[scenarioKey].inputs;

      const result = await OrbitIqCore.executeAnalysis(
        {
          query: prompt,
          inputs,
        },
        (step) => {
          setActiveSteps((prev) => {
            const existingIdx = prev.findIndex((s) => s.message === step.message);
            if (existingIdx >= 0) {
              const updated = [...prev];
              updated[existingIdx] = step;
              return updated;
            }
            return [...prev, step];
          });
        }
      );

      const botMsg: ChatMessage = {
        id: `msg-bot-${Date.now()}`,
        sender: 'orbit_iq',
        text: result.answer,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        result,
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: `msg-err-${Date.now()}`,
        sender: 'orbit_iq',
        text: `Orbit IQ Core Error: ${err.message || 'Failed to process remote sensing query.'}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsProcessing(false);
      setActiveSteps([]);
    }
  };

  return (
    <div className="min-h-screen bg-space text-foreground font-sans">
      <Navbar />

      <div className="pt-24 pb-8 max-w-5xl mx-auto px-4 sm:px-6">
        {/* Chat Interface Container */}
        <div className="rounded-3xl border border-glass-border bg-[#050814]/90 shadow-2xl backdrop-blur-xl flex flex-col h-[80vh] overflow-hidden">
          
          {/* Header */}
          <div className="flex items-center justify-between border-b border-glass-border px-6 py-4 bg-white/[0.01]">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-cyan-400/40 bg-cyan-400/10 text-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.3)]">
                <Cpu size={18} />
              </div>
              <div>
                <h2 className="text-sm font-bold text-white">Orbit IQ Core Dialogue</h2>
                <div className="text-[10px] font-mono text-cyan-300">
                  Autonomous Specialist Routing
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono text-gray-400">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Core Intelligence Ready</span>
            </div>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex items-start gap-3.5 ${
                  msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
                }`}
              >
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-xs font-bold ${
                    msg.sender === 'user'
                      ? 'bg-purple-600 text-white'
                      : 'border border-cyan-400/40 bg-cyan-400/10 text-cyan-300'
                  }`}
                >
                  {msg.sender === 'user' ? <User size={14} /> : <Bot size={14} />}
                </div>

                <div
                  className={`space-y-3 max-w-3xl rounded-2xl p-4 text-xs sm:text-sm font-sans leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-purple-600/20 border border-purple-500/30 text-white'
                      : 'bg-white/[0.03] border border-glass-border text-gray-200'
                  }`}
                >
                  <p>{msg.text}</p>

                  {/* If the message contains an AnalysisResult, render the structured evidence card */}
                  {msg.result && (
                    <div className="pt-2">
                      <AnalysisResultCard result={msg.result} />
                    </div>
                  )}

                  <div className="text-[10px] font-mono text-gray-500 text-right">
                    {msg.timestamp}
                  </div>
                </div>
              </div>
            ))}

            {/* Real-time Execution Steps when Processing */}
            {isProcessing && (
              <div className="flex items-start gap-3.5">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-cyan-400/40 bg-cyan-400/10 text-cyan-300">
                  <Loader2 size={14} className="animate-spin" />
                </div>
                <div className="w-full max-w-xl">
                  <OrbitIqCoreStatus steps={activeSteps} isRunning={true} />
                </div>
              </div>
            )}
          </div>

          {/* Input & Suggested Prompts Bar */}
          <div className="border-t border-glass-border p-4 bg-white/[0.01] space-y-3">
            {/* Quick Prompt Chips */}
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
              <span className="text-[10px] text-gray-500 uppercase">Suggested Prompts:</span>
              {[
                'What changed between 2022 and 2026?',
                'Highlight the central lake reservoir',
                'Fuse optical and SAR to identify structures through haze',
                'Describe dominant land cover and urban density',
              ].map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => handleSend(undefined, prompt)}
                  disabled={isProcessing}
                  className="px-2.5 py-1 rounded-lg border border-glass-border bg-white/[0.02] hover:bg-cyan-400/10 hover:border-cyan-400/40 text-gray-300 hover:text-cyan-300 text-[11px] transition-colors cursor-pointer disabled:opacity-50"
                >
                  {prompt}
                </button>
              ))}
            </div>

            {/* Form */}
            <form onSubmit={handleSend} className="flex items-center gap-3">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Ask Orbit IQ Core anything about earth observations..."
                disabled={isProcessing}
                className="flex-1 rounded-xl border border-glass-border bg-black/40 px-4 py-3 text-sm text-white placeholder-gray-500 focus:border-cyan-400/60 focus:outline-none font-sans disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={isProcessing || !inputText.trim()}
                className="inline-flex shrink-0 items-center gap-2 rounded-xl gradient-cta px-5 py-3 text-xs sm:text-sm font-semibold text-white shadow-xl shadow-primary/25 hover:brightness-110 disabled:opacity-50 transition-all cursor-pointer"
              >
                <span>Send</span>
                <Send size={14} />
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}
