import { ImageInput } from '@/types/image';
import { AnalysisRequest } from '@/types/analysis';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  inferredMode: 'single' | 'temporal' | 'multimodal';
}

/**
 * Supporting Capability: input_validator
 * Validates file type, modality, number of images, metadata and input configuration
 */
export function validateAnalysisInput(request: AnalysisRequest): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // 1. Query Validation
  if (!request.query || request.query.trim().length === 0) {
    errors.push('Natural language query cannot be empty.');
  } else if (request.query.trim().length < 3) {
    warnings.push('Query is very brief. Provide more specific criteria for higher confidence.');
  }

  // 2. Images Count & Modality Validation
  const inputs = request.inputs || [];

  if (inputs.length === 0) {
    errors.push('At least one remote sensing observation image is required.');
    return {
      isValid: false,
      errors,
      warnings,
      inferredMode: 'single',
    };
  }

  let inferredMode: 'single' | 'temporal' | 'multimodal' = 'single';

  if (inputs.length === 1) {
    inferredMode = 'single';
    const img = inputs[0];
    if (!img.url) {
      errors.push(`Image "${img.fileName}" is missing a valid data URL/source.`);
    }
  } else if (inputs.length === 2) {
    const hasSar = inputs.some((img) => img.modality === 'sar');
    const hasOptical = inputs.some((img) => img.modality === 'optical' || img.modality === 'multispectral');

    if (hasSar && hasOptical) {
      inferredMode = 'multimodal';
    } else {
      inferredMode = 'temporal';
      // Verify temporal date sequence if available
      const [img1, img2] = inputs;
      if (img1.acquisitionDate && img2.acquisitionDate) {
        const date1 = new Date(img1.acquisitionDate).getTime();
        const date2 = new Date(img2.acquisitionDate).getTime();
        if (date1 === date2) {
          warnings.push('Both images share identical acquisition dates. Ensure this is a valid bi-temporal observation pair.');
        }
      }
    }
  } else {
    warnings.push(`Received ${inputs.length} images. Processing primary pair/focus image.`);
    inferredMode = 'temporal';
  }

  // 3. Format Validation
  const validFormats = ['geotiff', 'tiff', 'png', 'jpeg', 'jpg', 'jp2'];
  inputs.forEach((img, idx) => {
    if (img.format && !validFormats.includes(img.format.toLowerCase())) {
      warnings.push(`Image #${idx + 1} (${img.fileName}) format "${img.format}" may require server-side raster conversion.`);
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    inferredMode,
  };
}
