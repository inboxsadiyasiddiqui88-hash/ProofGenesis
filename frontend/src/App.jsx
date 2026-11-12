import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import CaseDetails from "./pages/user/CaseDetails";
import EvidenceDetails from "./pages/user/EvidenceDetails";
import Login from "./pages/auth/Login";

import Dashboard from "./pages/user/Dashboard";
import Cases from "./pages/user/Cases";
import Evidence from "./pages/user/Evidence";
import Reports from "./pages/user/Reports";
import Profile from "./pages/user/Profile";

import ProtectedRoute from "./components/auth/ProtectedRoute";
import Register from "./pages/auth/Register";
import Verification from "./pages/investigator/Verification";
import InvestigatorDashboard from "./pages/dashboard/InvestigatorDashboard";
import InvestigatorEvidenceDetails from "./pages/investigator/InvestigatorEvidenceDetails";

import { useAuth } from "./context/AuthContext";


// ==================================================
// USER-ONLY ROUTE
// ==================================================

function UserOnlyRoute() {

    const { user, loading } = useAuth();

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!user) {
        return <Navigate to="/" replace />;
    }

    if (user.role !== "user") {
        return <Navigate to="/investigator/dashboard" replace />;
    }

    return <ProtectedRoute />;
}


// ==================================================
// INVESTIGATOR-ONLY ROUTE
// ==================================================

function InvestigatorOnlyRoute() {

    const { user, loading } = useAuth();

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!user) {
        return <Navigate to="/" replace />;
    }

    if (user.role !== "investigator") {
        return <Navigate to="/dashboard" replace />;
    }

    return <ProtectedRoute />;
}


// ==================================================
// APP
// ==================================================

function App() {

    return (

        <BrowserRouter>

            <Routes>

                {/* =====================================
                    PUBLIC ROUTES
                ===================================== */}

                <Route
                    path="/"
                    element={<Login />}
                />

                <Route
                    path="/register"
                    element={<Register />}
                />


                {/* =====================================
                    USER-ONLY ROUTES
                ===================================== */}

                <Route element={<UserOnlyRoute />}>

                    <Route
                        path="/dashboard"
                        element={<Dashboard />}
                    />

                    <Route
                        path="/cases"
                        element={<Cases />}
                    />

                    <Route
                        path="/cases/:case_id"
                        element={<CaseDetails />}
                    />

                    <Route
                        path="/evidence"
                        element={<Evidence />}
                    />

                    <Route
                        path="/evidence/:evidence_id"
                        element={<EvidenceDetails />}
                    />

                    <Route
                        path="/reports"
                        element={<Reports />}
                    />

                    <Route
                        path="/profile"
                        element={<Profile />}
                    />

                </Route>


                {/* =====================================
                    INVESTIGATOR-ONLY ROUTES
                ===================================== */}

                <Route element={<InvestigatorOnlyRoute />}>

                    <Route
                        path="/investigator/dashboard"
                        element={<InvestigatorDashboard />}
                    />

                    <Route
                        path="/investigator/verification"
                        element={<Verification />}
                    />

                    {/* Investigator Evidence Details */}
                    <Route
                        path="/investigator/evidence/:evidence_id"
                        element={<InvestigatorEvidenceDetails />}
                    />

                </Route>


                {/* =====================================
                    FALLBACK
                ===================================== */}

                <Route
                    path="*"
                    element={<Navigate to="/" replace />}
                />

            </Routes>

        </BrowserRouter>

    );
}


export default App;