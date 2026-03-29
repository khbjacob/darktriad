import { Link } from 'react-router-dom';
import { Scan, Clock, LogIn, LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export default function Header() {
  const { user, signOut, isConfigured } = useAuth();

  return (
    <header style={{
      borderBottom: '1px solid var(--border)',
      background: 'var(--bg-primary)',
      position: 'sticky',
      top: 0,
      zIndex: 50,
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '60px',
      }}>
        <Link to="/" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          color: 'var(--text-bright)',
          textDecoration: 'none',
        }}>
          <Scan size={22} color="var(--accent-amber-bright)" />
          <span style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '1.4rem',
            fontWeight: 600,
            letterSpacing: '0.02em',
          }}>
            PersonaScope
          </span>
        </Link>

        <nav style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {user && (
            <Link to="/history" style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              color: 'var(--text-secondary)',
              fontSize: '0.85rem',
            }}>
              <Clock size={15} />
              History
            </Link>
          )}
          {isConfigured && (
            user ? (
              <button
                onClick={signOut}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-dim)',
                  fontSize: '0.8rem',
                }}
              >
                <LogOut size={14} />
                Sign Out
              </button>
            ) : (
              <Link to="/login" style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                color: 'var(--text-secondary)',
                fontSize: '0.85rem',
              }}>
                <LogIn size={15} />
                Sign In
              </Link>
            )
          )}
        </nav>
      </div>
    </header>
  );
}
