import { ImageInput } from '@/types/image';
import { AnalysisResult, ExecutionStep } from '@/types/analysis';
import { OrbitIqCore } from '@/services/orbitIqCore';

export class GroundingAgent {
  public static readonly id = 'grounding';
  public static readonly displayName = 'Region Grounding';

  public static async groundRegion(
    image: ImageInput,
    textPrompt: string,
    onStep?: (step: ExecutionStep) => void
  ): Promise<AnalysisResult> {
    return OrbitIqCore.executeAnalysis(
      {
        inputs: [image],
        query: `Highlight and locate ${textPrompt}`,
        mode: 'single',
      },
      onStep
    );
  }
}
