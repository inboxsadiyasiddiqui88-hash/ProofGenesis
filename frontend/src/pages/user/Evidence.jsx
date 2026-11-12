import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import UserLayout from "../../layouts/UserLayout";

import {
    FaFileAlt,
    FaUpload,
    FaRedo,
    FaExclamationTriangle,
    FaCheckCircle,
    FaArrowRight
} from "react-icons/fa";


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
        status === "Cancelled by User" ||
        status === "Integrity Failed"
    ) {
        return {
            background: "#FEE2E2",
            color: "#991B1B"
        };
    }

    if (
        status === "Pending User Decision" ||
        status === "Not Registered" ||
        status === "Not Verified"
    ) {
        return {
            background: "#FEF3C7",
            color: "#92400E"
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

const primaryButtonStyle = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    padding: "11px 19px",
    background: "#2563EB",
    color: "#FFFFFF",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "600",
    transition: "all 0.2s ease",
    boxShadow: "0 2px 5px rgba(37, 99, 235, 0.18)"
};

const secondaryButtonStyle = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "7px",
    padding: "9px 15px",
    background: "#FFFFFF",
    color: "#475569",
    border: "1px solid #CBD5E1",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: "600",
    transition: "all 0.2s ease"
};

const badgeStyle = (status) => ({
    ...getStatusStyle(status),
    padding: "6px 11px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: "600",
    display: "inline-flex",
    alignItems: "center",
    whiteSpace: "nowrap"
});


// ==========================================
// COMPONENT
// ==========================================

function Evidence() {

    const navigate = useNavigate();

    const [cases, setCases] = useState([]);

    const [evidenceList, setEvidenceList] =
        useState([]);

    const [selectedCase, setSelectedCase] =
        useState("");

    const [selectedFile, setSelectedFile] =
        useState(null);

    const [loading, setLoading] =
        useState(false);

    const [loadingEvidence, setLoadingEvidence] =
        useState(true);

    const [message, setMessage] =
        useState("");

    const [error, setError] =
        useState("");

    const [evidenceError, setEvidenceError] =
        useState("");


    // ==========================================
    // LOAD CASES
    // ==========================================

    useEffect(() => {

        fetchCases();

    }, []);


    const fetchCases = async () => {

        try {

            setError("");

            const token =
                localStorage.getItem("token");

            const response = await fetch(
                "http://127.0.0.1:8000/cases/my-cases",
                {
                    method: "GET",

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
                    "Failed to load cases"
                );

            }

            setCases(
                data.cases || []
            );

        }

        catch (err) {

            console.error(err);

            setError(
                "Unable to load your cases."
            );

        }

    };


    // ==========================================
    // LOAD USER'S EVIDENCE
    // ==========================================

    useEffect(() => {

        fetchEvidence();

    }, []);


    const fetchEvidence = async () => {

        try {

            setLoadingEvidence(true);
            setEvidenceError("");

            const token =
                localStorage.getItem("token");

            const response = await fetch(
                "http://127.0.0.1:8000/my-evidence",
                {
                    method: "GET",

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
                    "Failed to load evidence"
                );

            }

            setEvidenceList(
                Array.isArray(data)
                    ? data
                    : data.evidence || []
            );

        }

        catch (err) {

            console.error(err);

            setEvidenceError(
                err.message ||
                "Unable to load your evidence."
            );

        }

        finally {

            setLoadingEvidence(false);

        }

    };


    // ==========================================
    // FILE SELECTION
    // ==========================================

    const handleFileChange = (event) => {

        const file =
            event.target.files[0];

        setSelectedFile(file);

        setMessage("");
        setError("");

    };


    // ==========================================
    // UPLOAD EVIDENCE
    // ==========================================

    const handleUpload = async () => {

        setMessage("");
        setError("");

        if (!selectedCase) {

            setError(
                "Please select a case first."
            );

            return;

        }

        if (!selectedFile) {

            setError(
                "Please select an evidence file."
            );

            return;

        }

        try {

            setLoading(true);

            const token =
                localStorage.getItem("token");

            const formData =
                new FormData();

            formData.append(
                "file",
                selectedFile
            );

            const response = await fetch(

                `http://127.0.0.1:8000/upload/${selectedCase}`,

                {
                    method: "POST",

                    headers: {
                        "Authorization":
                            `Bearer ${token}`
                    },

                    body: formData
                }
            );

            const data =
                await response.json();

            if (!response.ok) {

                throw new Error(
                    data.detail ||
                    "Upload failed"
                );

            }

            setMessage(
                "Evidence uploaded and AI analysis completed successfully!"
            );

            setSelectedFile(null);

            const fileInput =
                document.getElementById(
                    "evidence-file"
                );

            if (fileInput) {
                fileInput.value = "";
            }

            // Refresh evidence list
            fetchEvidence();

        }

        catch (err) {

            console.error(err);

            setError(
                err.message ||
                "Unable to upload evidence."
            );

        }

        finally {

            setLoading(false);

        }

    };


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
                    My Evidence
                </h1>

                <p
                    style={{
                        marginTop: "8px",
                        marginBottom: 0,
                        color: "#64748B",
                        fontSize: "15px"
                    }}
                >
                    Upload and manage your digital evidence.
                </p>

            </div>


            {/* ==================================
                UPLOAD SECTION
            ================================== */}

            <div
                style={{
                    background: "#FFFFFF",
                    marginTop: "30px",
                    padding: "30px",
                    borderRadius: "16px",
                    boxShadow:
                        "0 4px 15px rgba(0,0,0,0.06)",
                    border:
                        "1px solid #F1F5F9"
                }}
            >

                <div
                    style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "14px"
                    }}
                >

                    <div
                        style={{
                            width: "44px",
                            height: "44px",
                            borderRadius: "10px",
                            background: "#EFF6FF",
                            color: "#2563EB",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0
                        }}
                    >
                        <FaUpload size={19} />
                    </div>

                    <div>

                        <h2
                            style={{
                                margin: 0,
                                color: "#0F172A",
                                fontSize: "20px"
                            }}
                        >
                            Upload Evidence
                        </h2>

                        <p
                            style={{
                                marginTop: "6px",
                                marginBottom: 0,
                                color: "#64748B",
                                fontSize: "14px",
                                lineHeight: "1.5"
                            }}
                        >
                            Upload a digital evidence file and
                            let the system analyze its authenticity.
                        </p>

                    </div>

                </div>


                {/* CASE */}

                <div
                    style={{
                        marginTop: "25px"
                    }}
                >

                    <label
                        style={{
                            display: "block",
                            color: "#334155",
                            fontSize: "14px"
                        }}
                    >
                        <strong>
                            Select Case
                        </strong>
                    </label>

                    <select
                        value={selectedCase}
                        onChange={(e) =>
                            setSelectedCase(
                                e.target.value
                            )
                        }
                        style={{
                            display: "block",
                            marginTop: "10px",
                            width: "100%",
                            maxWidth: "500px",
                            padding: "12px 13px",
                            borderRadius: "8px",
                            border:
                                "1px solid #CBD5E1",
                            background: "#FFFFFF",
                            color: "#0F172A",
                            fontSize: "14px",
                            outline: "none",
                            cursor: "pointer",
                            boxSizing: "border-box"
                        }}
                        onFocus={(e) => {
                            e.currentTarget.style.borderColor =
                                "#2563EB";
                        }}
                        onBlur={(e) => {
                            e.currentTarget.style.borderColor =
                                "#CBD5E1";
                        }}
                    >

                        <option value="">
                            -- Select a Case --
                        </option>

                        {cases.map((item) => (

                            <option
                                key={item.case_id}
                                value={item.case_id}
                            >
                                {item.case_id} - {item.title}
                            </option>

                        ))}

                    </select>

                    {cases.length === 0 && !error && (
                        <p
                            style={{
                                marginTop: "7px",
                                color: "#64748B",
                                fontSize: "13px"
                            }}
                        >
                            No cases available. Create a case
                            before uploading evidence.
                        </p>
                    )}

                </div>


                {/* FILE */}

                <div
                    style={{
                        marginTop: "25px"
                    }}
                >

                    <label
                        style={{
                            display: "block",
                            color: "#334155",
                            fontSize: "14px"
                        }}
                    >
                        <strong>
                            Select Evidence File
                        </strong>
                    </label>

                    <input
                        id="evidence-file"
                        type="file"
                        onChange={
                            handleFileChange
                        }
                        style={{
                            display: "block",
                            marginTop: "10px",
                            width: "100%",
                            maxWidth: "500px",
                            fontSize: "14px",
                            color: "#475569"
                        }}
                    />

                    <p
                        style={{
                            marginTop: "7px",
                            color: "#94A3B8",
                            fontSize: "12px"
                        }}
                    >
                        Select the digital evidence file you want
                        to analyze.
                    </p>

                </div>


                {/* SELECTED FILE */}

                {selectedFile && (

                    <div
                        style={{
                            marginTop: "15px",
                            padding: "13px 15px",
                            background: "#F8FAFC",
                            border:
                                "1px solid #E2E8F0",
                            borderRadius: "9px",
                            fontSize: "14px",
                            color: "#475569",
                            display: "flex",
                            alignItems: "center",
                            gap: "10px"
                        }}
                    >

                        <FaFileAlt
                            size={15}
                            color="#2563EB"
                        />

                        <span>
                            Selected file:{" "}
                            <strong
                                style={{
                                    color: "#0F172A"
                                }}
                            >
                                {selectedFile.name}
                            </strong>
                        </span>

                    </div>

                )}


                {/* ERROR */}

                {error && (

                    <div
                        style={{
                            marginTop: "20px",
                            padding: "13px 15px",
                            background: "#FEF2F2",
                            border:
                                "1px solid #FECACA",
                            borderRadius: "9px",
                            color: "#991B1B",
                            display: "flex",
                            alignItems: "flex-start",
                            gap: "10px",
                            fontSize: "14px",
                            lineHeight: "1.5"
                        }}
                    >

                        <FaExclamationTriangle
                            size={14}
                            style={{
                                marginTop: "3px",
                                flexShrink: 0
                            }}
                        />

                        <span>
                            {error}
                        </span>

                    </div>

                )}


                {/* SUCCESS */}

                {message && (

                    <div
                        style={{
                            marginTop: "20px",
                            padding: "13px 15px",
                            background: "#F0FDF4",
                            border:
                                "1px solid #BBF7D0",
                            borderRadius: "9px",
                            color: "#166534",
                            display: "flex",
                            alignItems: "flex-start",
                            gap: "10px",
                            fontSize: "14px",
                            lineHeight: "1.5"
                        }}
                    >

                        <FaCheckCircle
                            size={15}
                            style={{
                                marginTop: "3px",
                                flexShrink: 0
                            }}
                        />

                        <span>
                            {message}
                        </span>

                    </div>

                )}


                {/* UPLOAD BUTTON */}

                <button
                    onClick={handleUpload}
                    disabled={loading}
                    style={{
                        ...primaryButtonStyle,
                        marginTop: "25px",
                        background:
                            loading
                                ? "#94A3B8"
                                : "#2563EB",
                        cursor:
                            loading
                                ? "not-allowed"
                                : "pointer",
                        boxShadow:
                            loading
                                ? "none"
                                : "0 2px 5px rgba(37, 99, 235, 0.18)"
                    }}
                    onMouseEnter={(e) => {

                        if (!loading) {

                            e.currentTarget.style.background =
                                "#1D4ED8";

                            e.currentTarget.style.transform =
                                "translateY(-1px)";
                        }

                    }}
                    onMouseLeave={(e) => {

                        e.currentTarget.style.background =
                            loading
                                ? "#94A3B8"
                                : "#2563EB";

                        e.currentTarget.style.transform =
                            "translateY(0)";
                    }}
                >

                    {loading ? (

                        <>
                            <span
                                style={{
                                    width: "15px",
                                    height: "15px",
                                    border:
                                        "2px solid rgba(255,255,255,0.45)",
                                    borderTop:
                                        "2px solid #FFFFFF",
                                    borderRadius: "50%",
                                    animation:
                                        "evidenceUploadSpin 0.8s linear infinite"
                                }}
                            />

                            Analyzing Evidence...
                        </>

                    ) : (

                        <>
                            <FaUpload size={13} />
                            Upload Evidence
                        </>

                    )}

                </button>

            </div>


            {/* ==================================
                MY UPLOADED EVIDENCE
            ================================== */}

            <div
                style={{
                    background: "#FFFFFF",
                    marginTop: "30px",
                    padding: "30px",
                    borderRadius: "16px",
                    boxShadow:
                        "0 4px 15px rgba(0,0,0,0.06)",
                    border:
                        "1px solid #F1F5F9"
                }}
            >

                <div>

                    <h2
                        style={{
                            margin: 0,
                            color: "#0F172A",
                            fontSize: "20px"
                        }}
                    >
                        Uploaded Evidence
                    </h2>

                    <p
                        style={{
                            marginTop: "7px",
                            marginBottom: 0,
                            color: "#64748B",
                            fontSize: "14px"
                        }}
                    >
                        View the evidence you have uploaded
                        and its current analysis status.
                    </p>

                </div>


                {/* LOADING */}

                {loadingEvidence && (

                    <div
                        style={{
                            marginTop: "25px",
                            padding: "45px 25px",
                            textAlign: "center",
                            background: "#F8FAFC",
                            borderRadius: "12px",
                            border:
                                "1px dashed #CBD5E1"
                        }}
                    >

                        <div
                            style={{
                                width: "36px",
                                height: "36px",
                                margin: "0 auto 14px",
                                border:
                                    "4px solid #E2E8F0",
                                borderTop:
                                    "4px solid #2563EB",
                                borderRadius: "50%",
                                animation:
                                    "evidenceListSpin 1s linear infinite"
                            }}
                        />

                        <h3
                            style={{
                                margin: 0,
                                color: "#0F172A"
                            }}
                        >
                            Loading your evidence
                        </h3>

                        <p
                            style={{
                                marginTop: "7px",
                                marginBottom: 0,
                                color: "#64748B",
                                fontSize: "14px"
                            }}
                        >
                            Retrieving your uploaded files...
                        </p>

                    </div>

                )}


                {/* ERROR */}

                {!loadingEvidence &&
                    evidenceError && (

                    <div
                        style={{
                            marginTop: "25px",
                            padding: "18px",
                            background: "#FEF2F2",
                            border:
                                "1px solid #FECACA",
                            borderRadius: "10px",
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
                                    marginTop: "3px",
                                    flexShrink: 0
                                }}
                            />

                            <div>

                                <strong>
                                    Unable to load your evidence
                                </strong>

                                <p
                                    style={{
                                        marginTop: "6px",
                                        marginBottom: 0,
                                        fontSize: "14px"
                                    }}
                                >
                                    {evidenceError}
                                </p>

                            </div>

                        </div>

                        <button
                            onClick={fetchEvidence}
                            style={{
                                ...secondaryButtonStyle,
                                marginTop: "14px",
                                color: "#991B1B",
                                borderColor: "#FCA5A5"
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


                {/* EMPTY */}

                {!loadingEvidence &&
                    !evidenceError &&
                    evidenceList.length === 0 && (

                    <div
                        style={{
                            marginTop: "25px",
                            padding: "45px 25px",
                            textAlign: "center",
                            background: "#F8FAFC",
                            borderRadius: "12px",
                            border:
                                "1px dashed #CBD5E1"
                        }}
                    >

                        <div
                            style={{
                                width: "60px",
                                height: "60px",
                                margin: "0 auto",
                                borderRadius: "50%",
                                background: "#EFF6FF",
                                color: "#2563EB",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center"
                            }}
                        >
                            <FaFileAlt size={25} />
                        </div>

                        <h3
                            style={{
                                marginTop: "15px",
                                marginBottom: 0,
                                color: "#0F172A"
                            }}
                        >
                            No evidence uploaded yet
                        </h3>

                        <p
                            style={{
                                marginTop: "8px",
                                marginBottom: 0,
                                color: "#64748B",
                                fontSize: "14px",
                                lineHeight: "1.5"
                            }}
                        >
                            Select a case and upload your first
                            evidence file above to begin analysis.
                        </p>

                    </div>

                )}


                {/* EVIDENCE LIST */}

                {!loadingEvidence &&
                    !evidenceError &&
                    evidenceList.length > 0 && (

                    <div
                        style={{
                            marginTop: "25px",
                            display: "grid",
                            gap: "15px"
                        }}
                    >

                        {evidenceList.map((item) => (

                            <div
                                key={item.evidence_id}
                                style={{
                                    border:
                                        "1px solid #E2E8F0",
                                    borderRadius: "12px",
                                    padding: "20px",
                                    background: "#FFFFFF",
                                    transition:
                                        "transform 0.2s ease, box-shadow 0.2s ease"
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform =
                                        "translateY(-2px)";
                                    e.currentTarget.style.boxShadow =
                                        "0 6px 18px rgba(0,0,0,0.07)";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform =
                                        "translateY(0)";
                                    e.currentTarget.style.boxShadow =
                                        "none";
                                }}
                            >

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
                                                size={16}
                                                color="#2563EB"
                                            />

                                            <h3
                                                style={{
                                                    margin: 0,
                                                    color: "#0F172A",
                                                    fontSize: "17px",
                                                    wordBreak:
                                                        "break-word"
                                                }}
                                            >
                                                {item.original_filename ||
                                                    item.filename ||
                                                    "Evidence File"}
                                            </h3>

                                        </div>

                                        <p
                                            style={{
                                                marginTop: "8px",
                                                marginBottom: 0,
                                                fontSize: "13px",
                                                color: "#64748B"
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
                                            item.status ||
                                            "Pending"
                                        )}
                                    >
                                        {item.status ||
                                            "Pending"}
                                    </span>

                                </div>


                                <div
                                    style={{
                                        marginTop: "18px",
                                        display: "flex",
                                        gap: "9px",
                                        flexWrap: "wrap"
                                    }}
                                >

                                    <span
                                        style={badgeStyle(
                                            item.blockchain_status ||
                                            "Not Registered"
                                        )}
                                    >
                                        Blockchain:{" "}
                                        {item.blockchain_status ||
                                            "Not Registered"}
                                    </span>

                                    <span
                                        style={badgeStyle(
                                            item.verification_status ||
                                            "Not Verified"
                                        )}
                                    >
                                        Verification:{" "}
                                        {item.verification_status ||
                                            "Not Verified"}
                                    </span>

                                </div>


                                <button
                                    onClick={() =>
                                        navigate(
                                            `/evidence/${item.evidence_id}`
                                        )
                                    }
                                    style={{
                                        ...primaryButtonStyle,
                                        marginTop: "18px",
                                        width: "100%"
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.background =
                                            "#1D4ED8";
                                        e.currentTarget.style.transform =
                                            "translateY(-1px)";
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.background =
                                            "#2563EB";
                                        e.currentTarget.style.transform =
                                            "translateY(0)";
                                    }}
                                >
                                    View Evidence
                                    <FaArrowRight size={12} />
                                </button>

                            </div>

                        ))}

                    </div>

                )}

            </div>


            {/* ==================================
                ANIMATIONS
            ================================== */}

            <style>
                {`
                    @keyframes evidenceUploadSpin {
                        from {
                            transform: rotate(0deg);
                        }
                        to {
                            transform: rotate(360deg);
                        }
                    }

                    @keyframes evidenceListSpin {
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

export default Evidence;