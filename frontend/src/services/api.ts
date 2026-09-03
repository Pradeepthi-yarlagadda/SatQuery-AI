import { AnalysisRequest, AnalysisResult } from '@/types/analysis';
import { AnalysisReport } from '@/types/report';

/**
 * Centralized API Client & Endpoints Configuration
 * 
 * PLACEHOLDER ARCHITECTURE FOR REAL BACKEND INTEGRATION:
 * When connecting a live Python/FastAPI/PyTorch backend, update API_BASE_URL
 * in environment variables (NEXT_PUBLIC_API_URL).
 * The service layer calls these endpoints transparently.
 */
export const API_CONFIG = {
  baseUrl: process.env.NEXT_PUBLIC_API_URL || '/api',
  timeoutMs: 30000,
  endpoints: {
    // Master Orbit IQ Core endpoint (unified routing)
    analyze: '/v1/orbit-iq/analyze',
    
    // Specialist Capabilities endpoints (if calling directly)
    vqa: '/v1/specialists/vqa',
    captioning: '/v1/specialists/captioning',
    grounding: '/v1/specialists/grounding',
    changeDetection: '/v1/specialists/change-detection',
    changeVqa: '/v1/specialists/change-vqa',
    opticalSar: '/v1/specialists/optical-sar',
    
    // Supporting Services endpoints
    upload: '/v1/storage/upload',
    validate: '/v1/validate',
    report: '/v1/reports/generate',
    history: '/v1/history',
  },
};

export class ApiError extends Error {
  status: number;
  data?: any;

  constructor(message: string, status: number, data?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

/**
 * Generic Fetch Wrapper with timeout and error handling
 */
export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = endpoint.startsWith('http')
    ? endpoint
    : `${API_CONFIG.baseUrl}${endpoint}`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.timeoutMs);

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch {
        errorData = { message: response.statusText };
      }
      throw new ApiError(
        errorData.message || `HTTP error ${response.status}`,
        response.status,
        errorData
      );
    }

    return (await response.json()) as T;
  } catch (error: any) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new ApiError('Request timed out after 30s', 408);
    }
    throw error;
  }
}
