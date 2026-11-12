import { useEffect, useState } from "react";

import DashboardLayout from "../../components/layout/DashboardLayout";
import StatCard from "../../components/ui/StatCard";

import api from "../../services/api";

import {
    FaFolderOpen,
    FaFileAlt,
    FaCube,
    FaClock
} from "react-icons/fa";


function UserDashboard() {

    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    useEffect(() => {

        const fetchDashboardData = async () => {

            try {

                const token = localStorage.getItem("token");

                const response = await api.get(
                    "/dashboard/user",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                console.log(
                    "User Dashboard Data:",
                    response.data
                );

                setDashboardData(response.data);

            } catch (error) {

                console.error(
                    "Dashboard Error:",
                    error
                );

                setError(
                    error.response?.data?.detail ||
                    "Unable to load dashboard data."
                );

            } finally {

                setLoading(false);

            }

        };

        fetchDashboardData();

    }, []);


    if (loading) {

        return (

            <DashboardLayout>

                <h2>Loading dashboard...</h2>

            </DashboardLayout>

        );

    }


    if (error) {

        return (

            <DashboardLayout>

                <h2>Unable to load dashboard</h2>

                <p>{error}</p>

            </DashboardLayout>

        );

    }


    return (

        <DashboardLayout>

            <h1>Dashboard</h1>

            <div
                style={{

                    display: "grid",

                    gridTemplateColumns: "repeat(4, 1fr)",

                    gap: "20px",

                    marginTop: "30px"

                }}
            >

                <StatCard
                    title="Cases"
                    value={dashboardData?.total_cases ?? 0}
                    icon={<FaFolderOpen />}
                    color="#2563EB"
                />


                <StatCard
                    title="Evidence"
                    value={dashboardData?.total_evidence ?? 0}
                    icon={<FaFileAlt />}
                    color="#0EA5E9"
                />


                <StatCard
                    title="Registered"
                    value={dashboardData?.registered_evidence ?? 0}
                    icon={<FaCube />}
                    color="#22C55E"
                />


                <StatCard
                    title="Pending"
                    value={dashboardData?.pending_decision ?? 0}
                    icon={<FaClock />}
                    color="#F59E0B"
                />

            </div>

        </DashboardLayout>

    );

}

export default UserDashboard;