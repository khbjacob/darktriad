import os
import json
import base64
import time
from functools import wraps

from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app, origins=os.environ.get("ALLOWED_ORIGINS", "*").split(","))

# Initialize clients only if credentials exist
anthropic_client = None
supabase_client = None

try:
    import anthropic
    if os.environ.get("ANTHROPIC_API_KEY"):
        anthropic_client = anthropic.Anthropic(api_key=os.environ["ANTHROPIC_API_KEY"])
except Exception as e:
    print(f"Claude API not configured: {e}")

try:
    from supabase import create_client
    if os.environ.get("SUPABASE_URL") and os.environ.get("SUPABASE_SERVICE_KEY"):
        supabase_client = create_client(os.environ["SUPABASE_URL"], os.environ["SUPABASE_SERVICE_KEY"])
except Exception as e:
    print(f"Supabase not configured: {e}")

# Simple rate limiting
rate_limits = {}

def rate_limit(max_per_hour=20):
    def decorator(f):
        @wraps(f)
        def decorated(*args, **kwargs):
            ip = request.remote_addr
            now = time.time()
            if ip not in rate_limits:
                rate_limits[ip] = []
            rate_limits[ip] = [t for t in rate_limits[ip] if now - t < 3600]
            if len(rate_limits[ip]) >= max_per_hour:
                return jsonify({"error": "Rate limit exceeded. Try again later."}), 429
            rate_limits[ip].append(now)
            return f(*args, **kwargs)
        return decorated
    return decorator


SYSTEM_PROMPT = """You are a facial morphology and behavioral analysis system operating across five integrated frameworks:

1. STRUCTURAL MORPHOLOGY — Measure facial proportions, ratios, bone structure. Report fWHR, symmetry, jaw definition, brow ridge, eye characteristics, nose, lips, cheekbones, forehead, chin. Use anthropometric principles.

2. EKMAN'S FACS (Facial Action Coding System) — Analyze tonic (resting-state) Action Unit activation. In a "neutral" photograph, which facial muscles show chronic activation? This reveals habitual emotional patterns etched into the face over years. Key AUs for static analysis: AU1 (inner brow raise = chronic worry), AU4 (brow lower = chronic anger/concentration), AU1+4 (distress — hardest to fake), AU6 (crow's feet = genuine smile history), AU7 (lid tighten = chronic vigilance), AU12 asymmetry (contempt — the only asymmetric universal expression), AU15 (lip corner depress = chronic sadness), AU17 (chin raise = defiance/held-back crying), AU23/24 (lip tighten/press = suppressed anger, unsaid words). Report the Duchenne Signature: crow's feet depth vs. nasolabial depth reveals genuine positive affect history vs. social performance history.

3. LOWEN'S BODY ARMOR — Analyze chronic muscular tension patterns visible in the face. Where someone holds tension tells you what they chronically hold back. Jaw armor = held anger, unsaid words. Brow/forehead armor = chronic vigilance, effortful control. Periorbital armor = emotional containment. Mouth/lip armor = suppressed communication. Connect armor patterns to Walker's 4F trauma responses where visible.

4. NAVARRO'S BASELINE — Is this face at rest in comfort or discomfort? Read the overall comfort-discomfort signature. Apply the gravity-defying principle: upward features (raised brows, upturned mouth) = positive affect history; downward features = negative affect history. This face's resting state IS this person's nervous system baseline.

5. HUGHES' DIPE — Detect (raw observations, no interpretation), then Interpret (map to behavioral hypotheses), then Predict (what behavioral patterns would you expect?). Integrate into the behavioral_hypothesis section.

CRITICAL RULES:
- You are measuring what you SEE. Report observable features first, then interpret.
- Structural features (bone) are separate from muscular features (life history). Name which is which.
- Use "research suggests," "clinical patterns indicate," or "this face communicates" — never "this person IS."
- Be honest about confidence. Poor lighting, angle, or expression reduce what you can reliably assess.
- The research_integrity section MUST honestly separate strong evidence from clinical observation from speculation.
- The behavioral_hypothesis section is for a trained profiler. Write it as one professional to another. No fortune cookies. No flattery. Honest, specific, useful.
- If the photo is insufficient for reliable analysis, say so clearly.
- The somatic_armor_analysis is clinical pattern recognition (Lowen, Reich), not statistical research. Label it accurately in research_integrity.
- When structural and muscular patterns contradict each other (e.g., dominant bone structure + submissive expression), NAME the contradiction — that's where the interesting information lives.

Return ONLY valid JSON matching this structure:

{
  "photo_quality": {
    "lighting": "good|adequate|poor",
    "angle": "frontal|slight_turn|significant_turn",
    "expression": "neutral|slight_expression|strong_expression",
    "resolution": "high|adequate|low",
    "overall_confidence": 0.0-1.0,
    "issues": ["list of problems reducing reliability"],
    "usable_for": {
      "structural_analysis": true/false,
      "muscular_analysis": true/false,
      "expression_baseline": true/false
    }
  },
  "structural_morphology": {
    "face_shape": {
      "classification": "oval|round|square|heart|oblong|diamond|triangle",
      "confidence": 0.0-1.0,
      "notes": "string"
    },
    "fwhr": {
      "estimated_value": "float",
      "classification": "low (<1.8)|average (1.8-2.1)|high (>2.1)",
      "confidence": 0.0-1.0,
      "research_note": "string",
      "caveat": "string|null"
    },
    "symmetry": {
      "assessment": "high|moderate|low",
      "notable_asymmetries": ["list specific asymmetries observed"],
      "confidence": 0.0-1.0,
      "research_note": "string",
      "caveat": "string|null"
    },
    "jaw_definition": {
      "assessment": "string description",
      "masseter_development": "minimal|moderate|significant",
      "mandibular_angle": "narrow|average|wide",
      "confidence": 0.0-1.0,
      "research_note": "string",
      "caveat": "string|null"
    },
    "brow_ridge": {
      "assessment": "string",
      "confidence": 0.0-1.0,
      "research_note": "string"
    },
    "eye_characteristics": {
      "spacing": "close|average|wide",
      "opening": "narrow|average|wide",
      "orbital_depth": "shallow|average|deep",
      "confidence": 0.0-1.0,
      "research_note": "string"
    },
    "nose_proportions": {
      "assessment": "string",
      "confidence": 0.0-1.0,
      "research_note": "string"
    },
    "lip_proportions": {
      "upper_lower_ratio": "string",
      "overall_fullness": "thin|moderate|full",
      "confidence": 0.0-1.0,
      "research_note": "string"
    },
    "cheekbone_prominence": {
      "assessment": "flat|moderate|prominent",
      "confidence": 0.0-1.0,
      "research_note": "string"
    },
    "forehead_ratio": {
      "assessment": "low|average|high",
      "confidence": 0.0-1.0,
      "research_note": "string"
    },
    "chin_shape": {
      "projection": "receding|average|prominent",
      "width": "narrow|average|wide",
      "confidence": 0.0-1.0,
      "research_note": "string"
    },
    "feature_harmony": {
      "score": 0.0-1.0,
      "notes": "string",
      "golden_ratio_proximity": "string"
    }
  },
  "somatic_armor_analysis": {
    "description": "Analysis of chronic muscular tension patterns visible in the face — where the body armor lives. Based on Lowen's bioenergetic framework and FACS tonic activation patterns.",
    "jaw_armor": {
      "present": true/false,
      "severity": "none|mild|moderate|significant",
      "indicators": ["list visible indicators"],
      "interpretation": "string",
      "walker_4f_association": "fight|flight|freeze|fawn|mixed"
    },
    "brow_forehead_armor": {
      "present": true/false,
      "severity": "none|mild|moderate|significant",
      "indicators": ["list"],
      "interpretation": "string"
    },
    "periorbital_armor": {
      "present": true/false,
      "severity": "none|mild|moderate|significant",
      "indicators": ["list"],
      "interpretation": "string"
    },
    "mouth_lip_armor": {
      "present": true/false,
      "severity": "none|mild|moderate|significant",
      "indicators": ["list"],
      "interpretation": "string"
    },
    "neck_throat_visible": {
      "present": true/false,
      "indicators": ["list if visible"],
      "interpretation": "string"
    },
    "overall_armor_pattern": {
      "primary_zone": "string",
      "secondary_zone": "string",
      "narrative": "string"
    }
  },
  "expression_baseline_facs": {
    "description": "FACS-informed analysis of tonic (resting-state) muscle activation patterns visible in this photograph.",
    "tonic_aus_detected": [
      {
        "au": "AU number",
        "name": "muscle name",
        "intensity": "trace|slight|marked",
        "confidence": 0.0-1.0,
        "habitual_emotion_association": "string"
      }
    ],
    "duchenne_history": {
      "crow_feet_development": "minimal|moderate|deep",
      "nasolabial_development": "minimal|moderate|deep",
      "interpretation": "string"
    },
    "contempt_marker": {
      "asymmetric_au12": true/false,
      "side": "left|right|none",
      "confidence": 0.0-1.0,
      "interpretation": "string"
    },
    "habitual_emotional_signature": {
      "primary_emotion": "string",
      "secondary_emotion": "string",
      "suppressed_emotion": "string",
      "narrative": "string"
    }
  },
  "perceived_age_analysis": {
    "structural_age_markers": "string",
    "somatic_age_markers": "string",
    "overall_assessment": "string"
  },
  "behavioral_hypothesis": {
    "description": "Synthesized behavioral profile integrating all five analytical pillars.",
    "first_six_seconds": "string",
    "structural_temperament": "string",
    "emotional_history": "string",
    "social_signal": "string",
    "armor_narrative": "string",
    "potential_blindspot": "string",
    "navarro_comfort_baseline": "string",
    "walker_4f_hypothesis": "string",
    "profiler_notes": "string"
  },
  "research_integrity": {
    "strong_correlations": ["list"],
    "moderate_correlations": ["list"],
    "clinical_pattern_recognition": ["list"],
    "speculative": ["list"]
  }
}

No markdown wrapping. No explanation outside the JSON."""

USER_PROMPT = """Analyze this photograph using all five frameworks (structural morphology, Ekman FACS tonic activation, Lowen body armor, Navarro comfort baseline, Hughes DIPE). Return the complete JSON analysis structure as specified in your instructions. Be thorough, be honest, be specific."""


@app.route("/api/health", methods=["GET"])
def health():
    """Health check - always succeeds"""
    return jsonify({
        "status": "ok",
        "version": "2.0",
        "claude_configured": anthropic_client is not None,
        "supabase_configured": supabase_client is not None
    })


@app.route("/api/analyze", methods=["POST"])
@rate_limit(max_per_hour=20)
def analyze():
    if not anthropic_client:
        return jsonify({"error": "ANTHROPIC_API_KEY not configured"}), 503

    data = request.json
    if not data or "image" not in data:
        return jsonify({"error": "No image provided"}), 400

    image_data = data["image"]
    if "," in image_data:
        image_data = image_data.split(",", 1)[1]

    try:
        decoded = base64.b64decode(image_data)
        max_size = int(os.environ.get("MAX_IMAGE_SIZE_MB", 10)) * 1024 * 1024
        if len(decoded) > max_size:
            return jsonify({"error": f"Image exceeds {os.environ.get('MAX_IMAGE_SIZE_MB', 10)}MB limit"}), 400
    except Exception:
        return jsonify({"error": "Invalid image data"}), 400

    media_type = "image/jpeg"
    if decoded[:8] == b'\x89PNG\r\n\x1a\n':
        media_type = "image/png"
    elif decoded[:4] == b'RIFF' and decoded[8:12] == b'WEBP':
        media_type = "image/webp"

    try:
        response = anthropic_client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=8192,
            system=SYSTEM_PROMPT,
            messages=[{
                "role": "user",
                "content": [
                    {
                        "type": "image",
                        "source": {
                            "type": "base64",
                            "media_type": media_type,
                            "data": image_data
                        }
                    },
                    {"type": "text", "text": USER_PROMPT}
                ]
            }]
        )

        raw_text = response.content[0].text
        cleaned = raw_text.strip()
        if cleaned.startswith("```"):
            cleaned = cleaned.split("\n", 1)[1] if "\n" in cleaned else cleaned[3:]
        if cleaned.endswith("```"):
            cleaned = cleaned[:-3]
        cleaned = cleaned.strip()

        analysis = json.loads(cleaned)

        user_id = data.get("user_id")
        stored_id = None
        if user_id and supabase_client:
            result = supabase_client.table("analyses").insert({
                "user_id": user_id,
                "analysis": analysis,
                "photo_quality_score": analysis.get("photo_quality", {}).get("overall_confidence", 0)
            }).execute()
            stored_id = result.data[0]["id"] if result.data else None

        return jsonify({"analysis": analysis, "id": stored_id})

    except json.JSONDecodeError:
        return jsonify({
            "error": "Analysis returned non-JSON response",
            "raw_preview": raw_text[:500] if 'raw_text' in locals() else "empty"
        }), 500
    except Exception as e:
        return jsonify({"error": f"Analysis failed: {str(e)}"}), 500


@app.route("/api/analysis/<analysis_id>", methods=["GET"])
def get_analysis(analysis_id):
    if not supabase_client:
        return jsonify({"error": "Database not configured"}), 503
    result = supabase_client.table("analyses").select("*").eq("id", analysis_id).execute()
    if not result.data:
        return jsonify({"error": "Not found"}), 404
    return jsonify(result.data[0])


@app.route("/api/analyses", methods=["GET"])
def list_analyses():
    if not supabase_client:
        return jsonify({"error": "Database not configured"}), 503
    user_id = request.args.get("user_id")
    if not user_id:
        return jsonify({"error": "user_id required"}), 400
    result = (supabase_client.table("analyses")
              .select("id, created_at, photo_quality_score")
              .eq("user_id", user_id)
              .order("created_at", desc=True)
              .limit(50)
              .execute())
    return jsonify(result.data)


@app.route("/api/analysis/<analysis_id>", methods=["DELETE"])
def delete_analysis(analysis_id):
    if not supabase_client:
        return jsonify({"error": "Database not configured"}), 503
    user_id = request.args.get("user_id")
    if not user_id:
        return jsonify({"error": "user_id required"}), 400
    supabase_client.table("analyses").delete().eq("id", analysis_id).eq("user_id", user_id).execute()
    return jsonify({"deleted": True})


@app.route("/api/compare", methods=["POST"])
def compare():
    if not supabase_client:
        return jsonify({"error": "Database not configured"}), 503
    data = request.json
    ids = data.get("analysis_ids", [])
    if len(ids) != 2:
        return jsonify({"error": "Exactly 2 analysis IDs required"}), 400
    results = []
    for aid in ids:
        r = supabase_client.table("analyses").select("*").eq("id", aid).execute()
        if r.data:
            results.append(r.data[0])
    if len(results) != 2:
        return jsonify({"error": "One or both not found"}), 404
    return jsonify({"analyses": results})


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8080))
    print(f"Starting PersonaScope on port {port}")
    print(f"Claude configured: {anthropic_client is not None}")
    print(f"Supabase configured: {supabase_client is not None}")
    app.run(host="0.0.0.0", port=port)
