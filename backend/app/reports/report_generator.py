def generate_report(
    metadata,
    analysis,
    decision
):

    report = {

        "metadata": metadata,

        "analysis": analysis,

        "analysis_type": analysis.get(
            "analysis_type",
            "Image"
        )

    }

    # -------------------------------
    # Image Evidence
    # -------------------------------

    if report["analysis_type"] == "Image":

        score = decision["score"]

        if score >= 90:
            confidence = "High"
            recommendation = "Proceed to Blockchain"

        elif score >= 75:
            confidence = "Medium"
            recommendation = "Manual Review Recommended"

        else:
            confidence = "Low"
            recommendation = "Do Not Register"

        report["authenticity"] = {

            "score": score,

            "confidence": confidence,

            "reasons": decision["reasons"],

            "recommendation": recommendation

        }

    # -------------------------------
    # PDF / Video / Audio
    # -------------------------------

    else:

        report["authenticity"] = {

            "status": decision["status"],

            "risk_level": decision["risk_level"],

            "recommendation":
                "Metadata analysis completed."

        }

    return report