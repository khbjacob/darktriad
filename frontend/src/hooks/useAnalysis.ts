import { useState } from 'react';
import { analyzeImage } from '@/lib/api';
import type { AnalysisResult } from '@/lib/types';

export function useAnalysis() {
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [storedId, setStoredId] = useState<string | null>(null);

  const analyze = async (imageBase64: string, userId?: string) => {
    setLoading(true);
    setError(null);
    setResult(null);
    setStoredId(null);

    try {
      const response = await analyzeImage(imageBase64, userId);
      setResult(response.analysis);
      setStoredId(response.id);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Analysis failed';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setResult(null);
    setError(null);
    setStoredId(null);
  };

  return { result, loading, error, storedId, analyze, reset };
}
