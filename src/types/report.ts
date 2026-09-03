import { AnalysisResult } from './analysis';

export interface ReportSection {
  id: string;
  title: string;
  type: 'executive_summary' | 'methodology' | 'findings' | 'visual_evidence' | 'confidence_audit' | 'trace_log';
  content: string;
  dataPoints?: Record<string, string | number>;
  imageUrl?: string;
}

export interface AnalysisReport {
  id: string;
  analysisId: string;
  title: string;
  generatedAt: string;
  author: string; // "Orbit IQ Core Intelligence System"
  task: string;
  specialistUsed: string;
  overallConfidence: number;
  executiveSummary: string;
  sections: ReportSection[];
  resultReference: AnalysisResult;
}
