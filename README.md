# PersonaScope - Facial Feature & Trait Analysis Platform

**⚠️ CRITICAL DISCLAIMER: This application is for entertainment and educational purposes only. Facial analysis of personality traits is not scientifically validated for individual prediction and should NEVER be used for hiring, dating decisions, or judging others.**

## Overview

PersonaScope is a research-oriented web application that explores statistical correlations between facial features and personality traits as reported in psychological research literature. The application emphasizes scientific rigor, transparency about limitations, and ethical usage.

## Purpose

- **Educational**: Demonstrate facial analysis techniques and psychological research
- **Exploratory**: Allow users to explore research-suggested correlations
- **Entertainment**: Provide engaging self-exploration experience
- **NOT Diagnostic**: This is not a validated psychological assessment tool

## Key Features

### Facial Feature Detection
- Facial width-to-height ratio (fWHR) measurement
- Facial symmetry analysis
- Eyebrow positioning and thickness detection
- Jaw prominence and facial structure analysis
- Eye shape, spacing, and characteristics
- Lip fullness and mouth width analysis

### Trait Correlation Analysis
- Research-based correlation indicators (not deterministic predictions)
- Big Five personality approximations
- Confidence intervals and statistical significance
- Links to peer-reviewed research papers
- Comprehensive limitations documentation

### Privacy & Security
- Client-side processing where possible
- Immediate image deletion after analysis
- No facial data retention
- GDPR/CCPA compliant
- Rate limiting and abuse prevention

## Technical Stack

- **Frontend**: React + TypeScript + Vite
- **Backend**: Python Flask + OpenCV + dlib/MediaPipe
- **Database**: Supabase (user auth and analysis history)
- **ML**: TensorFlow/PyTorch for trait prediction models
- **Hosting**: Frontend on Vercel, Backend on Railway/Render

## Project Structure

```
personascope/
├── frontend/           # React + TypeScript frontend
├── backend/            # Python Flask API
├── docs/               # Documentation and research citations
└── README.md           # This file
```

## Ethical Guidelines

This application is built with strict ethical safeguards:

1. **Mandatory Disclaimers**: Users must acknowledge limitations before use
2. **Research Transparency**: All claims linked to peer-reviewed research
3. **Probabilistic Framing**: Results shown as correlations, not certainties
4. **No Misuse**: Usage monitoring to detect discrimination patterns
5. **Watermarked Results**: All outputs marked "NOT FOR DECISION-MAKING"

## Scientific Approach

- All trait correlations presented as "research suggests" or "studies indicate"
- Confidence intervals and p-values displayed
- Comprehensive limitations section for each trait
- Population-level statistics, not individual predictions
- Regular updates based on latest research

## Getting Started

See `/docs/SETUP.md` for development setup instructions.

## Research Citations

See `/docs/RESEARCH.md` for comprehensive list of peer-reviewed studies and methodological limitations.

## License

MIT License - See LICENSE file for details

## Ethics & Usage Policy

See `/docs/ETHICS.md` for detailed usage policy and ethical considerations.

---

**Remember**: This tool explores statistical correlations reported in research literature. It does not and cannot accurately predict individual personality traits. Treat results as educational entertainment, not scientific fact.
