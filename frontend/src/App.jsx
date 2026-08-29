import {

    Routes,
    Route

} from "react-router-dom";

import Login from "./pages/auth/Login";

import Dashboard from "./pages/user/Dashboard";

import ProtectedRoute from "./routes/ProtectedRoute";

function App() {

    return (

        <Routes>

            <Route

                path="/"

                element={<Login />}

            />

            <Route

                path="/dashboard"

                element={

                    <ProtectedRoute>

                        <Dashboard />

                    </ProtectedRoute>

                }

            />

        </Routes>

    );

}

export default App;