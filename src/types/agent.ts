export type MasterAgentId = 'orbit_iq_core';

export type SpecialistAgentId =
  | 'vqa'
  | 'captioning'
  | 'grounding'
  | 'change_detection'
  | 'change_vqa'
  | 'optical_sar';

export type SupportingCapabilityId =
  | 'input_validator'
  | 'preprocessor'
  | 'evidence_engine'
  | 'confidence_engine'
  | 'execution_trace'
  | 'report_generator';

export type AgentId = MasterAgentId | SpecialistAgentId;

export type AgentRole = 'master' | 'specialist' | 'supporting';

export type AgentStatus = 'ready' | 'running' | 'busy' | 'offline';

export interface AgentCapability {
  id: string;
  name: string;
  description: string;
  expectedInputCount: number | [number, number]; // e.g. 1 for single, 2 for pair
  supportedModalities: ('optical' | 'multispectral' | 'sar')[];
}

export interface AgentDefinition {
  id: AgentId | SupportingCapabilityId;
  name: string;
  displayName: string;
  role: AgentRole;
  purpose: string;
  status: AgentStatus;
  capabilities?: AgentCapability[];
}

export interface SpecialistSelection {
  specialistId: SpecialistAgentId;
  specialistName: string;
  rationale: string;
  confidenceScore: number;
}
