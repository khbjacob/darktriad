// Complete TypeScript interfaces matching the JSON analysis schema

export interface PhotoQuality {
  lighting: 'good' | 'adequate' | 'poor';
  angle: 'frontal' | 'slight_turn' | 'significant_turn';
  expression: 'neutral' | 'slight_expression' | 'strong_expression';
  resolution: 'high' | 'adequate' | 'low';
  overall_confidence: number;
  issues: string[];
  usable_for: {
    structural_analysis: boolean;
    muscular_analysis: boolean;
    expression_baseline: boolean;
  };
}

export interface MorphologyField {
  assessment?: string;
  classification?: string;
  confidence: number;
  research_note: string;
  caveat?: string | null;
  notes?: string;
}

export interface FaceShape extends MorphologyField {
  classification: string;
}

export interface FWHR extends MorphologyField {
  estimated_value: string;
  classification: string;
}

export interface Symmetry extends MorphologyField {
  assessment: string;
  notable_asymmetries: string[];
}

export interface JawDefinition extends MorphologyField {
  assessment: string;
  masseter_development: 'minimal' | 'moderate' | 'significant';
  mandibular_angle: 'narrow' | 'average' | 'wide';
}

export interface EyeCharacteristics extends MorphologyField {
  spacing: 'close' | 'average' | 'wide';
  opening: 'narrow' | 'average' | 'wide';
  orbital_depth: 'shallow' | 'average' | 'deep';
}

export interface LipProportions extends MorphologyField {
  upper_lower_ratio: string;
  overall_fullness: 'thin' | 'moderate' | 'full';
}

export interface ChinShape extends MorphologyField {
  projection: 'receding' | 'average' | 'prominent';
  width: 'narrow' | 'average' | 'wide';
}

export interface FeatureHarmony {
  score: number;
  notes: string;
  golden_ratio_proximity: string;
}

export interface StructuralMorphology {
  face_shape: FaceShape;
  fwhr: FWHR;
  symmetry: Symmetry;
  jaw_definition: JawDefinition;
  brow_ridge: MorphologyField;
  eye_characteristics: EyeCharacteristics;
  nose_proportions: MorphologyField;
  lip_proportions: LipProportions;
  cheekbone_prominence: MorphologyField;
  forehead_ratio: MorphologyField;
  chin_shape: ChinShape;
  feature_harmony: FeatureHarmony;
}

export interface ArmorZone {
  present: boolean;
  severity: 'none' | 'mild' | 'moderate' | 'significant';
  indicators: string[];
  interpretation: string;
  walker_4f_association?: string;
}

export interface SomaticArmorAnalysis {
  description: string;
  jaw_armor: ArmorZone;
  brow_forehead_armor: ArmorZone;
  periorbital_armor: ArmorZone;
  mouth_lip_armor: ArmorZone;
  neck_throat_visible: {
    present: boolean;
    indicators: string[];
    interpretation: string;
  };
  overall_armor_pattern: {
    primary_zone: string;
    secondary_zone: string;
    narrative: string;
  };
}

export interface TonicAU {
  au: string;
  name: string;
  intensity: 'trace' | 'slight' | 'marked';
  confidence: number;
  habitual_emotion_association: string;
}

export interface ExpressionBaselineFACS {
  description: string;
  tonic_aus_detected: TonicAU[];
  duchenne_history: {
    crow_feet_development: 'minimal' | 'moderate' | 'deep';
    nasolabial_development: 'minimal' | 'moderate' | 'deep';
    interpretation: string;
  };
  contempt_marker: {
    asymmetric_au12: boolean;
    side: 'left' | 'right' | 'none';
    confidence: number;
    interpretation: string;
  };
  habitual_emotional_signature: {
    primary_emotion: string;
    secondary_emotion: string;
    suppressed_emotion: string;
    narrative: string;
  };
}

export interface PerceivedAgeAnalysis {
  structural_age_markers: string;
  somatic_age_markers: string;
  overall_assessment: string;
}

export interface BehavioralHypothesis {
  description: string;
  first_six_seconds: string;
  structural_temperament: string;
  emotional_history: string;
  social_signal: string;
  armor_narrative: string;
  potential_blindspot: string;
  navarro_comfort_baseline: string;
  walker_4f_hypothesis: string;
  profiler_notes: string;
}

export interface ResearchIntegrity {
  strong_correlations: string[];
  moderate_correlations: string[];
  clinical_pattern_recognition: string[];
  speculative: string[];
}

export interface AnalysisResult {
  photo_quality: PhotoQuality;
  structural_morphology: StructuralMorphology;
  somatic_armor_analysis: SomaticArmorAnalysis;
  expression_baseline_facs: ExpressionBaselineFACS;
  perceived_age_analysis: PerceivedAgeAnalysis;
  behavioral_hypothesis: BehavioralHypothesis;
  research_integrity: ResearchIntegrity;
}

export interface StoredAnalysis {
  id: string;
  user_id: string;
  analysis: AnalysisResult;
  photo_quality_score: number;
  created_at: string;
  updated_at: string;
}

export interface AnalysisResponse {
  analysis: AnalysisResult;
  id: string | null;
}

export interface ApiError {
  error: string;
  raw_preview?: string;
}
