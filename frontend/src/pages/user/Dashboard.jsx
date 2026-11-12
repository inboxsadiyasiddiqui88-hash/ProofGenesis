
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import DashboardLayout from "../../components/layout/DashboardLayout";
import StatCard from "../../components/ui/StatCard";

import api from "../../services/api";

import {
    FaFolderOpen,
    FaFileAlt,
    FaCube,
    FaClock,
    FaArrowRight,
    FaRedo,
    FaExclamationTriangle
} from "react-icons/fa";

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
        status === "Cancelled by User" ||
        status === "Cancelled" ||
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

const badgeStyle = (status) => ({
    ...getStatusStyle(status),
    padding: "6px 11px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: "600",
    display: "inline-flex",
    alignItems: "center",
    whiteSpace: "nowrap",
    lineHeight: "1.2"
});

const primaryButtonStyle = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    padding: "10px 17px",
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
    gap: "7px",
    padding: "9px 14px",
    background: "#EFF6FF",
    color: "#2563EB",
    border: "1px solid #DBEAFE",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "13px",
    transition: "all 0.2s ease"
};

function Dashboard() {

    const navigate = useNavigate();

    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchDashboardData = async () => {

        try {

            setLoading(true);
            setError("");

            const token = localStorage.getItem("token");

            const response = await api.get(
                "/dashboard/user",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setDashboardData(response.data);

        } catch (error) {

            console.error(
                "Dashboard Error:",
                error
            );

            setError(
                error.response?.data?.detail ||
                "Unable to load your dashboard. Please try again."
            );

        } finally {

            setLoading(false);

        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    if (loading) {
        return (
            <DashboardLayout>

                <div
                    style={{
                        minHeight: "60vh",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                    }}
                >
                    <div
                        style={{
                            background: "#FFFFFF",
                            padding: "45px",
                            borderRadius: "16px",
                            textAlign: "center",
                            boxShadow:
                                "0 4px 15px rgba(0,0,0,0.06)",
                            maxWidth: "420px",
                            width: "100%"
                        }}
                    >

                        <div
                            style={{
                                width: "42px",
                                height: "42px",
                                margin: "0 auto 18px",
                                border: "4px solid #E2E8F0",
                                borderTop:
                                    "4px solid #2563EB",
                                borderRadius: "50%",
                                animation:
                                    "dashboardSpin 1s linear infinite"
                            }}
                        />

                        <h2
                            style={{
                                margin: 0,
                                color: "#0F172A",
                                fontSize: "20px"
                            }}
                        >
                            Loading your dashboard
                        </h2>

                        <p
                            style={{
                                marginTop: "8px",
                                color: "#64748B",
                                fontSize: "14px"
                            }}
                        >
                            We're preparing your latest
                            evidence information.
                        </p>

                    </div>
                </div>

            </DashboardLayout>
        );
    }

    if (error) {
        return (
            <DashboardLayout>

                <div
                    style={{
                        maxWidth: "600px",
                        margin: "60px auto",
                        background: "#FFFFFF",
                        padding: "38px",
                        borderRadius: "16px",
                        textAlign: "center",
                        boxShadow:
                            "0 4px 15px rgba(0,0,0,0.06)"
                    }}
                >

                    <div
                        style={{
                            width: "54px",
                            height: "54px",
                            margin: "0 auto",
                            borderRadius: "50%",
                            background: "#FEE2E2",
                            color: "#B91C1C",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "22px"
                        }}
                    >
                        <FaExclamationTriangle />
                    </div>

                    <h2
                        style={{
                            marginTop: "18px",
                            marginBottom: 0,
                            color: "#0F172A"
                        }}
                    >
                        Unable to load dashboard
                    </h2>

                    <p
                        style={{
                            marginTop: "10px",
                            color: "#64748B",
                            fontSize: "14px",
                            lineHeight: "1.6"
                        }}
                    >
                        {error}
                    </p>

                    <button
                        onClick={fetchDashboardData}
                        style={primaryButtonStyle}
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
                        <FaRedo size={12} />
                        Try Again
                    </button>

                </div>

            </DashboardLayout>
        );
    }

    const recentEvidence =
        dashboardData?.recent_evidence || [];

    return (
        <DashboardLayout>

            {/* PAGE HEADER */}

            <div>

                <h1
                    style={{
                        margin: 0,
                        color: "#0F172A",
                        fontSize: "28px",
                        fontWeight: "700"
                    }}
                >
                    User Dashboard
                </h1>

                <p
                    style={{
                        marginTop: "8px",
                        color: "#64748B",
                        fontSize: "15px"
                    }}
                >
                    Welcome to ProofGenesis. Here's an
                    overview of your digital evidence.
                </p>

            </div>


            {/* STAT CARDS */}

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns:
                        "repeat(auto-fit, minmax(210px, 1fr))",
                    gap: "20px",
                    marginTop: "30px"
                }}
            >

                <StatCard
                    title="Cases"
                    value={
                        dashboardData?.total_cases ?? 0
                    }
                    icon={<FaFolderOpen />}
                    color="#2563EB"
                />

                <StatCard
                    title="Evidence"
                    value={
                        dashboardData?.total_evidence ?? 0
                    }
                    icon={<FaFileAlt />}
                    color="#0EA5E9"
                />

                <StatCard
                    title="Registered"
                    value={
                        dashboardData?.registered_evidence ?? 0
                    }
                    icon={<FaCube />}
                    color="#22C55E"
                />

                <StatCard
                    title="Pending"
                    value={
                        dashboardData?.pending_decision ?? 0
                    }
                    icon={<FaClock />}
                    color="#F59E0B"
                />

            </div>


            {/* RECENT EVIDENCE */}

            <div
                style={{
                    background: "#FFFFFF",
                    marginTop: "30px",
                    padding: "28px",
                    borderRadius: "16px",
                    boxShadow:
                        "0 4px 15px rgba(0,0,0,0.06)"
                }}
            >

                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: "15px",
                        flexWrap: "wrap"
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
                            Recent Evidence
                        </h2>

                        <p
                            style={{
                                marginTop: "6px",
                                marginBottom: 0,
                                color: "#64748B",
                                fontSize: "14px"
                            }}
                        >
                            Your most recently uploaded evidence.
                        </p>

                    </div>

                    <button
                        onClick={() => navigate("/evidence")}
                        style={secondaryButtonStyle}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background =
                                "#DBEAFE";
                            e.currentTarget.style.borderColor =
                                "#BFDBFE";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background =
                                "#EFF6FF";
                            e.currentTarget.style.borderColor =
                                "#DBEAFE";
                        }}
                    >
                        View All
                        <FaArrowRight size={12} />
                    </button>

                </div>


                {recentEvidence.length > 0 ? (

                    <div
                        style={{
                            overflowX: "auto",
                            marginTop: "22px"
                        }}
                    >

                        <table
                            style={{
                                width: "100%",
                                borderCollapse: "collapse",
                                minWidth: "700px"
                            }}
                        >

                            <thead>

                                <tr>

                                    {[
                                        "Case",
                                        "File",
                                        "Status",
                                        "Blockchain",
                                        "Uploaded"
                                    ].map((heading) => (

                                        <th
                                            key={heading}
                                            style={{
                                                textAlign: "left",
                                                padding:
                                                    "12px",
                                                borderBottom:
                                                    "2px solid #E5E7EB",
                                                color:
                                                    "#475569",
                                                fontSize:
                                                    "13px",
                                                fontWeight:
                                                    "600",
                                                background:
                                                    "#F8FAFC"
                                            }}
                                        >
                                            {heading}
                                        </th>

                                    ))}

                                </tr>

                            </thead>

                            <tbody>

                                {recentEvidence.map(
                                    (evidence) => (

                                        <tr
                                            key={
                                                evidence.evidence_id
                                            }
                                            style={{
                                                transition:
                                                    "background 0.2s ease"
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.background =
                                                    "#F8FAFC";
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.background =
                                                    "#FFFFFF";
                                            }}
                                        >

                                            <td
                                                style={{
                                                    padding:
                                                        "15px 12px",
                                                    borderBottom:
                                                        "1px solid #E5E7EB",
                                                    fontSize:
                                                        "14px",
                                                    color:
                                                        "#0F172A"
                                                }}
                                            >
                                                <strong>
                                                    {
                                                        evidence.case_id
                                                    }
                                                </strong>
                                            </td>

                                            <td
                                                style={{
                                                    padding:
                                                        "15px 12px",
                                                    borderBottom:
                                                        "1px solid #E5E7EB",
                                                    maxWidth:
                                                        "250px",
                                                    color:
                                                        "#334155"
                                                }}
                                            >
                                                <span
                                                    style={{
                                                        display:
                                                            "block",
                                                        overflow:
                                                            "hidden",
                                                        textOverflow:
                                                            "ellipsis",
                                                        whiteSpace:
                                                            "nowrap"
                                                    }}
                                                    title={
                                                        evidence.filename
                                                    }
                                                >
                                                    {
                                                        evidence.filename
                                                    }
                                                </span>
                                            </td>

                                            <td
                                                style={{
                                                    padding:
                                                        "15px 12px",
                                                    borderBottom:
                                                        "1px solid #E5E7EB"
                                                }}
                                            >
                                                <span
                                                    style={badgeStyle(
                                                        evidence.status
                                                    )}
                                                >
                                                    {
                                                        evidence.status
                                                    }
                                                </span>
                                            </td>

                                            <td
                                                style={{
                                                    padding:
                                                        "15px 12px",
                                                    borderBottom:
                                                        "1px solid #E5E7EB"
                                                }}
                                            >
                                                <span
                                                    style={badgeStyle(
                                                        evidence.blockchain_status
                                                    )}
                                                >
                                                    {
                                                        evidence.blockchain_status ||
                                                        "Not Registered"
                                                    }
                                                </span>
                                            </td>

                                            <td
                                                style={{
                                                    padding:
                                                        "15px 12px",
                                                    borderBottom:
                                                        "1px solid #E5E7EB",
                                                    color:
                                                        "#64748B",
                                                    fontSize:
                                                        "13px"
                                                }}
                                            >
                                                {evidence.uploaded_at
                                                    ? new Date(
                                                          evidence.uploaded_at
                                                      ).toLocaleDateString()
                                                    : "Unknown"}
                                            </td>

                                        </tr>

                                    )
                                )}

                            </tbody>

                        </table>

                    </div>

                ) : (

                    <div
                        style={{
                            marginTop: "22px",
                            padding: "40px 25px",
                            background: "#F8FAFC",
                            borderRadius: "12px",
                            textAlign: "center",
                            border:
                                "1px dashed #CBD5E1"
                        }}
                    >

                        <FaFileAlt
                            size={32}
                            color="#94A3B8"
                        />

                        <h3
                            style={{
                                marginTop: "13px",
                                marginBottom: 0,
                                color: "#0F172A"
                            }}
                        >
                            No evidence yet
                        </h3>

                        <p
                            style={{
                                marginTop: "7px",
                                color: "#64748B",
                                fontSize: "14px",
                                lineHeight: "1.5"
                            }}
                        >
                            Upload your first evidence file
                            to begin the authenticity analysis.
                        </p>

                        <button
                            onClick={() =>
                                navigate("/evidence")
                            }
                            style={{
                                ...primaryButtonStyle,
                                marginTop: "18px"
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
                            <FaFileAlt size={13} />
                            Upload Evidence
                        </button>

                    </div>

                )}

            </div>

            <style>
                {`
                    @keyframes dashboardSpin {
                        from {
                            transform: rotate(0deg);
                        }
                        to {
                            transform: rotate(360deg);
                        }
                    }
                `}
            </style>

        </DashboardLayout>
    );
}

export default Dashboard;