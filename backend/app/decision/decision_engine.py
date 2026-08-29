import numpy as np


def calculate_authenticity(
    metadata,
    rule_analysis,
    deep_features
):
    """
    Calculates an explainable authenticity score.
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
    # Rule-based analysis
    # --------------------------

    score -= (100 - rule_analysis["authenticity_score"])

    reasons.extend(rule_analysis["analysis"])

    # --------------------------
    # Deep feature statistics
    # --------------------------

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

    score = max(score, 0)

    return {
        "score": round(score, 2),
        "reasons": reasons
    }