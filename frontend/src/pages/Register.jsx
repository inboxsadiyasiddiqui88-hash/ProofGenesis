import { useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../../services/api";

import PrimaryButton from "../../components/ui/PrimaryButton";

import "../../styles/auth.css";

function Register() {

    const navigate = useNavigate();

    const [role, setRole] = useState("user");

    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [investigatorCode, setInvestigatorCode] = useState("");

    const handleRegister = async (e) => {

        e.preventDefault();

        if (!fullName.trim()) {
            alert("Please enter your full name.");
            return;
        }

        if (!email.trim()) {
            alert("Please enter your email.");
            return;
        }

        if (!password.trim()) {
            alert("Please enter a password.");
            return;
        }

        if (password.length < 8) {
            alert("Password must be at least 8 characters.");
            return;
        }

        if (role === "investigator" && !investigatorCode.trim()) {
            alert("Please enter the investigator registration code.");
            return;
        }

        try {

            if (role === "user") {

                await api.post("/register", {
                    full_name: fullName,
                    email: email,
                    password: password
                });

                alert("User registered successfully!");

            } else {

                await api.post("/investigator/register", {
                    full_name: fullName,
                    email: email,
                    password: password,
                    investigator_code: investigatorCode
                });

                alert("Investigator registered successfully!");
            }

            navigate("/");

        } catch (error) {

            console.log("FULL ERROR:", error);
            console.log("RESPONSE:", error.response);
            console.log("DATA:", error.response?.data);

            alert(
                error.response?.data?.detail ||
                error.message ||
                "Registration Failed"
            );
        }
    };

    return (

        <div>

            <h1>
                Register
            </h1>

            <div>

                <button
                    type="button"
                    onClick={() => setRole("user")}
                >
                    Register as User
                </button>

                <button
                    type="button"
                    onClick={() => setRole("investigator")}
                >
                    Register as Investigator
                </button>

            </div>

            <form onSubmit={handleRegister}>

                <input
                    type="text"
                    placeholder="Enter full name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                />

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

                {role === "investigator" && (

                    <input
                        type="text"
                        placeholder="Enter investigator registration code"
                        value={investigatorCode}
                        onChange={(e) => setInvestigatorCode(e.target.value)}
                    />

                )}

                <PrimaryButton type="submit">
                    Register
                </PrimaryButton>

            </form>

        </div>

    );
}

export default Register;