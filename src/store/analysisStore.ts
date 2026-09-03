import { AnalysisResult, ExecutionStep, AnalysisMode } from '@/types/analysis';
import { ImageInput } from '@/types/image';

export interface AnalysisState {
  currentMode: AnalysisMode;
  selectedImages: ImageInput[];
  currentQuery: string;
  isAnalyzing: boolean;
  activeSteps: ExecutionStep[];
  currentResult: AnalysisResult | null;
  error: string | null;
}

// In-memory global state store singleton
export const analysisStore = {
  state: {
    currentMode: 'single',
    selectedImages: [],
    currentQuery: '',
    isAnalyzing: false,
    activeSteps: [],
    currentResult: null,
    error: null,
  } as AnalysisState,

  getState() {
    return this.state;
  },

  setState(partial: Partial<AnalysisState>) {
    this.state = { ...this.state, ...partial };
  },

  reset() {
    this.state = {
      currentMode: 'single',
      selectedImages: [],
      currentQuery: '',
      isAnalyzing: false,
      activeSteps: [],
      currentResult: null,
      error: null,
    };
  },
};
