import { ImageInput } from '@/types/image';
import { AnalysisResult, ExecutionStep } from '@/types/analysis';
import { OrbitIqCore } from '@/services/orbitIqCore';

export class ChangeVQAAgent {
  public static readonly id = 'change_vqa';
  public static readonly displayName = 'Change Intelligence';

  public static async answerChangeQuestion(
    imageA: ImageInput,
    imageB: ImageInput,
    question: string,
    onStep?: (step: ExecutionStep) => void
  ): Promise<AnalysisResult> {
    return OrbitIqCore.executeAnalysis(
      {
        inputs: [imageA, imageB],
        query: question,
        mode: 'temporal',
      },
      onStep
    );
  }
}
