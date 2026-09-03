import { ImageInput } from './image';
import { SpecialistAgentId } from './agent';
import { VisualEvidence } from './evidence';

export type TaskType =
  | 'SINGLE_IMAGE_VQA'
  | 'SCENE_UNDERSTANDING'
  | 'REGION_GROUNDING'
  | 'CHANGE_DETECTION'
  | 'CHANGE_VQA'
  | 'OPTICAL_SAR_FUSION';

export type AnalysisMode = 'single' | 'temporal' | 'multimodal' | 'auto';

export type ExecutionStepStatus = 'pending' | 'running' | 'completed' | 'failed';

export interface ExecutionStep {
  id: string;
  order: number;
  capability: string; // e.g., 'input_validator', 'orbit_iq_core', 'preprocessor', specialist name
  status: ExecutionStepStatus;
  message: string;
  detail?: string;
  timestamp: string;
  durationMs?: number;
}

export interface AnalysisRequest {
  id?: string;
  query: string;
  inputs: ImageInput[];
  mode?: AnalysisMode;
  targetRegion?: string;
  metadataFilters?: Record<string, any>;
}

export interface AnalysisConfidence {
  overall: number; // 0.0 to 1.0
  level: 'High' | 'Moderate' | 'Low';
  factors?: {
    label: string;
    score: number;
    weight: number;
  }[];
}

export interface AnalysisResult {
  id: string;
  requestId: string;
  task: TaskType;
  taskDisplayName: string;
  specialistId: SpecialistAgentId;
  specialistDisplayName: string;
  query: string;
  answer: string;
  summary: string;
  keyFindings: string[];
  confidence: AnalysisConfidence;
  evidence: VisualEvidence;
  executionTrace: ExecutionStep[];
  inputs: ImageInput[];
  completedAt: string;
  executionDurationMs: number;
}
