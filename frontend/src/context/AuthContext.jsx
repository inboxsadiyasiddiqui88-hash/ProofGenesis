import { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export function AuthProvider({ children }) {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);


    // -----------------------------------------
    // Restore login when application starts
    // -----------------------------------------

    useEffect(() => {

        const token = localStorage.getItem("token");

        console.log("AUTH CONTEXT TOKEN:", token ? "Token found" : "No token found");


        if (token) {

            try {

                const decoded = jwtDecode(token);

                console.log("AUTH CONTEXT USER:", decoded);

                // Check token expiration
                if (decoded.exp && decoded.exp * 1000 < Date.now()) {

                    console.log("TOKEN EXPIRED");

                    localStorage.removeItem("token");
                    setUser(null);

                } else {

                    setUser(decoded);

                }

            } catch (error) {

                console.error("Invalid token:", error);

                localStorage.removeItem("token");
                setUser(null);

            }

        } else {

            setUser(null);

        }

        setLoading(false);

    }, []);


    // -----------------------------------------
    // Login
    // -----------------------------------------

    const login = (token) => {

        try {

            localStorage.setItem("token", token);

            const decoded = jwtDecode(token);

            console.log("LOGIN USER:", decoded);

            setUser(decoded);

        } catch (error) {

            console.error("Login token error:", error);

            localStorage.removeItem("token");
            setUser(null);

        }

    };


    // -----------------------------------------
    // Logout
    // -----------------------------------------

    const logout = () => {

        localStorage.removeItem("token");

        setUser(null);

    };


    return (

        <AuthContext.Provider
            value={{
                user,
                login,
                logout,
                loading,
                isAuthenticated: !!user
            }}
        >

            {children}

        </AuthContext.Provider>

    );

}


export function useAuth() {

    return useContext(AuthContext);

}