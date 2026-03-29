# PersonaScope

Facial morphology analysis platform operating across five integrated frameworks:

1. **Structural Morphology** — Bone structure, proportions, ratios (fWHR, symmetry, jaw, forehead)
2. **Ekman FACS** — Tonic Action Unit activation revealing habitual emotional patterns
3. **Lowen Body Armor** — Chronic muscular tension patterns and what they hold back
4. **Navarro Baseline** — Comfort-discomfort signature and gravity-defying principle
5. **Hughes DIPE** — Detect, Interpret, Predict behavioral profiling pipeline

## Stack

- **Frontend**: React + TypeScript + Vite
- **Backend**: Python Flask
- **AI Engine**: Anthropic Claude API (claude-sonnet-4-20250514) with vision
- **Database**: Supabase (auth + analysis storage)
- **Deploy**: Backend on Railway, Frontend on Vercel

## Quick Start

### Backend

```bash
cd backend
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env  # fill in ANTHROPIC_API_KEY + Supabase creds
python app.py
```

### Frontend

```bash
cd frontend
npm install
cp .env.example .env  # fill in API URL + Supabase creds
npm run dev
```

### Database

Run `supabase/schema.sql` against your Supabase project.

## How It Works

1. User uploads a frontal photograph
2. Image is sent as base64 to the Flask backend
3. Backend sends image + comprehensive system prompt to Claude Vision API
4. Claude analyzes across all 5 frameworks and returns structured JSON
5. Frontend renders the analysis across tabbed panels (Profile, Structure, Armor, Expression, Research)
6. Image is never stored — analysis JSON is optionally saved for authenticated users

## Architecture

Claude Vision replaces all traditional CV/ML libraries (OpenCV, dlib, MediaPipe, TensorFlow). One API call that understands *context*, not just landmarks.

The system prompt (in `backend/app.py`) is the core intellectual property. It instructs Claude to:
- Measure structural proportions
- Read tonic FACS activation patterns
- Map somatic armor zones
- Establish comfort/discomfort baseline
- Synthesize a behavioral hypothesis

## Disclaimer

PersonaScope maps facial structure against published research and clinical observation frameworks. Structural measurements reflect population-level statistical patterns, not individual certainties. Muscular analysis draws on clinical traditions (bioenergetics, somatic psychology) that are therapeutically validated but not statistically controlled in the way morphometric research is. Use this as a starting point for observation and hypothesis, not as a conclusion about who someone is.
