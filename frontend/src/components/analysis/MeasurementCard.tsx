import ConfidenceBar from './ConfidenceBar';

interface MeasurementCardProps {
  title: string;
  value: string;
  confidence: number;
  researchNote: string;
  caveat?: string | null;
  details?: Record<string, string>;
}

export default function MeasurementCard({
  title,
  value,
  confidence,
  researchNote,
  caveat,
  details,
}: MeasurementCardProps) {
  return (
    <div className="card" style={{ padding: '1.25rem' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '0.6rem',
      }}>
        <span className="label">{title}</span>
        <span className={`badge ${confidence >= 0.7 ? 'badge-high' : confidence >= 0.4 ? 'badge-mid' : 'badge-low'}`}>
          {confidence >= 0.7 ? 'high' : confidence >= 0.4 ? 'moderate' : 'low'} conf.
        </span>
      </div>

      <div className="data-value" style={{
        fontSize: '1rem',
        marginBottom: '0.5rem',
      }}>
        {value}
      </div>

      <ConfidenceBar value={confidence} />

      {details && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '0.4rem',
          marginTop: '0.75rem',
          paddingTop: '0.75rem',
          borderTop: '1px solid var(--border)',
        }}>
          {Object.entries(details).map(([k, v]) => (
            <div key={k}>
              <span className="label" style={{ fontSize: '0.6rem' }}>{k}</span>
              <div style={{ color: 'var(--text-primary)', fontSize: '0.8rem' }}>{v}</div>
            </div>
          ))}
        </div>
      )}

      <p style={{
        marginTop: '0.75rem',
        fontSize: '0.75rem',
        color: 'var(--text-dim)',
        lineHeight: 1.5,
      }}>
        {researchNote}
      </p>

      {caveat && (
        <p style={{
          marginTop: '0.4rem',
          fontSize: '0.7rem',
          color: 'var(--confidence-low)',
          lineHeight: 1.4,
        }}>
          {caveat}
        </p>
      )}
    </div>
  );
}
