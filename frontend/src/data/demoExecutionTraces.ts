import { ExecutionStep } from '@/types/analysis';

/**
 * Standard observable execution pipeline steps produced by Orbit IQ Core
 * Note: Only safe, observable operational steps are surfaced (no hidden chain-of-thought).
 */
export const DEFAULT_EXECUTION_PIPELINE_STEPS: Omit<ExecutionStep, 'id' | 'timestamp' | 'durationMs'>[] = [
  {
    order: 1,
    capability: 'orbit_iq_core',
    status: 'pending',
    message: 'Input received & query understood',
    detail: 'Decomposed natural language prompt and ingested imagery metadata.',
  },
  {
    order: 2,
    capability: 'input_validator',
    status: 'pending',
    message: 'Input validated',
    detail: 'Verified sensor modality, dimensions, spatial coordinate reference, and format integrity.',
  },
  {
    order: 3,
    capability: 'orbit_iq_core',
    status: 'pending',
    message: 'Task identified',
    detail: 'Classified task category and determined required analytical output structure.',
  },
  {
    order: 4,
    capability: 'orbit_iq_core',
    status: 'pending',
    message: 'Specialist selected',
    detail: 'Routed task to domain-expert specialist intelligence capability.',
  },
  {
    order: 5,
    capability: 'preprocessor',
    status: 'pending',
    message: 'Image prepared & aligned',
    detail: 'Normalized radiometric spectral channels and aligned sub-pixel grid coordinates.',
  },
  {
    order: 6,
    capability: 'specialist_engine',
    status: 'pending',
    message: 'Analysis running',
    detail: 'Executed remote sensing inference and computed spatial feature correlations.',
  },
  {
    order: 7,
    capability: 'evidence_engine',
    status: 'pending',
    message: 'Visual evidence generated',
    detail: 'Rendered bounding box coordinates, segmentation masks, and pixel delta overlays.',
  },
  {
    order: 8,
    capability: 'confidence_engine',
    status: 'pending',
    message: 'Confidence calculated & result completed',
    detail: 'Synthesized quantitative findings and calculated uncertainty metrics.',
  },
];
