import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

import api from "../../services/api";

import PrimaryButton from "../../components/ui/PrimaryButton";

import "../../styles/auth.css";

function Login() {

    const navigate = useNavigate();
    const { login } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async (e) => {

        e.preventDefault();

        console.log("Login button clicked");

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

            login(response.data.access_token);

            alert("Login Successful!");

            console.log(response.data);

            navigate("/dashboard");

        } catch (error) {

    console.log("FULL ERROR:", error);

    console.log("RESPONSE:", error.response);

    console.log("DATA:", error.response?.data);

    alert(
        error.response?.data?.detail ||
        error.message ||
        "Login Failed"
    );
}
    };

    return (

        <div>

            <h1 style={{ color: "red" }}>
                THIS IS MY LOGIN FILE
            </h1>

            <form onSubmit={handleLogin}>

                <input
                    type="email"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <input
                    type="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <PrimaryButton type="submit">
                    Sign In
                </PrimaryButton>

            </form>

        </div>

    );

}

export default Login;