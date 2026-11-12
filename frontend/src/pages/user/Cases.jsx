
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import UserLayout from "../../layouts/UserLayout";

import {
    FaFolderOpen,
    FaPlus,
    FaTimes,
    FaRedo,
    FaArrowRight,
    FaExclamationTriangle
} from "react-icons/fa";


// ==========================================
// STATUS STYLE
// ==========================================

const getCaseStatusStyle = (status) => {
    if (
        status === "Active" ||
        status === "Open"
    ) {
        return {
            background: "#DCFCE7",
            color: "#166534"
        };
    }

    if (
        status === "Closed" ||
        status === "Completed"
    ) {
        return {
            background: "#E2E8F0",
            color: "#475569"
        };
    }

    return {
        background: "#FEF3C7",
        color: "#92400E"
    };
};


// ==========================================
// PRIORITY STYLE
// ==========================================

const getPriorityStyle = (priority) => {
    if (priority === "High") {
        return {
            background: "#FEE2E2",
            color: "#991B1B"
        };
    }

    if (priority === "Low") {
        return {
            background: "#DCFCE7",
            color: "#166534"
        };
    }

    return {
        background: "#FEF3C7",
        color: "#92400E"
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
    padding: "11px 18px",
    background: "#2563EB",
    color: "#FFFFFF",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "14px",
    transition: "all 0.2s ease",
    boxShadow: "0 2px 5px rgba(37, 99, 235, 0.18)"
};

const secondaryButtonStyle = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    padding: "10px 16px",
    background: "#FFFFFF",
    color: "#475569",
    border: "1px solid #CBD5E1",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "14px",
    transition: "all 0.2s ease"
};

const badgeBaseStyle = {
    padding: "6px 11px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: "600",
    display: "inline-flex",
    alignItems: "center",
    whiteSpace: "nowrap"
};


// ==========================================
// COMPONENT
// ==========================================

function Cases() {

    const navigate = useNavigate();

    const [cases, setCases] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    // Create case states

    const [showCreateForm, setShowCreateForm] =
        useState(false);

    const [title, setTitle] = useState("");

    const [description, setDescription] =
        useState("");

    const [priority, setPriority] =
        useState("Normal");

    const [creating, setCreating] =
        useState(false);


    // ==========================================
    // FETCH CASES
    // ==========================================

    const fetchCases = useCallback(async () => {

        try {

            setLoading(true);
            setError("");

            const token =
                localStorage.getItem("token");

            const response = await fetch(
                "http://127.0.0.1:8000/cases/my-cases",
                {
                    method: "GET",

                    headers: {
                        "Authorization":
                            `Bearer ${token}`,

                        "Content-Type":
                            "application/json"
                    }
                }
            );

            if (!response.ok) {

                const data =
                    await response.json();

                throw new Error(
                    data.detail ||
                    "Failed to fetch cases"
                );
            }

            const data =
                await response.json();

            setCases(
                data.cases || []
            );

        } catch (err) {

            console.error(err);

            setError(
                err.message ||
                "Unable to load your cases."
            );

        } finally {

            setLoading(false);

        }

    }, []);


    useEffect(() => {

        fetchCases();

    }, [fetchCases]);


    // ==========================================
    // CREATE NEW CASE
    // ==========================================

    const handleCreateCase = async (event) => {

        event.preventDefault();

        setError("");

        if (!title.trim()) {

            setError(
                "Please enter a case title."
            );

            return;
        }

        try {

            setCreating(true);

            const token =
                localStorage.getItem("token");

            const response = await fetch(
                "http://127.0.0.1:8000/cases",
                {
                    method: "POST",

                    headers: {
                        "Authorization":
                            `Bearer ${token}`,

                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        title: title,

                        description:
                            description,

                        priority: priority

                    })
                }
            );

            const data =
                await response.json();

            if (!response.ok) {

                throw new Error(
                    data.detail ||
                    "Failed to create case"
                );
            }

            setTitle("");

            setDescription("");

            setPriority("Normal");

            setShowCreateForm(false);

            await fetchCases();

        } catch (err) {

            console.error(err);

            setError(
                err.message ||
                "Unable to create case."
            );

        } finally {

            setCreating(false);

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

            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: "15px"
                }}
            >

                <div>

                    <h1
                        style={{
                            margin: 0,
                            color: "#0F172A",
                            fontSize: "28px",
                            fontWeight: "700"
                        }}
                    >
                        My Cases
                    </h1>

                    <p
                        style={{
                            marginTop: "8px",
                            marginBottom: 0,
                            color: "#64748B",
                            fontSize: "15px"
                        }}
                    >
                        Create and manage your evidence cases.
                    </p>

                </div>


                <button
                    onClick={() =>
                        setShowCreateForm(
                            !showCreateForm
                        )
                    }
                    style={{
                        ...primaryButtonStyle,
                        background: showCreateForm
                            ? "#64748B"
                            : "#2563EB"
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background =
                            showCreateForm
                                ? "#475569"
                                : "#1D4ED8";
                        e.currentTarget.style.transform =
                            "translateY(-1px)";
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background =
                            showCreateForm
                                ? "#64748B"
                                : "#2563EB";
                        e.currentTarget.style.transform =
                            "translateY(0)";
                    }}
                >

                    {showCreateForm ? (
                        <>
                            <FaTimes size={13} />
                            Close
                        </>
                    ) : (
                        <>
                            <FaPlus size={12} />
                            Create New Case
                        </>
                    )}

                </button>

            </div>


            {/* ==================================
                CREATE CASE FORM
            ================================== */}

            {showCreateForm && (

                <form
                    onSubmit={handleCreateCase}
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

                    <h2
                        style={{
                            margin: 0,
                            color: "#0F172A",
                            fontSize: "20px"
                        }}
                    >
                        Create New Case
                    </h2>

                    <p
                        style={{
                            marginTop: "6px",
                            marginBottom: 0,
                            color: "#64748B",
                            fontSize: "14px"
                        }}
                    >
                        Add the basic details for your evidence case.
                    </p>


                    {/* TITLE */}

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
                                Case Title
                            </strong>
                        </label>

                        <input
                            type="text"
                            value={title}
                            onChange={(e) =>
                                setTitle(
                                    e.target.value
                                )
                            }
                            placeholder="Enter case title"
                            style={{
                                display: "block",
                                width: "100%",
                                maxWidth: "600px",
                                marginTop: "10px",
                                padding: "12px 13px",
                                border:
                                    "1px solid #CBD5E1",
                                borderRadius: "8px",
                                boxSizing: "border-box",
                                fontSize: "14px",
                                color: "#0F172A",
                                outline: "none",
                                transition:
                                    "border-color 0.2s ease"
                            }}
                            onFocus={(e) => {
                                e.currentTarget.style.borderColor =
                                    "#2563EB";
                            }}
                            onBlur={(e) => {
                                e.currentTarget.style.borderColor =
                                    "#CBD5E1";
                            }}
                        />

                    </div>


                    {/* DESCRIPTION */}

                    <div
                        style={{
                            marginTop: "20px"
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
                                Description
                            </strong>
                        </label>

                        <textarea
                            value={description}
                            onChange={(e) =>
                                setDescription(
                                    e.target.value
                                )
                            }
                            placeholder="Enter case description"
                            rows="4"
                            style={{
                                display: "block",
                                width: "100%",
                                maxWidth: "600px",
                                marginTop: "10px",
                                padding: "12px 13px",
                                border:
                                    "1px solid #CBD5E1",
                                borderRadius: "8px",
                                resize: "vertical",
                                boxSizing: "border-box",
                                fontSize: "14px",
                                color: "#0F172A",
                                outline: "none",
                                fontFamily: "inherit",
                                transition:
                                    "border-color 0.2s ease"
                            }}
                            onFocus={(e) => {
                                e.currentTarget.style.borderColor =
                                    "#2563EB";
                            }}
                            onBlur={(e) => {
                                e.currentTarget.style.borderColor =
                                    "#CBD5E1";
                            }}
                        />

                    </div>


                    {/* PRIORITY */}

                    <div
                        style={{
                            marginTop: "20px"
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
                                Priority
                            </strong>
                        </label>

                        <select
                            value={priority}
                            onChange={(e) =>
                                setPriority(
                                    e.target.value
                                )
                            }
                            style={{
                                display: "block",
                                marginTop: "10px",
                                padding: "12px",
                                width: "200px",
                                border:
                                    "1px solid #CBD5E1",
                                borderRadius: "8px",
                                background: "#FFFFFF",
                                color: "#0F172A",
                                fontSize: "14px",
                                outline: "none",
                                cursor: "pointer"
                            }}
                        >

                            <option value="Low">
                                Low
                            </option>

                            <option value="Normal">
                                Normal
                            </option>

                            <option value="High">
                                High
                            </option>

                        </select>

                    </div>


                    {/* FORM ERROR */}

                    {error && (

                        <div
                            style={{
                                marginTop: "20px",
                                padding: "12px 15px",
                                background: "#FEF2F2",
                                border:
                                    "1px solid #FECACA",
                                color: "#991B1B",
                                borderRadius: "9px",
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


                    {/* CREATE */}

                    <button
                        type="submit"
                        disabled={creating}
                        style={{
                            ...primaryButtonStyle,
                            marginTop: "25px",
                            background:
                                creating
                                    ? "#94A3B8"
                                    : "#16A34A",
                            cursor:
                                creating
                                    ? "not-allowed"
                                    : "pointer",
                            boxShadow:
                                creating
                                    ? "none"
                                    : "0 2px 5px rgba(22, 163, 74, 0.18)"
                        }}
                        onMouseEnter={(e) => {
                            if (!creating) {
                                e.currentTarget.style.background =
                                    "#15803D";
                                e.currentTarget.style.transform =
                                    "translateY(-1px)";
                            }
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background =
                                creating
                                    ? "#94A3B8"
                                    : "#16A34A";
                            e.currentTarget.style.transform =
                                "translateY(0)";
                        }}
                    >

                        {creating ? (
                            <>
                                <span
                                    style={{
                                        width: "14px",
                                        height: "14px",
                                        border:
                                            "2px solid rgba(255,255,255,0.45)",
                                        borderTop:
                                            "2px solid #FFFFFF",
                                        borderRadius: "50%",
                                        animation:
                                            "createCaseSpin 0.8s linear infinite"
                                    }}
                                />
                                Creating Case...
                            </>
                        ) : (
                            <>
                                <FaPlus size={12} />
                                Create Case
                            </>
                        )}

                    </button>

                </form>

            )}


            {/* ==================================
                ERROR
            ================================== */}

            {!showCreateForm && error && (

                <div
                    style={{
                        marginTop: "30px",
                        padding: "16px 18px",
                        background: "#FEF2F2",
                        border: "1px solid #FECACA",
                        borderRadius: "10px",
                        color: "#991B1B",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: "15px",
                        flexWrap: "wrap"
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
                                Unable to load your cases
                            </strong>

                            <p
                                style={{
                                    marginTop: "5px",
                                    marginBottom: 0,
                                    fontSize: "13px"
                                }}
                            >
                                {error}
                            </p>

                        </div>

                    </div>

                    <button
                        onClick={fetchCases}
                        style={{
                            ...secondaryButtonStyle,
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
                        <FaRedo size={12} />
                        Try Again
                    </button>

                </div>

            )}


            {/* ==================================
                LOADING
            ================================== */}

            {loading && (

                <div
                    style={{
                        background: "#FFFFFF",
                        marginTop: "30px",
                        padding: "45px 30px",
                        borderRadius: "16px",
                        textAlign: "center",
                        boxShadow:
                            "0 4px 15px rgba(0,0,0,0.06)"
                    }}
                >

                    <div
                        style={{
                            width: "38px",
                            height: "38px",
                            margin: "0 auto 15px",
                            border: "4px solid #E2E8F0",
                            borderTop:
                                "4px solid #2563EB",
                            borderRadius: "50%",
                            animation:
                                "casesSpin 1s linear infinite"
                        }}
                    />

                    <h3
                        style={{
                            margin: 0,
                            color: "#0F172A"
                        }}
                    >
                        Loading your cases
                    </h3>

                    <p
                        style={{
                            marginTop: "7px",
                            marginBottom: 0,
                            color: "#64748B",
                            fontSize: "14px"
                        }}
                    >
                        Please wait while we retrieve your cases.
                    </p>

                </div>

            )}


            {/* ==================================
                NO CASES
            ================================== */}

            {!loading &&
                !error &&
                cases.length === 0 && (

                    <div
                        style={{
                            background: "#FFFFFF",
                            marginTop: "30px",
                            padding: "45px 30px",
                            borderRadius: "16px",
                            textAlign: "center",
                            boxShadow:
                                "0 4px 15px rgba(0,0,0,0.06)"
                        }}
                    >

                        <div
                            style={{
                                width: "64px",
                                height: "64px",
                                margin: "0 auto",
                                borderRadius: "50%",
                                background: "#EFF6FF",
                                color: "#2563EB",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center"
                            }}
                        >
                            <FaFolderOpen size={27} />
                        </div>

                        <h2
                            style={{
                                marginTop: "18px",
                                marginBottom: 0,
                                color: "#0F172A"
                            }}
                        >
                            No cases yet
                        </h2>

                        <p
                            style={{
                                marginTop: "8px",
                                marginBottom: 0,
                                color: "#64748B",
                                fontSize: "14px",
                                lineHeight: "1.5"
                            }}
                        >
                            Create your first case to start
                            uploading digital evidence.
                        </p>

                        <button
                            onClick={() =>
                                setShowCreateForm(true)
                            }
                            style={{
                                ...primaryButtonStyle,
                                marginTop: "20px"
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
                            <FaPlus size={12} />
                            Create Your First Case
                        </button>

                    </div>

                )}


            {/* ==================================
                CASES
            ================================== */}

            {!loading &&
                !error &&
                cases.length > 0 && (

                    <div
                        style={{
                            marginTop: "30px",
                            display: "grid",
                            gridTemplateColumns:
                                "repeat(auto-fit, minmax(300px, 1fr))",
                            gap: "20px"
                        }}
                    >

                        {cases.map((item) => (

                            <div
                                key={item.case_id}
                                style={{
                                    background: "#FFFFFF",
                                    padding: "25px",
                                    borderRadius: "16px",
                                    boxShadow:
                                        "0 4px 15px rgba(0,0,0,0.06)",
                                    display: "flex",
                                    flexDirection: "column",
                                    border:
                                        "1px solid #F1F5F9",
                                    transition:
                                        "transform 0.2s ease, box-shadow 0.2s ease"
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform =
                                        "translateY(-2px)";
                                    e.currentTarget.style.boxShadow =
                                        "0 8px 22px rgba(0,0,0,0.08)";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform =
                                        "translateY(0)";
                                    e.currentTarget.style.boxShadow =
                                        "0 4px 15px rgba(0,0,0,0.06)";
                                }}
                            >

                                {/* CASE TITLE */}

                                <h2
                                    style={{
                                        margin: 0,
                                        lineHeight: "1.3",
                                        color: "#0F172A",
                                        fontSize: "20px"
                                    }}
                                >
                                    {item.title}
                                </h2>


                                {/* CASE ID */}

                                <p
                                    style={{
                                        marginTop: "10px",
                                        marginBottom: 0,
                                        fontSize: "13px",
                                        color: "#64748B"
                                    }}
                                >
                                    Case ID:{" "}
                                    <strong
                                        style={{
                                            color: "#334155"
                                        }}
                                    >
                                        {item.case_id}
                                    </strong>
                                </p>


                                {/* PRIORITY + STATUS */}

                                <div
                                    style={{
                                        display: "flex",
                                        flexWrap: "wrap",
                                        gap: "8px",
                                        marginTop: "15px"
                                    }}
                                >

                                    <span
                                        style={{
                                            ...badgeBaseStyle,
                                            ...getPriorityStyle(
                                                item.priority
                                            )
                                        }}
                                    >
                                        Priority:{" "}
                                        {item.priority ||
                                            "Normal"}
                                    </span>

                                    <span
                                        style={{
                                            ...badgeBaseStyle,
                                            ...getCaseStatusStyle(
                                                item.status
                                            )
                                        }}
                                    >
                                        {item.status ||
                                            "Unknown"}
                                    </span>

                                </div>


                                {/* DESCRIPTION */}

                                {item.description && (

                                    <p
                                        style={{
                                            marginTop: "18px",
                                            marginBottom: 0,
                                            color: "#475569",
                                            lineHeight: "1.6",
                                            fontSize: "14px"
                                        }}
                                    >
                                        {item.description}
                                    </p>

                                )}


                                {/* CREATED */}

                                <p
                                    style={{
                                        marginTop: "auto",
                                        paddingTop: "20px",
                                        marginBottom: 0,
                                        fontSize: "13px",
                                        color: "#64748B"
                                    }}
                                >
                                    Created:{" "}
                                    {item.created_at
                                        ? new Date(
                                              item.created_at
                                          ).toLocaleString()
                                        : "Unknown"}
                                </p>


                                {/* VIEW CASE */}

                                <button
                                    onClick={() =>
                                        navigate(
                                            `/cases/${item.case_id}`
                                        )
                                    }
                                    style={{
                                        ...primaryButtonStyle,
                                        marginTop: "15px",
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
                                    View Case
                                    <FaArrowRight size={12} />
                                </button>

                            </div>

                        ))}

                    </div>

                )}


            {/* ==================================
                ANIMATIONS
            ================================== */}

            <style>
                {`
                    @keyframes casesSpin {
                        from {
                            transform: rotate(0deg);
                        }
                        to {
                            transform: rotate(360deg);
                        }
                    }

                    @keyframes createCaseSpin {
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

export default Cases;