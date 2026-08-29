from pypdf import PdfReader


def analyze_pdf(file_path):

    reader = PdfReader(file_path)

    metadata = reader.metadata or {}

    suspicious = []

    if metadata.get("/ModDate"):
        suspicious.append(
            "Document has been modified after creation."
        )

    if metadata.get("/Producer") is None:
        suspicious.append(
            "Producer metadata missing."
        )

    if metadata.get("/Author") is None:
        suspicious.append(
            "Author metadata missing."
        )

    return {

        "analysis_type": "PDF",

        "pages": len(reader.pages),

        "encrypted": reader.is_encrypted,

        "author": metadata.get("/Author"),

        "creator": metadata.get("/Creator"),

        "producer": metadata.get("/Producer"),

        "creation_date": metadata.get("/CreationDate"),

        "modification_date": metadata.get("/ModDate"),

        "metadata_complete": len(metadata) > 0,

        "suspicious_findings": suspicious
    }