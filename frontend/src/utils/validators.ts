export { validateAnalysisInput } from '@/services/inputValidator';
export type { ValidationResult } from '@/services/inputValidator';

export function isValidImageUrl(url: string): boolean {
  return url.startsWith('http://') || url.startsWith('https://') || url.startsWith('/') || url.startsWith('blob:');
}
