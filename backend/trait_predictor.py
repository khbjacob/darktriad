"""
Trait Prediction Module
Predicts personality trait correlations based on facial measurements
Uses research-based correlations with heavy disclaimers
"""

import numpy as np
from typing import Dict, List
import logging

logger = logging.getLogger(__name__)


class TraitPredictor:
    """
    Predicts personality trait correlations based on facial features

    IMPORTANT: All predictions are based on weak population-level correlations
    and should NOT be used for individual assessment
    """

    def __init__(self):
        self.citations = self._load_research_citations()

    def predict(self, facial_measurements: Dict) -> Dict:
        """
        Generate trait predictions from facial measurements

        Args:
            facial_measurements: Dictionary of facial feature measurements

        Returns:
            Dictionary containing Big Five, Dark Triad, and other trait predictions
        """
        try:
            big_five = self._predict_big_five(facial_measurements)
            dark_triad = self._predict_dark_triad(facial_measurements)
            other_traits = self._predict_other_traits(facial_measurements)

            return {
                'bigFive': big_five,
                'darkTriad': dark_triad,
                'otherTraits': other_traits,
            }

        except Exception as e:
            logger.error(f"Error in trait prediction: {e}", exc_info=True)
            # Return neutral values on error
            return self._get_neutral_predictions()

    def _predict_big_five(self, measurements: Dict) -> List[Dict]:
        """
        Predict Big Five personality traits

        Based on meta-analysis suggesting weak correlations (r < 0.2)
        """
        fwhr = measurements['fWHR']
        symmetry = measurements['symmetry']
        jaw_prominence = measurements['jawProminence']

        # Openness - weak correlation with facial variability
        openness_base = 50
        openness_adj = (symmetry - 70) * 0.1  # Very weak correlation
        openness = np.clip(openness_base + openness_adj + np.random.normal(0, 10), 0, 100)

        # Conscientiousness - minimal facial correlations in research
        conscientiousness = np.random.normal(50, 12)
        conscientiousness = np.clip(conscientiousness, 0, 100)

        # Extraversion - weak positive correlation with fWHR
        extraversion_base = 50
        extraversion_adj = (fwhr - 1.9) * 10  # Weak correlation
        extraversion = np.clip(extraversion_base + extraversion_adj + np.random.normal(0, 12), 0, 100)

        # Agreeableness - weak negative correlation with fWHR and jaw prominence
        agreeableness_base = 50
        agreeableness_adj = -(fwhr - 1.9) * 8 - (jaw_prominence - 50) * 0.1
        agreeableness = np.clip(agreeableness_base + agreeableness_adj + np.random.normal(0, 12), 0, 100)

        # Neuroticism - minimal facial correlations
        neuroticism = np.random.normal(50, 12)
        neuroticism = np.clip(neuroticism, 0, 100)

        # Calculate percentiles (assuming normal distribution)
        def score_to_percentile(score):
            return int(np.clip((score / 100) * 100, 1, 99))

        return [
            {
                'trait': 'Openness',
                'score': float(openness),
                'confidence': 0.25,  # Very low confidence
                'percentile': score_to_percentile(openness),
                'description': 'Research suggests minimal correlation between facial features and openness to experience. This estimate has very low accuracy.',
            },
            {
                'trait': 'Conscientiousness',
                'score': float(conscientiousness),
                'confidence': 0.15,  # Extremely low confidence
                'percentile': score_to_percentile(conscientiousness),
                'description': 'No reliable facial correlations found in research. This score is essentially random and should not be trusted.',
            },
            {
                'trait': 'Extraversion',
                'score': float(extraversion),
                'confidence': 0.30,  # Low confidence
                'percentile': score_to_percentile(extraversion),
                'description': 'Some studies suggest weak correlations between facial width-to-height ratio and extraversion (r ≈ 0.15), but effect is very small.',
            },
            {
                'trait': 'Agreeableness',
                'score': float(agreeableness),
                'confidence': 0.28,  # Low confidence
                'percentile': score_to_percentile(agreeableness),
                'description': 'Weak negative correlations reported with fWHR (r ≈ -0.12), but highly inconsistent across studies.',
            },
            {
                'trait': 'Neuroticism',
                'score': float(neuroticism),
                'confidence': 0.10,  # Extremely low confidence
                'percentile': score_to_percentile(neuroticism),
                'description': 'No reliable facial correlations. This estimate is not based on evidence and should be ignored.',
            },
        ]

    def _predict_dark_triad(self, measurements: Dict) -> List[Dict]:
        """
        Predict Dark Triad trait correlations

        Based on limited research with weak effect sizes and poor replication
        """
        fwhr = measurements['fWHR']
        symmetry = measurements['symmetry']
        jaw_prominence = measurements['jawProminence']

        # Narcissism - weak correlation with fWHR in some studies
        narcissism_base = 50
        narcissism_adj = (fwhr - 1.9) * 12  # Weak correlation
        narcissism = np.clip(narcissism_base + narcissism_adj + np.random.normal(0, 15), 0, 100)

        # Machiavellianism - extremely weak evidence
        machiavellianism = np.random.normal(50, 15)
        machiavellianism = np.clip(machiavellianism, 0, 100)

        # Psychopathy - weak correlation with fWHR in limited studies
        psychopathy_base = 50
        psychopathy_adj = (fwhr - 1.9) * 10 + (jaw_prominence - 50) * 0.08
        psychopathy = np.clip(psychopathy_base + psychopathy_adj + np.random.normal(0, 15), 0, 100)

        def score_to_percentile(score):
            return int(np.clip((score / 100) * 100, 1, 99))

        return [
            {
                'trait': 'Narcissism',
                'score': float(narcissism),
                'confidence': 0.22,
                'percentile': score_to_percentile(narcissism),
                'description': 'Some studies report weak correlations between fWHR and narcissistic traits (r ≈ 0.10-0.20), but many fail to replicate.',
                'disclaimer': 'WARNING: Dark Triad assessments from facial features are NOT scientifically validated. This is population-level correlation only, NOT individual prediction. DO NOT use for screening or judgment.',
            },
            {
                'trait': 'Machiavellianism',
                'score': float(machiavellianism),
                'confidence': 0.12,
                'percentile': score_to_percentile(machiavellianism),
                'description': 'Extremely limited research support. No reliable facial correlations established.',
                'disclaimer': 'WARNING: This score is essentially random. No scientific basis for facial prediction of Machiavellianism. Treat as entertainment only.',
            },
            {
                'trait': 'Psychopathy',
                'score': float(psychopathy),
                'confidence': 0.18,
                'percentile': score_to_percentile(psychopathy),
                'description': 'Limited studies suggest weak correlations with fWHR, but effect sizes are small (r < 0.15) and inconsistent.',
                'disclaimer': 'CRITICAL WARNING: Facial analysis CANNOT diagnose or predict psychopathy. This is based on weak population statistics with no individual diagnostic value.',
            },
        ]

    def _predict_other_traits(self, measurements: Dict) -> List[Dict]:
        """
        Predict other personality-related traits
        """
        fwhr = measurements['fWHR']
        symmetry = measurements['symmetry']
        jaw_prominence = measurements['jawProminence']

        # Dominance - most researched correlation with fWHR
        dominance_base = 50
        dominance_adj = (fwhr - 1.9) * 15
        dominance = np.clip(dominance_base + dominance_adj + np.random.normal(0, 10), 0, 100)

        # Trustworthiness - weak correlations with facial features
        trust_base = 50
        trust_adj = (symmetry - 70) * 0.2 - (jaw_prominence - 50) * 0.15
        trustworthiness = np.clip(trust_base + trust_adj + np.random.normal(0, 12), 0, 100)

        # Attractiveness - stronger correlation with symmetry
        attractiveness = np.clip(30 + symmetry * 0.7 + np.random.normal(0, 8), 0, 100)

        return [
            {
                'trait': 'Perceived Dominance',
                'score': float(dominance),
                'confidence': 0.35,
                'percentile': int(np.clip(dominance, 1, 99)),
                'description': 'Research suggests facial width-to-height ratio correlates with perceived dominance (r ≈ 0.20-0.30). This is the strongest documented correlation.',
                'researchBasis': 'Multiple studies show fWHR correlates with perceptions of dominance and aggression, though effect sizes are modest and may be culturally specific.',
                'limitations': [
                    'Correlation does not imply causation',
                    'Effect size explains only ~5-9% of variance',
                    'May reflect cultural stereotypes rather than true personality',
                    'Poor predictive accuracy for individuals',
                    'Confounded with sex, age, and ethnicity',
                ],
                'citations': self.citations['dominance'],
            },
            {
                'trait': 'Perceived Trustworthiness',
                'score': float(trustworthiness),
                'confidence': 0.25,
                'percentile': int(np.clip(trustworthiness, 1, 99)),
                'description': 'Weak correlations between facial features and trustworthiness judgments, but these may reflect biases rather than actual trustworthiness.',
                'researchBasis': 'Studies show people make rapid trustworthiness judgments from faces, but these judgments have low accuracy for predicting actual behavior.',
                'limitations': [
                    'Judgments based on stereotypes and heuristics',
                    'No evidence these judgments predict actual trustworthy behavior',
                    'High risk of discrimination and bias',
                    'Context and expression matter more than static features',
                ],
                'citations': self.citations['trustworthiness'],
            },
            {
                'trait': 'Facial Attractiveness',
                'score': float(attractiveness),
                'confidence': 0.45,
                'percentile': int(np.clip(attractiveness, 1, 99)),
                'description': 'Facial symmetry shows moderate correlation with attractiveness ratings (r ≈ 0.3-0.4), though attractiveness is highly subjective.',
                'researchBasis': 'Symmetry is one of the most studied facial features. Meta-analyses show modest correlations with attractiveness judgments, though standards vary by culture.',
                'limitations': [
                    'Attractiveness is highly subjective and culturally variable',
                    'Individual preferences vary enormously',
                    'Context, grooming, and expression matter significantly',
                    'Not a personality trait - included for research interest only',
                ],
                'citations': self.citations['attractiveness'],
            },
        ]

    def _load_research_citations(self) -> Dict:
        """
        Load research citations for each trait
        """
        return {
            'dominance': [
                {
                    'authors': 'Carré, J. M., & McCormick, C. M.',
                    'year': 2008,
                    'title': 'In your face: Facial metrics predict aggressive behaviour in the laboratory and in varsity and professional hockey players',
                    'journal': 'Proceedings of the Royal Society B',
                    'doi': '10.1098/rspb.2008.0873',
                    'summary': 'Found correlation between fWHR and aggressive behavior in hockey players. Effect size modest, limited generalizability.',
                },
                {
                    'authors': 'Haselhuhn, M. P., & Wong, E. M.',
                    'year': 2012,
                    'title': 'Bad to the bone: Facial structure predicts unethical behaviour',
                    'journal': 'Proceedings of the Royal Society B',
                    'doi': '10.1098/rspb.2012.1193',
                    'summary': 'Reported fWHR correlations with unethical behavior. Replication attempts have shown mixed results.',
                },
            ],
            'trustworthiness': [
                {
                    'authors': 'Todorov, A., et al.',
                    'year': 2015,
                    'title': 'Social attributions from faces: Determinants, consequences, accuracy, and functional significance',
                    'journal': 'Annual Review of Psychology',
                    'doi': '10.1146/annurev-psych-010213-115134',
                    'summary': 'Comprehensive review showing people make rapid trait inferences from faces, but accuracy for predicting behavior is low.',
                },
            ],
            'attractiveness': [
                {
                    'authors': 'Rhodes, G.',
                    'year': 2006,
                    'title': 'The evolutionary psychology of facial beauty',
                    'journal': 'Annual Review of Psychology',
                    'doi': '10.1146/annurev.psych.57.102904.190208',
                    'summary': 'Meta-analysis showing symmetry correlates moderately with attractiveness, though effects are complex and context-dependent.',
                },
            ],
        }

    def _get_neutral_predictions(self) -> Dict:
        """
        Return neutral predictions in case of error
        """
        return {
            'bigFive': [
                {'trait': t, 'score': 50.0, 'confidence': 0.0, 'percentile': 50, 'description': 'Error in prediction'}
                for t in ['Openness', 'Conscientiousness', 'Extraversion', 'Agreeableness', 'Neuroticism']
            ],
            'darkTriad': [
                {'trait': t, 'score': 50.0, 'confidence': 0.0, 'percentile': 50, 'description': 'Error in prediction', 'disclaimer': 'Error occurred'}
                for t in ['Narcissism', 'Machiavellianism', 'Psychopathy']
            ],
            'otherTraits': [],
        }
