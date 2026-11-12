import { useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../../services/api";

import InputField from "../../components/ui/InputField";
import PasswordField from "../../components/ui/PasswordField";
import PrimaryButton from "../../components/ui/PrimaryButton";

import { useAuth } from "../../context/AuthContext";

import "../../styles/auth.css";

function Login() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const { login } = useAuth();

    const navigate = useNavigate();


    const handleLogin = async (e) => {

        e.preventDefault();


        if (!email.trim()) {

            alert("Please enter your email.");

            return;

        }


        if (!password.trim()) {

            alert("Please enter your password.");

            return;

        }


        try {

            const response = await api.post(
                "/login",
                {
                    email: email,
                    password: password
                }
            );


            // Send JWT to AuthContext
            login(response.data.access_token);


            // Go to User Dashboard
            navigate("/dashboard");


        } catch (error) {

            console.error("Login Error:", error);

            alert(
                error.response?.data?.detail ||
                "Login failed. Please try again."
            );

        }

    };


    return (

        <div className="auth-page">

            <div className="auth-card">

                <h1>ProofGenesis</h1>

                <p className="subtitle">

                    Digital Evidence Intelligence Platform

                </p>


                <form onSubmit={handleLogin}>

                    <InputField

                        label="Email Address"

                        value={email}

                        onChange={(e) =>
                            setEmail(e.target.value)
                        }

                        placeholder="Enter your email"

                    />


                    <PasswordField

                        value={password}

                        onChange={(e) =>
                            setPassword(e.target.value)
                        }

                    />


                    <PrimaryButton type="submit">

                        Sign In

                    </PrimaryButton>

                </form>

                <div
    style={{
        marginTop: "20px",
        textAlign: "center",
        fontSize: "14px",
        color: "#64748B"
    }}
>
    Don't have an account?{" "}
    <button
        type="button"
        onClick={() => navigate("/register")}
        style={{
            border: "none",
            background: "none",
            color: "#2563EB",
            fontWeight: "600",
            cursor: "pointer",
            padding: 0
        }}
    >
        Register here
    </button>
</div>

            </div>

        </div>

    );

}

export default Login;