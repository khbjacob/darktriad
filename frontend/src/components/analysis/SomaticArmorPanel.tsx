import type { SomaticArmorAnalysis, ArmorZone } from '@/lib/types';
import { Shield } from 'lucide-react';

interface Props {
  armor: SomaticArmorAnalysis;
}

function ArmorZoneCard({ name, zone }: { name: string; zone: ArmorZone }) {
  const severityColor = {
    none: 'var(--text-dim)',
    mild: 'var(--confidence-mid)',
    moderate: 'var(--accent-amber-bright)',
    significant: 'var(--confidence-low)',
  }[zone.severity];

  if (!zone.present) {
    return (
      <div className="card" style={{ padding: '1rem', opacity: 0.5 }}>
        <span className="label">{name}</span>
        <p style={{ color: 'var(--text-dim)', fontSize: '0.8rem', marginTop: '0.3rem' }}>
          Not detected
        </p>
      </div>
    );
  }

  return (
    <div className="card" style={{ padding: '1.25rem', borderLeftColor: severityColor, borderLeftWidth: '3px' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '0.5rem',
      }}>
        <span className="label">{name}</span>
        <span className="badge" style={{
          background: `${severityColor}22`,
          color: severityColor,
        }}>
          {zone.severity}
        </span>
      </div>

      {zone.indicators.length > 0 && (
        <div style={{ marginBottom: '0.6rem' }}>
          {zone.indicators.map((ind, i) => (
            <span key={i} style={{
              display: 'inline-block',
              margin: '0.15rem 0.25rem 0.15rem 0',
              padding: '0.15rem 0.5rem',
              background: 'var(--bg-input)',
              borderRadius: '3px',
              fontSize: '0.7rem',
              color: 'var(--text-secondary)',
            }}>
              {ind}
            </span>
          ))}
        </div>
      )}

      <p style={{ fontSize: '0.8rem', color: 'var(--text-primary)', lineHeight: 1.6 }}>
        {zone.interpretation}
      </p>

      {zone.walker_4f_association && (
        <p style={{
          marginTop: '0.5rem',
          fontSize: '0.72rem',
          color: 'var(--accent-amber)',
        }}>
          Walker 4F: {zone.walker_4f_association}
        </p>
      )}
    </div>
  );
}

export default function SomaticArmorPanel({ armor }: Props) {
  return (
    <div>
      <h2 className="section-title">
        <Shield size={18} style={{ display: 'inline', marginRight: '0.5rem', verticalAlign: 'text-bottom' }} />
        Somatic Armor Analysis
      </h2>
      <p style={{
        color: 'var(--text-dim)',
        fontSize: '0.8rem',
        marginBottom: '1.25rem',
        marginTop: '-0.75rem',
      }}>
        {armor.description}
      </p>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '1rem',
        marginBottom: '1.5rem',
      }}>
        <ArmorZoneCard name="Jaw Armor" zone={armor.jaw_armor} />
        <ArmorZoneCard name="Brow / Forehead Armor" zone={armor.brow_forehead_armor} />
        <ArmorZoneCard name="Periorbital Armor" zone={armor.periorbital_armor} />
        <ArmorZoneCard name="Mouth / Lip Armor" zone={armor.mouth_lip_armor} />
      </div>

      {armor.neck_throat_visible.present && (
        <div className="card" style={{ marginBottom: '1.5rem', padding: '1.25rem' }}>
          <span className="label">Neck / Throat</span>
          {armor.neck_throat_visible.indicators.length > 0 && (
            <div style={{ marginTop: '0.4rem', marginBottom: '0.4rem' }}>
              {armor.neck_throat_visible.indicators.map((ind, i) => (
                <span key={i} style={{
                  display: 'inline-block',
                  margin: '0.15rem 0.25rem 0.15rem 0',
                  padding: '0.15rem 0.5rem',
                  background: 'var(--bg-input)',
                  borderRadius: '3px',
                  fontSize: '0.7rem',
                  color: 'var(--text-secondary)',
                }}>
                  {ind}
                </span>
              ))}
            </div>
          )}
          <p style={{ fontSize: '0.8rem', color: 'var(--text-primary)', lineHeight: 1.6 }}>
            {armor.neck_throat_visible.interpretation}
          </p>
        </div>
      )}

      {/* Overall pattern narrative */}
      <div className="card" style={{
        padding: '1.5rem',
        borderColor: 'var(--accent-amber)',
        borderWidth: '1px',
      }}>
        <span className="label" style={{ color: 'var(--accent-amber)' }}>Overall Armor Pattern</span>
        <div style={{
          display: 'flex',
          gap: '1.5rem',
          margin: '0.75rem 0',
          fontSize: '0.8rem',
        }}>
          <div>
            <span className="label" style={{ fontSize: '0.6rem' }}>Primary Zone</span>
            <div className="data-value">{armor.overall_armor_pattern.primary_zone}</div>
          </div>
          <div>
            <span className="label" style={{ fontSize: '0.6rem' }}>Secondary Zone</span>
            <div className="data-value">{armor.overall_armor_pattern.secondary_zone}</div>
          </div>
        </div>
        <p style={{
          fontSize: '0.85rem',
          color: 'var(--text-primary)',
          lineHeight: 1.7,
        }}>
          {armor.overall_armor_pattern.narrative}
        </p>
      </div>
    </div>
  );
}
