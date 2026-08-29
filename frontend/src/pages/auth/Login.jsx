import { useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../../services/api";

import InputField from "../../components/ui/InputField";
import PasswordField from "../../components/ui/PasswordField";
import PrimaryButton from "../../components/ui/PrimaryButton";

import "../../styles/auth.css";

function Login() {

    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

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

            const response = await api.post("/login", {
                email,
                password
            });

            localStorage.setItem(
                "token",
                response.data.access_token
            );

            alert("Login Successful!");

            console.log(response.data);

            navigate("/dashboard");

        } catch (error) {

            console.error(error);

            alert(
                error.response?.data?.detail ||
                "Login Failed"
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
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                    />

                    <PasswordField
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <PrimaryButton type="submit">
                        Sign In
                    </PrimaryButton>

                </form>

            </div>

        </div>

    );

}

export default Login;