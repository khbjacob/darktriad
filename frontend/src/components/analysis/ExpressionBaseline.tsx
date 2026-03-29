import type { ExpressionBaselineFACS } from '@/lib/types';
import ConfidenceBar from './ConfidenceBar';
import { Eye } from 'lucide-react';

interface Props {
  facs: ExpressionBaselineFACS;
}

export default function ExpressionBaseline({ facs }: Props) {
  return (
    <div>
      <h2 className="section-title">
        <Eye size={18} style={{ display: 'inline', marginRight: '0.5rem', verticalAlign: 'text-bottom' }} />
        Expression Baseline (FACS)
      </h2>
      <p style={{
        color: 'var(--text-dim)',
        fontSize: '0.8rem',
        marginBottom: '1.25rem',
        marginTop: '-0.75rem',
      }}>
        {facs.description}
      </p>

      {/* Tonic AUs */}
      {facs.tonic_aus_detected.length > 0 && (
        <div className="card" style={{ marginBottom: '1rem' }}>
          <span className="label">Tonic Action Units Detected</span>
          <div style={{ marginTop: '0.75rem' }}>
            {facs.tonic_aus_detected.map((au, i) => (
              <div key={i} style={{
                display: 'grid',
                gridTemplateColumns: '80px 1fr auto',
                gap: '0.75rem',
                alignItems: 'center',
                padding: '0.6rem 0',
                borderBottom: i < facs.tonic_aus_detected.length - 1 ? '1px solid var(--border)' : 'none',
              }}>
                <div>
                  <span className="mono" style={{
                    fontSize: '0.8rem',
                    color: 'var(--data-teal-bright)',
                    fontWeight: 500,
                  }}>
                    {au.au}
                  </span>
                  <br />
                  <span style={{ fontSize: '0.65rem', color: 'var(--text-dim)' }}>
                    {au.name}
                  </span>
                </div>
                <div>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-primary)', lineHeight: 1.4 }}>
                    {au.habitual_emotion_association}
                  </p>
                  <ConfidenceBar value={au.confidence} />
                </div>
                <span className={`badge ${
                  au.intensity === 'marked' ? 'badge-amber' : au.intensity === 'slight' ? 'badge-mid' : 'badge-low'
                }`}>
                  {au.intensity}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Duchenne History */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '1rem',
        marginBottom: '1rem',
      }}>
        <div className="card">
          <span className="label">Duchenne Signature</span>
          <div style={{
            display: 'flex',
            gap: '1.5rem',
            margin: '0.75rem 0',
          }}>
            <div>
              <span className="label" style={{ fontSize: '0.6rem' }}>Crow's Feet</span>
              <div className="data-value">{facs.duchenne_history.crow_feet_development}</div>
            </div>
            <div>
              <span className="label" style={{ fontSize: '0.6rem' }}>Nasolabial</span>
              <div className="data-value">{facs.duchenne_history.nasolabial_development}</div>
            </div>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-primary)', lineHeight: 1.6 }}>
            {facs.duchenne_history.interpretation}
          </p>
        </div>

        <div className="card">
          <span className="label">Contempt Marker (AU12 Asymmetry)</span>
          <div style={{ margin: '0.75rem 0' }}>
            <div className="data-value" style={{ fontSize: '1rem' }}>
              {facs.contempt_marker.asymmetric_au12 ? `Detected — ${facs.contempt_marker.side} side` : 'Not detected'}
            </div>
            <ConfidenceBar value={facs.contempt_marker.confidence} />
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-primary)', lineHeight: 1.6 }}>
            {facs.contempt_marker.interpretation}
          </p>
        </div>
      </div>

      {/* Habitual Emotional Signature */}
      <div className="card" style={{
        borderColor: 'var(--accent-amber)',
        borderWidth: '1px',
      }}>
        <span className="label" style={{ color: 'var(--accent-amber)' }}>
          Habitual Emotional Signature
        </span>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '1rem',
          margin: '1rem 0',
        }}>
          <div>
            <span className="label" style={{ fontSize: '0.6rem' }}>Primary</span>
            <div className="data-value">{facs.habitual_emotional_signature.primary_emotion}</div>
          </div>
          <div>
            <span className="label" style={{ fontSize: '0.6rem' }}>Secondary</span>
            <div className="data-value">{facs.habitual_emotional_signature.secondary_emotion}</div>
          </div>
          <div>
            <span className="label" style={{ fontSize: '0.6rem' }}>Suppressed</span>
            <div style={{ color: 'var(--confidence-low)', fontFamily: 'var(--font-data)', fontSize: '0.85rem' }}>
              {facs.habitual_emotional_signature.suppressed_emotion}
            </div>
          </div>
        </div>
        <p style={{
          fontSize: '0.85rem',
          color: 'var(--text-primary)',
          lineHeight: 1.7,
        }}>
          {facs.habitual_emotional_signature.narrative}
        </p>
      </div>
    </div>
  );
}
