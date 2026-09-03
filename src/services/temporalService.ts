import { ImageInput } from '@/types/image';
import { AnalysisResult, ExecutionStep } from '@/types/analysis';
import { AnalysisService } from './analysisService';

export class TemporalService {
  public static async runTemporalComparison(
    imageA: ImageInput,
    imageB: ImageInput,
    query: string,
    onStep?: (step: ExecutionStep) => void
  ): Promise<AnalysisResult> {
    return AnalysisService.analyzeTemporalPair(imageA, imageB, query, onStep);
  }
}
