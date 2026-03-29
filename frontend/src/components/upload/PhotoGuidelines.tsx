import { Camera, Sun, User, AlertCircle } from 'lucide-react';

export default function PhotoGuidelines() {
  const tips = [
    { icon: <User size={16} />, text: 'Face the camera directly — frontal angle, neutral expression' },
    { icon: <Sun size={16} />, text: 'Even lighting on both sides of the face — avoid harsh shadows' },
    { icon: <Camera size={16} />, text: 'High resolution, sharp focus — at least shoulders-up framing' },
    { icon: <AlertCircle size={16} />, text: 'Remove sunglasses and hats — full face visibility required' },
  ];

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
      gap: '0.75rem',
      marginTop: '1.5rem',
    }}>
      {tips.map((tip, i) => (
        <div key={i} style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: '0.6rem',
          padding: '0.6rem 0.8rem',
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius)',
          fontSize: '0.78rem',
          color: 'var(--text-secondary)',
        }}>
          <span style={{ color: 'var(--accent-amber)', marginTop: '1px', flexShrink: 0 }}>
            {tip.icon}
          </span>
          {tip.text}
        </div>
      ))}
    </div>
  );
}
