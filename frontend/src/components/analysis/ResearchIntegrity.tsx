import type { ResearchIntegrity as ResearchIntegrityType } from '@/lib/types';
import { BookOpen, CheckCircle, AlertTriangle, Stethoscope, HelpCircle } from 'lucide-react';

interface Props {
  integrity: ResearchIntegrityType;
}

function EvidenceSection({
  title,
  items,
  icon,
  color,
}: {
  title: string;
  items: string[];
  icon: React.ReactNode;
  color: string;
}) {
  if (items.length === 0) return null;

  return (
    <div className="card" style={{
      padding: '1.25rem',
      borderLeftColor: color,
      borderLeftWidth: '3px',
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        marginBottom: '0.75rem',
      }}>
        {icon}
        <span className="label" style={{ color }}>{title}</span>
      </div>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {items.map((item, i) => (
          <li key={i} style={{
            padding: '0.4rem 0',
            borderBottom: i < items.length - 1 ? '1px solid var(--border)' : 'none',
            fontSize: '0.8rem',
            color: 'var(--text-primary)',
            lineHeight: 1.5,
          }}>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function ResearchIntegrityPanel({ integrity }: Props) {
  return (
    <div>
      <h2 className="section-title">
        <BookOpen size={18} style={{ display: 'inline', marginRight: '0.5rem', verticalAlign: 'text-bottom' }} />
        Research Integrity
      </h2>
      <p style={{
        color: 'var(--text-dim)',
        fontSize: '0.8rem',
        marginBottom: '1.25rem',
        marginTop: '-0.75rem',
      }}>
        Four tiers of evidence. Honest separation of what we know, what we suspect, and what we are inferring.
      </p>

      <div style={{
        display: 'grid',
        gap: '1rem',
      }}>
        <EvidenceSection
          title="Strong Correlations"
          items={integrity.strong_correlations}
          icon={<CheckCircle size={16} style={{ color: 'var(--confidence-high)' }} />}
          color="var(--confidence-high)"
        />

        <EvidenceSection
          title="Moderate Correlations"
          items={integrity.moderate_correlations}
          icon={<AlertTriangle size={16} style={{ color: 'var(--confidence-mid)' }} />}
          color="var(--confidence-mid)"
        />

        <EvidenceSection
          title="Clinical Pattern Recognition"
          items={integrity.clinical_pattern_recognition}
          icon={<Stethoscope size={16} style={{ color: 'var(--accent-amber-bright)' }} />}
          color="var(--accent-amber-bright)"
        />

        <EvidenceSection
          title="Speculative"
          items={integrity.speculative}
          icon={<HelpCircle size={16} style={{ color: 'var(--confidence-low)' }} />}
          color="var(--confidence-low)"
        />
      </div>
    </div>
  );
}
