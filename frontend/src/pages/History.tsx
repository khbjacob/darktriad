import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import HistoryList from '@/components/history/HistoryList';

export default function History() {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="container" style={{ textAlign: 'center', paddingTop: '4rem' }}>
        <p style={{ color: 'var(--text-dim)' }}>Sign in to view your analysis history.</p>
      </div>
    );
  }

  return (
    <div className="container" style={{ maxWidth: '600px' }}>
      <h1 style={{ marginBottom: '1.5rem' }}>Analysis History</h1>
      <HistoryList userId={user.id} onView={(id) => navigate(`/results/${id}`)} />
    </div>
  );
}
