import type { BehavioralHypothesis, PerceivedAgeAnalysis } from '@/lib/types';
import { Brain } from 'lucide-react';

interface Props {
  hypothesis: BehavioralHypothesis;
  age: PerceivedAgeAnalysis;
}

function ProfileSection({ label, content }: { label: string; content: string }) {
  return (
    <div style={{
      padding: '1.25rem 0',
      borderBottom: '1px solid var(--border)',
    }}>
      <span className="label" style={{ marginBottom: '0.5rem', display: 'block' }}>
        {label}
      </span>
      <p style={{
        fontSize: '0.9rem',
        color: 'var(--text-primary)',
        lineHeight: 1.75,
      }}>
        {content}
      </p>
    </div>
  );
}

export default function BehavioralProfile({ hypothesis, age }: Props) {
  const sections = [
    { label: 'First Six Seconds', content: hypothesis.first_six_seconds },
    { label: 'Structural Temperament — The Hardware', content: hypothesis.structural_temperament },
    { label: 'Emotional History — The Software', content: hypothesis.emotional_history },
    { label: 'Social Signal — The Feedback Loop', content: hypothesis.social_signal },
    { label: 'Armor Narrative — What Is Being Held Back', content: hypothesis.armor_narrative },
    { label: 'Navarro Comfort Baseline', content: hypothesis.navarro_comfort_baseline },
    { label: 'Walker 4F Hypothesis', content: hypothesis.walker_4f_hypothesis },
    { label: 'Potential Blindspot', content: hypothesis.potential_blindspot },
  ];

  return (
    <div>
      <h2 className="section-title">
        <Brain size={18} style={{ display: 'inline', marginRight: '0.5rem', verticalAlign: 'text-bottom' }} />
        Behavioral Hypothesis
      </h2>
      <p style={{
        color: 'var(--text-dim)',
        fontSize: '0.8rem',
        marginBottom: '1.25rem',
        marginTop: '-0.75rem',
      }}>
        {hypothesis.description}
      </p>

      <div className="card" style={{ padding: '0 1.5rem' }}>
        {sections.map((s, i) => (
          <ProfileSection key={i} label={s.label} content={s.content} />
        ))}

        {/* Profiler Notes — distinct styling */}
        <div style={{
          padding: '1.25rem 0',
          borderBottom: 'none',
        }}>
          <span className="label" style={{
            marginBottom: '0.5rem',
            display: 'block',
            color: 'var(--accent-amber)',
          }}>
            Profiler Notes
          </span>
          <p style={{
            fontSize: '0.9rem',
            color: 'var(--text-primary)',
            lineHeight: 1.75,
          }}>
            {hypothesis.profiler_notes}
          </p>
        </div>
      </div>

      {/* Perceived Age */}
      <div className="card" style={{ marginTop: '1rem' }}>
        <span className="label">Perceived Age Analysis</span>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1rem',
          margin: '0.75rem 0',
        }}>
          <div>
            <span className="label" style={{ fontSize: '0.6rem' }}>Structural Markers</span>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-primary)', lineHeight: 1.5, marginTop: '0.25rem' }}>
              {age.structural_age_markers}
            </p>
          </div>
          <div>
            <span className="label" style={{ fontSize: '0.6rem' }}>Somatic Markers</span>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-primary)', lineHeight: 1.5, marginTop: '0.25rem' }}>
              {age.somatic_age_markers}
            </p>
          </div>
        </div>
        <p style={{
          fontSize: '0.85rem',
          color: 'var(--text-primary)',
          lineHeight: 1.6,
          marginTop: '0.5rem',
          paddingTop: '0.75rem',
          borderTop: '1px solid var(--border)',
        }}>
          {age.overall_assessment}
        </p>
      </div>
    </div>
  );
}
