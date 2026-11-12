import Sidebar from "../components/layout/Sidebar";
import Navbar from "../components/layout/Navbar";

import "../styles/layout.css";

function UserLayout({ children }) {

    return (
        <div className="dashboard-layout">

            <Sidebar />

            <div className="main-content">

                <Navbar />

                <div className="page-content">
                    {children}
                </div>

            </div>

        </div>
    );
}

export default UserLayout;