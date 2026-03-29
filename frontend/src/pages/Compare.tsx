import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { compareAnalyses } from '@/lib/api';
import CompareView from '@/components/compare/CompareView';
import type { AnalysisResult } from '@/lib/types';

export default function Compare() {
  const [searchParams] = useSearchParams();
  const [results, setResults] = useState<[AnalysisResult, AnalysisResult] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const a = searchParams.get('a');
    const b = searchParams.get('b');
    if (!a || !b) {
      setError('Two analysis IDs required (?a=...&b=...)');
      setLoading(false);
      return;
    }

    compareAnalyses([a, b])
      .then(data => {
        setResults([data.analyses[0].analysis, data.analyses[1].analysis]);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [searchParams]);

  if (loading) {
    return (
      <div className="container" style={{ textAlign: 'center', paddingTop: '4rem' }}>
        <p style={{ color: 'var(--text-dim)' }}>Loading comparison...</p>
      </div>
    );
  }

  if (error || !results) {
    return (
      <div className="container" style={{ textAlign: 'center', paddingTop: '4rem' }}>
        <p style={{ color: 'var(--confidence-low)' }}>{error || 'Failed to load'}</p>
      </div>
    );
  }

  return <CompareView left={results[0]} right={results[1]} />;
}
