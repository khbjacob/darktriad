import { Trash2 } from 'lucide-react';

interface Props {
  id: string;
  createdAt: string;
  faceShape?: string;
  qualityScore: number;
  onView: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function HistoryCard({ id, createdAt, faceShape, qualityScore, onView, onDelete }: Props) {
  const date = new Date(createdAt).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="card" style={{
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
      cursor: 'pointer',
    }}
      onClick={() => onView(id)}
    >
      <div style={{ flex: 1 }}>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>
          {faceShape || 'Analysis'} — {date}
        </p>
        <p style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '0.2rem' }}>
          Quality: {(qualityScore * 100).toFixed(0)}%
        </p>
      </div>
      <button
        onClick={(e) => { e.stopPropagation(); onDelete(id); }}
        style={{
          background: 'none',
          border: 'none',
          color: 'var(--text-dim)',
          padding: '0.4rem',
        }}
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
}
