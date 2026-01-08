import React, { useState } from 'react';
import { AlertTriangle, BookOpen, XCircle } from 'lucide-react';

interface DisclaimerModalProps {
  onAccept: () => void;
  onDecline: () => void;
}

const DisclaimerModal: React.FC<DisclaimerModalProps> = ({ onAccept, onDecline }) => {
  const [hasScrolled, setHasScrolled] = useState(false);
  const [checkboxes, setCheckboxes] = useState({
    entertainment: false,
    notScientific: false,
    noDecisions: false,
    understand: false,
  });

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    const isAtBottom = target.scrollHeight - target.scrollTop <= target.clientHeight + 50;
    if (isAtBottom) {
      setHasScrolled(true);
    }
  };

  const handleCheckboxChange = (key: keyof typeof checkboxes) => {
    setCheckboxes(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const allCheckboxesChecked = Object.values(checkboxes).every(v => v);
  const canAccept = hasScrolled && allCheckboxesChecked;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-red-600 text-white px-6 py-4 rounded-t-lg flex items-center gap-3">
          <AlertTriangle className="w-8 h-8" />
          <div>
            <h2 className="text-2xl font-bold">Critical Disclaimer & Informed Consent</h2>
            <p className="text-red-100 text-sm">Please read carefully before proceeding</p>
          </div>
        </div>

        {/* Content */}
        <div
          className="px-6 py-4 overflow-y-auto flex-1 space-y-4 text-academic-800"
          onScroll={handleScroll}
        >
          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
            <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
              For Entertainment and Educational Purposes Only
            </h3>
            <p className="text-sm leading-relaxed">
              This application is designed for entertainment and educational exploration only.
              It is NOT a validated psychological assessment tool and should NOT be used for any
              serious decision-making purposes.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="font-bold text-xl flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Scientific Limitations
            </h3>
            <ul className="space-y-2 text-sm list-disc list-inside">
              <li><strong>NOT Scientifically Validated:</strong> Facial analysis of personality traits is not scientifically validated for individual prediction. Research shows weak correlations at population level, not individual accuracy.</li>
              <li><strong>Low Predictive Accuracy:</strong> Even published research shows correlations typically r &lt; 0.3, explaining less than 10% of variance in personality traits.</li>
              <li><strong>Replication Crisis:</strong> Many facial analysis studies fail to replicate. Results are highly dependent on sample characteristics and methods.</li>
              <li><strong>Cultural Bias:</strong> Most research is conducted on Western populations. Results may not generalize across cultures.</li>
              <li><strong>No Diagnostic Value:</strong> This tool cannot and should not be used to diagnose any psychological condition or make predictions about individual behavior.</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="font-bold text-xl flex items-center gap-2">
              <XCircle className="w-5 h-5 text-red-600" />
              Prohibited Uses
            </h3>
            <p className="text-sm font-semibold text-red-700">
              You MUST NOT use this tool for:
            </p>
            <ul className="space-y-2 text-sm list-disc list-inside">
              <li>Employment screening or hiring decisions</li>
              <li>Dating, relationship, or romantic partner evaluation</li>
              <li>Educational admissions or academic decisions</li>
              <li>Legal proceedings or criminal justice decisions</li>
              <li>Medical or clinical diagnosis</li>
              <li>Security clearance or background checks</li>
              <li>Any form of discrimination or prejudgment of others</li>
              <li>Surveillance or non-consensual analysis of others</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="font-bold text-xl">What This Tool Actually Does</h3>
            <p className="text-sm leading-relaxed">
              PersonaScope measures facial features (width-to-height ratio, symmetry, etc.) and
              compares them to correlations reported in psychological research literature. It
              presents these as probabilistic associations with large confidence intervals, NOT
              as individual predictions or certainties.
            </p>
            <p className="text-sm leading-relaxed">
              All results are based on population-level statistics from research papers. Individual
              variation is enormous, and these correlations tell you almost nothing definitive about
              any specific person.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="font-bold text-xl">Ethical Considerations</h3>
            <p className="text-sm leading-relaxed">
              Facial analysis technologies have been misused historically for discrimination and
              pseudoscientific claims. We present this tool with full transparency about its
              limitations and strong ethical safeguards to prevent misuse.
            </p>
            <p className="text-sm leading-relaxed">
              By using this tool, you acknowledge the troubled history of physiognomy and commit
              to using this tool only for self-exploration and educational purposes.
            </p>
          </div>

          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
            <h3 className="font-bold mb-2">Research Transparency</h3>
            <p className="text-sm">
              All trait correlations are linked to peer-reviewed research papers. We encourage you
              to read the original research and understand the limitations, sample sizes, effect
              sizes, and methodological concerns.
            </p>
          </div>

          {!hasScrolled && (
            <div className="text-center text-sm text-academic-500 italic py-2 animate-pulse">
              ↓ Please scroll to the bottom to continue ↓
            </div>
          )}
        </div>

        {/* Checkboxes */}
        <div className="px-6 py-4 bg-academic-50 space-y-2">
          <p className="font-semibold text-sm mb-3">Please confirm you understand:</p>

          <label className="flex items-start gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={checkboxes.entertainment}
              onChange={() => handleCheckboxChange('entertainment')}
              className="mt-1"
              disabled={!hasScrolled}
            />
            <span className="text-sm">
              This tool is for entertainment and educational purposes only
            </span>
          </label>

          <label className="flex items-start gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={checkboxes.notScientific}
              onChange={() => handleCheckboxChange('notScientific')}
              className="mt-1"
              disabled={!hasScrolled}
            />
            <span className="text-sm">
              Facial analysis of personality is not scientifically validated for individual prediction
            </span>
          </label>

          <label className="flex items-start gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={checkboxes.noDecisions}
              onChange={() => handleCheckboxChange('noDecisions')}
              className="mt-1"
              disabled={!hasScrolled}
            />
            <span className="text-sm">
              I will NOT use this tool for hiring, dating, or any important life decisions
            </span>
          </label>

          <label className="flex items-start gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={checkboxes.understand}
              onChange={() => handleCheckboxChange('understand')}
              className="mt-1"
              disabled={!hasScrolled}
            />
            <span className="text-sm">
              I understand the severe limitations and will treat results as exploratory entertainment
            </span>
          </label>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-academic-100 rounded-b-lg flex gap-3">
          <button
            onClick={onDecline}
            className="flex-1 px-4 py-2 bg-academic-300 hover:bg-academic-400 text-academic-800 rounded-lg font-medium transition"
          >
            I Do Not Accept
          </button>
          <button
            onClick={onAccept}
            disabled={!canAccept}
            className={`flex-1 px-4 py-2 rounded-lg font-medium transition ${
              canAccept
                ? 'bg-primary-600 hover:bg-primary-700 text-white'
                : 'bg-academic-300 text-academic-500 cursor-not-allowed'
            }`}
          >
            I Accept & Understand
          </button>
        </div>
      </div>
    </div>
  );
};

export default DisclaimerModal;
