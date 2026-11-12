import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

import {
    FaShieldAlt,
    FaCheckCircle,
    FaExclamationTriangle,
    FaFileUpload
} from "react-icons/fa";


export default function Verification() {

    const [searchParams] =
        useSearchParams();

    const navigate =
        useNavigate();


    const selectedEvidenceId =
        searchParams.get("evidence") || "";


    const [evidenceId] =
        useState(selectedEvidenceId);

    const [file, setFile] =
        useState(null);

    const [loading, setLoading] =
        useState(false);

    const [result, setResult] =
        useState(null);

    const [error, setError] =
        useState("");


    // ==========================================
    // VERIFY
    // ==========================================

    const handleVerify = async (e) => {

        e.preventDefault();

        setError("");
        setResult(null);


        if (!evidenceId.trim()) {

            setError(
                "No evidence was selected. Please return to the Investigator Dashboard and select an evidence item."
            );

            return;
        }


        if (!file) {

            setError(
                "Please select the evidence file to verify."
            );

            return;
        }


        const token =
            localStorage.getItem("token");


        if (!token) {

            setError(
                "You are not logged in."
            );

            return;
        }


        const formData =
            new FormData();

        formData.append(
            "file",
            file
        );


        try {

            setLoading(true);


            const response =
                await fetch(
                    `http://127.0.0.1:8000/evidence/${evidenceId}/verify`,
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
                    "Verification failed."
                );

            }


            setResult(data);

        } catch (err) {

            console.error(err);

            setError(
                err.message ||
                "Unable to verify evidence."
            );

        } finally {

            setLoading(false);

        }

    };


    const isVerified =
        result?.verification_result ===
        "Verified";


    return (

        <div
    style={{
        padding: "40px",
        maxWidth: "1100px",
        margin: "0 auto"
    }}
>

            {/* ==================================
                HEADER
            ================================== */}

            <button
                onClick={() =>
                    navigate(
                        "/investigator/dashboard"
                    )
                }
               style={{
    padding: "10px 16px",
    border: "1px solid #CBD5E1",
    background: "white",
    borderRadius: "8px",
    cursor: "pointer",
    color: "#334155",
    fontWeight: "600",
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
                    marginTop: "25px"
                }}
            >

                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px"
                    }}
                >

                    <FaShieldAlt
                        style={{
                            color: "#2563EB"
                        }}
                    />

                    <span
                        style={{
                            color: "#2563EB",
                            fontSize: "13px",
                            fontWeight: "700",
                            textTransform: "uppercase"
                        }}
                    >
                        Evidence Integrity
                    </span>

                </div>

                <h1
                    style={{
                        marginTop: "8px"
                    }}
                >
                    Evidence Verification
                </h1>

                <p
                    style={{
                        marginTop: "8px",
                        color: "#64748B"
                    }}
                >
                    Compare an evidence file against its
                    originally registered version.
                </p>

            </div>


            {/* ==================================
                VERIFICATION CARD
            ================================== */}

            <form
                onSubmit={handleVerify}
                style={{
                    marginTop: "30px",
                    background: "white",
                    padding: "30px",
                    borderRadius: "15px",
                    boxShadow:
                        "0 4px 15px rgba(0,0,0,0.06)",
                    border:
                        "1px solid #F1F5F9"
                }}
            >

                <h2>
                    Verification Request
                </h2>

                <p
                    style={{
                        marginTop: "6px",
                        color: "#64748B",
                        fontSize: "14px"
                    }}
                >
                    Select the evidence file provided for
                    integrity verification.
                </p>


                {/* EVIDENCE ID */}

                <div
                    style={{
                        marginTop: "25px"
                    }}
                >

                    <label>
                        <strong>
                            Evidence ID
                        </strong>
                    </label>

                    <div
                        style={{
                            marginTop: "9px",
                            padding: "13px 15px",
                            background: "#F8FAFC",
                            border:
                                "1px solid #E2E8F0",
                            borderRadius: "8px",
                            color: "#334155",
                            fontFamily: "monospace"
                        }}
                    >
                        {evidenceId ||
                            "No evidence selected"}
                    </div>

                </div>


                {/* FILE */}

                <div
                    style={{
                        marginTop: "25px"
                    }}
                >

                    <label>
                        <strong>
                            Evidence File
                        </strong>
                    </label>

                    <label
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "12px",
                            marginTop: "10px",
                            padding: "18px",
                            borderRadius: "10px",
                            cursor: "pointer",
                            background: file ? "#F0FDF4" : "#F8FAFC", 
                            border: file 
                              ? "2px dashed #86EFAC"
                              : "2px dashed #CBD5E1"
                        }}
                    >

                        <FaFileUpload
                            style={{
                                color: "#2563EB",
                                fontSize: "20px"
                            }}
                        />

                        <div>

                            <strong
    style={{
        color: file ? "#166534" : "#334155"
    }}
>
    {file
        ? file.name
        : "Choose evidence file"}
</strong>

                            <p
                                style={{
                                    marginTop: "4px",
                                    color: "#64748B",
                                    fontSize: "13px"
                                }}
                            >
                                Select the file you want
                                to compare.
                            </p>

                        </div>

                        <input
                            type="file"
                            onChange={(e) => {

                                setFile(
                                    e.target.files[0]
                                );

                                setError("");
                                setResult(null);

                            }}
                            style={{
                                display: "none"
                            }}
                        />

                    </label>

                </div>


                {/* ERROR */}

                {error && (

    <div
        style={{
            marginTop: "20px",
            padding: "16px",
            background: "#FEF2F2",
            border: "1px solid #FECACA",
            color: "#991B1B",
            borderRadius: "9px",
            fontSize: "14px"
        }}
    >

        <strong>
            Verification Error
        </strong>

        <p
            style={{
                marginTop: "6px",
                marginBottom: 0,
                lineHeight: "1.5"
            }}
        >
            {error}
        </p>

    </div>

)}


                {/* BUTTON */}

                <button
    type="submit"
    disabled={
        loading ||
        !evidenceId
    }
    style={{
        marginTop: "25px",
        padding: "12px 22px",
        border: "none",
        borderRadius: "8px",
        background:
            loading ||
            !evidenceId
                ? "#94A3B8"
                : "#2563EB",
        color: "white",
        cursor:
            loading ||
            !evidenceId
                ? "not-allowed"
                : "pointer",
        fontWeight: "600",
        transition: "all 0.2s ease",
        boxShadow:
            loading || !evidenceId
                ? "none"
                : "0 4px 10px rgba(37, 99, 235, 0.18)"
    }}
    onMouseEnter={(e) => {
        if (!loading && evidenceId) {
            e.currentTarget.style.background = "#1D4ED8";
            e.currentTarget.style.transform = "translateY(-1px)";
            e.currentTarget.style.boxShadow =
                "0 6px 14px rgba(37, 99, 235, 0.25)";
        }
    }}
    onMouseLeave={(e) => {
        e.currentTarget.style.background =
            loading || !evidenceId
                ? "#94A3B8"
                : "#2563EB";

        e.currentTarget.style.transform =
            "translateY(0)";

        e.currentTarget.style.boxShadow =
            loading || !evidenceId
                ? "none"
                : "0 4px 10px rgba(37, 99, 235, 0.18)";
    }}
>

                    {loading ? (
    <span
        style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px"
        }}
    >

        <span
            style={{
                width: "15px",
                height: "15px",
                border: "2px solid rgba(255,255,255,0.5)",
                borderTop: "2px solid white",
                borderRadius: "50%",
                animation: "verifySpin 0.8s linear infinite"
            }}
        />

        Verifying Evidence...

        <style>
            {`
                @keyframes verifySpin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}
        </style>

    </span>
) : (
    "Verify Evidence"
)}

                </button>

            </form>


            {/* ==================================
                RESULT
            ================================== */}

            {result && (

                <div
                    style={{
                        marginTop: "25px",
                        background: "white",
                        padding: "30px",
                        borderRadius: "15px",
                        boxShadow:
                            "0 4px 15px rgba(0,0,0,0.06)",
                        border: isVerified
                            ? "1px solid #BBF7D0"
                            : "1px solid #FECACA"
                    }}
                >

                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "12px"
                        }}
                    >

                        {isVerified ? (

                            <FaCheckCircle
                                style={{
                                    color: "#16A34A",
                                    fontSize: "28px"
                                }}
                            />

                        ) : (

                            <FaExclamationTriangle
                                style={{
                                    color: "#DC2626",
                                    fontSize: "28px"
                                }}
                            />

                        )}

                        <h2>
                            {isVerified
                                ? "Evidence Verified"
                                : "Integrity Check Failed"}
                        </h2>

                    </div>


                    <p
                        style={{
                            marginTop: "15px",
                            color: "#475569",
                            lineHeight: "1.6"
                        }}
                    >
                        {isVerified
                            ? "The uploaded file matches the originally registered evidence."
                            : "The uploaded file does not match the originally registered evidence."}
                    </p>


                    <div
                        style={{
                            marginTop: "20px",
                            padding: "15px",
                            background: isVerified
                                ? "#F0FDF4"
                                : "#FEF2F2",
                            borderRadius: "10px"
                        }}
                    >

                        <strong>
                            Integrity Status
                        </strong>

                        <div
                            style={{
                                marginTop: "6px",
                                fontWeight: "700",
                                color: isVerified
                                    ? "#166534"
                                    : "#991B1B"
                            }}
                        >
                            {isVerified
                                ? "Verified"
                                : "Failed"}
                        </div>

                    </div>

                </div>

            )}

        </div>

    );
}