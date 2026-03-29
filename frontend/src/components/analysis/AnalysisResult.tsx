import { useState } from 'react';
import type { AnalysisResult as AnalysisResultType } from '@/lib/types';
import PhotoQualityBadge from './PhotoQuality';
import StructuralPanel from './StructuralPanel';
import SomaticArmorPanel from './SomaticArmorPanel';
import ExpressionBaseline from './ExpressionBaseline';
import BehavioralProfile from './BehavioralProfile';
import ResearchIntegrityPanel from './ResearchIntegrity';

interface Props {
  result: AnalysisResultType;
}

const TABS = [
  { id: 'profile', label: 'Profile' },
  { id: 'structure', label: 'Structure' },
  { id: 'armor', label: 'Armor' },
  { id: 'expression', label: 'Expression' },
  { id: 'research', label: 'Research' },
] as const;

type TabId = typeof TABS[number]['id'];

export default function AnalysisResultView({ result }: Props) {
  const [activeTab, setActiveTab] = useState<TabId>('profile');

  return (
    <div className="container" style={{ maxWidth: '900px' }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        marginBottom: '1rem',
      }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', marginBottom: '0.25rem' }}>Analysis Report</h1>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <span className="badge badge-amber">
              {result.structural_morphology.face_shape.classification}
            </span>
            <span className={`badge ${
              result.photo_quality.overall_confidence >= 0.7 ? 'badge-high' :
              result.photo_quality.overall_confidence >= 0.4 ? 'badge-mid' : 'badge-low'
            }`}>
              {(result.photo_quality.overall_confidence * 100).toFixed(0)}% confidence
            </span>
          </div>
        </div>
      </div>

      {/* Photo Quality */}
      <PhotoQualityBadge quality={result.photo_quality} />

      {/* Tab navigation — desktop tabs, mobile scroll */}
      <div className="tabs" style={{ marginTop: '1.5rem' }}>
        {TABS.map(tab => (
          <button
            key={tab.id}
            className={`tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div style={{ minHeight: '400px' }}>
        {activeTab === 'profile' && (
          <BehavioralProfile
            hypothesis={result.behavioral_hypothesis}
            age={result.perceived_age_analysis}
          />
        )}
        {activeTab === 'structure' && (
          <StructuralPanel morphology={result.structural_morphology} />
        )}
        {activeTab === 'armor' && (
          <SomaticArmorPanel armor={result.somatic_armor_analysis} />
        )}
        {activeTab === 'expression' && (
          <ExpressionBaseline facs={result.expression_baseline_facs} />
        )}
        {activeTab === 'research' && (
          <ResearchIntegrityPanel integrity={result.research_integrity} />
        )}
      </div>
    </div>
  );
}
