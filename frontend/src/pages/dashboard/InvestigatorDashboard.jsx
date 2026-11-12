import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

import api from "../../services/api";

import {
  FaFolderOpen,
  FaFileAlt,
  FaCube,
  FaExclamationTriangle,
  FaCheckCircle,
  FaSearch,
  FaRedo,
  FaTimes,
  FaShieldAlt,
  FaSignOutAlt,
} from "react-icons/fa";

// ==========================================
// STATUS STYLE
// ==========================================

const getStatusStyle = (status) => {
  if (status === "Registered" || status === "Verified") {
    return {
      background: "#DCFCE7",
      color: "#166534",
    };
  }

  if (
    status === "Pending User Decision" ||
    status === "Not Registered" ||
    status === "Not Verified"
  ) {
    return {
      background: "#FEF3C7",
      color: "#92400E",
    };
  }

  if (status === "Cancelled" || status === "Integrity Failed") {
    return {
      background: "#FEE2E2",
      color: "#991B1B",
    };
  }

  return {
    background: "#F1F5F9",
    color: "#475569",
  };
};

// ==========================================
// RISK STYLE
// ==========================================

const getRiskStyle = (risk) => {
  const normalized = String(risk || "").toLowerCase();

  if (normalized === "high") {
    return {
      background: "#FEE2E2",
      color: "#991B1B",
    };
  }

  if (normalized === "medium") {
    return {
      background: "#FEF3C7",
      color: "#92400E",
    };
  }

  if (normalized === "low") {
    return {
      background: "#DCFCE7",
      color: "#166534",
    };
  }

  return {
    background: "#F1F5F9",
    color: "#475569",
  };
};

// ==========================================
// GET RISK
// ==========================================

const getEvidenceRisk = (evidence) => {
  return evidence.risk_level || "Unknown";
};

// ==========================================
// STAT CARD
// ==========================================

const StatCard = ({ title, value, icon, background, iconBackground }) => {
  return (
    <div
      style={{
        background: "white",
        padding: "22px",
        borderRadius: "14px",
        boxShadow: "0 4px 15px rgba(0,0,0,0.06)",
        border: "1px solid #F1F5F9",
        transition: "all 0.2s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.08)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 4px 15px rgba(0,0,0,0.06)";
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <p
            style={{
              color: "#64748B",
              fontSize: "14px",
              margin: 0,
            }}
          >
            {title}
          </p>

          <h2
            style={{
              marginTop: "8px",
              fontSize: "28px",
              color: "#0F172A",
            }}
          >
            {value}
          </h2>
        </div>

        <div
          style={{
            width: "44px",
            height: "44px",
            borderRadius: "12px",
            background: iconBackground || background,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: background,
            fontSize: "18px",
          }}
        >
          {icon}
        </div>
      </div>
    </div>
  );
};

// ==========================================
// FILTER INPUT STYLE
// ==========================================

const filterInputStyle = {
  width: "100%",
  padding: "11px 13px",
  border: "1px solid #CBD5E1",
  borderRadius: "8px",
  background: "white",
  color: "#334155",
  fontSize: "14px",
  outline: "none",
  boxSizing: "border-box",
};

// ==========================================
// MAIN COMPONENT
// ==========================================

export default function InvestigatorDashboard() {
  const navigate = useNavigate();

  // logout + user are needed from AuthContext.
  // Investigator name is loaded from /profile,
  // with `user` as a fallback if /profile fails.
  const { logout, user } = useAuth();

  const [data, setData] = useState(null);

  const [investigatorName, setInvestigatorName] = useState("Investigator");

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  // ==========================================
  // FILTER STATES
  // ==========================================

  const [searchTerm, setSearchTerm] = useState("");

  const [riskFilter, setRiskFilter] = useState("All");

  const [verificationFilter, setVerificationFilter] = useState("All");

  // ==========================================
  // LOGOUT
  // ==========================================

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // ==========================================
  // FETCH DASHBOARD
  // ==========================================

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      // Fetch dashboard data
      const dashboardResponse = await api.get("/dashboard/investigator");

      setData(dashboardResponse.data);

      // Fetch investigator profile/name
      try {
        const profileResponse = await api.get("/profile");

        setInvestigatorName(profileResponse.data?.full_name || "Investigator");
      } catch (profileError) {
        console.error("Failed to load investigator profile:", profileError);

        // Fallback to JWT user name
        setInvestigatorName(user?.full_name || "Investigator");
      }
    } catch (err) {
      console.error("Investigator Dashboard Error:", err);

      setError(
        err.response?.data?.detail || "Unable to load investigator dashboard.",
      );
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadDashboard();
}, [loadDashboard]);
  // ==========================================
  // DATA
  // ==========================================

  const summary = data?.summary || {};

  const recentEvidence = data?.recent_evidence || [];

  // ==========================================
  // FILTERED EVIDENCE
  // ==========================================

  const filteredEvidence = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    return recentEvidence.filter((evidence) => {
      const filename = String(evidence.filename || "").toLowerCase();

      const evidenceId = String(evidence.evidence_id || "").toLowerCase();

      const caseId = String(evidence.case_id || "").toLowerCase();

      const verificationStatus = evidence.verification_status || "Not Verified";

      const risk = getEvidenceRisk(evidence);

      const matchesSearch =
        !search ||
        filename.includes(search) ||
        evidenceId.includes(search) ||
        caseId.includes(search);

      const matchesRisk =
        riskFilter === "All" ||
        String(risk).toLowerCase() === riskFilter.toLowerCase();

      const matchesVerification =
        verificationFilter === "All" ||
        verificationStatus === verificationFilter;

      return matchesSearch && matchesRisk && matchesVerification;
    });
  }, [recentEvidence, searchTerm, riskFilter, verificationFilter]);

  // ==========================================
  // CLEAR FILTERS
  // ==========================================

  const clearFilters = () => {
    setSearchTerm("");
    setRiskFilter("All");
    setVerificationFilter("All");
  };

  const filtersActive =
    searchTerm.trim() !== "" ||
    riskFilter !== "All" ||
    verificationFilter !== "All";

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div
        style={{
          padding: "40px",
          maxWidth: "1400px",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            background: "white",
            padding: "50px 30px",
            borderRadius: "15px",
            textAlign: "center",
            boxShadow: "0 4px 15px rgba(0,0,0,0.06)",
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
              animation: "investigatorDashboardSpin 1s linear infinite",
            }}
          />

          <h2
            style={{
              marginTop: "18px",
              color: "#0F172A",
            }}
          >
            Loading Investigator Dashboard
          </h2>

          <p
            style={{
              marginTop: "8px",
              color: "#64748B",
            }}
          >
            Preparing your evidence overview.
          </p>

          <style>
            {`
                            @keyframes investigatorDashboardSpin {

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

  // ==========================================
  // ERROR
  // ==========================================

  if (error) {
    return (
      <div
        style={{
          padding: "40px",
          maxWidth: "1400px",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            background: "#FEF2F2",
            padding: "30px",
            borderRadius: "12px",
            border: "1px solid #FECACA",
          }}
        >
          <FaExclamationTriangle
            size={28}
            style={{
              color: "#DC2626",
            }}
          />

          <h2
            style={{
              marginTop: "12px",
              color: "#991B1B",
            }}
          >
            Unable to load dashboard
          </h2>

          <p
            style={{
              marginTop: "8px",
              color: "#7F1D1D",
            }}
          >
            {error}
          </p>

          <button
            onClick={loadDashboard}
            style={{
              marginTop: "18px",
              padding: "10px 16px",
              border: "none",
              borderRadius: "8px",
              background: "#2563EB",
              color: "white",
              cursor: "pointer",
              fontWeight: "600",
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <FaRedo />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // ==========================================
  // MAIN UI
  // ==========================================

  return (
    <>
      {/* ==================================
                INVESTIGATOR TOP BAR
            ================================== */}

      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          gap: "14px",
          padding: "20px 35px 0",
          maxWidth: "1400px",
          margin: "0 auto",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <FaShieldAlt
            style={{
              color: "#2563EB",
              fontSize: "20px",
            }}
          />

          <div>
            {/* ACTUAL INVESTIGATOR NAME */}
            <strong
              style={{
                display: "block",
                color: "#0F172A",
                fontSize: "14px",
              }}
            >
              {investigatorName}
            </strong>

            <span
              style={{
                display: "block",
                marginTop: "2px",
                color: "#64748B",
                fontSize: "12px",
              }}
            >
              Investigator
            </span>
          </div>
        </div>

        {/* LOGOUT */}

        <button
          type="button"
          onClick={handleLogout}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "7px",
            padding: "9px 13px",
            border: "1px solid #FECACA",
            borderRadius: "8px",
            background: "#FEF2F2",
            color: "#DC2626",
            cursor: "pointer",
            fontWeight: "600",
            fontSize: "13px",
          }}
        >
          <FaSignOutAlt />
          Logout
        </button>
      </div>

      {/* ==================================
                DASHBOARD CONTENT
            ================================== */}

      <div
        style={{
          padding: "35px",
          maxWidth: "1400px",
          margin: "0 auto",
        }}
      >
        {/* HEADER */}

        <div>
          <h1
            style={{
              marginTop: "8px",
              color: "#0F172A",
            }}
          >
            Investigator Dashboard
          </h1>

          <p
            style={{
              marginTop: "8px",
              color: "#64748B",
            }}
          >
            Review, verify, and monitor registered digital evidence.
          </p>
        </div>

        {/* ==================================
                    SUMMARY
                ================================== */}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "15px",
            marginTop: "25px",
          }}
        >
          <StatCard
            title="Total Cases"
            value={summary.total_cases || 0}
            icon={<FaFolderOpen />}
            background="#2563EB"
            iconBackground="#EFF6FF"
          />

          <StatCard
            title="Total Evidence"
            value={summary.total_evidence || 0}
            icon={<FaFileAlt />}
            background="#0EA5E9"
            iconBackground="#F0F9FF"
          />

          <StatCard
            title="Blockchain Registered"
            value={summary.registered_evidence || 0}
            icon={<FaCube />}
            background="#16A34A"
            iconBackground="#F0FDF4"
          />

          <StatCard
            title="High Risk Evidence"
            value={summary.high_risk_evidence || 0}
            icon={<FaExclamationTriangle />}
            background="#B91C1C"
            iconBackground="#FEF2F2"
          />
        </div>

        {/* ==================================
                    EVIDENCE WORKSPACE
                ================================== */}

        <div
          style={{
            background: "white",
            marginTop: "35px",
            padding: "25px",
            borderRadius: "15px",
            boxShadow: "0 4px 15px rgba(0,0,0,0.06)",
            border: "1px solid #F1F5F9",
          }}
        >
          {/* SECTION HEADER */}

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "10px",
            }}
          >
            <div>
              <h2
                style={{
                  margin: 0,
                  color: "#0F172A",
                }}
              >
                Evidence Workspace
              </h2>

              <p
                style={{
                  marginTop: "5px",
                  color: "#64748B",
                  fontSize: "14px",
                }}
              >
                Search and filter evidence by AI-generated risk and verification
                status.
              </p>
            </div>

            <div
              style={{
                background: "#EFF6FF",
                color: "#1D4ED8",
                padding: "7px 11px",
                borderRadius: "20px",
                fontSize: "12px",
                fontWeight: "700",
              }}
            >
              {filteredEvidence.length}{" "}
              {filteredEvidence.length === 1 ? "Result" : "Results"}
            </div>
          </div>

          {/* ==================================
                        FILTER PANEL
                    ================================== */}

          <div
            style={{
              marginTop: "22px",
              padding: "18px",
              background: "#F8FAFC",
              border: "1px solid #E2E8F0",
              borderRadius: "12px",
            }}
          >
            <div
              className="investigator-filter-grid"
              style={{
                display: "grid",
                gridTemplateColumns:
                  "minmax(250px, 2fr) repeat(2, minmax(150px, 1fr))",
                gap: "12px",
                alignItems: "end",
              }}
            >
              {/* SEARCH */}

              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "7px",
                    fontSize: "12px",
                    fontWeight: "700",
                    color: "#475569",
                  }}
                >
                  Search Evidence
                </label>

                <div
                  style={{
                    position: "relative",
                  }}
                >
                  <FaSearch
                    style={{
                      position: "absolute",
                      left: "12px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "#94A3B8",
                    }}
                  />

                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Filename, evidence ID or case ID"
                    style={{
                      ...filterInputStyle,
                      paddingLeft: "36px",
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.border = "1px solid #2563EB";

                      e.currentTarget.style.boxShadow =
                        "0 0 0 3px rgba(37,99,235,0.10)";
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.border = "1px solid #CBD5E1";

                      e.currentTarget.style.boxShadow = "none";
                    }}
                  />
                </div>
              </div>

              {/* RISK */}

              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "7px",
                    fontSize: "12px",
                    fontWeight: "700",
                    color: "#475569",
                  }}
                >
                  Risk Level
                </label>

                <select
                  value={riskFilter}
                  onChange={(e) => setRiskFilter(e.target.value)}
                  style={filterInputStyle}
                >
                  <option value="All">All Risk Levels</option>

                  <option value="Low">Low Risk</option>

                  <option value="Medium">Medium Risk</option>

                  <option value="High">High Risk</option>
                </select>
              </div>

              {/* VERIFICATION */}

              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "7px",
                    fontSize: "12px",
                    fontWeight: "700",
                    color: "#475569",
                  }}
                >
                  Verification
                </label>

                <select
                  value={verificationFilter}
                  onChange={(e) => setVerificationFilter(e.target.value)}
                  style={filterInputStyle}
                >
                  <option value="All">All Verification</option>

                  <option value="Verified">Verified</option>

                  <option value="Integrity Failed">Integrity Failed</option>

                  <option value="Not Verified">Not Verified</option>
                </select>
              </div>
            </div>

            {/* CLEAR FILTERS */}

            {filtersActive && (
              <div
                style={{
                  marginTop: "14px",
                  display: "flex",
                  justifyContent: "flex-end",
                }}
              >
                <button
                  type="button"
                  onClick={clearFilters}
                  style={{
                    padding: "8px 13px",
                    border: "1px solid #CBD5E1",
                    background: "white",
                    color: "#475569",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontWeight: "600",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "7px",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#F1F5F9";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "white";
                  }}
                >
                  <FaTimes />
                  Clear Filters
                </button>
              </div>
            )}
          </div>

          {/* RESULT COUNT */}

          {recentEvidence.length > 0 && (
            <div
              style={{
                marginTop: "18px",
                color: "#64748B",
                fontSize: "13px",
              }}
            >
              Showing{" "}
              <strong
                style={{
                  color: "#334155",
                }}
              >
                {filteredEvidence.length}
              </strong>{" "}
              of{" "}
              <strong
                style={{
                  color: "#334155",
                }}
              >
                {recentEvidence.length}
              </strong>{" "}
              evidence items
            </div>
          )}

          {/* ==================================
                        EMPTY / FILTERED RESULTS
                    ================================== */}

          {recentEvidence.length === 0 ? (
            <div
              style={{
                marginTop: "25px",
                padding: "40px 25px",
                textAlign: "center",
                background: "#F8FAFC",
                borderRadius: "12px",
                border: "1px solid #E2E8F0",
              }}
            >
              <FaCheckCircle
                size={32}
                style={{
                  color: "#16A34A",
                }}
              />

              <h3
                style={{
                  marginTop: "12px",
                  color: "#0F172A",
                }}
              >
                No evidence available
              </h3>

              <p
                style={{
                  marginTop: "6px",
                  color: "#64748B",
                }}
              >
                There is currently no evidence requiring investigator attention.
              </p>
            </div>
          ) : filteredEvidence.length === 0 ? (
            <div
              style={{
                marginTop: "25px",
                padding: "40px 25px",
                textAlign: "center",
                background: "#F8FAFC",
                borderRadius: "12px",
                border: "1px solid #E2E8F0",
              }}
            >
              <FaSearch
                size={30}
                style={{
                  color: "#94A3B8",
                }}
              />

              <h3
                style={{
                  marginTop: "12px",
                  color: "#0F172A",
                }}
              >
                No matching evidence
              </h3>

              <p
                style={{
                  marginTop: "6px",
                  color: "#64748B",
                }}
              >
                Try changing your search or filter selection.
              </p>

              <button
                type="button"
                onClick={clearFilters}
                style={{
                  marginTop: "15px",
                  padding: "9px 15px",
                  border: "none",
                  borderRadius: "8px",
                  background: "#2563EB",
                  color: "white",
                  cursor: "pointer",
                  fontWeight: "600",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "7px",
                }}
              >
                <FaRedo />
                Reset Filters
              </button>
            </div>
          ) : (
            /* ==================================
                           EVIDENCE LIST
                        ================================== */

            <div
              style={{
                marginTop: "20px",
                display: "flex",
                flexDirection: "column",
                gap: "12px",
              }}
            >
              {filteredEvidence.map((evidence) => {
                const risk = getEvidenceRisk(evidence);

                return (
                  <div
                    key={evidence.evidence_id}
                    style={{
                      padding: "20px",
                      border: "1px solid #E2E8F0",
                      borderRadius: "12px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: "20px",
                      flexWrap: "wrap",
                      transition: "all 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "#CBD5E1";

                      e.currentTarget.style.boxShadow =
                        "0 5px 15px rgba(0,0,0,0.05)";

                      e.currentTarget.style.transform = "translateY(-1px)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "#E2E8F0";

                      e.currentTarget.style.boxShadow = "none";

                      e.currentTarget.style.transform = "translateY(0)";
                    }}
                  >
                    {/* EVIDENCE INFO */}

                    <div
                      style={{
                        minWidth: "250px",
                        flex: 1,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "9px",
                        }}
                      >
                        <FaFileAlt
                          style={{
                            color: "#2563EB",
                          }}
                        />

                        <h3
                          style={{
                            margin: 0,
                            fontSize: "16px",
                            color: "#0F172A",
                          }}
                        >
                          {evidence.filename || "Unnamed Evidence"}
                        </h3>
                      </div>

                      <p
                        style={{
                          marginTop: "8px",
                          color: "#64748B",
                          fontSize: "13px",
                        }}
                      >
                        Evidence ID:{" "}
                        <strong
                          style={{
                            color: "#334155",
                          }}
                        >
                          {evidence.evidence_id}
                        </strong>
                      </p>

                      <p
                        style={{
                          marginTop: "4px",
                          color: "#64748B",
                          fontSize: "13px",
                        }}
                      >
                        Case:{" "}
                        <strong
                          style={{
                            color: "#334155",
                          }}
                        >
                          {evidence.case_id}
                        </strong>
                      </p>

                      {evidence.last_verified_at && (
                        <p
                          style={{
                            marginTop: "4px",
                            color: "#64748B",
                            fontSize: "13px",
                          }}
                        >
                          Last verified:{" "}
                          {new Date(evidence.last_verified_at).toLocaleString()}
                        </p>
                      )}
                    </div>

                    {/* STATUS */}

                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "7px",
                        alignItems: "center",
                        maxWidth: "330px",
                      }}
                    >
                      <span
                        style={{
                          ...getStatusStyle(evidence.blockchain_status),
                          padding: "6px 11px",
                          borderRadius: "20px",
                          fontSize: "12px",
                          fontWeight: "600",
                        }}
                      >
                        {evidence.blockchain_status || "Not Registered"}
                      </span>

                      <span
                        style={{
                          ...getStatusStyle(
                            evidence.verification_status || "Not Verified",
                          ),
                          padding: "6px 11px",
                          borderRadius: "20px",
                          fontSize: "12px",
                          fontWeight: "600",
                        }}
                      >
                        {evidence.verification_status || "Not Verified"}
                      </span>

                      {/* RISK BADGE */}

                      <span
                        style={{
                          ...getRiskStyle(risk),
                          padding: "6px 11px",
                          borderRadius: "20px",
                          fontSize: "12px",
                          fontWeight: "600",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "5px",
                        }}
                      >
                        <FaShieldAlt size={10} />
                        AI Risk: {risk}
                      </span>
                    </div>

                    {/* ACTIONS */}

                    <div
                      style={{
                        display: "flex",
                        gap: "8px",
                        flexWrap: "wrap",
                      }}
                    >
                      <button
                        type="button"
                        onClick={() =>
                          navigate(
                            `/investigator/evidence/${encodeURIComponent(
                              evidence.evidence_id,
                            )}`,
                          )
                        }
                        style={{
                          padding: "9px 15px",
                          border: "1px solid #CBD5E1",
                          background: "white",
                          color: "#334155",
                          borderRadius: "8px",
                          cursor: "pointer",
                          fontWeight: "600",
                          transition: "all 0.2s ease",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = "#F8FAFC";

                          e.currentTarget.style.transform = "translateY(-1px)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = "white";

                          e.currentTarget.style.transform = "translateY(0)";
                        }}
                      >
                        View Details
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          navigate(
                            `/investigator/verification?evidence=${encodeURIComponent(
                              evidence.evidence_id,
                            )}`,
                          )
                        }
                        style={{
                          padding: "9px 15px",
                          border: "none",
                          background: "#2563EB",
                          color: "white",
                          borderRadius: "8px",
                          cursor: "pointer",
                          fontWeight: "600",
                          transition: "all 0.2s ease",
                          boxShadow: "0 3px 8px rgba(37,99,235,0.15)",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = "#1D4ED8";

                          e.currentTarget.style.transform = "translateY(-1px)";

                          e.currentTarget.style.boxShadow =
                            "0 5px 12px rgba(37,99,235,0.22)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = "#2563EB";

                          e.currentTarget.style.transform = "translateY(0)";

                          e.currentTarget.style.boxShadow =
                            "0 3px 8px rgba(37,99,235,0.15)";
                        }}
                      >
                        Verify
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ==================================
                    RESPONSIVE
                ================================== */}

        <style>
          {`
                        @media (max-width: 900px) {

                            .investigator-filter-grid {
                                grid-template-columns: 1fr !important;
                            }

                        }
                    `}
        </style>
      </div>
    </>
  );
}
