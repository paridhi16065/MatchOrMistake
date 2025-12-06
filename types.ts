export enum VerdictType {
  RED_FLAG = 'Red Flag',
  GREEN_FLAG = 'Green Flag',
  BEIGE_FLAG = 'Beige Flag'
}

export interface AnalysisResult {
  verdict: VerdictType;
  score: number; // 0-100
  summary: string;
  redFlags: string[];
  greenFlags: string[];
  detailedAnalysis: string;
}

export interface AnalysisState {
  isLoading: boolean;
  error: string | null;
  result: AnalysisResult | null;
  imagePreview: string | null;
}
