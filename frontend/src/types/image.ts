export type ImageFormat = 'geotiff' | 'tiff' | 'png' | 'jpeg' | 'jpg' | 'jp2';
export type ImageModality = 'optical' | 'multispectral' | 'hyperspectral' | 'sar' | 'thermal';

export interface GeoBoundingBox {
  minLat: number;
  maxLat: number;
  minLng: number;
  maxLng: number;
}

export interface ImageMetadata {
  sensor?: string;
  satellite?: string;
  spatialResolutionMeters?: number;
  cloudCoverPercentage?: number;
  spectralBands?: string[];
  polarization?: 'VV' | 'VH' | 'HH' | 'HV' | 'dual' | 'quad';
  coordinateSystem?: string;
  geoBounds?: GeoBoundingBox;
  sunElevationAngle?: number;
}

export interface ImageInput {
  id: string;
  fileName: string;
  url: string;
  format: ImageFormat;
  modality: ImageModality;
  acquisitionDate: string; // ISO-8601 string or YYYY-MM-DD
  width: number;
  height: number;
  fileSizeBytes?: number;
  thumbnailUrl?: string;
  metadata?: ImageMetadata;
}
