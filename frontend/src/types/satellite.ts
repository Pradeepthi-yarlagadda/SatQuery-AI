export type AnalysisMode = 'single' | 'temporal' | 'optical_sar' | 'grounding' | 'vqa' | 'captioning';

export type TaskType = 
  | 'Single Image VQA'
  | 'Scene Captioning'
  | 'Text-Guided Grounding'
  | 'Bi-temporal Change Analysis'
  | 'Change-based VQA'
  | 'Cross-Modal Optical + SAR Analysis'
  | 'Multispectral Land-Cover Classification';

export interface GeoTIFFMetadata {
  filename: string;
  filesize: string;
  modality: 'Optical (RGB/NIR)' | 'SAR (C-Band VV/VH)' | 'Multispectral (12-Band)' | 'Hyperspectral';
  resolution: string;
  gsd: string;
  bands: number;
  bandNames: string[];
  crs: string;
  bounds: [number, number, number, number]; // [minLon, minLat, maxLon, maxLat]
  acquisitionDate: string;
  satellite: 'Sentinel-2A' | 'Sentinel-1B (SAR)' | 'Landsat-9' | 'Cartosat-3' | 'RISAT-1A';
  cloudCover?: string;
  polarization?: string;
  isCompatible: boolean;
  compatibilityNote: string;
}

export interface TraceStep {
  step: number;
  timestamp: string;
  stage: string;
  detail: string;
  toolUsed: string;
  status: 'pending' | 'active' | 'completed' | 'verified';
  durationMs: number;
}

export interface AnalysisEvidence {
  title: string;
  type: 'before' | 'after' | 'change_mask' | 'grounding_box' | 'optical_view' | 'sar_view' | 'fusion_view';
  imageUrl: string;
  description: string;
  metrics?: { label: string; value: string; delta?: string }[];
}

export interface AnalysisScenario {
  id: string;
  title: string;
  tagline: string;
  mode: AnalysisMode;
  detectedTask: TaskType;
  selectedModel: {
    name: string;
    dataset: string;
    architecture: string;
    status: 'Ready' | 'Active';
  };
  confidence: number;
  locationName: string;
  coordinates: string;
  inputs: GeoTIFFMetadata[];
  primaryQuery: string;
  suggestedQueries: string[];
  answerSummary: string;
  detailedFindings: string[];
  primaryChangeRegion?: string;
  evidence: AnalysisEvidence[];
  trace: TraceStep[];
  detectedFeatures: {
    category: string;
    changeType: 'increased' | 'decreased' | 'detected' | 'stable';
    areaKm2?: number;
    percentageChange?: string;
    color: string;
  }[];
  groundingBox?: {
    x: number;
    y: number;
    width: number;
    height: number;
    label: string;
    confidence: number;
  };
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'orbitiq' | 'system';
  timestamp: string;
  content: string;
  evidenceRef?: string;
  confidence?: number;
  suggestedFollowUps?: string[];
}

export interface LayerState {
  satelliteBase: boolean;
  analysisOverlay: boolean;
  changeRegions: boolean;
  waterBodies: boolean;
  vegetation: boolean;
  builtUpAreas: boolean;
  roadNetwork: boolean;
  sarBackscatter: boolean;
  fusionHeatmap: boolean;
}
