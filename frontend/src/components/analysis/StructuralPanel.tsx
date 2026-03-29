import type { StructuralMorphology } from '@/lib/types';
import MeasurementCard from './MeasurementCard';

interface Props {
  morphology: StructuralMorphology;
}

export default function StructuralPanel({ morphology }: Props) {
  const m = morphology;

  return (
    <div>
      <h2 className="section-title">Structural Morphology</h2>
      <p style={{
        color: 'var(--text-dim)',
        fontSize: '0.8rem',
        marginBottom: '1.25rem',
        marginTop: '-0.75rem',
      }}>
        Bone structure, proportions, ratios. What the skeleton says.
      </p>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '1rem',
      }}>
        <MeasurementCard
          title="Face Shape"
          value={m.face_shape.classification}
          confidence={m.face_shape.confidence}
          researchNote={m.face_shape.notes || ''}
        />

        <MeasurementCard
          title="fWHR"
          value={`${m.fwhr.estimated_value} — ${m.fwhr.classification}`}
          confidence={m.fwhr.confidence}
          researchNote={m.fwhr.research_note}
          caveat={m.fwhr.caveat}
        />

        <MeasurementCard
          title="Symmetry"
          value={m.symmetry.assessment}
          confidence={m.symmetry.confidence}
          researchNote={m.symmetry.research_note}
          caveat={m.symmetry.caveat}
          details={m.symmetry.notable_asymmetries.length > 0 ? {
            'Notable': m.symmetry.notable_asymmetries.join(', '),
          } : undefined}
        />

        <MeasurementCard
          title="Jaw Definition"
          value={m.jaw_definition.assessment}
          confidence={m.jaw_definition.confidence}
          researchNote={m.jaw_definition.research_note}
          caveat={m.jaw_definition.caveat}
          details={{
            'Masseter': m.jaw_definition.masseter_development,
            'Mandibular': m.jaw_definition.mandibular_angle,
          }}
        />

        <MeasurementCard
          title="Brow Ridge"
          value={m.brow_ridge.assessment || ''}
          confidence={m.brow_ridge.confidence}
          researchNote={m.brow_ridge.research_note}
        />

        <MeasurementCard
          title="Eye Characteristics"
          value={`${m.eye_characteristics.spacing} spacing, ${m.eye_characteristics.opening} opening`}
          confidence={m.eye_characteristics.confidence}
          researchNote={m.eye_characteristics.research_note}
          details={{
            'Spacing': m.eye_characteristics.spacing,
            'Opening': m.eye_characteristics.opening,
            'Depth': m.eye_characteristics.orbital_depth,
          }}
        />

        <MeasurementCard
          title="Nose Proportions"
          value={m.nose_proportions.assessment || ''}
          confidence={m.nose_proportions.confidence}
          researchNote={m.nose_proportions.research_note}
        />

        <MeasurementCard
          title="Lip Proportions"
          value={`${m.lip_proportions.overall_fullness} — ${m.lip_proportions.upper_lower_ratio}`}
          confidence={m.lip_proportions.confidence}
          researchNote={m.lip_proportions.research_note}
        />

        <MeasurementCard
          title="Cheekbone Prominence"
          value={m.cheekbone_prominence.assessment || ''}
          confidence={m.cheekbone_prominence.confidence}
          researchNote={m.cheekbone_prominence.research_note}
        />

        <MeasurementCard
          title="Forehead Ratio"
          value={m.forehead_ratio.assessment || ''}
          confidence={m.forehead_ratio.confidence}
          researchNote={m.forehead_ratio.research_note}
        />

        <MeasurementCard
          title="Chin Shape"
          value={`${m.chin_shape.projection} projection, ${m.chin_shape.width} width`}
          confidence={m.chin_shape.confidence}
          researchNote={m.chin_shape.research_note}
        />

        <div className="card" style={{ padding: '1.25rem' }}>
          <span className="label">Feature Harmony</span>
          <div className="data-value" style={{ fontSize: '1.4rem', margin: '0.5rem 0' }}>
            {(m.feature_harmony.score * 100).toFixed(0)}
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
            {m.feature_harmony.notes}
          </p>
          <p style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginTop: '0.3rem' }}>
            Golden ratio proximity: {m.feature_harmony.golden_ratio_proximity}
          </p>
        </div>
      </div>
    </div>
  );
}
