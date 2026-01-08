import React, { useState, useEffect } from 'react';
import DisclaimerModal from './components/DisclaimerModal';
import ImageUpload from './components/ImageUpload';
import ResultsDashboard from './components/ResultsDashboard';
import { AnalysisResult } from './types';
import { analyzeImage } from './services/api';
import { Loader2, Brain, AlertCircle } from 'lucide-react';

function App() {
  const [disclaimerAccepted, setDisclaimerAccepted] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if disclaimer was previously accepted (in this session)
    const accepted = sessionStorage.getItem('disclaimerAccepted');
    if (accepted === 'true') {
      setDisclaimerAccepted(true);
    }
  }, []);

  const handleDisclaimerAccept = () => {
    setDisclaimerAccepted(true);
    sessionStorage.setItem('disclaimerAccepted', 'true');
  };

  const handleDisclaimerDecline = () => {
    window.location.href = 'https://www.google.com';
  };

  const handleImageSelect = async (image: File | string) => {
    setSelectedImage(image);
    setError(null);
    setIsAnalyzing(true);

    try {
      const analysisResult = await analyzeImage(image);
      setResult(analysisResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during analysis');
      console.error('Analysis error:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleNewAnalysis = () => {
    setSelectedImage(null);
    setResult(null);
    setError(null);
  };

  const handleExportPDF = () => {
    // TODO: Implement PDF export
    alert('PDF export functionality will be implemented');
  };

  if (!disclaimerAccepted) {
    return (
      <DisclaimerModal
        onAccept={handleDisclaimerAccept}
        onDecline={handleDisclaimerDecline}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-academic-50 via-primary-50 to-academic-100">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <Brain className="w-10 h-10 text-primary-600" />
            <div>
              <h1 className="text-3xl font-bold text-academic-900">
                PersonaScope
              </h1>
              <p className="text-sm text-academic-600">
                Facial Feature & Trait Analysis Platform
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Persistent Warning Banner */}
        <div className="max-w-6xl mx-auto mb-6">
          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-lg shadow">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-yellow-800 font-medium">
                  Entertainment & Education Only - Not Scientifically Validated for Individual Prediction
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Analysis Flow */}
        {!result && !isAnalyzing && (
          <ImageUpload onImageSelect={handleImageSelect} />
        )}

        {isAnalyzing && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-12 text-center">
              <Loader2 className="w-16 h-16 text-primary-600 animate-spin mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-academic-900 mb-2">
                Analyzing Facial Features
              </h2>
              <p className="text-academic-600 mb-6">
                Processing image and computing correlations...
              </p>
              <div className="max-w-md mx-auto space-y-2 text-sm text-academic-700 text-left">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary-600 rounded-full animate-pulse"></div>
                  <span>Detecting facial landmarks</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary-600 rounded-full animate-pulse delay-100"></div>
                  <span>Measuring facial features</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary-600 rounded-full animate-pulse delay-200"></div>
                  <span>Computing trait correlations</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary-600 rounded-full animate-pulse delay-300"></div>
                  <span>Generating report</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg shadow">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="font-bold text-red-900 mb-2">Analysis Error</h3>
                  <p className="text-sm text-red-800 mb-4">{error}</p>
                  <button
                    onClick={handleNewAnalysis}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {result && (
          <div>
            <ResultsDashboard result={result} onExportPDF={handleExportPDF} />
            <div className="max-w-6xl mx-auto mt-6 text-center">
              <button
                onClick={handleNewAnalysis}
                className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-medium"
              >
                Analyze Another Image
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-academic-900 text-white mt-12 py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-academic-300 mb-2">
            PersonaScope - Research-Based Facial Feature Analysis
          </p>
          <p className="text-xs text-academic-400">
            For entertainment and educational purposes only. Not a validated psychological assessment.
          </p>
          <div className="mt-4 flex justify-center gap-6 text-xs text-academic-400">
            <a href="#" className="hover:text-white transition">Research Citations</a>
            <a href="#" className="hover:text-white transition">Privacy Policy</a>
            <a href="#" className="hover:text-white transition">Ethics & Usage</a>
            <a href="#" className="hover:text-white transition">About</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
