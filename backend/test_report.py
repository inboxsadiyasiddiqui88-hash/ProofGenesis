from app.reports.report_generator import generate_report

metadata = {
    "file_type": "Image"
}

analysis = {
    "analysis": [
        "No obvious forensic indicators detected."
    ]
}

decision = {
    "score": 91,
    "reasons": [
        "Metadata consistent",
        "Normal resolution"
    ]
}

report = generate_report(
    metadata,
    analysis,
    decision
)

print(report)