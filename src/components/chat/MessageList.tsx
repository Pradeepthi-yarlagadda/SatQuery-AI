'use client';

import React from 'react';
import UserMessage from './UserMessage';
import OrbitMessage from './OrbitMessage';
import { AnalysisResult } from '@/types/analysis';

export interface ChatMsg {
  id: string;
  sender: 'user' | 'orbit_iq';
  text: string;
  timestamp: string;
  result?: AnalysisResult;
}

export function MessageList({ messages }: { messages: ChatMsg[] }) {
  return (
    <div className="space-y-6">
      {messages.map((m) =>
        m.sender === 'user' ? (
          <UserMessage key={m.id} text={m.text} timestamp={m.timestamp} />
        ) : (
          <OrbitMessage key={m.id} text={m.text} result={m.result} timestamp={m.timestamp} />
        )
      )}
    </div>
  );
}

export default MessageList;
