def generate_user_summary(
    analysis_type,
    decision,
    analysis=None
):

    score = decision.get("score")

    # -------------------------
    # IMAGE
    # -------------------------

    if analysis_type == "Image":

        if score is None:
            score = 0

        if score >= 90:

            overall = "Likely Authentic"

            risk = "Low"

            recommendation = (
                "Proceed to Blockchain Registration"
            )

            summary = [

                "No major signs of manipulation detected.",

                "Image metadata appears consistent.",

                "Evidence appears suitable for blockchain registration."

            ]

        elif score >= 75:

            overall = "Requires Manual Review"

            risk = "Medium"

            recommendation = (
                "Manual review is recommended before registration."
            )

            summary = [

                "Minor inconsistencies were detected.",

                "Some metadata requires verification.",

                "Please review before blockchain registration."

            ]

        else:

            overall = "Potentially Manipulated"

            risk = "High"

            recommendation = (
                "Do Not Register on Blockchain"
            )

            summary = [

                "Possible manipulation indicators detected.",

                "Evidence integrity could not be confirmed.",

                "Manual investigation is strongly recommended."

            ]

        return {

            "analysis_status": "Completed",

            "overall_result": overall,

            "confidence_score": score,

            "risk_level": risk,

            "summary": summary,

            "recommendation": recommendation

        }

    # -------------------------
    # PDF
    # -------------------------

    elif analysis_type == "PDF":

        suspicious = len(
            analysis.get(
                "suspicious_findings",
                []
            )
        )

        risk = "Low" if suspicious == 0 else "Medium"

        return {

            "analysis_status": "Completed",

            "overall_result": "Document Analysis Completed",

            "confidence_score": 95 if suspicious == 0 else 75,

            "risk_level": risk,

            "summary": [

                "PDF metadata analysed successfully.",

                "Document structure appears valid.",

                "No critical integrity issues detected."

            ] if suspicious == 0 else [

                "Some metadata inconsistencies were found.",

                "Manual review is recommended."

            ],

            "recommendation":

                "Proceed to Blockchain Registration"

                if suspicious == 0

                else

                "Manual Review Recommended"

        }

    # -------------------------
    # VIDEO
    # -------------------------

    elif analysis_type == "Video":

        suspicious = len(
            analysis.get(
                "suspicious_findings",
                []
            )
        )

        return {

            "analysis_status": "Completed",

            "overall_result": "Video Analysis Completed",

            "confidence_score": 95 if suspicious == 0 else 75,

            "risk_level":

                "Low"

                if suspicious == 0

                else

                "Medium",

            "summary": [

                "Video metadata analysed.",

                "Media properties appear consistent.",

                "No major anomalies detected."

            ] if suspicious == 0 else [

                "Some video properties require review."

            ],

            "recommendation":

                "Proceed to Blockchain Registration"

                if suspicious == 0

                else

                "Manual Review Recommended"

        }

    # -------------------------
    # AUDIO
    # -------------------------

    elif analysis_type == "Audio":

        suspicious = len(
            analysis.get(
                "suspicious_findings",
                []
            )
        )

        return {

            "analysis_status": "Completed",

            "overall_result": "Audio Analysis Completed",

            "confidence_score": 95 if suspicious == 0 else 75,

            "risk_level":

                "Low"

                if suspicious == 0

                else

                "Medium",

            "summary": [

                "Audio metadata analysed.",

                "No significant anomalies detected.",

                "Evidence appears suitable for blockchain registration."

            ] if suspicious == 0 else [

                "Audio metadata requires manual review."

            ],

            "recommendation":

                "Proceed to Blockchain Registration"

                if suspicious == 0

                else

                "Manual Review Recommended"

        }

    # -------------------------
    # DEFAULT
    # -------------------------

    return {

        "analysis_status": "Completed",

        "overall_result": "Analysis Completed",

        "confidence_score": None,

        "risk_level": "Unknown",

        "summary": [

            "Analysis completed successfully."

        ],

        "recommendation": "Manual Review Recommended"

    }