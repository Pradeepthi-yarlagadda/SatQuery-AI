import { ImageInput } from '@/types/image';
import { AnalysisResult, ExecutionStep } from '@/types/analysis';
import { AnalysisService } from './analysisService';

export class MultimodalService {
  public static async runOpticalSARFusion(
    opticalImage: ImageInput,
    sarImage: ImageInput,
    query: string,
    onStep?: (step: ExecutionStep) => void
  ): Promise<AnalysisResult> {
    return AnalysisService.analyzeOpticalSAR(opticalImage, sarImage, query, onStep);
  }
}
