import {
    FaHome,
    FaFolder,
    FaFileAlt,
    FaUser,
    FaSignOutAlt,
    FaFolderOpen,
    FaShieldAlt
} from "react-icons/fa";

import "./Sidebar.css";

function Sidebar() {

    return (

        <aside className="sidebar">

            <div>

                <div className="logo-container">

                    <FaShieldAlt className="logo-icon"/>

                    <div>

                        <h2>ProofGenesis</h2>

                        <p>Digital Evidence Platform</p>

                    </div>

                </div>

                <nav>

                    <a href="#">
                        <FaHome/>
                        Dashboard
                    </a>

                    <a href="#">
                        <FaFolder/>
                        My Cases
                    </a>

                    <a href="#">
                        <FaFolderOpen/>
                        My Evidence
                    </a>

                    <a href="#">
                        <FaFileAlt/>
                        AI Reports
                    </a>

                    <a href="#">
                        <FaUser/>
                        Profile
                    </a>

                </nav>

            </div>

            <button className="logout-btn">

                <FaSignOutAlt/>

                Logout

            </button>

        </aside>

    );

}

export default Sidebar;