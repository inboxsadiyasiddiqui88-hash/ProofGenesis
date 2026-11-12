import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import UserLayout from "../../layouts/UserLayout";


function CaseDetails() {

    const { case_id } = useParams();

    const navigate = useNavigate();

    const [caseData, setCaseData] = useState(null);

    const [evidence, setEvidence] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");


    useEffect(() => {

        fetchCase();

        fetchEvidence();

    }, [case_id]);


    // ==========================================
    // Fetch Case
    // ==========================================

    const fetchCase = async () => {

        try {

            const token =
                localStorage.getItem("token");


            const response = await fetch(
                `http://127.0.0.1:8000/cases/${case_id}`,
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


            const data =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    data.detail ||
                    "Failed to load case"
                );

            }


            setCaseData(data);

        }

        catch (err) {

            console.error(err);

            setError(
                err.message ||
                "Unable to load case."
            );

        }

    };


    // ==========================================
    // Fetch Evidence
    // ==========================================

    const fetchEvidence = async () => {

        try {

            const token =
                localStorage.getItem("token");


            const response = await fetch(
                `http://127.0.0.1:8000/cases/${case_id}/evidence`,
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


            const data =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    data.detail ||
                    "Failed to load evidence"
                );

            }


            setEvidence(
                data.evidence || []
            );

        }

        catch (err) {

            console.error(err);

        }

        finally {

            setLoading(false);

        }

    };


    // ==========================================
    // Loading
    // ==========================================

    if (loading) {

        return (

            <UserLayout>

                <p>
                    Loading case...
                </p>

            </UserLayout>

        );

    }


    // ==========================================
    // Error
    // ==========================================

    if (error) {

        return (

            <UserLayout>

                <p
                    style={{
                        color: "red"
                    }}
                >
                    {error}
                </p>


                <button
                    onClick={() =>
                        navigate("/cases")
                    }
                    style={{
                        marginTop: "20px",
                        padding: "10px 18px",
                        border: "none",
                        borderRadius: "8px",
                        cursor: "pointer"
                    }}
                >
                    ← Back to My Cases
                </button>

            </UserLayout>

        );

    }


    return (

        <UserLayout>

            {/* Back button */}

            <button
                onClick={() =>
                    navigate("/cases")
                }
                style={{
                    padding: "10px 18px",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                    marginBottom: "25px"
                }}
            >
                ← Back to My Cases
            </button>


            {/* ==================================
                CASE INFORMATION
            ================================== */}

            <h1>
                {caseData.title}
            </h1>


            <p
                style={{
                    marginTop: "10px"
                }}
            >

                Case ID:{" "}

                <strong>
                    {caseData.case_id}
                </strong>

            </p>


            <div
                style={{
                    background: "white",
                    marginTop: "30px",
                    padding: "30px",
                    borderRadius: "15px",
                    boxShadow:
                        "0 4px 15px rgba(0,0,0,0.06)"
                }}
            >

                <h2>
                    Case Information
                </h2>


                <p
                    style={{
                        marginTop: "20px"
                    }}
                >
                    <strong>
                        Description:
                    </strong>
                </p>


                <p
                    style={{
                        marginTop: "8px"
                    }}
                >
                    {caseData.description ||
                        "No description provided."}
                </p>


                <p
                    style={{
                        marginTop: "20px"
                    }}
                >

                    <strong>
                        Priority:
                    </strong>{" "}

                    {caseData.priority}

                </p>


                <p
                    style={{
                        marginTop: "10px"
                    }}
                >

                    <strong>
                        Status:
                    </strong>{" "}

                    {caseData.status}

                </p>


                <p
                    style={{
                        marginTop: "10px"
                    }}
                >

                    <strong>
                        Created:
                    </strong>{" "}

                    {new Date(
                        caseData.created_at
                    ).toLocaleString()}

                </p>

            </div>


            {/* ==================================
                EVIDENCE
            ================================== */}

            <h2
                style={{
                    marginTop: "40px"
                }}
            >
                Evidence in this Case
            </h2>


            {evidence.length === 0 && (

                <p
                    style={{
                        marginTop: "20px"
                    }}
                >
                    No evidence has been uploaded
                    for this case yet.
                </p>

            )}


            {evidence.length > 0 && (

                <div
                    style={{
                        display: "grid",

                        gridTemplateColumns:
                            "repeat(auto-fit, minmax(300px, 1fr))",

                        gap: "20px",

                        marginTop: "20px"
                    }}
                >

                    {evidence.map((item) => (

                        <div
                            key={item.evidence_id}

                            style={{
                                background: "white",

                                padding: "25px",

                                borderRadius: "15px",

                                boxShadow:
                                    "0 4px 15px rgba(0,0,0,0.06)"
                            }}
                        >

                            <h3>
                                {item.original_filename}
                            </h3>


                            <p
                                style={{
                                    marginTop: "12px"
                                }}
                            >

                                <strong>
                                    Evidence ID:
                                </strong>{" "}

                                {item.evidence_id}

                            </p>


                            <p
                                style={{
                                    marginTop: "8px"
                                }}
                            >

                                <strong>
                                    Status:
                                </strong>{" "}

                                {item.status ||
                                    "Unknown"}

                            </p>


                            <p
                                style={{
                                    marginTop: "8px"
                                }}
                            >

                                <strong>
                                    Blockchain:
                                </strong>{" "}

                                {item.blockchain_status ||
                                    "Not Registered"}

                            </p>


                            <p
                                style={{
                                    marginTop: "8px"
                                }}
                            >

                                <strong>
                                    Verification:
                                </strong>{" "}

                                {item.verification_status ||
                                    "Not Verified"}

                            </p>


                            <p
                                style={{
                                    marginTop: "15px",
                                    fontSize: "14px",
                                    color: "#666"
                                }}
                            >

                                Uploaded:{" "}

                                {item.uploaded_at
                                    ? new Date(
                                        item.uploaded_at
                                    ).toLocaleString()
                                    : "Unknown"}

                            </p>

                            <button
    onClick={() =>
        navigate(
            `/evidence/${item.evidence_id}`
        )
    }
    style={{
        marginTop: "20px",
        padding: "10px 18px",
        background: "#2563EB",
        color: "white",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
        fontWeight: "600"
    }}
>
    View Evidence
</button>

                        </div>

                    ))}

                </div>

            )}

        </UserLayout>

    );

}


export default CaseDetails;