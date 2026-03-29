# PersonaScope — Project Context

## What This Is
Facial morphology analysis platform. Upload photo → Claude Vision analyzes across 5 frameworks (structural morphology, Ekman FACS, Lowen body armor, Navarro baseline, Hughes DIPE) → returns comprehensive behavioral hypothesis profile.

## Stack
- Backend: Flask (Python) on Railway
- Frontend: React + TypeScript + Vite on Vercel
- AI: Anthropic Claude API (claude-sonnet-4-20250514) with vision
- DB: Supabase (auth + JSONB storage)

## Key Design Decisions
- Claude Vision replaces all CV/ML libraries — one API call does everything
- Dark theme (Cormorant Garamond + JetBrains Mono + system sans)
- Mobile-first, 18px minimum text
- No italic text
- Analysis works without auth; save/history requires login
- One honest disclaimer, not groveling on every screen

## Environment Variables (Backend)
ANTHROPIC_API_KEY, SUPABASE_URL, SUPABASE_SERVICE_KEY, FLASK_SECRET_KEY, PORT, MAX_IMAGE_SIZE_MB, ALLOWED_ORIGINS

## Environment Variables (Frontend)
VITE_API_URL, VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY

## The System Prompt
The Claude Vision system prompt is the core IP. It instructs Claude to analyze across all 5 frameworks and return structured JSON. It lives in app.py as SYSTEM_PROMPT. Changes to this prompt change the entire output quality.

## Known Constraints
- API call takes 15-30 seconds (need good loading UX)
- max_tokens set to 8192 for full analysis
- Photo quality significantly affects analysis quality — guidelines matter
- Rate limited to 20 analyses/hour/IP
