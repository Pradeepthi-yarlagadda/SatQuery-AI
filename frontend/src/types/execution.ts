export type ExecutionStatus = 'pending' | 'running' | 'completed' | 'failed';

export interface ExecutionStep {
  id: string;
  order: number;
  capability: string;
  status: ExecutionStatus;
  message: string;
  detail?: string;
  timestamp: string;
  durationMs?: number;
}

export interface ExecutionTraceSummary {
  totalSteps: number;
  completedSteps: number;
  status: ExecutionStatus;
  totalDurationMs: number;
  steps: ExecutionStep[];
}
