import { FaBell } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";

function Navbar() {

    return (

        <header className="navbar">

            <h3>

                Welcome Back 👋

            </h3>

            <div>

                🔔

                {" "}

                Sadiya

            </div>

        </header>

    );

}

export default Navbar;