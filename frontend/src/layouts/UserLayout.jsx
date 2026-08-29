import Sidebar from "../components/layout/Sidebar";
import Navbar from "../components/layout/Navbar";

import "../styles/dashboard.css";

function UserLayout({ children }) {

    return (

        <div className="dashboard-container">

            <Sidebar />

            <div className="dashboard-content">

                <Navbar />

                <div className="dashboard-page">

                    {children}

                </div>

            </div>

        </div>

    );

}

export default UserLayout;