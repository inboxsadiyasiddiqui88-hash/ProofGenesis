import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

import "../../styles/layout.css";

function DashboardLayout({children}){

    return(

        <div className="dashboard-layout">

            <Sidebar/>

            <div className="main-content">

                <Navbar/>

                <div className="page-content">

                    {children}

                </div>

            </div>

        </div>

    );

}

export default DashboardLayout;