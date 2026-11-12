import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api";
import { FaExclamationTriangle } from "react-icons/fa";

export default function InvestigatorEvidenceDetails() {
    const { evidence_id } = useParams();
    const navigate = useNavigate();

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchForensicReport = async () => {
            try {
                const response = await api.get(
                    `/forensic-report/${evidence_id}`
                );

                setData(response.data);
            } catch (err) {
                console.error(
                    "Forensic Report Error:",
                    err
                );

                setError(
                    err.response?.data?.detail ||
                    "Unable to load forensic report."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchForensicReport();
    }, [evidence_id]);

    // =========================
    // FRIENDLY REASON MAPPING
    // =========================

    const getFriendlyReason = (reason) => {
        const friendlyReasons = {
            // -------------------------
            // GENERAL FILE REASONS
            // -------------------------

            "Metadata could not be extracted.":
                "Some file information could not be read.",

            "Unknown file type.":
                "The file type could not be identified.",

            "Metadata unavailable.":
                "Some file information could not be checked.",

            "File metadata unavailable.":
                "Some file information could not be checked.",

            "Metadata missing.":
                "Some file information is missing.",

            // -------------------------
            // AUDIO REASONS
            // -------------------------

            "Sample rate unavailable.":
                "Some audio information could not be checked.",

            "Bitrate information unavailable.":
                "Some audio information could not be checked.",

            "Audio metadata unavailable.":
                "Some audio information could not be checked.",

            "Audio information unavailable.":
                "Some audio information could not be checked.",

            "Duration unavailable.":
                "The duration of the audio could not be checked.",

            "Audio duration could not be determined.":
                "The duration of the audio could not be checked.",

            // -------------------------
            // IMAGE REASONS
            // -------------------------

            "Low feature diversity detected.":
                "The file has some unusual visual characteristics.",

            "Visual features appear unusual.":
                "Some visual patterns in the image look unusual.",

            "Low resolution image detected.":
                "The image quality is lower than expected.",

            "Image resolution unavailable.":
                "The image quality could not be checked.",

            "Image metadata unavailable.":
                "Some image information could not be checked.",

            "Visual analysis unavailable.":
                "The visual content could not be fully analyzed.",

            // -------------------------
            // VIDEO REASONS
            // -------------------------

            "Unusually low frame rate.":
                "The video has an unusually low frame rate.",

            "Video duration could not be determined.":
                "The video duration could not be checked.",

            "Video metadata unavailable.":
                "Some video information could not be checked.",

            "Frame rate unavailable.":
                "The video frame rate could not be checked.",

            // -------------------------
            // FILE SIZE REASONS
            // -------------------------

            "Very small file size.":
                "The file size is unusually small.",

            "Unusually small file size.":
                "The file size is unusually small.",

            "File size unavailable.":
                "The file size could not be checked.",

            // -------------------------
            // DOCUMENT REASONS
            // -------------------------

            "Document has been modified after creation.":
                "The document shows signs of being modified.",

            "Producer metadata missing.":
                "Some document information is missing.",

            "Author metadata missing.":
                "The document does not contain author information.",

            "Creation date missing.":
                "The document does not contain creation date information.",

            "Modification date missing.":
                "The document does not contain modification date information.",

            "Document metadata unavailable.":
                "Some document information could not be checked.",

            // -------------------------
            // HASH / INTEGRITY REASONS
            // -------------------------

            "Hash unavailable.":
                "The file's integrity could not be checked.",

            "Hash could not be generated.":
                "The file's integrity could not be checked.",

            "Checksum unavailable.":
                "The file's integrity could not be checked.",

            "Integrity check unavailable.":
                "The file's integrity could not be checked.",

            // -------------------------
            // GENERAL ANALYSIS REASONS
            // -------------------------

            "Analysis unavailable.":
                "Some parts of the file could not be analyzed.",

            "Analysis could not be completed.":
                "The analysis could not be fully completed.",

            "Insufficient data for analysis.":
                "There was not enough information to complete the analysis.",

            "Insufficient information.":
                "There was not enough information to complete the analysis.",

            "Unable to analyze file.":
                "The file could not be fully analyzed.",

            "Technical analysis unavailable.":
                "Some technical information could not be checked."
        };

        return friendlyReasons[reason] || reason;
    };

    // =========================
    // VERIFICATION HISTORY HELPERS
    // =========================

    const formatHistoryLabel = (key) => {
        return key
            .replace(/_/g, " ")
            .replace(/\b\w/g, (char) => char.toUpperCase());
    };

    // IMPORTANT:
    // Only fields that are actually date fields are formatted
    // as dates. This prevents names, IDs, hashes, etc. from
    // accidentally being interpreted as dates.

    const dateHistoryFields = [
        "verified_at",
        "verification_date",
        "created_at",
        "updated_at",
        "timestamp",
        "uploaded_at",
        "registered_at"
    ];

    const formatHistoryValue = (key, value) => {
        if (
            value === null ||
            value === undefined ||
            value === ""
        ) {
            return "—";
        }

        if (typeof value === "boolean") {
            return value ? "Yes" : "No";
        }

        if (
            dateHistoryFields.includes(key) &&
            typeof value === "string"
        ) {
            const parsedDate = Date.parse(value);

            if (!Number.isNaN(parsedDate)) {
                return new Date(
                    parsedDate
                ).toLocaleString();
            }
        }

        if (typeof value === "object") {
            return JSON.stringify(value);
        }

        return String(value);
    };

    // =========================
    // LOADING
    // =========================

    if (loading) {
    return (
        <div
            style={{
                padding: "40px",
                maxWidth: "1400px",
                margin: "0 auto"
            }}
        >
            <div
                style={{
                    background: "white",
                    padding: "50px 30px",
                    borderRadius: "15px",
                    textAlign: "center",
                    boxShadow:
                        "0 4px 15px rgba(0,0,0,0.06)"
                }}
            >
                <div
                    style={{
                        width: "42px",
                        height: "42px",
                        border: "4px solid #E2E8F0",
                        borderTop: "4px solid #2563EB",
                        borderRadius: "50%",
                        margin: "0 auto",
                        animation:
                            "forensicReportSpin 1s linear infinite"
                    }}
                />

                <h2
                    style={{
                        marginTop: "18px",
                        color: "#0F172A"
                    }}
                >
                    Loading Forensic Report
                </h2>

                <p
                    style={{
                        marginTop: "8px",
                        color: "#64748B"
                    }}
                >
                    Preparing detailed evidence analysis.
                </p>

                <style>
                    {`
                        @keyframes forensicReportSpin {
                            from {
                                transform: rotate(0deg);
                            }
                            to {
                                transform: rotate(360deg);
                            }
                        }
                    `}
                </style>
            </div>
        </div>
    );
}

    // =========================
    // ERROR
    // =========================

    if (error) {
    return (
        <div
            style={{
                padding: "40px",
                maxWidth: "1400px",
                margin: "0 auto"
            }}
        >
            <button
                onClick={() =>
                    navigate("/investigator/dashboard")
                }
                style={{
                    padding: "10px 16px",
                    border: "1px solid #CBD5E1",
                    borderRadius: "8px",
                    background: "white",
                    color: "#334155",
                    cursor: "pointer",
                    fontWeight: "600"
                }}
            >
                ← Back to Dashboard
            </button>

            <div
                style={{
                    marginTop: "25px",
                    background: "#FEF2F2",
                    padding: "30px",
                    borderRadius: "12px",
                    border: "1px solid #FECACA"
                }}
            >
                <FaExclamationTriangle
                    size={28}
                    style={{
                        color: "#DC2626"
                    }}
                />

                <h2
                    style={{
                        marginTop: "12px",
                        color: "#991B1B"
                    }}
                >
                    Unable to load forensic report
                </h2>

                <p
                    style={{
                        marginTop: "8px",
                        color: "#7F1D1D"
                    }}
                >
                    {error}
                </p>

                <button
                    onClick={() => window.location.reload()}
                    style={{
                        marginTop: "18px",
                        padding: "10px 16px",
                        border: "none",
                        borderRadius: "8px",
                        background: "#2563EB",
                        color: "white",
                        cursor: "pointer",
                        fontWeight: "600"
                    }}
                >
                    Try Again
                </button>
            </div>
        </div>
    );
}

    // =========================
    // DATA
    // =========================

    const caseInfo =
        data?.case_information || {};

    const evidenceInfo =
        data?.evidence_information || {};

    const blockchainInfo =
        data?.blockchain_information || {};

    const forensicReport =
        data?.forensic_report || {};

    const verification =
        data?.verification || {};

    // =========================
    // METADATA
    // =========================

    const metadata =
        forensicReport.metadata_analysis || {};

    const metadataFields = [
        ["Format", metadata.format],

        [
            "Width",
            metadata.width != null
                ? `${metadata.width} px`
                : null
        ],

        [
            "Height",
            metadata.height != null
                ? `${metadata.height} px`
                : null
        ],

        ["Pages", metadata.pages],

        ["Author", metadata.author],

        ["Creator", metadata.creator],

        ["Producer", metadata.producer],

        ["Creation Date", metadata.creation_date],

        ["Modification Date", metadata.modification_date],

        [
            "Duration",
            metadata.duration != null
                ? `${metadata.duration} seconds`
                : null
        ],

        [
            "Bitrate",
            metadata.bitrate != null
                ? `${metadata.bitrate} bps`
                : null
        ],

        [
            "Sample Rate",
            metadata.sample_rate != null
                ? `${metadata.sample_rate} Hz`
                : null
        ],

        ["Codec", metadata.codec],

        ["FPS", metadata.fps],

        ["Resolution", metadata.resolution]
    ].filter(
        ([, value]) =>
            value !== null &&
            value !== undefined &&
            value !== ""
    );

    // =========================
    // TECHNICAL FINDINGS
    // =========================

    const technical =
        forensicReport.technical_analysis || {};

    const technicalFindings =
        technical.suspicious_findings ||
        technical.analysis ||
        [];

    const technicalFindingsArray =
        Array.isArray(technicalFindings)
            ? technicalFindings
            : technicalFindings
                ? [technicalFindings]
                : [];

    const technicalFindingsFriendly =
        technicalFindingsArray.map((reason) => {
            const message =
                typeof reason === "object"
                    ? (
                        reason.message ||
                        reason.reason ||
                        JSON.stringify(reason)
                    )
                    : reason;

            return getFriendlyReason(message);
        });

    // =========================
    // VERIFICATION HISTORY
    // =========================

    const verificationHistory =
        verification?.history ||
        verification?.verification_history ||
        [];

    const verificationHistoryArray =
        Array.isArray(verificationHistory)
            ? verificationHistory
            : verificationHistory
                ? [verificationHistory]
                : [];

    return (
    <div
        style={{
            padding: "40px",
            maxWidth: "1400px",
            margin: "0 auto"
        }}
    >
            {/* =========================
                HEADER
            ========================= */}

           <button
    onClick={() =>
        navigate("/investigator/dashboard")
    }
    style={{
        padding: "10px 16px",
        border: "1px solid #CBD5E1",
        borderRadius: "8px",
        background: "white",
        color: "#334155",
        cursor: "pointer",
        fontWeight: "600",
        marginBottom: "20px",
        transition: "all 0.2s ease"
    }}
    onMouseEnter={(e) => {
        e.currentTarget.style.background = "#F8FAFC";
    }}
    onMouseLeave={(e) => {
        e.currentTarget.style.background = "white";
    }}
>
    ← Back to Dashboard
</button>
           <div
    style={{
        marginBottom: "30px"
    }}
>
    <h1
        style={{
            margin: 0,
            color: "#0F172A",
            fontSize: "30px"
        }}
    >
        Investigator Evidence Details
    </h1>

    <p
        style={{
            marginTop: "8px",
            color: "#64748B",
            fontSize: "15px"
        }}
    >
        Detailed forensic analysis and evidence information.
    </p>
</div>


            {/* =========================
                CASE INFORMATION
            ========================= */}

            <div
                style={{
    background: "#FFFFFF",
    padding: "28px",
    borderRadius: "16px",
    marginTop: "20px",
    border: "1px solid #E2E8F0",
    boxShadow: "0 4px 15px rgba(0,0,0,0.04)"
}}
            >
                <h2
    style={{
        margin: 0,
        color: "#0F172A",
        fontSize: "19px"
    }}
>
    Case Information
</h2>

                <p>
                    <strong>Case ID:</strong>{" "}
                    {caseInfo.case_id || "—"}
                </p>

                <p>
                    <strong>Title:</strong>{" "}
                    {caseInfo.title || "—"}
                </p>

                <p>
                    <strong>Description:</strong>{" "}
                    {caseInfo.description || "—"}
                </p>
            </div>


            {/* =========================
                EVIDENCE INFORMATION
            ========================= */}

            <div
                style={{
    background: "#FFFFFF",
    padding: "28px",
    borderRadius: "16px",
    marginTop: "20px",
    border: "1px solid #E2E8F0",
    boxShadow: "0 4px 15px rgba(0,0,0,0.04)"
}}
            >
                <h2
                style={{
        margin: 0,
        color: "#0F172A",
        fontSize: "19px"
    }}>
                    Evidence Information
                </h2>

                <p>
                    <strong>Evidence ID:</strong>{" "}
                    {evidenceInfo.evidence_id || "—"}
                </p>

                <p>
                    <strong>Original Filename:</strong>{" "}
                    {evidenceInfo.original_filename || "—"}
                </p>

                <p>
                    <strong>Stored Filename:</strong>{" "}
                    {evidenceInfo.stored_filename || "—"}
                </p>

                <p>
                    <strong>File Type:</strong>{" "}
                    {evidenceInfo.file_type || "—"}
                </p>

                <p>
                    <strong>File Size:</strong>{" "}
                    {evidenceInfo.file_size || "—"}
                </p>

                <p>
                    <strong>Uploaded At:</strong>{" "}
                    {evidenceInfo.uploaded_at
                        ? new Date(
                            evidenceInfo.uploaded_at
                        ).toLocaleString()
                        : "—"}
                </p>

                <p>
                    <strong>Storage Status:</strong>{" "}
                    {evidenceInfo.storage_status || "—"}
                </p>

                <p>
                    <strong>Storage Path:</strong>{" "}
                    {evidenceInfo.storage_path || "—"}
                </p>
            </div>


            {/* =========================
                BLOCKCHAIN INFORMATION
            ========================= */}

            <div
                style={{
                    background: "white",
                    padding: "25px",
                    borderRadius: "12px",
                    marginTop: "20px",
                    boxShadow:
                        "0 4px 15px rgba(0,0,0,0.06)"
                }}
            >
                <h2 
                style={{
        margin: 0,
        color: "#0F172A",
        fontSize: "19px"
    }} >
                    Blockchain Information
                </h2>

                <p>
                    <strong>Registration Status:</strong>{" "}
                    {blockchainInfo.registration_status || "—"}
                </p>

                <p>
                    <strong>Transaction Hash:</strong>{" "}
                    {blockchainInfo.transaction_hash || "—"}
                </p>

                <p>
                    <strong>Block Index:</strong>{" "}
                    {blockchainInfo.block_index ?? "—"}
                </p>

                <p>
                    <strong>Registered At:</strong>{" "}
                    {blockchainInfo.registered_at
                        ? new Date(
                            blockchainInfo.registered_at
                        ).toLocaleString()
                        : "—"}
                </p>
            </div>


            {/* =========================
                FORENSIC REPORT
            ========================= */}

            <div
                style={{
    background: "#FFFFFF",
    padding: "28px",
    borderRadius: "16px",
    marginTop: "20px",
    border: "1px solid #E2E8F0",
    boxShadow: "0 4px 15px rgba(0,0,0,0.04)"
}}
            >

                <h2 
                style={{
        margin: 0,
        color: "#0F172A",
        fontSize: "19px"
    }}
    >
                    AI / Forensic Report
                </h2>


                {/* =========================
                    REPORT INFORMATION
                ========================= */}

                <div
                    style={{
                        marginTop: "20px",
                        padding: "20px",
                        background: "#f8f9fa",
                        borderRadius: "10px"
                    }}
                >
                    <h3>
                        Report Information
                    </h3>

                    <p
                        style={{
                            marginTop: "12px"
                        }}
                    >
                        <strong>Analysis Engine:</strong>{" "}
                        {
                            forensicReport
                                .report_information
                                ?.analysis_engine || "—"
                        }
                    </p>

                    <p
                        style={{
                            marginTop: "8px"
                        }}
                    >
                        <strong>Report Version:</strong>{" "}
                        {
                            forensicReport
                                .report_information
                                ?.report_version || "—"
                        }
                    </p>

                    <p
                        style={{
                            marginTop: "8px"
                        }}
                    >
                        <strong>Generated At:</strong>{" "}
                        {
                            forensicReport
                                .report_information
                                ?.generated_at
                                ? new Date(
                                    forensicReport
                                        .report_information
                                        .generated_at
                                ).toLocaleString()
                                : "—"
                        }
                    </p>
                </div>


                {/* =========================
                    AUTHENTICITY ASSESSMENT
                ========================= */}

                <div
                    style={{
                        marginTop: "20px",
                        padding: "20px",
                        borderRadius: "10px",
                        border: "1px solid #eee"
                    }}
                >
                    <h3>
                        Authenticity Assessment
                    </h3>

                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns:
                                "repeat(auto-fit, minmax(200px, 1fr))",
                            gap: "15px",
                            marginTop: "20px"
                        }}
                    >

                        {/* CONFIDENCE */}

                        <div
                            style={{
                                padding: "15px",
                                background: "#f8f9fa",
                                borderRadius: "8px"
                            }}
                        >
                            <strong>
                                Authenticity Score
                            </strong>

                            <div
                                style={{
                                    fontSize: "24px",
                                    fontWeight: "bold",
                                    marginTop: "8px"
                                }}
                            >
                                {
                                    forensicReport
                                        .authenticity_assessment
                                        ?.confidence_score != null
                                        ? `${forensicReport.authenticity_assessment.confidence_score} / 100`
                                        : "Not Available"
                                }
                            </div>
                        </div>


                        {/* RISK */}

                        <div
                            style={{
                                padding: "15px",
                                background: "#f8f9fa",
                                borderRadius: "8px"
                            }}
                        >
                            <strong>
                                Risk Level
                            </strong>

                            <div
                                style={{
                                    fontSize: "20px",
                                    fontWeight: "bold",
                                    marginTop: "8px"
                                }}
                            >
                                {
                                    forensicReport
                                        .authenticity_assessment
                                        ?.risk_level || "—"
                                }
                            </div>
                        </div>


                        {/* STATUS */}

                        <div
                            style={{
                                padding: "15px",
                                background: "#f8f9fa",
                                borderRadius: "8px"
                            }}
                        >
                            <strong>
                                Analysis Status
                            </strong>

                            <div
                                style={{
                                    fontSize: "18px",
                                    fontWeight: "bold",
                                    marginTop: "8px"
                                }}
                            >
                                {
                                    forensicReport
                                        .authenticity_assessment
                                        ?.status || "—"
                                }
                            </div>
                        </div>

                    </div>


                    {/* =========================
                        REASONS
                    ========================= */}

                    <div
                        style={{
                            marginTop: "20px"
                        }}
                    >
                        <h4>
                            Why This Assessment?
                        </h4>

                        {
                            forensicReport
                                .authenticity_assessment
                                ?.reasons
                                ?.length > 0 ? (

                                <ul
                                    style={{
                                        marginTop: "10px",
                                        paddingLeft: "20px"
                                    }}
                                >
                                    {
                                        forensicReport
                                            .authenticity_assessment
                                            .reasons
                                            .map(
                                                (reason, index) => (
                                                    <li
                                                        key={index}
                                                        style={{
                                                            marginTop: "6px"
                                                        }}
                                                    >
                                                        {
                                                            typeof reason === "object"
                                                                ? getFriendlyReason(
                                                                    reason.message ||
                                                                    reason.reason ||
                                                                    JSON.stringify(reason)
                                                                )
                                                                : getFriendlyReason(reason)
                                                        }
                                                    </li>
                                                )
                                            )
                                    }
                                </ul>

                            ) : (
                                <p
                                    style={{
                                        marginTop: "10px",
                                        color: "#666"
                                    }}
                                >
                                    No specific reasons were recorded.
                                </p>
                            )
                        }
                    </div>
                </div>


                {/* =========================
                    METADATA ANALYSIS
                ========================= */}

                <div
                    style={{
                        marginTop: "20px",
                        padding: "20px",
                        borderRadius: "10px",
                        border: "1px solid #eee"
                    }}
                >
                    <h3>
                        Metadata Analysis
                    </h3>

                    {
                        metadataFields.length > 0 ? (

                            <div
                                style={{
                                    display: "grid",
                                    gridTemplateColumns:
                                        "repeat(auto-fit, minmax(250px, 1fr))",
                                    gap: "15px",
                                    marginTop: "20px"
                                }}
                            >
                                {
                                    metadataFields.map(
                                        ([label, value]) => (
                                            <div
                                                key={label}
                                                style={{
                                                    padding: "15px",
                                                    background: "#f8f9fa",
                                                    borderRadius: "8px"
                                                }}
                                            >
                                                <strong>
                                                    {label}
                                                </strong>

                                                <div
                                                    style={{
                                                        marginTop: "6px"
                                                    }}
                                                >
                                                    {String(value)}
                                                </div>
                                            </div>
                                        )
                                    )
                                }
                            </div>

                        ) : (
                            <p
                                style={{
                                    marginTop: "12px",
                                    color: "#666"
                                }}
                            >
                                No metadata information is available.
                            </p>
                        )
                    }
                </div>


                {/* =========================
                    TECHNICAL ANALYSIS
                ========================= */}

                <div
                    style={{
                        marginTop: "20px",
                        padding: "20px",
                        borderRadius: "10px",
                        border: "1px solid #eee"
                    }}
                >
                    <h3>
                        Technical Analysis
                    </h3>

                    {
                        technicalFindingsFriendly.length > 0 ? (

                            <ul
                                style={{
                                    marginTop: "15px",
                                    paddingLeft: "20px"
                                }}
                            >
                                {
                                    technicalFindingsFriendly.map(
                                        (finding, index) => (
                                            <li
                                                key={index}
                                                style={{
                                                    marginTop: "8px"
                                                }}
                                            >
                                                {finding}
                                            </li>
                                        )
                                    )
                                }
                            </ul>

                        ) : (
                            <p
                                style={{
                                    marginTop: "12px",
                                    color: "#666"
                                }}
                            >
                                No suspicious technical findings were recorded.
                            </p>
                        )
                    }
                </div>




                {/* =========================
                    VERIFICATION HISTORY
                ========================= */}

                <div
                    style={{
                        marginTop: "20px",
                        padding: "20px",
                        borderRadius: "10px",
                        border: "1px solid #eee"
                    }}
                >
                    <h3>
                        Verification 
                    </h3>

                    {
                        verificationHistoryArray.length > 0 ? (

                            <div
                                style={{
                                    marginTop: "20px",
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "15px"
                                }}
                            >

                                {
                                    verificationHistoryArray.map(
                                        (historyItem, index) => (

                                            <div
                                                key={index}
                                                style={{
                                                    padding: "20px",
                                                    background: "#f8f9fa",
                                                    borderRadius: "10px",
                                                    border: "1px solid #e5e5e5"
                                                }}
                                            >

                                                <h4
                                                    style={{
                                                        marginBottom: "15px"
                                                    }}
                                                >
                                                    Verification Attempt{" "}
                                                    {index + 1}
                                                </h4>

                                                {
                                                    typeof historyItem === "object" &&
                                                    historyItem !== null ? (

                                                        <div
                                                            style={{
                                                                display: "grid",
                                                                gridTemplateColumns:
                                                                    "repeat(auto-fit, minmax(250px, 1fr))",
                                                                gap: "12px"
                                                            }}
                                                        >

                                                            {
                                                                Object.entries(
                                                                    historyItem
                                                                ).map(
                                                                    ([key, value]) => (

                                                                        <div
                                                                            key={key}
                                                                            style={{
                                                                                padding: "12px",
                                                                                background: "white",
                                                                                borderRadius: "8px",
                                                                                border: "1px solid #eee"
                                                                            }}
                                                                        >

                                                                            <strong>
                                                                                {
                                                                                    formatHistoryLabel(
                                                                                        key
                                                                                    )
                                                                                }
                                                                            </strong>

                                                                            <div
                                                                                style={{
                                                                                    marginTop: "6px",
                                                                                    wordBreak: "break-word"
                                                                                }}
                                                                            >
                                                                                {
                                                                                    formatHistoryValue(
                                                                                        key,
                                                                                        value
                                                                                    )
                                                                                }
                                                                            </div>

                                                                        </div>

                                                                    )
                                                                )
                                                            }

                                                        </div>

                                                    ) : (

                                                        <div
                                                            style={{
                                                                padding: "12px",
                                                                background: "white",
                                                                borderRadius: "8px"
                                                            }}
                                                        >
                                                            {
                                                                formatHistoryValue(
                                                                    "value",
                                                                    historyItem
                                                                )
                                                            }
                                                        </div>

                                                    )
                                                }

                                            </div>

                                        )
                                    )
                                }

                            </div>

                        ) : (

                            <p
                                style={{
                                    marginTop: "12px",
                                    color: "#666"
                                }}
                            >
                                This evidence has not been verified yet.
                            </p>

                        )
                    }
                </div>

            </div>

        </div>
    );
}