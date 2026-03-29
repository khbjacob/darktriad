import { useState, useCallback } from 'react';
import { listAnalyses, deleteAnalysis } from '@/lib/api';
import type { StoredAnalysis } from '@/lib/types';

export function useHistory(userId?: string) {
  const [analyses, setAnalyses] = useState<StoredAnalysis[]>([]);
  const [loading, setLoading] = useState(false);

  const fetch = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const data = await listAnalyses(userId);
      setAnalyses(data);
    } catch {
      // silently fail — history is optional
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const remove = async (id: string) => {
    if (!userId) return;
    await deleteAnalysis(id, userId);
    setAnalyses(prev => prev.filter(a => a.id !== id));
  };

  return { analyses, loading, fetch, remove };
}
