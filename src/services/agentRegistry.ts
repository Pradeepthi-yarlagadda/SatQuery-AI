import { AgentDefinition, AgentId, SupportingCapabilityId } from '@/types/agent';

export const AGENT_REGISTRY: Record<AgentId | SupportingCapabilityId, AgentDefinition> = {
  // =========================================================================
  // MASTER CONTROLLER / ORCHESTRATOR
  // =========================================================================
  orbit_iq_core: {
    id: 'orbit_iq_core',
    name: 'orbit_iq_core',
    displayName: 'Orbit IQ Core',
    role: 'master',
    purpose: 'Master orchestration, natural language query understanding, task identification, and capability routing controller.',
    status: 'ready',
    capabilities: [
      {
        id: 'query_decomposition',
        name: 'Query Decomposition & Task Routing',
        description: 'Analyzes user natural language intent, determines image requirements, and routes to the optimal specialist capability.',
        expectedInputCount: [1, 2],
        supportedModalities: ['optical', 'multispectral', 'sar'],
      },
    ],
  },

  // =========================================================================
  // SPECIALIST CAPABILITIES
  // =========================================================================
  vqa: {
    id: 'vqa',
    name: 'vqa',
    displayName: 'Remote Sensing VQA',
    role: 'specialist',
    purpose: 'Answers complex natural language questions on single optical/multispectral/SAR remote sensing images with quantitative evidence.',
    status: 'ready',
    capabilities: [
      {
        id: 'rs_visual_question_answering',
        name: 'Remote Sensing Visual Question Answering',
        description: 'Computes spatial statistics, counts objects, and estimates land cover percentages in response to natural language prompts.',
        expectedInputCount: 1,
        supportedModalities: ['optical', 'multispectral', 'sar'],
      },
    ],
  },

  captioning: {
    id: 'captioning',
    name: 'captioning',
    displayName: 'Scene Understanding',
    role: 'specialist',
    purpose: 'Generates comprehensive scene descriptions, land cover distributions, geographic context, and structural taxonomy from a single satellite image.',
    status: 'ready',
    capabilities: [
      {
        id: 'scene_captioning',
        name: 'Comprehensive Scene Captioning & Summary',
        description: 'Produces high-level semantic descriptions and land cover classification breakdowns.',
        expectedInputCount: 1,
        supportedModalities: ['optical', 'multispectral', 'sar'],
      },
    ],
  },

  grounding: {
    id: 'grounding',
    name: 'grounding',
    displayName: 'Region Grounding',
    role: 'specialist',
    purpose: 'Detects, localizes, and generates spatial bounding boxes or segmentation masks for entities mentioned in natural language text queries.',
    status: 'ready',
    capabilities: [
      {
        id: 'spatial_grounding',
        name: 'Visual Grounding & Localization',
        description: 'Outputs precise pixel bounding boxes, polygons, and highlighted attention masks matching prompt keywords.',
        expectedInputCount: 1,
        supportedModalities: ['optical', 'multispectral', 'sar'],
      },
    ],
  },

  change_detection: {
    id: 'change_detection',
    name: 'change_detection',
    displayName: 'Change Detection',
    role: 'specialist',
    purpose: 'Compares bi-temporal satellite image pairs to produce categorical change maps, pixel difference masks, and surface expansion statistics.',
    status: 'ready',
    capabilities: [
      {
        id: 'bitemporal_change_mapping',
        name: 'Bi-Temporal Change Mapping',
        description: 'Generates pixel-aligned delta maps identifying built-up sprawl, vegetation loss, water fluctuations, and infrastructure changes.',
        expectedInputCount: 2,
        supportedModalities: ['optical', 'multispectral', 'sar'],
      },
    ],
  },

  change_vqa: {
    id: 'change_vqa',
    name: 'change_vqa',
    displayName: 'Change Intelligence',
    role: 'specialist',
    purpose: 'Answers qualitative and quantitative change questions over bi-temporal satellite pairs with reasoning and visual delta evidence.',
    status: 'ready',
    capabilities: [
      {
        id: 'bitemporal_vqa',
        name: 'Bi-Temporal Visual Question Answering',
        description: 'Provides natural language explanations and metrics for changes observed between observation dates T1 and T2.',
        expectedInputCount: 2,
        supportedModalities: ['optical', 'multispectral', 'sar'],
      },
    ],
  },

  optical_sar: {
    id: 'optical_sar',
    name: 'optical_sar',
    displayName: 'Optical + SAR Fusion',
    role: 'specialist',
    purpose: 'Fuses co-registered multi-spectral optical imagery and Synthetic Aperture Radar (SAR) backscatter for all-weather, multi-sensor intelligence.',
    status: 'ready',
    capabilities: [
      {
        id: 'sensor_fusion_analysis',
        name: 'Multi-Sensor Joint Interpretation',
        description: 'Correlates optical spectral reflectance with SAR dielectric roughness and double-bounce scattering for water and building penetration.',
        expectedInputCount: 2,
        supportedModalities: ['optical', 'sar'],
      },
    ],
  },

  // =========================================================================
  // INTERNAL SUPPORTING SERVICES (Non user-facing)
  // =========================================================================
  input_validator: {
    id: 'input_validator',
    name: 'input_validator',
    displayName: 'Input Validation Service',
    role: 'supporting',
    purpose: 'Validates file formats, sensor modalities, GeoTIFF spatial metadata, resolution compatibility, and query completeness.',
    status: 'ready',
  },

  preprocessor: {
    id: 'preprocessor',
    name: 'preprocessor',
    displayName: 'Image Preprocessing Engine',
    role: 'supporting',
    purpose: 'Normalizes reflectance, co-registers bi-temporal/multi-sensor pixel grids, and prepares analysis tensors.',
    status: 'ready',
  },

  evidence_engine: {
    id: 'evidence_engine',
    name: 'evidence_engine',
    displayName: 'Visual Evidence Engine',
    role: 'supporting',
    purpose: 'Generates SVG bounding box coordinates, segmentation polygons, change difference heatmaps, and false-color overlays.',
    status: 'ready',
  },

  confidence_engine: {
    id: 'confidence_engine',
    name: 'confidence_engine',
    displayName: 'Confidence & Uncertainty Engine',
    role: 'supporting',
    purpose: 'Evaluates spatial entropy, model softmax probabilities, sensor SNR, and temporal alignment confidence scores.',
    status: 'ready',
  },

  execution_trace: {
    id: 'execution_trace',
    name: 'execution_trace',
    displayName: 'Observable Execution Tracer',
    role: 'supporting',
    purpose: 'Records high-level observable execution milestones without exposing internal chain-of-thought.',
    status: 'ready',
  },

  report_generator: {
    id: 'report_generator',
    name: 'report_generator',
    displayName: 'Mission Report Generator',
    role: 'supporting',
    purpose: 'Synthesizes findings, metrics, evidence overlays, and confidence audits into structured executive analysis documents.',
    status: 'ready',
  },
};

/**
 * Returns a registered agent definition by ID
 */
export function getAgentDefinition(id: AgentId | SupportingCapabilityId): AgentDefinition {
  return AGENT_REGISTRY[id] || AGENT_REGISTRY.orbit_iq_core;
}

/**
 * Returns all specialist capabilities
 */
export function getSpecialistAgents(): AgentDefinition[] {
  return Object.values(AGENT_REGISTRY).filter((agent) => agent.role === 'specialist');
}
