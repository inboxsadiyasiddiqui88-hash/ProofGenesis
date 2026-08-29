from datetime import datetime


def generate_forensic_report(
    metadata,
    analysis,
    decision
):

    report = {

        # ==========================================
        # Report Information
        # ==========================================

        "report_information": {

            "generated_at": datetime.utcnow(),

            "report_version": "1.0",

            "analysis_engine": "ProofGenesis AI"

        },

        # ==========================================
        # Metadata Analysis
        # ==========================================

        "metadata_analysis": metadata,

        # ==========================================
        # Technical Analysis
        # ==========================================

        "technical_analysis": analysis,

        # ==========================================
        # Authenticity Assessment
        # ==========================================

        "authenticity_assessment": {

            "confidence_score": decision.get("score"),

            "risk_level": decision.get(
                "risk_level",
                "Unknown"
            ),

            "status": decision.get(
                "status",
                "Analysis Completed"
            ),

            "reasons": decision.get(
                "reasons",
                []
            )

        }

    }

    return report