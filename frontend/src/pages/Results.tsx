import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAnalysis } from '@/lib/api';
import AnalysisResultView from '@/components/analysis/AnalysisResult';
import type { AnalysisResult } from '@/lib/types';

export default function Results() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    getAnalysis(id)
      .then(data => setResult(data.analysis))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="container" style={{ textAlign: 'center', paddingTop: '4rem' }}>
        <p style={{ color: 'var(--text-dim)' }}>Loading analysis...</p>
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="container" style={{ textAlign: 'center', paddingTop: '4rem' }}>
        <p style={{ color: 'var(--confidence-low)', marginBottom: '1rem' }}>
          {error || 'Analysis not found'}
        </p>
        <button
          onClick={() => navigate('/')}
          style={{
            padding: '0.6rem 1.5rem',
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
            color: 'var(--text-secondary)',
          }}
        >
          Back to Home
        </button>
      </div>
    );
  }

  return <AnalysisResultView result={result} />;
}
