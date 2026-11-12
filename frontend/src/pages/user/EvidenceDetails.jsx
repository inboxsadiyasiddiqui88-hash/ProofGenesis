
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import UserLayout from "../../layouts/UserLayout";

function EvidenceDetails() {
    const { evidence_id } = useParams();
    const navigate = useNavigate();

    const [evidence, setEvidence] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // ==========================================
    // LOAD EVIDENCE
    // ==========================================

    useEffect(() => {
        let cancelled = false;

        const loadEvidence = async () => {
            try {
                const token = localStorage.getItem("token");

                const response = await fetch(
                    `http://127.0.0.1:8000/evidence/${evidence_id}`,
                    {
                        method: "GET",
                        headers: {
                            "Authorization": `Bearer ${token}`,
                            "Content-Type": "application/json"
                        }
                    }
                );

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.detail || "Failed to load evidence"
                    );
                }

                if (!cancelled) {
                    setEvidence(data);
                    setError("");
                    setLoading(false);
                }

            } catch (err) {
                console.error(err);

                if (!cancelled) {
                    setError(
                        err.message ||
                        "Unable to load evidence."
                    );

                    setLoading(false);
                }
            }
        };

        if (evidence_id) {
            loadEvidence();
}

        return () => {
            cancelled = true;
        };
    }, [evidence_id]);

    // ==========================================
    // STATUS STYLE
    // ==========================================

    const getStatusStyle = (status) => {
        if (status === "Registered") {
            return {
                background: "#DCFCE7",
                color: "#166534"
            };
        }

        if (status === "Cancelled by User") {
            return {
                background: "#FEE2E2",
                color: "#991B1B"
            };
        }

        return {
            background: "#FEF3C7",
            color: "#92400E"
        };
    };

    // ==========================================
    // BLOCKCHAIN STYLE
    // ==========================================

    const getBlockchainStyle = (status) => {
        if (status === "Registered") {
            return {
                background: "#DCFCE7",
                color: "#166534"
            };
        }

        return {
            background: "#F3F4F6",
            color: "#4B5563"
        };
    };

    // ==========================================
    // VERIFICATION STYLE
    // ==========================================

    const getVerificationStyle = (status) => {
        if (status === "Verified") {
            return {
                background: "#DCFCE7",
                color: "#166534"
            };
        }

        if (status === "Integrity Failed") {
            return {
                background: "#FEE2E2",
                color: "#991B1B"
            };
        }

        return {
            background: "#F3F4F6",
            color: "#4B5563"
        };
    };

    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {
        return (
            <UserLayout>
                <div
                    style={{
                        background: "white",
                        padding: "40px",
                        borderRadius: "15px",
                        textAlign: "center",
                        boxShadow:
                            "0 4px 15px rgba(0,0,0,0.06)"
                    }}
                >
                    <p style={{ color: "#666" }}>
                        Loading evidence...
                    </p>
                </div>
            </UserLayout>
        );
    }

    // ==========================================
    // ERROR
    // ==========================================

    if (error) {
        return (
            <UserLayout>
                <div
                    style={{
                        background: "white",
                        padding: "30px",
                        borderRadius: "15px",
                        boxShadow:
                            "0 4px 15px rgba(0,0,0,0.06)"
                    }}
                >
                    <p style={{ color: "#DC2626" }}>
                        {error}
                    </p>

                    <button
                        onClick={() => navigate("/evidence")}
                        style={{
                            marginTop: "20px",
                            padding: "10px 18px",
                            border: "none",
                            borderRadius: "8px",
                            cursor: "pointer",
                            background: "#F3F4F6",
                            fontWeight: "600"
                        }}
                    >
                        ← Back to My Evidence
                    </button>
                </div>
            </UserLayout>
        );
    }

    // ==========================================
    // NO EVIDENCE
    // ==========================================

    if (!evidence) {
        return (
            <UserLayout>
                <div
                    style={{
                        background: "white",
                        padding: "30px",
                        borderRadius: "15px",
                        boxShadow:
                            "0 4px 15px rgba(0,0,0,0.06)"
                    }}
                >
                    <p style={{ color: "#666" }}>
                        Evidence details not found.
                    </p>

                    <button
                        onClick={() => navigate("/evidence")}
                        style={{
                            marginTop: "20px",
                            padding: "10px 18px",
                            border: "none",
                            borderRadius: "8px",
                            cursor: "pointer",
                            background: "#F3F4F6",
                            fontWeight: "600"
                        }}
                    >
                        ← Back to My Evidence
                    </button>
                </div>
            </UserLayout>
        );
    }

    const report = evidence.user_summary;

    // ==========================================
    // MAIN PAGE
    // ==========================================

    return (
        <UserLayout>

            {/* Back Button */}

            <button
                onClick={() => navigate("/evidence")}
                style={{
                    padding: "10px 18px",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                    marginBottom: "25px",
                    background: "#F3F4F6",
                    fontWeight: "600"
                }}
            >
                ← Back to My Evidence
            </button>

            {/* Page Header */}

            <div
                style={{
                    background: "white",
                    padding: "30px",
                    borderRadius: "15px",
                    boxShadow:
                        "0 4px 15px rgba(0,0,0,0.06)"
                }}
            >
                <h1>Evidence Details</h1>

                <p
                    style={{
                        marginTop: "10px",
                        color: "#666",
                        wordBreak: "break-word"
                    }}
                >
                    {evidence.original_filename}
                </p>

                <p
                    style={{
                        marginTop: "8px",
                        fontSize: "13px",
                        color: "#777"
                    }}
                >
                    Evidence ID:{" "}
                    <strong>{evidence.evidence_id}</strong>
                </p>
            </div>

            {/* Evidence Information */}

            <div
                style={{
                    background: "white",
                    marginTop: "25px",
                    padding: "30px",
                    borderRadius: "15px",
                    boxShadow:
                        "0 4px 15px rgba(0,0,0,0.06)"
                }}
            >
                <h2>Evidence Information</h2>

                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns:
                            "repeat(auto-fit, minmax(220px, 1fr))",
                        gap: "20px",
                        marginTop: "25px"
                    }}
                >
                    <div>
                        <p
                            style={{
                                color: "#666",
                                fontSize: "14px"
                            }}
                        >
                            Case ID
                        </p>

                        <p
                            style={{
                                marginTop: "5px",
                                fontWeight: "600"
                            }}
                        >
                            {evidence.case_id}
                        </p>
                    </div>

                    <div>
                        <p
                            style={{
                                color: "#666",
                                fontSize: "14px"
                            }}
                        >
                            File Type
                        </p>

                        <p
                            style={{
                                marginTop: "5px",
                                fontWeight: "600"
                            }}
                        >
                            {evidence.file_type}
                        </p>
                    </div>

                    <div>
                        <p
                            style={{
                                color: "#666",
                                fontSize: "14px"
                            }}
                        >
                            File Size
                        </p>

                        <p
                            style={{
                                marginTop: "5px",
                                fontWeight: "600"
                            }}
                        >
                            {evidence.file_size} bytes
                        </p>
                    </div>

                    <div>
                        <p
                            style={{
                                color: "#666",
                                fontSize: "14px"
                            }}
                        >
                            Uploaded
                        </p>

                        <p
                            style={{
                                marginTop: "5px",
                                fontWeight: "600"
                            }}
                        >
                            {evidence.uploaded_at
                                ? new Date(
                                      evidence.uploaded_at
                                  ).toLocaleString()
                                : "Unknown"}
                        </p>
                    </div>
                </div>

                {/* Status Badges */}

                <div
                    style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "10px",
                        marginTop: "25px"
                    }}
                >
                    <span
                        style={{
                            ...getStatusStyle(
                                evidence.status
                            ),
                            padding: "7px 13px",
                            borderRadius: "18px",
                            fontSize: "13px",
                            fontWeight: "700"
                        }}
                    >
                        Status:{" "}
                        {evidence.status || "Unknown"}
                    </span>

                    <span
                        style={{
                            ...getBlockchainStyle(
                                evidence.blockchain_status
                            ),
                            padding: "7px 13px",
                            borderRadius: "18px",
                            fontSize: "13px",
                            fontWeight: "700"
                        }}
                    >
                        Blockchain:{" "}
                        {evidence.blockchain_status ||
                            "Not Registered"}
                    </span>

                    <span
                        style={{
                            ...getVerificationStyle(
                                evidence.verification_status
                            ),
                            padding: "7px 13px",
                            borderRadius: "18px",
                            fontSize: "13px",
                            fontWeight: "700"
                        }}
                    >
                        Verification:{" "}
                        {evidence.verification_status ||
                            "Not Verified"}
                    </span>
                </div>
            </div>

            {/* AI Analysis */}

            {report && (
                <div
                    style={{
                        background: "white",
                        marginTop: "25px",
                        padding: "30px",
                        borderRadius: "15px",
                        boxShadow:
                            "0 4px 15px rgba(0,0,0,0.06)"
                    }}
                >
                    <h2>AI Analysis</h2>

                    <h3
                        style={{
                            marginTop: "20px"
                        }}
                    >
                        {report.overall_result ||
                            "Analysis Completed"}
                    </h3>

                    {/* Authenticity Score */}

                    <div
                        style={{
                            marginTop: "20px",
                            padding: "18px",
                            background: "#F8FAFC",
                            borderRadius: "10px"
                        }}
                    >
                        <p
                            style={{
                                fontSize: "14px",
                                color: "#666"
                            }}
                        >
                            Authenticity Score
                        </p>

                        <p
                            style={{
                                marginTop: "5px",
                                fontSize: "28px",
                                fontWeight: "700"
                            }}
                        >
                            {report.confidence_score !==
                            undefined
                                ? `${report.confidence_score}%`
                                : "N/A"}
                        </p>
                    </div>

                    {/* Risk Level */}

                    <div
                        style={{
                            marginTop: "15px"
                        }}
                    >
                        <strong>Risk Level:</strong>{" "}

                        <span
                            style={{
                                ...getStatusStyle(
                                    report.risk_level
                                ),
                                display: "inline-block",
                                padding: "5px 11px",
                                borderRadius: "15px",
                                marginLeft: "5px",
                                fontSize: "12px",
                                fontWeight: "700"
                            }}
                        >
                            {report.risk_level ||
                                "Unknown"}
                        </span>
                    </div>

                    {/* Summary */}

                    <h3
                        style={{
                            marginTop: "25px"
                        }}
                    >
                        Summary
                    </h3>

                    {report.summary &&
                    report.summary.length > 0 ? (
                        <ul
                            style={{
                                marginTop: "10px"
                            }}
                        >
                            {report.summary.map(
                                (point, index) => (
                                    <li
                                        key={index}
                                        style={{
                                            marginTop: "8px"
                                        }}
                                    >
                                        {point}
                                    </li>
                                )
                            )}
                        </ul>
                    ) : (
                        <p
                            style={{
                                marginTop: "10px",
                                color: "#666"
                            }}
                        >
                            No additional suspicious
                            indicators were reported.
                        </p>
                    )}

                    {/* Recommendation */}

                    <h3
                        style={{
                            marginTop: "25px"
                        }}
                    >
                        Recommendation
                    </h3>

                    <p
                        style={{
                            marginTop: "10px",
                            color: "#555",
                            lineHeight: "1.6"
                        }}
                    >
                        {report.recommendation ||
                            "Review the analysis before proceeding."}
                    </p>
                </div>
            )}

            {/* Blockchain Registration */}

            <div
                style={{
                    background: "white",
                    marginTop: "25px",
                    padding: "30px",
                    borderRadius: "15px",
                    boxShadow:
                        "0 4px 15px rgba(0,0,0,0.06)"
                }}
            >
                <h2 style={{ marginBottom: "15px" }}>
                    🔗 Blockchain Registration
                </h2>

                <p style={{ marginBottom: "10px" }}>
                    <strong>Status:</strong>
                </p>

                <span
                    style={{
                        ...getBlockchainStyle(
                            evidence.blockchain_status
                        ),
                        display: "inline-block",
                        padding: "6px 12px",
                        borderRadius: "20px",
                        fontSize: "13px",
                        fontWeight: "600"
                    }}
                >
                    {evidence.blockchain_status ||
                        "Not Registered"}
                </span>

                {evidence.blockchain_status ===
                    "Registered" && (
                    <p
                        style={{
                            marginTop: "15px",
                            color: "#555"
                        }}
                    >
                        Your evidence has been securely
                        registered on the blockchain.
                    </p>
                )}
            </div>

        </UserLayout>
    );
}

export default EvidenceDetails;
