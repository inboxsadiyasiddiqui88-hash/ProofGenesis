import { useEffect, useState } from "react";

import UserLayout from "../../layouts/UserLayout";

import {
    FaFileAlt,
    FaRedo,
    FaExclamationTriangle,
    FaCheckCircle,
    FaTimes,
    FaCube
} from "react-icons/fa";


function Reports() {

    const [evidence, setEvidence] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [actionLoading, setActionLoading] = useState(null);

    const [actionMessage, setActionMessage] = useState("");

    const [actionError, setActionError] = useState("");


    // ==========================================
    // FETCH EVIDENCE
    // ==========================================

    const fetchEvidence = async () => {

        try {

            setLoading(true);
            setError("");

            const token =
                localStorage.getItem("token");

            const response = await fetch(
                "http://127.0.0.1:8000/my-evidence",
                {
                    method: "GET",

                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    },

                    cache: "no-store"
                }
            );

            if (!response.ok) {

                throw new Error(
                    "Failed to fetch AI reports"
                );

            }

            const data =
                await response.json();

            setEvidence(
                data.evidence || []
            );

        } catch (err) {

            console.error(err);

            setError(
                "Unable to load AI reports."
            );

        } finally {

            setLoading(false);

        }

    };


    // ==========================================
    // INITIAL LOAD
    // ==========================================

    useEffect(() => {

        let cancelled = false;


        const loadInitialEvidence = async () => {

            try {

                const token =
                    localStorage.getItem("token");

                const response = await fetch(
                    "http://127.0.0.1:8000/my-evidence",
                    {
                        method: "GET",

                        headers: {
                            "Authorization":
                                `Bearer ${token}`,
                            "Content-Type":
                                "application/json"
                        },

                        cache: "no-store"
                    }
                );

                if (!response.ok) {

                    throw new Error(
                        "Failed to fetch AI reports"
                    );

                }

                const result =
                    await response.json();

                if (cancelled) {
                    return;
                }

                setEvidence(
                    result.evidence || []
                );

                setError("");

                setLoading(false);

            } catch (err) {

                console.error(err);

                if (cancelled) {
                    return;
                }

                setError(
                    "Unable to load AI reports."
                );

                setLoading(false);

            }

        };


        Promise.resolve()
            .then(loadInitialEvidence);


        return () => {

            cancelled = true;

        };

    }, []);


    // ==========================================
    // PUSH TO BLOCKCHAIN
    // ==========================================

    const proceedToBlockchain =
        async (evidenceId) => {

        try {

            setActionLoading(
                evidenceId
            );

            setActionMessage("");
            setActionError("");

            const token =
                localStorage.getItem("token");

            const response = await fetch(
                `http://127.0.0.1:8000/evidence/${evidenceId}/proceed`,
                {
                    method: "POST",

                    headers: {
                        "Authorization":
                            `Bearer ${token}`
                    }
                }
            );

            const data =
                await response.json();

            if (!response.ok) {

                throw new Error(
                    data.detail ||
                    "Failed to register evidence"
                );

            }

            setActionMessage(
                "Evidence has been successfully registered on the blockchain."
            );

            await fetchEvidence();

        } catch (error) {

            console.error(error);

            setActionError(
                error.message ||
                "Unable to register evidence."
            );

        } finally {

            setActionLoading(null);

        }

    };


    // ==========================================
    // CANCEL EVIDENCE
    // ==========================================

    const cancelEvidence =
        async (evidenceId) => {

        try {

            setActionLoading(
                evidenceId
            );

            setActionMessage("");
            setActionError("");

            const token =
                localStorage.getItem("token");

            const response = await fetch(
                `http://127.0.0.1:8000/evidence/${evidenceId}/cancel`,
                {
                    method: "POST",

                    headers: {
                        "Authorization":
                            `Bearer ${token}`
                    }
                }
            );

            const data =
                await response.json();

            if (!response.ok) {

                throw new Error(
                    data.detail ||
                    "Failed to cancel evidence"
                );

            }

            setActionMessage(
                "Evidence registration has been cancelled."
            );

            await fetchEvidence();

        } catch (error) {

            console.error(error);

            setActionError(
                error.message ||
                "Unable to cancel evidence."
            );

        } finally {

            setActionLoading(null);

        }

    };


    // ==========================================
    // STATUS STYLE
    // ==========================================

    const getStatusStyle = (status) => {

        if (
            status === "Registered" ||
            status === "Verified"
        ) {

            return {
                background: "#DCFCE7",
                color: "#166534"
            };

        }

        if (
            status === "Cancelled" ||
            status === "Cancelled by User"
        ) {

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
    // RISK STYLE
    // ==========================================

    const getRiskStyle = (risk) => {

        if (!risk) {

            return {
                background: "#F1F5F9",
                color: "#475569"
            };

        }

        const value =
            risk.toLowerCase();

        if (
            value.includes("high") ||
            value.includes("critical")
        ) {

            return {
                background: "#FEE2E2",
                color: "#991B1B"
            };

        }

        if (
            value.includes("medium") ||
            value.includes("moderate")
        ) {

            return {
                background: "#FEF3C7",
                color: "#92400E"
            };

        }

        if (
            value.includes("low") ||
            value.includes("minimal")
        ) {

            return {
                background: "#DCFCE7",
                color: "#166534"
            };

        }

        return {
            background: "#F1F5F9",
            color: "#475569"
        };

    };


    // ==========================================
    // COMMON STYLES
    // ==========================================

    const cardStyle = {
        background: "#FFFFFF",
        marginTop: "30px",
        padding: "30px",
        borderRadius: "16px",
        boxShadow:
            "0 4px 18px rgba(0,0,0,0.06)",
        border:
            "1px solid #F1F5F9"
    };

    const badgeStyle = (style) => ({
        ...style,
        padding: "7px 12px",
        borderRadius: "999px",
        fontSize: "12px",
        fontWeight: "600",
        display: "inline-flex",
        alignItems: "center",
        gap: "6px"
    });


    // ==========================================
    // RENDER
    // ==========================================

    return (

        <UserLayout>

            {/* ==================================
                PAGE HEADER
            ================================== */}

            <div>

                <h1
                    style={{
                        margin: 0,
                        color: "#0F172A",
                        fontSize: "28px",
                        fontWeight: "700"
                    }}
                >
                    AI Reports
                </h1>

                <p
                    style={{
                        marginTop: "8px",
                        marginBottom: 0,
                        color: "#64748B",
                        fontSize: "15px"
                    }}
                >
                    Review the AI authenticity analysis
                    of your uploaded evidence.
                </p>

            </div>


            {/* ==================================
                LOADING
            ================================== */}

            {loading && (

                <div
                    style={{
                        ...cardStyle,
                        padding: "45px 30px",
                        textAlign: "center"
                    }}
                >

                    <div
                        style={{
                            width: "36px",
                            height: "36px",
                            border:
                                "4px solid #E2E8F0",
                            borderTop:
                                "4px solid #2563EB",
                            borderRadius: "50%",
                            margin: "0 auto",
                            animation:
                                "reportsSpin 1s linear infinite"
                        }}
                    />

                    <h3
                        style={{
                            marginTop: "18px",
                            marginBottom: 0,
                            color: "#0F172A"
                        }}
                    >
                        Loading AI Reports
                    </h3>

                    <p
                        style={{
                            marginTop: "8px",
                            marginBottom: 0,
                            color: "#64748B",
                            fontSize: "14px"
                        }}
                    >
                        Please wait while we retrieve
                        your analysis.
                    </p>

                </div>

            )}


            {/* ==================================
                PAGE ERROR
            ================================== */}

            {!loading && error && (

                <div
                    style={{
                        marginTop: "30px",
                        padding: "20px",
                        background: "#FEF2F2",
                        border:
                            "1px solid #FECACA",
                        borderRadius: "12px",
                        color: "#991B1B"
                    }}
                >

                    <div
                        style={{
                            display: "flex",
                            alignItems: "flex-start",
                            gap: "10px"
                        }}
                    >

                        <FaExclamationTriangle
                            size={15}
                            style={{
                                marginTop: "3px"
                            }}
                        />

                        <div>

                            <h3
                                style={{
                                    margin: 0
                                }}
                            >
                                Unable to Load Reports
                            </h3>

                            <p
                                style={{
                                    marginTop: "7px",
                                    marginBottom: 0,
                                    fontSize: "14px"
                                }}
                            >
                                {error}
                            </p>

                        </div>

                    </div>


                    <button
                        onClick={fetchEvidence}
                        style={{
                            marginTop: "15px",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "7px",
                            padding: "9px 16px",
                            border:
                                "1px solid #FCA5A5",
                            borderRadius: "8px",
                            background: "#FFFFFF",
                            color: "#991B1B",
                            cursor: "pointer",
                            fontWeight: "600",
                            fontSize: "13px"
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background =
                                "#FEF2F2";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background =
                                "#FFFFFF";
                        }}
                    >
                        <FaRedo size={11} />
                        Try Again
                    </button>

                </div>

            )}


            {/* ==================================
                ACTION SUCCESS
            ================================== */}

            {actionMessage && (

                <div
                    style={{
                        marginTop: "25px",
                        padding: "15px 17px",
                        background: "#F0FDF4",
                        border:
                            "1px solid #BBF7D0",
                        borderRadius: "10px",
                        color: "#166534",
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        fontSize: "14px",
                        fontWeight: "500"
                    }}
                >

                    <FaCheckCircle size={15} />

                    {actionMessage}

                </div>

            )}


            {/* ==================================
                ACTION ERROR
            ================================== */}

            {actionError && (

                <div
                    style={{
                        marginTop: "25px",
                        padding: "15px 17px",
                        background: "#FEF2F2",
                        border:
                            "1px solid #FECACA",
                        borderRadius: "10px",
                        color: "#991B1B",
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        fontSize: "14px"
                    }}
                >

                    <FaExclamationTriangle size={14} />

                    {actionError}

                </div>

            )}


            {/* ==================================
                EMPTY STATE
            ================================== */}

            {!loading &&
                !error &&
                evidence.length === 0 && (

                <div
                    style={{
                        ...cardStyle,
                        padding: "50px 30px",
                        textAlign: "center"
                    }}
                >

                    <div
                        style={{
                            width: "62px",
                            height: "62px",
                            margin: "0 auto",
                            borderRadius: "50%",
                            background: "#EFF6FF",
                            color: "#2563EB",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center"
                        }}
                    >
                        <FaFileAlt size={27} />
                    </div>

                    <h2
                        style={{
                            marginTop: "18px",
                            marginBottom: 0,
                            color: "#0F172A"
                        }}
                    >
                        No AI Reports Yet
                    </h2>

                    <p
                        style={{
                            marginTop: "10px",
                            marginBottom: 0,
                            color: "#64748B",
                            maxWidth: "500px",
                            marginLeft: "auto",
                            marginRight: "auto",
                            lineHeight: "1.6",
                            fontSize: "14px"
                        }}
                    >
                        Upload digital evidence to generate
                        an AI authenticity report.
                    </p>

                </div>

            )}


            {/* ==================================
                REPORTS
            ================================== */}

            {!loading &&
                !error &&
                evidence.map((item) => {

                    const report =
                        item.user_summary;

                    if (!report) {
                        return null;
                    }

                    const isPending =
                        item.status ===
                        "Pending User Decision";

                    const isRegistered =
                        item.status ===
                        "Registered";

                    const isCancelled =
                        item.status ===
                        "Cancelled by User";

                    const isActionLoading =
                        actionLoading ===
                        item.evidence_id;


                    return (

                        <div
                            key={item.evidence_id}
                            style={{
                                ...cardStyle,
                                transition:
                                    "transform 0.2s ease, box-shadow 0.2s ease"
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform =
                                    "translateY(-2px)";
                                e.currentTarget.style.boxShadow =
                                    "0 7px 22px rgba(0,0,0,0.08)";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform =
                                    "translateY(0)";
                                e.currentTarget.style.boxShadow =
                                    "0 4px 18px rgba(0,0,0,0.06)";
                            }}
                        >

                            {/* ==============================
                                FILE HEADER
                            ============================== */}

                            <div
                                style={{
                                    display: "flex",
                                    justifyContent:
                                        "space-between",
                                    alignItems:
                                        "flex-start",
                                    gap: "15px",
                                    flexWrap: "wrap"
                                }}
                            >

                                <div
                                    style={{
                                        minWidth: 0,
                                        flex: 1
                                    }}
                                >

                                    <div
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "10px"
                                        }}
                                    >

                                        <FaFileAlt
                                            size={17}
                                            color="#2563EB"
                                        />

                                        <h2
                                            style={{
                                                margin: 0,
                                                color: "#0F172A",
                                                fontSize: "20px",
                                                wordBreak:
                                                    "break-word"
                                            }}
                                        >
                                            {item.original_filename}
                                        </h2>

                                    </div>

                                    <p
                                        style={{
                                            marginTop: "8px",
                                            marginBottom: 0,
                                            color: "#64748B",
                                            fontSize: "13px"
                                        }}
                                    >
                                        Case:{" "}
                                        <strong
                                            style={{
                                                color: "#334155"
                                            }}
                                        >
                                            {item.case_id}
                                        </strong>
                                    </p>

                                </div>

                                <span
                                    style={badgeStyle(
                                        getStatusStyle(
                                            item.status
                                        )
                                    )}
                                >
                                    {item.status}
                                </span>

                            </div>


                            {/* ==============================
                                SECONDARY STATUS
                            ============================== */}

                            <div
                                style={{
                                    marginTop: "16px",
                                    display: "flex",
                                    flexWrap: "wrap",
                                    gap: "9px"
                                }}
                            >

                                <span
                                    style={badgeStyle(
                                        getStatusStyle(
                                            item.blockchain_status ||
                                            "Not Registered"
                                        )
                                    )}
                                >
                                    <FaCube size={11} />
                                    Blockchain:{" "}
                                    {item.blockchain_status ||
                                        "Not Registered"}
                                </span>

                            </div>


                            {/* ==============================
                                AI ANALYSIS
                            ============================== */}

                            <div
                                style={{
                                    marginTop: "28px",
                                    padding: "24px",
                                    background: "#F8FAFC",
                                    borderRadius: "12px",
                                    border:
                                        "1px solid #E2E8F0"
                                }}
                            >

                                <p
                                    style={{
                                        margin: 0,
                                        fontSize: "12px",
                                        fontWeight: "700",
                                        color: "#64748B",
                                        textTransform:
                                            "uppercase",
                                        letterSpacing:
                                            "0.6px"
                                    }}
                                >
                                    AI Authenticity Analysis
                                </p>

                                <h3
                                    style={{
                                        marginTop: "11px",
                                        marginBottom: 0,
                                        color: "#0F172A",
                                        fontSize: "21px"
                                    }}
                                >
                                    {report.overall_result ||
                                        "Analysis Completed"}
                                </h3>


                                {/* SCORE + RISK */}

                                <div
                                    style={{
                                        display: "grid",
                                        gridTemplateColumns:
                                            "repeat(auto-fit, minmax(180px, 1fr))",
                                        gap: "15px",
                                        marginTop: "22px"
                                    }}
                                >

                                    {/* SCORE */}

                                    <div
                                        style={{
                                            background: "#FFFFFF",
                                            padding: "18px",
                                            borderRadius: "10px",
                                            border:
                                                "1px solid #E2E8F0"
                                        }}
                                    >

                                        <p
                                            style={{
                                                margin: 0,
                                                fontSize: "12px",
                                                color: "#64748B",
                                                fontWeight: "600"
                                            }}
                                        >
                                            Authenticity Score
                                        </p>

                                        <p
                                            style={{
                                                marginTop: "7px",
                                                marginBottom: 0,
                                                fontSize: "30px",
                                                fontWeight: "700",
                                                color: "#0F172A"
                                            }}
                                        >
                                            {report.confidence_score !==
                                            undefined
                                                ? `${report.confidence_score} / 100`
                                                : "N/A"}
                                        </p>

                                    </div>


                                    {/* RISK */}

                                    <div
                                        style={{
                                            background: "#FFFFFF",
                                            padding: "18px",
                                            borderRadius: "10px",
                                            border:
                                                "1px solid #E2E8F0"
                                        }}
                                    >

                                        <p
                                            style={{
                                                margin: 0,
                                                fontSize: "12px",
                                                color: "#64748B",
                                                fontWeight: "600"
                                            }}
                                        >
                                            Risk Level
                                        </p>

                                        <span
                                            style={{
                                                ...badgeStyle(
                                                    getRiskStyle(
                                                        report.risk_level
                                                    )
                                                ),
                                                marginTop: "8px"
                                            }}
                                        >
                                            {report.risk_level ||
                                                "Unknown"}
                                        </span>

                                    </div>

                                </div>


                                {/* SUMMARY */}

                                <h3
                                    style={{
                                        marginTop: "25px",
                                        marginBottom: 0,
                                        color: "#0F172A",
                                        fontSize: "17px"
                                    }}
                                >
                                    What We Found
                                </h3>


                                {report.summary &&
                                report.summary.length > 0 ? (

                                    <ul
                                        style={{
                                            marginTop: "10px",
                                            paddingLeft: "20px",
                                            marginBottom: 0
                                        }}
                                    >

                                        {report.summary.map(
                                            (point, index) => (

                                                <li
                                                    key={index}
                                                    style={{
                                                        marginTop:
                                                            "8px",
                                                        lineHeight:
                                                            "1.55",
                                                        color:
                                                            "#334155",
                                                        fontSize:
                                                            "14px"
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
                                            marginBottom: 0,
                                            color: "#64748B",
                                            fontSize: "14px"
                                        }}
                                    >
                                        No additional suspicious
                                        indicators were reported.
                                    </p>

                                )}


                                {/* RECOMMENDATION */}

                                <h3
                                    style={{
                                        marginTop: "25px",
                                        marginBottom: 0,
                                        color: "#0F172A",
                                        fontSize: "17px"
                                    }}
                                >
                                    Recommendation
                                </h3>

                                <div
                                    style={{
                                        marginTop: "10px",
                                        padding: "15px",
                                        background: "#FFFFFF",
                                        borderRadius: "9px",
                                        border:
                                            "1px solid #E2E8F0",
                                        lineHeight: "1.6",
                                        color: "#475569",
                                        fontSize: "14px"
                                    }}
                                >
                                    {report.recommendation ||
                                        "Review the analysis before proceeding."}
                                </div>

                            </div>


                            {/* ==============================
                                USER DECISION
                            ============================== */}

                            {isPending && (

                                <div
                                    style={{
                                        marginTop: "28px",
                                        padding: "22px",
                                        border:
                                            "1px solid #FDE68A",
                                        background: "#FFFBEB",
                                        borderRadius: "12px"
                                    }}
                                >

                                    <div
                                        style={{
                                            display: "flex",
                                            alignItems:
                                                "flex-start",
                                            gap: "10px"
                                        }}
                                    >

                                        <div
                                            style={{
                                                width: "32px",
                                                height: "32px",
                                                borderRadius: "8px",
                                                background:
                                                    "#FEF3C7",
                                                color: "#92400E",
                                                display: "flex",
                                                alignItems:
                                                    "center",
                                                justifyContent:
                                                    "center",
                                                flexShrink: 0
                                            }}
                                        >
                                            <FaCube size={14} />
                                        </div>

                                        <div>

                                            <h3
                                                style={{
                                                    margin: 0,
                                                    color: "#0F172A"
                                                }}
                                            >
                                                What would you like to do?
                                            </h3>

                                            <p
                                                style={{
                                                    marginTop: "7px",
                                                    marginBottom: 0,
                                                    color: "#92400E",
                                                    fontSize: "14px",
                                                    lineHeight: "1.5"
                                                }}
                                            >
                                                The AI analysis is complete.
                                                You can register this evidence
                                                on the blockchain or cancel
                                                the registration.
                                            </p>

                                        </div>

                                    </div>


                                    <div
                                        style={{
                                            display: "flex",
                                            flexWrap: "wrap",
                                            gap: "10px",
                                            marginTop: "18px"
                                        }}
                                    >

                                        {/* PROCEED */}

                                        <button
                                            onClick={() =>
                                                proceedToBlockchain(
                                                    item.evidence_id
                                                )
                                            }
                                            disabled={
                                                isActionLoading
                                            }
                                            style={{
                                                display: "inline-flex",
                                                alignItems: "center",
                                                justifyContent:
                                                    "center",
                                                gap: "8px",
                                                padding:
                                                    "11px 17px",
                                                background:
                                                    isActionLoading
                                                        ? "#94A3B8"
                                                        : "#16A34A",
                                                color: "#FFFFFF",
                                                border: "none",
                                                borderRadius: "8px",
                                                cursor:
                                                    isActionLoading
                                                        ? "not-allowed"
                                                        : "pointer",
                                                fontSize: "13px",
                                                fontWeight: "600",
                                                transition:
                                                    "all 0.2s ease"
                                            }}
                                            onMouseEnter={(e) => {

                                                if (!isActionLoading) {

                                                    e.currentTarget.style.background =
                                                        "#15803D";

                                                    e.currentTarget.style.transform =
                                                        "translateY(-1px)";

                                                }

                                            }}
                                            onMouseLeave={(e) => {

                                                e.currentTarget.style.background =
                                                    isActionLoading
                                                        ? "#94A3B8"
                                                        : "#16A34A";

                                                e.currentTarget.style.transform =
                                                    "translateY(0)";

                                            }}
                                        >

                                            {isActionLoading ? (

                                                <>
                                                    <span
                                                        style={{
                                                            width: "14px",
                                                            height: "14px",
                                                            border:
                                                                "2px solid rgba(255,255,255,0.45)",
                                                            borderTop:
                                                                "2px solid #FFFFFF",
                                                            borderRadius:
                                                                "50%",
                                                            animation:
                                                                "reportsActionSpin 0.8s linear infinite"
                                                        }}
                                                    />

                                                    Processing...
                                                </>

                                            ) : (

                                                <>
                                                    <FaCheckCircle size={13} />
                                                    Proceed with Blockchain Registration
                                                </>

                                            )}

                                        </button>


                                        {/* CANCEL */}

                                        <button
                                            onClick={() =>
                                                cancelEvidence(
                                                    item.evidence_id
                                                )
                                            }
                                            disabled={
                                                isActionLoading
                                            }
                                            style={{
                                                display: "inline-flex",
                                                alignItems: "center",
                                                justifyContent:
                                                    "center",
                                                gap: "8px",
                                                padding:
                                                    "11px 17px",
                                                background:
                                                    isActionLoading
                                                        ? "#E2E8F0"
                                                        : "#FFFFFF",
                                                color:
                                                    isActionLoading
                                                        ? "#94A3B8"
                                                        : "#991B1B",
                                                border:
                                                    "1px solid #FCA5A5",
                                                borderRadius: "8px",
                                                cursor:
                                                    isActionLoading
                                                        ? "not-allowed"
                                                        : "pointer",
                                                fontSize: "13px",
                                                fontWeight: "600",
                                                transition:
                                                    "all 0.2s ease"
                                            }}
                                            onMouseEnter={(e) => {

                                                if (!isActionLoading) {

                                                    e.currentTarget.style.background =
                                                        "#FEF2F2";

                                                }

                                            }}
                                            onMouseLeave={(e) => {

                                                e.currentTarget.style.background =
                                                    isActionLoading
                                                        ? "#E2E8F0"
                                                        : "#FFFFFF";

                                            }}
                                        >

                                            <FaTimes size={12} />

                                            Cancel Registration

                                        </button>

                                    </div>

                                </div>

                            )}


                            {/* ==============================
                                REGISTERED
                            ============================== */}

                            {isRegistered && (

                                <div
                                    style={{
                                        marginTop: "25px",
                                        padding: "16px 17px",
                                        background: "#F0FDF4",
                                        border:
                                            "1px solid #BBF7D0",
                                        borderRadius: "10px",
                                        color: "#166534",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "10px",
                                        fontSize: "14px",
                                        fontWeight: "600"
                                    }}
                                >

                                    <FaCheckCircle size={15} />

                                    Evidence has been successfully
                                    registered on the blockchain.

                                </div>

                            )}


                            {/* ==============================
                                CANCELLED
                            ============================== */}

                            {isCancelled && (

                                <div
                                    style={{
                                        marginTop: "25px",
                                        padding: "16px 17px",
                                        background: "#F8FAFC",
                                        border:
                                            "1px solid #E2E8F0",
                                        borderRadius: "10px",
                                        color: "#475569",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "10px",
                                        fontSize: "14px"
                                    }}
                                >

                                    <FaTimes size={14} />

                                    <span>
                                        Registration was cancelled.
                                        This evidence was not registered
                                        on the blockchain.
                                    </span>

                                </div>

                            )}

                        </div>

                    );

                })}


            {/* ==================================
                ANIMATIONS
            ================================== */}

            <style>
                {`
                    @keyframes reportsSpin {
                        from {
                            transform: rotate(0deg);
                        }

                        to {
                            transform: rotate(360deg);
                        }
                    }

                    @keyframes reportsActionSpin {
                        from {
                            transform: rotate(0deg);
                        }

                        to {
                            transform: rotate(360deg);
                        }
                    }
                `}
            </style>

        </UserLayout>

    );

}


export default Reports;
