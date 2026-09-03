'use client';

import React, { useState } from 'react';
import MessageList, { ChatMsg } from './MessageList';
import ChatInput from './ChatInput';
import OrbitIqCoreStatus from '../analysis/OrbitIqCoreStatus';
import { OrbitIqCore } from '@/services/orbitIqCore';
import { DEMO_ANALYSIS_SCENARIOS } from '@/data/demoResults';
import { ExecutionStep } from '@/types/analysis';

export function ChatWorkspace() {
  const [messages, setMessages] = useState<ChatMsg[]>([
    {
      id: 'msg-init',
      sender: 'orbit_iq',
      text: 'Greetings. I am Orbit IQ Core, your master remote sensing intelligence orchestrator. Ask me any question about single-image scene understanding, bi-temporal changes, or Optical + SAR sensor fusion.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [steps, setSteps] = useState<ExecutionStep[]>([]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isProcessing) return;

    const userMsg: ChatMsg = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: input,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    const prompt = input;
    setInput('');
    setIsProcessing(true);
    setSteps([]);

    try {
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
          setSteps((prev) => {
            const idx = prev.findIndex((s) => s.message === step.message);
            if (idx >= 0) {
              const updated = [...prev];
              updated[idx] = step;
              return updated;
            }
            return [...prev, step];
          });
        }
      );

      const botMsg: ChatMsg = {
        id: `msg-bot-${Date.now()}`,
        sender: 'orbit_iq',
        text: result.answer,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        result,
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: `msg-err-${Date.now()}`,
          sender: 'orbit_iq',
          text: `Orbit IQ Core Error: ${err.message || 'Failed to process query.'}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsProcessing(false);
      setSteps([]);
    }
  };

  return (
    <div className="rounded-3xl border border-glass-border bg-[#050814]/90 shadow-2xl backdrop-blur-xl flex flex-col h-[80vh] overflow-hidden">
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <MessageList messages={messages} />
        {isProcessing && <OrbitIqCoreStatus steps={steps} isRunning={true} />}
      </div>
      <div className="border-t border-glass-border p-4 bg-white/[0.01]">
        <ChatInput
          value={input}
          onChange={setInput}
          onSubmit={handleSend}
          disabled={isProcessing}
        />
      </div>
    </div>
  );
}

export default ChatWorkspace;
