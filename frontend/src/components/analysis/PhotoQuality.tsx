import type { PhotoQuality as PhotoQualityType } from '@/lib/types';
import { CheckCircle, AlertTriangle, XCircle } from 'lucide-react';

interface Props {
  quality: PhotoQualityType;
}

export default function PhotoQualityBadge({ quality }: Props) {
  const confidence = quality.overall_confidence;
  const Icon = confidence >= 0.7 ? CheckCircle : confidence >= 0.4 ? AlertTriangle : XCircle;
  const color = confidence >= 0.7 ? 'var(--confidence-high)' : confidence >= 0.4 ? 'var(--confidence-mid)' : 'var(--confidence-low)';

  return (
    <div className="card" style={{ padding: '1rem' }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.6rem',
        marginBottom: '0.75rem',
      }}>
        <Icon size={18} style={{ color }} />
        <span className="label">Photo Quality</span>
        <span className="mono" style={{ color, fontSize: '0.8rem', marginLeft: 'auto' }}>
          {(confidence * 100).toFixed(0)}%
        </span>
      </div>

      <div style={{
        display: 'flex',
        gap: '0.75rem',
        flexWrap: 'wrap',
        fontSize: '0.75rem',
      }}>
        <span style={{ color: 'var(--text-dim)' }}>
          Lighting: <span style={{ color: 'var(--text-secondary)' }}>{quality.lighting}</span>
        </span>
        <span style={{ color: 'var(--text-dim)' }}>
          Angle: <span style={{ color: 'var(--text-secondary)' }}>{quality.angle}</span>
        </span>
        <span style={{ color: 'var(--text-dim)' }}>
          Expression: <span style={{ color: 'var(--text-secondary)' }}>{quality.expression}</span>
        </span>
        <span style={{ color: 'var(--text-dim)' }}>
          Resolution: <span style={{ color: 'var(--text-secondary)' }}>{quality.resolution}</span>
        </span>
      </div>

      {quality.issues.length > 0 && (
        <div style={{ marginTop: '0.6rem' }}>
          {quality.issues.map((issue, i) => (
            <p key={i} style={{
              fontSize: '0.72rem',
              color: 'var(--confidence-mid)',
              lineHeight: 1.4,
            }}>
              — {issue}
            </p>
          ))}
        </div>
      )}

      <div style={{
        display: 'flex',
        gap: '0.75rem',
        marginTop: '0.6rem',
        fontSize: '0.7rem',
      }}>
        <span style={{ color: quality.usable_for.structural_analysis ? 'var(--confidence-high)' : 'var(--confidence-low)' }}>
          Structure: {quality.usable_for.structural_analysis ? 'usable' : 'limited'}
        </span>
        <span style={{ color: quality.usable_for.muscular_analysis ? 'var(--confidence-high)' : 'var(--confidence-low)' }}>
          Muscular: {quality.usable_for.muscular_analysis ? 'usable' : 'limited'}
        </span>
        <span style={{ color: quality.usable_for.expression_baseline ? 'var(--confidence-high)' : 'var(--confidence-low)' }}>
          Expression: {quality.usable_for.expression_baseline ? 'usable' : 'limited'}
        </span>
      </div>
    </div>
  );
}
