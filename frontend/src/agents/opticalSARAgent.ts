import { ImageInput } from '@/types/image';
import { AnalysisResult, ExecutionStep } from '@/types/analysis';
import { OrbitIqCore } from '@/services/orbitIqCore';

export class OpticalSARAgent {
  public static readonly id = 'optical_sar';
  public static readonly displayName = 'Optical + SAR Fusion';

  public static async analyzeMultiModalPair(
    opticalImage: ImageInput,
    sarImage: ImageInput,
    query: string,
    onStep?: (step: ExecutionStep) => void
  ): Promise<AnalysisResult> {
    return OrbitIqCore.executeAnalysis(
      {
        inputs: [opticalImage, sarImage],
        query,
        mode: 'multimodal',
      },
      onStep
    );
  }
}
