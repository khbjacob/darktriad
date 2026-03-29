export default function Footer() {
  return (
    <footer style={{
      borderTop: '1px solid var(--border)',
      padding: '2rem 0',
      marginTop: '4rem',
      textAlign: 'center',
    }}>
      <div className="container">
        <p style={{
          color: 'var(--text-dim)',
          fontSize: '0.75rem',
          lineHeight: 1.8,
          maxWidth: '700px',
          margin: '0 auto',
        }}>
          PersonaScope maps facial structure against published research and clinical observation
          frameworks. Structural measurements reflect population-level statistical patterns, not
          individual certainties. Muscular analysis draws on clinical traditions (bioenergetics,
          somatic psychology) that are therapeutically validated but not statistically controlled
          in the way morphometric research is. Use this as a starting point for observation and
          hypothesis, not as a conclusion about who someone is.
        </p>
      </div>
    </footer>
  );
}
