import DashboardLayout from "../../components/layout/DashboardLayout";

import StatCard from "../../components/ui/StatCard";

import {

FaFolderOpen,

FaFileAlt,

FaCube,

FaClock

} from "react-icons/fa";

function UserDashboard(){

return(

<DashboardLayout>

<h1>

Dashboard

</h1>

<div

style={{

display:"grid",

gridTemplateColumns:"repeat(4,1fr)",

gap:"20px",

marginTop:"30px"

}}

>

<StatCard

title="Cases"

value="12"

icon={<FaFolderOpen/>}

color="#2563EB"

/>

<StatCard

title="Evidence"

value="38"

icon={<FaFileAlt/>}

color="#0EA5E9"

/>

<StatCard

title="Registered"

value="20"

icon={<FaCube/>}

color="#22C55E"

/>

<StatCard

title="Pending"

value="18"

icon={<FaClock/>}

color="#F59E0B"

/>

</div>

</DashboardLayout>

);

}

export default UserDashboard;