import { useState } from 'react';
import { Scan } from 'lucide-react';
import UploadZone from '@/components/upload/UploadZone';
import AnalysisResultView from '@/components/analysis/AnalysisResult';
import { useAnalysis } from '@/hooks/useAnalysis';
import { useAuth } from '@/hooks/useAuth';

const LOADING_STAGES = [
  'Receiving image',
  'Detecting facial landmarks',
  'Analyzing structural morphology',
  'Reading tonic muscle activation (FACS)',
  'Mapping somatic armor patterns',
  'Establishing comfort baseline',
  'Synthesizing behavioral hypothesis',
  'Compiling research integrity assessment',
  'Finalizing report',
];

export default function Home() {
  const { result, loading, error, analyze, reset } = useAnalysis();
  const { user } = useAuth();
  const [loadingStage, setLoadingStage] = useState(0);

  const handleImageReady = async (base64: string) => {
    setLoadingStage(0);

    // Progress through stages during loading
    const interval = setInterval(() => {
      setLoadingStage(prev => {
        if (prev >= LOADING_STAGES.length - 1) {
          clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });
    }, 2200);

    await analyze(base64, user?.id);
    clearInterval(interval);
  };

  if (result) {
    return (
      <div>
        <AnalysisResultView result={result} />
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <button
            onClick={reset}
            style={{
              padding: '0.75rem 2rem',
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius)',
              color: 'var(--text-secondary)',
              fontSize: '0.85rem',
            }}
          >
            Analyze Another
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container" style={{ maxWidth: '500px', textAlign: 'center', paddingTop: '4rem' }}>
        <Scan
          size={48}
          className="pulse"
          style={{ margin: '0 auto 1.5rem', color: 'var(--accent-amber-bright)' }}
        />
        <h2 style={{ marginBottom: '0.5rem' }}>Analyzing</h2>
        <p style={{ color: 'var(--text-dim)', fontSize: '0.85rem', marginBottom: '2rem' }}>
          Claude is reading this face across five analytical frameworks.
          This takes 15-30 seconds.
        </p>

        <div style={{ textAlign: 'left' }}>
          {LOADING_STAGES.map((stage, i) => (
            <div key={i} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              padding: '0.4rem 0',
              opacity: i <= loadingStage ? 1 : 0.3,
              transition: 'opacity 0.5s',
            }}>
              <div style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: i < loadingStage
                  ? 'var(--confidence-high)'
                  : i === loadingStage
                    ? 'var(--accent-amber-bright)'
                    : 'var(--border)',
                flexShrink: 0,
              }} />
              <span style={{
                fontSize: '0.78rem',
                color: i === loadingStage ? 'var(--text-bright)' : 'var(--text-dim)',
                fontFamily: i === loadingStage ? 'var(--font-data)' : undefined,
              }}>
                {stage}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ maxWidth: '700px' }}>
      {/* Hero */}
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <h1 style={{ marginBottom: '0.75rem' }}>PersonaScope</h1>
        <p style={{
          color: 'var(--text-secondary)',
          fontSize: '0.95rem',
          maxWidth: '500px',
          margin: '0 auto',
          lineHeight: 1.7,
        }}>
          Facial morphology analysis across structural, muscular, and expression frameworks.
          Upload a clear, frontal photograph.
        </p>
      </div>

      {error && (
        <div className="card" style={{
          marginBottom: '1.5rem',
          borderLeftColor: 'var(--confidence-low)',
          borderLeftWidth: '3px',
          padding: '1rem 1.25rem',
        }}>
          <p style={{ color: 'var(--confidence-low)', fontSize: '0.85rem' }}>{error}</p>
          <button
            onClick={reset}
            style={{
              marginTop: '0.5rem',
              background: 'none',
              border: 'none',
              color: 'var(--text-secondary)',
              fontSize: '0.8rem',
              textDecoration: 'underline',
            }}
          >
            Try again
          </button>
        </div>
      )}

      <UploadZone onImageReady={handleImageReady} disabled={loading} />
    </div>
  );
}
