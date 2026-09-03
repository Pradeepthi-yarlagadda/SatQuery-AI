import { ImageInput } from '@/types/image';
import { AnalysisRequest, AnalysisResult, ExecutionStep } from '@/types/analysis';
import { OrbitIqCore } from './orbitIqCore';

/**
 * Public Analysis Service Layer
 * Wraps Orbit IQ Core and provides specialized workflow callers.
 */
export class AnalysisService {
  /**
   * Universal Analysis Function (Unified Orbit IQ Core Flow)
   */
  public static async analyze(
    request: AnalysisRequest,
    onStep?: (step: ExecutionStep) => void
  ): Promise<AnalysisResult> {
    return OrbitIqCore.executeAnalysis(request, onStep);
  }

  /**
   * Workflow A: Single Image Analysis
   */
  public static async analyzeSingleImage(
    image: ImageInput,
    query: string,
    onStep?: (step: ExecutionStep) => void
  ): Promise<AnalysisResult> {
    return this.analyze(
      {
        inputs: [image],
        query,
        mode: 'single',
      },
      onStep
    );
  }

  /**
   * Workflow B: Bi-Temporal Pair Analysis
   */
  public static async analyzeTemporalPair(
    imageA: ImageInput,
    imageB: ImageInput,
    query: string,
    onStep?: (step: ExecutionStep) => void
  ): Promise<AnalysisResult> {
    return this.analyze(
      {
        inputs: [imageA, imageB],
        query,
        mode: 'temporal',
      },
      onStep
    );
  }

  /**
   * Workflow C: Optical + SAR Sensor Fusion Analysis
   */
  public static async analyzeOpticalSAR(
    opticalImage: ImageInput,
    sarImage: ImageInput,
    query: string,
    onStep?: (step: ExecutionStep) => void
  ): Promise<AnalysisResult> {
    return this.analyze(
      {
        inputs: [opticalImage, sarImage],
        query,
        mode: 'multimodal',
      },
      onStep
    );
  }

  // Capability specific shortcuts
  public static async generateCaption(image: ImageInput): Promise<AnalysisResult> {
    return this.analyzeSingleImage(image, 'Describe this remote sensing scene and classify land cover.');
  }

  public static async answerVQA(image: ImageInput, question: string): Promise<AnalysisResult> {
    return this.analyzeSingleImage(image, question);
  }

  public static async groundRegion(image: ImageInput, entityToGround: string): Promise<AnalysisResult> {
    return this.analyzeSingleImage(image, `Highlight and segment the ${entityToGround}.`);
  }

  public static async detectChanges(imageA: ImageInput, imageB: ImageInput): Promise<AnalysisResult> {
    return this.analyzeTemporalPair(imageA, imageB, 'Show me where the changes occurred and classify categories.');
  }

  public static async answerChangeQuestion(
    imageA: ImageInput,
    imageB: ImageInput,
    question: string
  ): Promise<AnalysisResult> {
    return this.analyzeTemporalPair(imageA, imageB, question);
  }
}
