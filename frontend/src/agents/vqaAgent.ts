import { ImageInput } from '@/types/image';
import { AnalysisResult, ExecutionStep } from '@/types/analysis';
import { OrbitIqCore } from '@/services/orbitIqCore';

export class VQAAgent {
  public static readonly id = 'vqa';
  public static readonly displayName = 'Remote Sensing VQA';

  public static async answerQuestion(
    image: ImageInput,
    question: string,
    onStep?: (step: ExecutionStep) => void
  ): Promise<AnalysisResult> {
    return OrbitIqCore.executeAnalysis(
      {
        inputs: [image],
        query: question,
        mode: 'single',
      },
      onStep
    );
  }
}
