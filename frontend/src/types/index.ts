// Core types for the PersonaScope application

export interface FacialMeasurements {
  fWHR: number; // Facial width-to-height ratio
  symmetry: number; // Facial symmetry score (0-100)
  eyebrowThickness: number;
  eyebrowPosition: number;
  jawProminence: number;
  eyeSpacing: number;
  eyeShape: string;
  lipFullness: number;
  mouthWidth: number;
  faceShape: string;
}

export interface TraitCorrelation {
  trait: string;
  score: number; // 0-100
  confidence: number; // 0-1
  percentile: number; // Population percentile
  description: string;
  researchBasis: string;
  limitations: string[];
  citations: Citation[];
}

export interface Citation {
  authors: string;
  year: number;
  title: string;
  journal: string;
  doi?: string;
  url?: string;
  summary: string;
}

export interface BigFiveTrait {
  trait: 'Openness' | 'Conscientiousness' | 'Extraversion' | 'Agreeableness' | 'Neuroticism';
  score: number;
  confidence: number;
  percentile: number;
  description: string;
}

export interface DarkTriadTrait {
  trait: 'Narcissism' | 'Machiavellianism' | 'Psychopathy';
  score: number;
  confidence: number;
  percentile: number;
  description: string;
  disclaimer: string;
}

export interface AnalysisResult {
  id: string;
  timestamp: string;
  facialMeasurements: FacialMeasurements;
  bigFive: BigFiveTrait[];
  darkTriad: DarkTriadTrait[];
  otherTraits: TraitCorrelation[];
  overallConfidence: number;
  processingTime: number;
  imageUrl?: string;
}

export interface AnalysisRequest {
  image: File | string; // File object or base64 string
  includeHistory?: boolean;
}

export interface User {
  id: string;
  email: string;
  createdAt: string;
  analysisHistory: AnalysisResult[];
}

export interface DisclaimerAcceptance {
  accepted: boolean;
  timestamp: string;
  version: string;
}

export interface AppConfig {
  apiBaseUrl: string;
  supabaseUrl: string;
  supabaseAnonKey: string;
  maxFileSize: number;
  allowedFileTypes: string[];
  rateLimit: {
    maxRequests: number;
    windowMs: number;
  };
}
