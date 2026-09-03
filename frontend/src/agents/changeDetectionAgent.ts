import { ImageInput } from '@/types/image';
import { AnalysisResult, ExecutionStep } from '@/types/analysis';
import { OrbitIqCore } from '@/services/orbitIqCore';

export class ChangeDetectionAgent {
  public static readonly id = 'change_detection';
  public static readonly displayName = 'Change Detection';

  public static async detectChanges(
    imageA: ImageInput,
    imageB: ImageInput,
    onStep?: (step: ExecutionStep) => void
  ): Promise<AnalysisResult> {
    return OrbitIqCore.executeAnalysis(
      {
        inputs: [imageA, imageB],
        query: 'Show me where changes occurred and generate categorical difference map.',
        mode: 'temporal',
      },
      onStep
    );
  }
}
