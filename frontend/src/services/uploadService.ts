import { ImageInput, ImageFormat, ImageModality } from '@/types/image';

/**
 * Upload & Image Ingestion Service
 */
export class UploadService {
  /**
   * Ingest a File from a browser File input
   */
  public static async processUploadedFile(file: File, modality?: ImageModality): Promise<ImageInput> {
    const fileName = file.name;
    const extension = fileName.split('.').pop()?.toLowerCase() || 'png';
    const format = (['geotiff', 'tiff', 'png', 'jpeg', 'jpg', 'jp2'].includes(extension)
      ? extension
      : 'png') as ImageFormat;

    // Determine modality if not explicitly passed
    let determinedModality: ImageModality = modality || 'optical';
    if (!modality) {
      if (fileName.toLowerCase().includes('sar') || fileName.toLowerCase().includes('s1')) {
        determinedModality = 'sar';
      } else if (fileName.toLowerCase().includes('msi') || fileName.toLowerCase().includes('sentinel2')) {
        determinedModality = 'multispectral';
      }
    }

    // Create a local object URL for preview
    const objectUrl = URL.createObjectURL(file);

    return {
      id: `img-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      fileName,
      url: objectUrl,
      format,
      modality: determinedModality,
      acquisitionDate: new Date().toISOString().split('T')[0],
      width: 2048,
      height: 2048,
      fileSizeBytes: file.size,
      metadata: {
        sensor: determinedModality === 'sar' ? 'C-SAR Sentinel-1' : 'MSI Sentinel-2',
        spatialResolutionMeters: 10,
        cloudCoverPercentage: 0,
      },
    };
  }
}
