import numpy as np


def calculate_authenticity(
    metadata,
    rule_analysis,
    deep_features=None
):
    """
    Calculates an explainable authenticity score
    for supported evidence types.
    """

    score = 100
    reasons = []

    # --------------------------
    # Metadata checks
    # --------------------------

    if metadata.get("error"):
        score -= 20
        reasons.append("Metadata could not be extracted.")

    if metadata.get("file_type") == "Unknown":
        score -= 15
        reasons.append("Unknown file type.")

    # --------------------------
    # Image-specific analysis
    # --------------------------

    if rule_analysis.get("authenticity_score") is not None:

        score -= (
            100 - rule_analysis["authenticity_score"]
        )

        reasons.extend(
            rule_analysis.get("analysis", [])
        )

        # --------------------------
        # Deep feature analysis
        # --------------------------

        if deep_features is not None:

            feature_mean = np.mean(deep_features)
            feature_std = np.std(deep_features)

            if feature_std < 0.5:
                score -= 10
                reasons.append(
                    "Low feature diversity detected."
                )

            if feature_mean < 0.20:
                score -= 10
                reasons.append(
                    "Visual features appear unusual."
                )

    # --------------------------
    # PDF / Video / Audio analysis
    # --------------------------

    else:

        suspicious_findings = rule_analysis.get(
            "suspicious_findings",
            []
        )

        # Each detected forensic indicator
        # reduces the authenticity score.
        score -= len(suspicious_findings) * 10

        reasons.extend(suspicious_findings)

    # --------------------------
    # Keep score between 0 and 100
    # --------------------------

    score = max(0, min(score, 100))

    # --------------------------
    # Risk level
    # --------------------------

    if score >= 90:
        risk_level = "Low"

    elif score >= 70:
        risk_level = "Medium"

    else:
        risk_level = "High"

    return {
        "score": round(score, 2),
        "risk_level": risk_level,
        "reasons": reasons
    }