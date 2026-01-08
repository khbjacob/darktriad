import React, { useState } from 'react';
import { AnalysisResult } from '../types';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import {
  AlertTriangle,
  Download,
  Info,
  BookOpen,
  TrendingUp,
  Eye,
} from 'lucide-react';

interface ResultsDashboardProps {
  result: AnalysisResult;
  onExportPDF?: () => void;
}

const ResultsDashboard: React.FC<ResultsDashboardProps> = ({ result, onExportPDF }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'bigfive' | 'features' | 'research'>('overview');

  // Prepare radar chart data for Big Five
  const bigFiveRadarData = result.bigFive.map(trait => ({
    trait: trait.trait,
    score: trait.score,
    avg: 50, // Population average
  }));

  // Prepare bar chart data for facial measurements
  const featureData = [
    { feature: 'fWHR', value: result.facialMeasurements.fWHR * 50 },
    { feature: 'Symmetry', value: result.facialMeasurements.symmetry },
    { feature: 'Jaw Prominence', value: result.facialMeasurements.jawProminence },
    { feature: 'Eye Spacing', value: result.facialMeasurements.eyeSpacing * 20 },
    { feature: 'Lip Fullness', value: result.facialMeasurements.lipFullness },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Warning Banner */}
      <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-lg shadow">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-bold text-yellow-900 mb-1">
              NOT FOR DECISION-MAKING
            </h3>
            <p className="text-sm text-yellow-800 leading-relaxed">
              These results are based on weak statistical correlations from research literature.
              They have low predictive accuracy and should be treated as entertainment only.
              Do NOT use for hiring, dating, or any important life decisions.
            </p>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-3xl font-bold text-academic-900 mb-2">
              Analysis Report
            </h1>
            <p className="text-academic-600">
              Generated: {new Date(result.timestamp).toLocaleString()}
            </p>
            <p className="text-sm text-academic-500">
              Processing time: {result.processingTime.toFixed(2)}s | Overall confidence: {(result.overallConfidence * 100).toFixed(0)}%
            </p>
          </div>
          {onExportPDF && (
            <button
              onClick={onExportPDF}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export PDF
            </button>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-academic-200">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 font-medium transition ${
              activeTab === 'overview'
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-academic-600 hover:text-academic-900'
            }`}
          >
            <TrendingUp className="w-4 h-4 inline mr-1" />
            Overview
          </button>
          <button
            onClick={() => setActiveTab('bigfive')}
            className={`px-4 py-2 font-medium transition ${
              activeTab === 'bigfive'
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-academic-600 hover:text-academic-900'
            }`}
          >
            <Info className="w-4 h-4 inline mr-1" />
            Personality Traits
          </button>
          <button
            onClick={() => setActiveTab('features')}
            className={`px-4 ph-2 font-medium transition ${
              activeTab === 'features'
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-academic-600 hover:text-academic-900'
            }`}
          >
            <Eye className="w-4 h-4 inline mr-1" />
            Facial Features
          </button>
          <button
            onClick={() => setActiveTab('research')}
            className={`px-4 py-2 font-medium transition ${
              activeTab === 'research'
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-academic-600 hover:text-academic-900'
            }`}
          >
            <BookOpen className="w-4 h-4 inline mr-1" />
            Research Basis
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid md:grid-cols-2 gap-6">
          {/* Big Five Radar */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-academic-900 mb-4">
              Big Five Personality Profile
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={bigFiveRadarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="trait" />
                <PolarRadiusAxis angle={90} domain={[0, 100]} />
                <Radar
                  name="Your Score"
                  dataKey="score"
                  stroke="#0284c7"
                  fill="#0284c7"
                  fillOpacity={0.6}
                />
                <Radar
                  name="Average"
                  dataKey="avg"
                  stroke="#94a3b8"
                  fill="#94a3b8"
                  fillOpacity={0.3}
                />
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
            <p className="text-xs text-academic-500 mt-2 italic">
              Note: These are population-level correlations, not individual predictions
            </p>
          </div>

          {/* Dark Triad */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-academic-900 mb-4">
              Dark Triad Indicators
            </h2>
            <div className="space-y-4">
              {result.darkTriad.map((trait, idx) => (
                <div key={idx}>
                  <div className="flex justify-between mb-1">
                    <span className="font-medium text-sm">{trait.trait}</span>
                    <span className="text-sm text-academic-600">
                      {trait.score.toFixed(0)}/100
                    </span>
                  </div>
                  <div className="w-full bg-academic-200 rounded-full h-2">
                    <div
                      className="bg-purple-600 h-2 rounded-full transition-all"
                      style={{ width: `${trait.score}%` }}
                    />
                  </div>
                  <p className="text-xs text-academic-500 mt-1">
                    Confidence: {(trait.confidence * 100).toFixed(0)}% | Percentile: {trait.percentile}th
                  </p>
                  <div className="mt-2 p-2 bg-yellow-50 border-l-2 border-yellow-500 rounded">
                    <p className="text-xs text-yellow-800">{trait.disclaimer}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'bigfive' && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold text-academic-900 mb-4">
            Big Five Personality Traits (OCEAN)
          </h2>
          <div className="space-y-6">
            {result.bigFive.map((trait, idx) => (
              <div key={idx} className="border-l-4 border-primary-500 pl-4">
                <h3 className="text-lg font-semibold text-academic-900 mb-2">
                  {trait.trait}
                </h3>
                <div className="flex items-center gap-4 mb-2">
                  <div className="flex-1">
                    <div className="w-full bg-academic-200 rounded-full h-3">
                      <div
                        className="bg-primary-600 h-3 rounded-full transition-all"
                        style={{ width: `${trait.score}%` }}
                      />
                    </div>
                  </div>
                  <span className="font-bold text-lg text-primary-700">
                    {trait.score.toFixed(0)}
                  </span>
                </div>
                <p className="text-sm text-academic-700 mb-2">{trait.description}</p>
                <div className="flex gap-4 text-xs text-academic-600">
                  <span>Confidence: {(trait.confidence * 100).toFixed(0)}%</span>
                  <span>Percentile: {trait.percentile}th</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'features' && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold text-academic-900 mb-4">
            Facial Feature Measurements
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={featureData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="feature" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Bar dataKey="value" fill="#0284c7" />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-6 grid md:grid-cols-2 gap-4">
            <div className="p-4 bg-academic-50 rounded">
              <h4 className="font-semibold mb-2">Width-to-Height Ratio (fWHR)</h4>
              <p className="text-sm text-academic-700">
                Value: {result.facialMeasurements.fWHR.toFixed(3)}
              </p>
              <p className="text-xs text-academic-600 mt-1">
                Research suggests weak correlations with dominance and aggression
              </p>
            </div>
            <div className="p-4 bg-academic-50 rounded">
              <h4 className="font-semibold mb-2">Facial Symmetry</h4>
              <p className="text-sm text-academic-700">
                Score: {result.facialMeasurements.symmetry.toFixed(1)}/100
              </p>
              <p className="text-xs text-academic-600 mt-1">
                Associated with attractiveness perception (not personality)
              </p>
            </div>
            <div className="p-4 bg-academic-50 rounded">
              <h4 className="font-semibold mb-2">Face Shape</h4>
              <p className="text-sm text-academic-700">
                Detected: {result.facialMeasurements.faceShape}
              </p>
            </div>
            <div className="p-4 bg-academic-50 rounded">
              <h4 className="font-semibold mb-2">Eye Characteristics</h4>
              <p className="text-sm text-academic-700">
                Shape: {result.facialMeasurements.eyeShape}
              </p>
              <p className="text-sm text-academic-700">
                Spacing: {result.facialMeasurements.eyeSpacing.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'research' && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold text-academic-900 mb-4">
            Research Basis & Limitations
          </h2>
          <div className="space-y-6">
            {result.otherTraits.slice(0, 3).map((trait, idx) => (
              <div key={idx} className="border-b border-academic-200 pb-4 last:border-0">
                <h3 className="text-lg font-semibold text-academic-900 mb-2">
                  {trait.trait}
                </h3>
                <p className="text-sm text-academic-700 mb-3">
                  {trait.researchBasis}
                </p>

                {/* Citations */}
                <div className="mb-3">
                  <h4 className="font-medium text-sm text-academic-800 mb-2">Key Citations:</h4>
                  {trait.citations.map((citation, cidx) => (
                    <div key={cidx} className="pl-4 mb-2 text-xs text-academic-600">
                      <p className="font-medium">
                        {citation.authors} ({citation.year}). {citation.title}.{' '}
                        <em>{citation.journal}</em>.
                        {citation.doi && (
                          <a
                            href={`https://doi.org/${citation.doi}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary-600 hover:underline ml-1"
                          >
                            DOI: {citation.doi}
                          </a>
                        )}
                      </p>
                      <p className="mt-1 italic">{citation.summary}</p>
                    </div>
                  ))}
                </div>

                {/* Limitations */}
                <div className="bg-red-50 border-l-2 border-red-500 p-3 rounded">
                  <h4 className="font-medium text-sm text-red-900 mb-1">Limitations:</h4>
                  <ul className="list-disc list-inside text-xs text-red-800 space-y-1">
                    {trait.limitations.map((limitation, lidx) => (
                      <li key={lidx}>{limitation}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}

            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded mt-6">
              <h3 className="font-bold text-blue-900 mb-2">General Methodological Concerns</h3>
              <ul className="list-disc list-inside text-sm text-blue-800 space-y-1">
                <li>Most studies show effect sizes r &lt; 0.3 (explaining &lt;10% of variance)</li>
                <li>High risk of publication bias (null results often unpublished)</li>
                <li>Many findings fail to replicate across different samples</li>
                <li>Cultural and demographic biases in training data</li>
                <li>Confounding variables (age, expression, lighting, etc.) not fully controlled</li>
                <li>No longitudinal validation of predictive accuracy</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Footer Disclaimer */}
      <div className="bg-academic-800 text-white rounded-lg p-6 text-center">
        <p className="text-sm font-medium mb-2">
          WATERMARKED AS NOT FOR DECISION-MAKING
        </p>
        <p className="text-xs text-academic-300">
          This analysis is for entertainment and educational purposes only. Results are based on
          weak statistical correlations and should not be used to make judgments about yourself
          or others. Individual variation far exceeds any population-level patterns.
        </p>
      </div>
    </div>
  );
};

export default ResultsDashboard;
