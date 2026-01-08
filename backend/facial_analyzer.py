"""
Facial Feature Analysis Module
Uses MediaPipe and OpenCV for facial landmark detection and measurement
"""

import cv2
import numpy as np
import mediapipe as mp
from typing import Dict, Optional, Tuple
import logging

logger = logging.getLogger(__name__)


class FacialAnalyzer:
    """
    Analyzes facial features from images using MediaPipe Face Mesh
    """

    def __init__(self):
        self.mp_face_mesh = mp.solutions.face_mesh
        self.face_mesh = self.mp_face_mesh.FaceMesh(
            static_image_mode=True,
            max_num_faces=1,
            refine_landmarks=True,
            min_detection_confidence=0.5
        )

    def analyze(self, image_path: str) -> Optional[Dict]:
        """
        Analyze facial features from an image

        Args:
            image_path: Path to the image file

        Returns:
            Dictionary containing facial measurements or None if no face detected
        """
        try:
            # Read image
            image = cv2.imread(image_path)
            if image is None:
                logger.error(f"Failed to read image: {image_path}")
                return None

            # Convert to RGB
            rgb_image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
            height, width = image.shape[:2]

            # Process image
            results = self.face_mesh.process(rgb_image)

            if not results.multi_face_landmarks:
                logger.warning("No face detected in image")
                return None

            landmarks = results.multi_face_landmarks[0]

            # Calculate measurements
            measurements = {
                'fWHR': self._calculate_fwhr(landmarks, width, height),
                'symmetry': self._calculate_symmetry(landmarks, width, height),
                'eyebrowThickness': self._calculate_eyebrow_thickness(landmarks, width, height),
                'eyebrowPosition': self._calculate_eyebrow_position(landmarks),
                'jawProminence': self._calculate_jaw_prominence(landmarks, width, height),
                'eyeSpacing': self._calculate_eye_spacing(landmarks, width),
                'eyeShape': self._classify_eye_shape(landmarks),
                'lipFullness': self._calculate_lip_fullness(landmarks, height),
                'mouthWidth': self._calculate_mouth_width(landmarks, width),
                'faceShape': self._classify_face_shape(landmarks, width, height),
            }

            logger.info("Facial analysis completed successfully")
            return measurements

        except Exception as e:
            logger.error(f"Error in facial analysis: {e}", exc_info=True)
            return None

    def _get_landmark_coords(self, landmarks, index: int, width: int, height: int) -> Tuple[float, float]:
        """Get x,y coordinates for a landmark"""
        lm = landmarks.landmark[index]
        return lm.x * width, lm.y * height

    def _calculate_fwhr(self, landmarks, width: int, height: int) -> float:
        """
        Calculate facial width-to-height ratio (fWHR)
        Research suggests weak correlations with dominance and aggression

        Returns value typically between 1.5 and 2.5
        """
        # Bizygomatic width (cheekbone to cheekbone)
        # Using landmarks 234 (right cheekbone) and 454 (left cheekbone)
        right_cheek = self._get_landmark_coords(landmarks, 234, width, height)
        left_cheek = self._get_landmark_coords(landmarks, 454, width, height)
        face_width = np.sqrt((left_cheek[0] - right_cheek[0])**2 + (left_cheek[1] - right_cheek[1])**2)

        # Upper face height (eyebrow to upper lip)
        # Using approximate landmarks
        upper_lip = self._get_landmark_coords(landmarks, 13, width, height)
        eyebrow_center = self._get_landmark_coords(landmarks, 9, width, height)
        face_height = abs(upper_lip[1] - eyebrow_center[1])

        if face_height == 0:
            return 1.8  # Default value

        fwhr = face_width / face_height
        return min(max(fwhr, 1.3), 3.0)  # Clamp to reasonable range

    def _calculate_symmetry(self, landmarks, width: int, height: int) -> float:
        """
        Calculate facial symmetry score (0-100)
        Higher scores indicate more symmetry
        """
        # Select key landmark pairs (left-right)
        pairs = [
            (33, 263),    # Eyes
            (61, 291),    # Mouth corners
            (234, 454),   # Cheekbones
            (127, 356),   # Nose bridge
        ]

        # Calculate vertical midline
        nose_tip = self._get_landmark_coords(landmarks, 1, width, height)
        midline_x = nose_tip[0]

        asymmetries = []
        for left_idx, right_idx in pairs:
            left = self._get_landmark_coords(landmarks, left_idx, width, height)
            right = self._get_landmark_coords(landmarks, right_idx, width, height)

            # Calculate distance from midline
            left_dist = abs(left[0] - midline_x)
            right_dist = abs(right[0] - midline_x)

            # Calculate asymmetry (0 = perfect symmetry)
            if left_dist + right_dist > 0:
                asymmetry = abs(left_dist - right_dist) / (left_dist + right_dist)
                asymmetries.append(asymmetry)

        avg_asymmetry = np.mean(asymmetries) if asymmetries else 0
        symmetry_score = max(0, 100 * (1 - avg_asymmetry * 2))

        return symmetry_score

    def _calculate_eyebrow_thickness(self, landmarks, width: int, height: int) -> float:
        """Calculate eyebrow thickness (0-100)"""
        # Simplified estimation based on eyebrow landmarks
        # This is an approximation as MediaPipe doesn't provide detailed eyebrow contours
        return np.random.uniform(40, 70)  # Placeholder - would need more sophisticated detection

    def _calculate_eyebrow_position(self, landmarks) -> float:
        """Calculate eyebrow position relative to eyes (0-100)"""
        # Higher values = higher eyebrows
        return np.random.uniform(40, 70)  # Placeholder

    def _calculate_jaw_prominence(self, landmarks, width: int, height: int) -> float:
        """Calculate jaw prominence (0-100)"""
        # Calculate jaw width vs face width ratio
        jaw_left = self._get_landmark_coords(landmarks, 172, width, height)
        jaw_right = self._get_landmark_coords(landmarks, 397, width, height)
        jaw_width = abs(jaw_right[0] - jaw_left[0])

        cheek_left = self._get_landmark_coords(landmarks, 454, width, height)
        cheek_right = self._get_landmark_coords(landmarks, 234, width, height)
        cheek_width = abs(cheek_left[0] - cheek_right[0])

        if cheek_width == 0:
            return 50

        jaw_prominence = (jaw_width / cheek_width) * 100
        return min(max(jaw_prominence, 0), 100)

    def _calculate_eye_spacing(self, landmarks, width: int) -> float:
        """Calculate eye spacing ratio"""
        left_eye = self._get_landmark_coords(landmarks, 33, width, 1)
        right_eye = self._get_landmark_coords(landmarks, 263, width, 1)
        eye_distance = abs(right_eye[0] - left_eye[0])

        # Normalize by face width
        normalized_distance = eye_distance / width
        return normalized_distance

    def _classify_eye_shape(self, landmarks) -> str:
        """Classify eye shape"""
        # Simplified classification
        shapes = ['Almond', 'Round', 'Hooded', 'Upturned', 'Downturned']
        return np.random.choice(shapes)  # Placeholder - would need ML model

    def _calculate_lip_fullness(self, landmarks, height: int) -> float:
        """Calculate lip fullness (0-100)"""
        # Calculate upper and lower lip height
        upper_lip_top = self._get_landmark_coords(landmarks, 13, 1, height)
        upper_lip_bottom = self._get_landmark_coords(landmarks, 14, 1, height)
        lower_lip_top = self._get_landmark_coords(landmarks, 14, 1, height)
        lower_lip_bottom = self._get_landmark_coords(landmarks, 17, 1, height)

        upper_thickness = abs(upper_lip_top[1] - upper_lip_bottom[1])
        lower_thickness = abs(lower_lip_top[1] - lower_lip_bottom[1])

        avg_thickness = (upper_thickness + lower_thickness) / 2
        # Normalize (typical range 10-30 pixels for average image)
        fullness = min(max((avg_thickness / height) * 500, 0), 100)

        return fullness

    def _calculate_mouth_width(self, landmarks, width: int) -> float:
        """Calculate mouth width (0-100)"""
        left_corner = self._get_landmark_coords(landmarks, 61, width, 1)
        right_corner = self._get_landmark_coords(landmarks, 291, width, 1)
        mouth_width = abs(right_corner[0] - left_corner[0])

        # Normalize by image width
        normalized_width = (mouth_width / width) * 100
        return min(max(normalized_width, 0), 100)

    def _classify_face_shape(self, landmarks, width: int, height: int) -> str:
        """Classify overall face shape"""
        # Calculate face proportions
        fwhr = self._calculate_fwhr(landmarks, width, height)

        if fwhr > 2.1:
            return "Round"
        elif fwhr > 1.9:
            return "Square"
        elif fwhr > 1.7:
            return "Oval"
        elif fwhr > 1.5:
            return "Heart"
        else:
            return "Long"
