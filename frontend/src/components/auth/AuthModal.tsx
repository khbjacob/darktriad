import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { X } from 'lucide-react';

interface Props {
  onClose: () => void;
}

export default function AuthModal({ onClose }: Props) {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (mode === 'signin') {
        await signIn(email, password);
      } else {
        await signUp(email, password);
      }
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,0.7)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100,
      padding: '1rem',
    }}>
      <div className="card" style={{
        maxWidth: '400px',
        width: '100%',
        position: 'relative',
      }}>
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            background: 'none',
            border: 'none',
            color: 'var(--text-dim)',
          }}
        >
          <X size={18} />
        </button>

        <h2 style={{ marginBottom: '1.5rem' }}>
          {mode === 'signin' ? 'Sign In' : 'Create Account'}
        </h2>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label className="label" style={{ display: 'block', marginBottom: '0.3rem' }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '0.6rem 0.8rem',
                background: 'var(--bg-input)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius)',
                color: 'var(--text-primary)',
                fontSize: '0.9rem',
                fontFamily: 'var(--font-body)',
              }}
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label className="label" style={{ display: 'block', marginBottom: '0.3rem' }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              minLength={6}
              style={{
                width: '100%',
                padding: '0.6rem 0.8rem',
                background: 'var(--bg-input)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius)',
                color: 'var(--text-primary)',
                fontSize: '0.9rem',
                fontFamily: 'var(--font-body)',
              }}
            />
          </div>

          {error && (
            <p style={{
              color: 'var(--confidence-low)',
              fontSize: '0.8rem',
              marginBottom: '0.75rem',
            }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '0.75rem',
              background: loading ? 'var(--bg-input)' : 'var(--accent-amber)',
              color: 'var(--text-bright)',
              border: 'none',
              borderRadius: 'var(--radius)',
              fontWeight: 600,
              cursor: loading ? 'wait' : 'pointer',
            }}
          >
            {loading ? 'Processing...' : mode === 'signin' ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <p style={{
          textAlign: 'center',
          marginTop: '1rem',
          fontSize: '0.8rem',
          color: 'var(--text-dim)',
        }}>
          {mode === 'signin' ? (
            <>No account? <button onClick={() => setMode('signup')} style={{ background: 'none', border: 'none', color: 'var(--accent-amber-bright)', textDecoration: 'underline', fontSize: '0.8rem' }}>Sign up</button></>
          ) : (
            <>Have an account? <button onClick={() => setMode('signin')} style={{ background: 'none', border: 'none', color: 'var(--accent-amber-bright)', textDecoration: 'underline', fontSize: '0.8rem' }}>Sign in</button></>
          )}
        </p>
      </div>
    </div>
  );
}
