import type { AnalysisResponse, StoredAnalysis } from './types';

const API_URL = import.meta.env.VITE_API_URL || '';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || `Request failed: ${res.status}`);
  }

  return data as T;
}

export async function analyzeImage(
  imageBase64: string,
  userId?: string
): Promise<AnalysisResponse> {
  return request<AnalysisResponse>('/api/analyze', {
    method: 'POST',
    body: JSON.stringify({
      image: imageBase64,
      user_id: userId,
    }),
  });
}

export async function getAnalysis(id: string): Promise<StoredAnalysis> {
  return request<StoredAnalysis>(`/api/analysis/${id}`);
}

export async function listAnalyses(userId: string): Promise<StoredAnalysis[]> {
  return request<StoredAnalysis[]>(`/api/analyses?user_id=${userId}`);
}

export async function deleteAnalysis(id: string, userId: string): Promise<void> {
  await request(`/api/analysis/${id}?user_id=${userId}`, { method: 'DELETE' });
}

export async function compareAnalyses(ids: [string, string]) {
  return request<{ analyses: StoredAnalysis[] }>('/api/compare', {
    method: 'POST',
    body: JSON.stringify({ analysis_ids: ids }),
  });
}
