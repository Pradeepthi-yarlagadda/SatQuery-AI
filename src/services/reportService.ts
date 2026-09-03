import { AnalysisResult } from '@/types/analysis';
import { AnalysisReport } from '@/types/report';

export class ReportService {
  /**
   * Generates a formal evidence-backed analysis report from an AnalysisResult
   */
  public static generateReport(result: AnalysisResult): AnalysisReport {
    return {
      id: `rep-${Date.now()}`,
      analysisId: result.id,
      title: `Orbit IQ Mission Intelligence Report: ${result.taskDisplayName}`,
      generatedAt: new Date().toISOString(),
      author: 'Orbit IQ Core Intelligence System',
      task: result.taskDisplayName,
      specialistUsed: result.specialistDisplayName,
      overallConfidence: result.confidence.overall,
      executiveSummary: result.summary,
      resultReference: result,
      sections: [
        {
          id: 'sec-summary',
          title: '1. Executive Summary',
          type: 'executive_summary',
          content: result.summary,
        },
        {
          id: 'sec-findings',
          title: '2. Key Quantitative & Qualitative Findings',
          type: 'findings',
          content: result.keyFindings.map((f, i) => `${i + 1}. ${f}`).join('\n\n'),
        },
        {
          id: 'sec-evidence',
          title: '3. Visual Evidence & Spatial Mapping',
          type: 'visual_evidence',
          content: result.evidence.description,
          dataPoints: result.evidence.metrics,
          imageUrl: result.evidence.overlayImageUrl || result.evidence.baseImageUrl,
        },
        {
          id: 'sec-confidence',
          title: '4. Confidence & Uncertainty Audit',
          type: 'confidence_audit',
          content: `Overall analytical confidence evaluated at ${(result.confidence.overall * 100).toFixed(1)}% (${result.confidence.level}).`,
          dataPoints: result.confidence.factors?.reduce((acc, curr) => {
            acc[curr.label] = `${(curr.score * 100).toFixed(1)}% (weight: ${curr.weight})`;
            return acc;
          }, {} as Record<string, string>),
        },
        {
          id: 'sec-trace',
          title: '5. Observable Execution Log',
          type: 'trace_log',
          content: result.executionTrace
            .map(
              (step) =>
                `[${step.timestamp.split('T')[1].split('.')[0]}] ${step.message} - ${step.detail || 'Completed'}`
            )
            .join('\n'),
        },
      ],
    };
  }
}
