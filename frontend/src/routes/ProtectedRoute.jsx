import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

console.log("🔥 PROTECTED ROUTE FILE LOADED");

function ProtectedRoute() {

    const {
        user,
        isAuthenticated,
        loading
    } = useAuth();

    console.log("PROTECTED ROUTE:");
    console.log("loading:", loading);
    console.log("user:", user);
    console.log("isAuthenticated:", isAuthenticated);

    if (loading) {

        return <h2>Checking authentication...</h2>;

    }

    if (!isAuthenticated) {

        console.log("REDIRECTING TO LOGIN");

        return <Navigate to="/" replace />;

    }

    return <Outlet />;

}

export default ProtectedRoute;