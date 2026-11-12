import {
    FaHome,
    FaFolder,
    FaFileAlt,
    FaUser,
    FaSignOutAlt,
    FaFolderOpen,
    FaShieldAlt
} from "react-icons/fa";

import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

import "./Sidebar.css";

function Sidebar() {

    const navigate = useNavigate();
    const { logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    return (
        <aside className="sidebar">

            {/* BRAND */}
            <div>

                <div className="logo-container">

                    <div className="logo-icon-wrapper">
                        <FaShieldAlt className="logo-icon" />
                    </div>

                    <div>
                        <h2>ProofGenesis</h2>
                        <p>Digital Evidence Platform</p>
                    </div>

                </div>

                {/* NAVIGATION */}
                <nav>

                    <NavLink
                        to="/dashboard"
                        className={({ isActive }) =>
                            isActive ? "menu-item active" : "menu-item"
                        }
                    >
                        <FaHome />
                        <span>Dashboard</span>
                    </NavLink>

                    <NavLink
                        to="/cases"
                        className={({ isActive }) =>
                            isActive ? "menu-item active" : "menu-item"
                        }
                    >
                        <FaFolder />
                        <span>My Cases</span>
                    </NavLink>

                    <NavLink
                        to="/evidence"
                        className={({ isActive }) =>
                            isActive ? "menu-item active" : "menu-item"
                        }
                    >
                        <FaFolderOpen />
                        <span>My Evidence</span>
                    </NavLink>

                    <NavLink
                        to="/reports"
                        className={({ isActive }) =>
                            isActive ? "menu-item active" : "menu-item"
                        }
                    >
                        <FaFileAlt />
                        <span>AI Reports</span>
                    </NavLink>

                    <NavLink
                        to="/profile"
                        className={({ isActive }) =>
                            isActive ? "menu-item active" : "menu-item"
                        }
                    >
                        <FaUser />
                        <span>Profile</span>
                    </NavLink>

                </nav>

            </div>

            {/* LOGOUT */}
            <div className="sidebar-bottom">

                <button
                    className="logout-btn"
                    onClick={handleLogout}
                    type="button"
                >
                    <FaSignOutAlt />
                    <span>Logout</span>
                </button>

            </div>

        </aside>
    );
}

export default Sidebar;
