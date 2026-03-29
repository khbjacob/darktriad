import { useEffect } from 'react';
import { useHistory } from '@/hooks/useHistory';
import HistoryCard from './HistoryCard';

interface Props {
  userId: string;
  onView: (id: string) => void;
}

export default function HistoryList({ userId, onView }: Props) {
  const { analyses, loading, fetch, remove } = useHistory(userId);

  useEffect(() => {
    fetch();
  }, [fetch]);

  if (loading) {
    return <p style={{ color: 'var(--text-dim)', textAlign: 'center' }}>Loading history...</p>;
  }

  if (analyses.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem 0' }}>
        <p style={{ color: 'var(--text-dim)' }}>No analyses yet</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'grid', gap: '0.75rem' }}>
      {analyses.map(a => (
        <HistoryCard
          key={a.id}
          id={a.id}
          createdAt={a.created_at}
          qualityScore={a.photo_quality_score}
          onView={onView}
          onDelete={remove}
        />
      ))}
    </div>
  );
}
