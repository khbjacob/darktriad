interface ConfidenceBarProps {
  value: number;
  label?: string;
  showValue?: boolean;
}

export default function ConfidenceBar({ value, label, showValue = true }: ConfidenceBarProps) {
  const color = value >= 0.7
    ? 'var(--confidence-high)'
    : value >= 0.4
      ? 'var(--confidence-mid)'
      : 'var(--confidence-low)';

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
      {label && (
        <span className="label" style={{ minWidth: '70px' }}>{label}</span>
      )}
      <div className="confidence-bar" style={{ flex: 1 }}>
        <div
          className="confidence-bar-fill"
          style={{ width: `${value * 100}%`, background: color }}
        />
      </div>
      {showValue && (
        <span className="mono" style={{
          fontSize: '0.7rem',
          color,
          minWidth: '32px',
          textAlign: 'right',
        }}>
          {(value * 100).toFixed(0)}%
        </span>
      )}
    </div>
  );
}
