import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Register() {

    const navigate = useNavigate();

    const [role, setRole] = useState("user");

    const [fullName, setFullName] = useState("");

    const [email, setEmail] = useState("");

    const [password, setPassword] = useState("");

    const [confirmPassword, setConfirmPassword] =
        useState("");

    const [investigatorCode, setInvestigatorCode] =
        useState("");

    const [error, setError] = useState("");

    const [success, setSuccess] = useState("");

    const [loading, setLoading] = useState(false);


    const handleRegister = async (e) => {

        e.preventDefault();

        setError("");

        setSuccess("");


        // ==========================================
        // Validate Password
        // ==========================================

        if (password !== confirmPassword) {

            setError(
                "Passwords do not match."
            );

            return;

        }


        if (password.length < 8) {

            setError(
                "Password must be at least 8 characters."
            );

            return;

        }


        // ==========================================
        // Validate Investigator Code
        // ==========================================

        if (
            role === "investigator" &&
            !investigatorCode.trim()
        ) {

            setError(
                "Please enter the investigator registration code."
            );

            return;

        }


        setLoading(true);


        try {

            let endpoint;
            let requestBody;


            // ==========================================
            // USER REGISTRATION
            // ==========================================

            if (role === "user") {

                endpoint =
                    "http://127.0.0.1:8000/register";

                requestBody = {

                    full_name: fullName,

                    email: email,

                    password: password

                };

            }


            // ==========================================
            // INVESTIGATOR REGISTRATION
            // ==========================================

            else {

                endpoint =
                    "http://127.0.0.1:8000/investigator/register";

                requestBody = {

                    full_name: fullName,

                    email: email,

                    password: password,

                    investigator_code:
                        investigatorCode

                };

            }


            const response = await fetch(
                endpoint,
                {
                    method: "POST",

                    headers: {

                        "Content-Type":
                            "application/json"

                    },

                    body: JSON.stringify(
                        requestBody
                    )

                }
            );


            const data =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    data.detail ||
                    "Registration failed."
                );

            }


            setSuccess(
                role === "user"
                    ? "Registration successful! Redirecting to login..."
                    : "Investigator registration successful! Redirecting to login..."
            );


            // ==========================================
            // Clear Form
            // ==========================================

            setFullName("");

            setEmail("");

            setPassword("");

            setConfirmPassword("");

            setInvestigatorCode("");


            // ==========================================
            // Go To Login
            // ==========================================

            setTimeout(() => {

                navigate("/");

            }, 1500);

        }

        catch (err) {

            console.error(err);

            setError(
                err.message ||
                "Unable to register."
            );

        }

        finally {

            setLoading(false);

        }

    };


    return (

        <div
            style={{
                minHeight: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                background: "#F5F7FB"
            }}
        >

            <div
                style={{
                    background: "white",
                    width: "400px",
                    padding: "35px",
                    borderRadius: "15px",
                    boxShadow:
                        "0 4px 20px rgba(0,0,0,0.08)"
                }}
            >

                <h1>
                    Create Account
                </h1>


                <p
                    style={{
                        marginTop: "8px",
                        color: "#666"
                    }}
                >
                    Register for ProofGenesis
                </p>


                {error && (

                    <p
                        style={{
                            marginTop: "20px",
                            color: "#DC2626"
                        }}
                    >
                        {error}
                    </p>

                )}


                {success && (

                    <p
                        style={{
                            marginTop: "20px",
                            color: "#16A34A"
                        }}
                    >
                        {success}
                    </p>

                )}


                <form
                    onSubmit={handleRegister}
                    style={{
                        marginTop: "25px"
                    }}
                >

                    {/* Registration Type */}

                    <label>
                        Register as
                    </label>

                    <div
                        style={{
                            display: "flex",
                            gap: "10px",
                            marginTop: "8px",
                            marginBottom: "20px"
                        }}
                    >

                        <button
                            type="button"
                            onClick={() => setRole("user")}
                            style={{
                                flex: 1,
                                padding: "10px",
                                border:
                                    role === "user"
                                        ? "2px solid #2563EB"
                                        : "1px solid #D1D5DB",
                                borderRadius: "8px",
                                background:
                                    role === "user"
                                        ? "#EFF6FF"
                                        : "white",
                                color:
                                    role === "user"
                                        ? "#2563EB"
                                        : "#333",
                                cursor: "pointer",
                                fontSize: "14px"
                            }}
                        >
                            User
                        </button>


                        <button
                            type="button"
                            onClick={() =>
                                setRole("investigator")
                            }
                            style={{
                                flex: 1,
                                padding: "10px",
                                border:
                                    role === "investigator"
                                        ? "2px solid #2563EB"
                                        : "1px solid #D1D5DB",
                                borderRadius: "8px",
                                background:
                                    role === "investigator"
                                        ? "#EFF6FF"
                                        : "white",
                                color:
                                    role === "investigator"
                                        ? "#2563EB"
                                        : "#333",
                                cursor: "pointer",
                                fontSize: "14px"
                            }}
                        >
                            Investigator
                        </button>

                    </div>


                    {/* Full Name */}

                    <label>
                        Full Name
                    </label>

                    <input
                        type="text"
                        value={fullName}
                        onChange={(e) =>
                            setFullName(e.target.value)
                        }
                        required
                        style={{
                            width: "100%",
                            padding: "11px",
                            marginTop: "7px",
                            marginBottom: "18px",
                            border: "1px solid #D1D5DB",
                            borderRadius: "8px",
                            boxSizing: "border-box"
                        }}
                    />


                    {/* Email */}

                    <label>
                        Email
                    </label>

                    <input
                        type="email"
                        value={email}
                        onChange={(e) =>
                            setEmail(e.target.value)
                        }
                        required
                        style={{
                            width: "100%",
                            padding: "11px",
                            marginTop: "7px",
                            marginBottom: "18px",
                            border: "1px solid #D1D5DB",
                            borderRadius: "8px",
                            boxSizing: "border-box"
                        }}
                    />


                    {/* Password */}

                    <label>
                        Password
                    </label>

                    <input
                        type="password"
                        value={password}
                        onChange={(e) =>
                            setPassword(e.target.value)
                        }
                        required
                        minLength={8}
                        style={{
                            width: "100%",
                            padding: "11px",
                            marginTop: "7px",
                            marginBottom: "18px",
                            border: "1px solid #D1D5DB",
                            borderRadius: "8px",
                            boxSizing: "border-box"
                        }}
                    />


                    {/* Confirm Password */}

                    <label>
                        Confirm Password
                    </label>

                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) =>
                            setConfirmPassword(e.target.value)
                        }
                        required
                        style={{
                            width: "100%",
                            padding: "11px",
                            marginTop: "7px",
                            marginBottom: "18px",
                            border: "1px solid #D1D5DB",
                            borderRadius: "8px",
                            boxSizing: "border-box"
                        }}
                    />


                    {/* Investigator Code */}

                    {role === "investigator" && (

                        <>

                            <label>
                                Investigator Registration Code
                            </label>

                            <input
                                type="password"
                                value={investigatorCode}
                                onChange={(e) =>
                                    setInvestigatorCode(
                                        e.target.value
                                    )
                                }
                                required
                                placeholder="Enter registration code"
                                style={{
                                    width: "100%",
                                    padding: "11px",
                                    marginTop: "7px",
                                    marginBottom: "22px",
                                    border:
                                        "1px solid #D1D5DB",
                                    borderRadius: "8px",
                                    boxSizing: "border-box"
                                }}
                            />

                        </>

                    )}


                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: "100%",
                            padding: "12px",
                            background: "#2563EB",
                            color: "white",
                            border: "none",
                            borderRadius: "8px",
                            cursor: "pointer",
                            fontSize: "16px"
                        }}
                    >

                        {loading
                            ? "Creating Account..."
                            : "Register"}

                    </button>

                </form>


                <p
                    style={{
                        marginTop: "20px",
                        textAlign: "center"
                    }}
                >

                    Already have an account?{" "}

                    <button
                        type="button"
                        onClick={() =>
                            navigate("/")
                        }
                        style={{
                            border: "none",
                            background: "none",
                            color: "#2563EB",
                            cursor: "pointer"
                        }}
                    >
                        Login
                    </button>

                </p>

            </div>

        </div>
    );

}

export default Register;