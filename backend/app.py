import os
import time
import uuid
from datetime import datetime
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from werkzeug.utils import secure_filename
import logging
from pathlib import Path

from facial_analyzer import FacialAnalyzer
from trait_predictor import TraitPredictor
from pdf_generator import generate_analysis_pdf

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Configuration
app.config['MAX_CONTENT_LENGTH'] = 10 * 1024 * 1024  # 10MB max file size
app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['ALLOWED_EXTENSIONS'] = {'png', 'jpg', 'jpeg', 'webp'}

# Create upload folder
Path(app.config['UPLOAD_FOLDER']).mkdir(exist_ok=True)

# Rate limiting
limiter = Limiter(
    app=app,
    key_func=get_remote_address,
    default_limits=["100 per day", "20 per hour"],
    storage_uri="memory://",
)

# Logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Initialize ML components
facial_analyzer = FacialAnalyzer()
trait_predictor = TraitPredictor()


def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in app.config['ALLOWED_EXTENSIONS']


@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.utcnow().isoformat(),
        'version': '1.0.0'
    })


@app.route('/api/analyze', methods=['POST'])
@limiter.limit("5 per minute")
def analyze_face():
    """
    Main endpoint for facial analysis
    Accepts an image file and returns comprehensive analysis results
    """
    start_time = time.time()

    # Validate request
    if 'image' not in request.files:
        return jsonify({'error': 'No image file provided'}), 400

    file = request.files['image']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    if not allowed_file(file.filename):
        return jsonify({'error': 'Invalid file type. Allowed: PNG, JPG, JPEG, WebP'}), 400

    try:
        # Save file temporarily
        filename = secure_filename(f"{uuid.uuid4()}_{file.filename}")
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)

        logger.info(f"Processing image: {filename}")

        # Step 1: Facial analysis
        facial_measurements = facial_analyzer.analyze(filepath)
        if facial_measurements is None:
            return jsonify({'error': 'No face detected in the image. Please ensure the face is clearly visible.'}), 400

        # Step 2: Trait prediction
        trait_predictions = trait_predictor.predict(facial_measurements)

        # Step 3: Calculate overall confidence
        all_confidences = []
        for trait_list in [trait_predictions['bigFive'], trait_predictions['darkTriad'], trait_predictions['otherTraits']]:
            all_confidences.extend([t.get('confidence', 0.5) for t in trait_list])
        overall_confidence = sum(all_confidences) / len(all_confidences) if all_confidences else 0.5

        # Construct response
        processing_time = time.time() - start_time
        analysis_id = str(uuid.uuid4())

        result = {
            'id': analysis_id,
            'timestamp': datetime.utcnow().isoformat(),
            'facialMeasurements': facial_measurements,
            'bigFive': trait_predictions['bigFive'],
            'darkTriad': trait_predictions['darkTriad'],
            'otherTraits': trait_predictions['otherTraits'],
            'overallConfidence': overall_confidence,
            'processingTime': processing_time,
        }

        logger.info(f"Analysis completed in {processing_time:.2f}s")

        return jsonify(result), 200

    except Exception as e:
        logger.error(f"Error during analysis: {str(e)}", exc_info=True)
        return jsonify({'error': f'Analysis failed: {str(e)}'}), 500

    finally:
        # Clean up uploaded file
        if os.path.exists(filepath):
            try:
                os.remove(filepath)
            except Exception as e:
                logger.warning(f"Failed to remove temp file: {e}")


@app.route('/api/analysis/<analysis_id>/pdf', methods=['GET'])
@limiter.limit("10 per minute")
def export_pdf(analysis_id):
    """
    Export analysis results as PDF
    """
    try:
        # In a real app, retrieve analysis from database
        # For now, return a placeholder error
        return jsonify({'error': 'PDF export requires analysis to be saved first'}), 501

    except Exception as e:
        logger.error(f"PDF export error: {str(e)}")
        return jsonify({'error': 'PDF generation failed'}), 500


@app.route('/api/history', methods=['GET'])
def get_history():
    """
    Get analysis history for authenticated user
    """
    # TODO: Implement user authentication and database retrieval
    return jsonify([]), 200


@app.errorhandler(429)
def ratelimit_handler(e):
    """Handle rate limit exceeded"""
    return jsonify({
        'error': 'Rate limit exceeded',
        'message': 'Too many requests. Please try again later.'
    }), 429


@app.errorhandler(413)
def too_large(e):
    """Handle file too large"""
    return jsonify({
        'error': 'File too large',
        'message': 'File size must be less than 10MB'
    }), 413


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
