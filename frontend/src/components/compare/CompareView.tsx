import type { AnalysisResult } from '@/lib/types';

interface Props {
  left: AnalysisResult;
  right: AnalysisResult;
}

function CompareRow({ label, leftVal, rightVal }: { label: string; leftVal: string; rightVal: string }) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '1fr 120px 1fr',
      gap: '0.5rem',
      padding: '0.5rem 0',
      borderBottom: '1px solid var(--border)',
      alignItems: 'center',
    }}>
      <span className="data-value" style={{ textAlign: 'right', fontSize: '0.8rem' }}>{leftVal}</span>
      <span className="label" style={{ textAlign: 'center', fontSize: '0.6rem' }}>{label}</span>
      <span className="data-value" style={{ fontSize: '0.8rem' }}>{rightVal}</span>
    </div>
  );
}

export default function CompareView({ left, right }: Props) {
  return (
    <div className="container" style={{ maxWidth: '800px' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>Comparative Analysis</h1>

      <div className="card">
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 120px 1fr',
          padding: '0.75rem 0',
          borderBottom: '2px solid var(--border)',
          marginBottom: '0.5rem',
        }}>
          <span className="label" style={{ textAlign: 'right' }}>Subject A</span>
          <span className="label" style={{ textAlign: 'center' }}>Feature</span>
          <span className="label">Subject B</span>
        </div>

        <CompareRow
          label="Face Shape"
          leftVal={left.structural_morphology.face_shape.classification}
          rightVal={right.structural_morphology.face_shape.classification}
        />
        <CompareRow
          label="fWHR"
          leftVal={left.structural_morphology.fwhr.estimated_value}
          rightVal={right.structural_morphology.fwhr.estimated_value}
        />
        <CompareRow
          label="Symmetry"
          leftVal={left.structural_morphology.symmetry.assessment}
          rightVal={right.structural_morphology.symmetry.assessment}
        />
        <CompareRow
          label="Jaw"
          leftVal={left.structural_morphology.jaw_definition.masseter_development}
          rightVal={right.structural_morphology.jaw_definition.masseter_development}
        />
        <CompareRow
          label="Primary Emotion"
          leftVal={left.expression_baseline_facs.habitual_emotional_signature.primary_emotion}
          rightVal={right.expression_baseline_facs.habitual_emotional_signature.primary_emotion}
        />
        <CompareRow
          label="Primary Armor"
          leftVal={left.somatic_armor_analysis.overall_armor_pattern.primary_zone}
          rightVal={right.somatic_armor_analysis.overall_armor_pattern.primary_zone}
        />
        <CompareRow
          label="4F Hypothesis"
          leftVal={left.behavioral_hypothesis.walker_4f_hypothesis.slice(0, 60) + '...'}
          rightVal={right.behavioral_hypothesis.walker_4f_hypothesis.slice(0, 60) + '...'}
        />
      </div>
    </div>
  );
}
