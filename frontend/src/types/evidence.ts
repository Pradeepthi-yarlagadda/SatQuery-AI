export type EvidenceType =
  | 'bounding_box'
  | 'segmentation_mask'
  | 'heatmap'
  | 'change_map'
  | 'bitemporal_comparison'
  | 'optical_sar_fusion'
  | 'landcover_classification';

export interface BoundingBox {
  id: string;
  label: string;
  confidence: number;
  // Normalized coordinates [0, 1]
  xmin: number;
  ymin: number;
  xmax: number;
  ymax: number;
  color?: string;
  properties?: Record<string, string | number>;
}

export interface PolygonCoordinate {
  x: number;
  y: number;
}

export interface MaskPolygon {
  id: string;
  label: string;
  coordinates: PolygonCoordinate[];
  fillColor: string;
  strokeColor: string;
  opacity: number;
  areaKm2?: number;
  percentageCoverage?: number;
}

export interface ChangeCategory {
  category: string;
  label: string;
  deltaPercentage: number;
  areaKm2: number;
  color: string;
  description: string;
}

export interface VisualEvidence {
  type: EvidenceType;
  title: string;
  description: string;
  baseImageUrl?: string;
  overlayImageUrl?: string;
  compareImageUrl?: string; // For bi-temporal or optical-SAR comparisons
  boundingBoxes?: BoundingBox[];
  masks?: MaskPolygon[];
  changeCategories?: ChangeCategory[];
  metrics?: Record<string, string | number>;
  confidence: number;
}
