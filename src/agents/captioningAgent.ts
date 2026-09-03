import { ImageInput } from '@/types/image';
import { AnalysisResult, ExecutionStep } from '@/types/analysis';
import { OrbitIqCore } from '@/services/orbitIqCore';

export class CaptioningAgent {
  public static readonly id = 'captioning';
  public static readonly displayName = 'Scene Understanding';

  public static async describeScene(
    image: ImageInput,
    onStep?: (step: ExecutionStep) => void
  ): Promise<AnalysisResult> {
    return OrbitIqCore.executeAnalysis(
      {
        inputs: [image],
        query: 'Describe this remote sensing scene and classify land cover distribution.',
        mode: 'single',
      },
      onStep
    );
  }
}
