import { useEffect, useState } from "react";

import {
    FaUserCircle
} from "react-icons/fa";

import { useAuth } from "../../context/AuthContext";

function Navbar() {

    const { user } = useAuth();

    const [profile, setProfile] =
        useState(null);


    useEffect(() => {

        const fetchProfile = async () => {

            try {

                const token =
                    localStorage.getItem("token");

                if (!token) {
                    return;
                }

                const response = await fetch(
                    "http://127.0.0.1:8000/profile",
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
                    return;
                }

                const data =
                    await response.json();

                setProfile(data);

            } catch (error) {

                console.error(
                    "Failed to load navbar profile:",
                    error
                );

            }

        };

        fetchProfile();

    }, []);


    const displayName =
        profile?.full_name ||
        user?.full_name ||
        "User";


    return (

        <header className="navbar">

            <div className="navbar-welcome">

                <h3>
                    Welcome back,{" "}
                    {displayName.split(" ")[0]} 👋
                </h3>

                <span>
                    Manage your digital evidence securely.
                </span>

            </div>


            <div className="navbar-profile">

                <div className="navbar-user">

                    <FaUserCircle
                        className="navbar-user-icon"
                    />

                    <div>

                        <strong>
                            {displayName}
                        </strong>

                        <span>
                            {user?.role === "investigator"
                                ? "Investigator"
                                : "User"}
                        </span>

                    </div>

                </div>

            </div>

        </header>

    );
}

export default Navbar;