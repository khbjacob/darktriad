# PersonaScope Backend

Flask-based backend API for facial feature analysis and trait prediction.

## Features

- Facial landmark detection using MediaPipe
- Facial feature measurement (fWHR, symmetry, etc.)
- Trait correlation prediction with research citations
- Rate limiting and security safeguards
- PDF report generation
- CORS support for frontend integration

## Installation

### Prerequisites

- Python 3.8 or higher
- pip package manager

### Setup

1. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Configure environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Run the development server:
```bash
python app.py
```

The API will be available at `http://localhost:5000`

## API Endpoints

### Health Check
```
GET /api/health
```

### Analyze Face
```
POST /api/analyze
Content-Type: multipart/form-data

Body:
- image: Image file (JPG, PNG, WebP, max 10MB)

Response:
- facialMeasurements: Object with facial feature measurements
- bigFive: Array of Big Five trait predictions
- darkTriad: Array of Dark Triad trait predictions
- otherTraits: Array of other trait correlations
- overallConfidence: Float (0-1)
- processingTime: Float (seconds)
```

### Export PDF (Not yet implemented)
```
GET /api/analysis/<analysis_id>/pdf
```

### Get History (Not yet implemented)
```
GET /api/history
```

## Architecture

### Modules

- **app.py**: Main Flask application and API routes
- **facial_analyzer.py**: Facial landmark detection and measurement using MediaPipe
- **trait_predictor.py**: Trait prediction based on facial measurements
- **pdf_generator.py**: PDF report generation with research citations

### Facial Measurements

- **fWHR**: Facial width-to-height ratio
- **Symmetry**: Bilateral facial symmetry (0-100)
- **Jaw Prominence**: Relative jaw size (0-100)
- **Eye Spacing**: Inter-ocular distance ratio
- **Face Shape**: Classification (Round, Oval, Square, Heart, Long)

### Trait Predictions

All predictions include:
- Score (0-100)
- Confidence level (0-1)
- Percentile ranking
- Research-based description
- Limitations and disclaimers
- Scientific citations

## Security Features

- Rate limiting (5 requests/minute, 20/hour, 100/day)
- File size limits (10MB)
- File type validation
- Immediate file deletion after processing
- No data retention by default

## Research Ethics

This backend implements strong ethical safeguards:
- All predictions framed as weak correlations, not certainties
- Heavy disclaimers throughout
- Research citations provided
- Limitations clearly stated
- Watermarked outputs

## Deployment

### Using Docker (Recommended)

See `/docker-compose.yml` in root directory.

### Using Railway/Render

1. Connect your GitHub repository
2. Set environment variables
3. Deploy from main branch

Configuration files:
- `Procfile` for process commands
- `runtime.txt` for Python version
- `requirements.txt` for dependencies

## Development

### Running Tests
```bash
# TODO: Add test suite
pytest
```

### Code Quality
```bash
# Format code
black .

# Lint code
flake8 .

# Type checking
mypy .
```

## License

MIT License - See LICENSE file

## Ethical Use

This backend is designed for entertainment and educational purposes only.
Never use for screening, discrimination, or important life decisions.
