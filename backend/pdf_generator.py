"""
PDF Report Generation Module
Generates professional research-style PDF reports with citations
"""

from reportlab.lib.pagesizes import letter, A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_JUSTIFY
from io import BytesIO
from datetime import datetime
from typing import Dict
import logging

logger = logging.getLogger(__name__)


def generate_analysis_pdf(analysis_result: Dict) -> BytesIO:
    """
    Generate a comprehensive PDF report for analysis results

    Args:
        analysis_result: Dictionary containing analysis results

    Returns:
        BytesIO object containing the PDF
    """
    buffer = BytesIO()

    try:
        # Create PDF document
        doc = SimpleDocTemplate(buffer, pagesize=letter,
                              rightMargin=72, leftMargin=72,
                              topMargin=72, bottomMargin=18)

        # Container for the 'Flowable' objects
        elements = []

        # Define styles
        styles = getSampleStyleSheet()
        styles.add(ParagraphStyle(name='Justify', alignment=TA_JUSTIFY))
        styles.add(ParagraphStyle(name='Center', alignment=TA_CENTER))

        title_style = ParagraphStyle(
            'CustomTitle',
            parent=styles['Heading1'],
            fontSize=24,
            textColor=colors.HexColor('#0369a1'),
            spaceAfter=30,
            alignment=TA_CENTER,
        )

        heading_style = ParagraphStyle(
            'CustomHeading',
            parent=styles['Heading2'],
            fontSize=16,
            textColor=colors.HexColor('#0284c7'),
            spaceAfter=12,
            spaceBefore=12,
        )

        # Watermark and disclaimer
        watermark = Paragraph(
            '<para align=center><b>NOT FOR DECISION-MAKING - ENTERTAINMENT & EDUCATIONAL USE ONLY</b></para>',
            ParagraphStyle('Watermark', fontSize=10, textColor=colors.red, alignment=TA_CENTER)
        )
        elements.append(watermark)
        elements.append(Spacer(1, 12))

        # Title
        title = Paragraph("PersonaScope Analysis Report", title_style)
        elements.append(title)

        # Metadata
        timestamp = datetime.fromisoformat(analysis_result['timestamp']).strftime('%B %d, %Y at %H:%M UTC')
        metadata = Paragraph(
            f'<para align=center>Generated: {timestamp}<br/>Report ID: {analysis_result["id"]}</para>',
            styles['Normal']
        )
        elements.append(metadata)
        elements.append(Spacer(1, 20))

        # Critical Disclaimer
        disclaimer_text = """
        <para align=justify>
        <b>CRITICAL DISCLAIMER:</b> This report is for entertainment and educational purposes only.
        Facial analysis of personality traits is NOT scientifically validated for individual prediction.
        The correlations presented are based on weak population-level statistics from research literature
        and should NEVER be used for hiring, dating decisions, clinical diagnosis, or any form of
        discrimination or judgment of others. Results have very low predictive accuracy and should be
        treated as exploratory entertainment only.
        </para>
        """
        elements.append(Paragraph(disclaimer_text, styles['Justify']))
        elements.append(Spacer(1, 20))

        # Facial Measurements Section
        elements.append(Paragraph("Facial Feature Measurements", heading_style))

        measurements = analysis_result['facialMeasurements']
        measurement_data = [
            ['Feature', 'Value', 'Notes'],
            ['Facial Width-to-Height Ratio', f"{measurements['fWHR']:.3f}", 'Typical range: 1.5-2.5'],
            ['Facial Symmetry', f"{measurements['symmetry']:.1f}/100", 'Higher = more symmetrical'],
            ['Jaw Prominence', f"{measurements['jawProminence']:.1f}/100", 'Relative measurement'],
            ['Eye Spacing', f"{measurements['eyeSpacing']:.3f}", 'Normalized ratio'],
            ['Face Shape', measurements['faceShape'], 'Classification'],
        ]

        measurement_table = Table(measurement_data, colWidths=[2.5*inch, 1.5*inch, 2*inch])
        measurement_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#0284c7')),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 12),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
            ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
            ('GRID', (0, 0), (-1, -1), 1, colors.black),
        ]))
        elements.append(measurement_table)
        elements.append(Spacer(1, 20))

        # Big Five Section
        elements.append(Paragraph("Big Five Personality Traits (OCEAN)", heading_style))
        elements.append(Paragraph(
            '<para align=justify><i>Note: These are weak population-level correlations with very low individual predictive accuracy.</i></para>',
            styles['Justify']
        ))
        elements.append(Spacer(1, 10))

        for trait in analysis_result['bigFive']:
            trait_text = f"""
            <para>
            <b>{trait['trait']}: {trait['score']:.0f}/100</b> (Confidence: {trait['confidence']*100:.0f}%,
            Percentile: {trait['percentile']}th)<br/>
            <i>{trait['description']}</i>
            </para>
            """
            elements.append(Paragraph(trait_text, styles['Normal']))
            elements.append(Spacer(1, 10))

        elements.append(Spacer(1, 20))

        # Dark Triad Section
        elements.append(Paragraph("Dark Triad Indicators", heading_style))
        elements.append(Paragraph(
            '<para align=justify><b>WARNING:</b> These assessments are NOT scientifically validated. Treat as entertainment only.</para>',
            ParagraphStyle('Warning', fontSize=10, textColor=colors.red)
        ))
        elements.append(Spacer(1, 10))

        for trait in analysis_result['darkTriad']:
            trait_text = f"""
            <para>
            <b>{trait['trait']}: {trait['score']:.0f}/100</b> (Confidence: {trait['confidence']*100:.0f}%)<br/>
            <i>{trait['description']}</i><br/>
            <font color="red">{trait['disclaimer']}</font>
            </para>
            """
            elements.append(Paragraph(trait_text, styles['Normal']))
            elements.append(Spacer(1, 12))

        # Page break before research section
        elements.append(PageBreak())

        # Research Basis Section
        elements.append(Paragraph("Research Basis & Citations", heading_style))

        for trait in analysis_result['otherTraits']:
            elements.append(Paragraph(f"<b>{trait['trait']}</b>", styles['Heading3']))
            elements.append(Paragraph(trait['researchBasis'], styles['Justify']))
            elements.append(Spacer(1, 8))

            # Citations
            elements.append(Paragraph("<b>Key Citations:</b>", styles['Normal']))
            for citation in trait['citations']:
                citation_text = f"""
                <para>
                {citation['authors']} ({citation['year']}). <i>{citation['title']}</i>.
                {citation['journal']}. DOI: {citation.get('doi', 'N/A')}<br/>
                Summary: {citation['summary']}
                </para>
                """
                elements.append(Paragraph(citation_text, ParagraphStyle('Citation', fontSize=9)))
                elements.append(Spacer(1, 6))

            # Limitations
            elements.append(Paragraph("<b>Limitations:</b>", styles['Normal']))
            for limitation in trait['limitations']:
                elements.append(Paragraph(f"• {limitation}", ParagraphStyle('Limitation', fontSize=9)))

            elements.append(Spacer(1, 15))

        # Final disclaimer
        final_disclaimer = """
        <para align=justify>
        <b>FINAL REMINDER:</b> This report explores statistical correlations from research literature.
        It does NOT provide accurate individual personality assessment. Effect sizes in the research
        are typically very small (r < 0.3), explaining less than 10% of personality variance.
        Individual variation far exceeds any population-level patterns. Use this information only
        for entertainment and education, never for important decisions about yourself or others.
        </para>
        """
        elements.append(Paragraph(final_disclaimer, ParagraphStyle('FinalDisclaimer',
                                                                    fontSize=10,
                                                                    textColor=colors.red,
                                                                    alignment=TA_JUSTIFY)))

        # Build PDF
        doc.build(elements)

        buffer.seek(0)
        return buffer

    except Exception as e:
        logger.error(f"Error generating PDF: {e}", exc_info=True)
        raise
