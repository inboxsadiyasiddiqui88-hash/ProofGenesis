import { useEffect, useState } from "react";
import {
    FaUserCircle,
    FaEnvelope,
    FaIdCard,
    FaShieldAlt,
    FaRedo,
    FaExclamationTriangle
} from "react-icons/fa";

import UserLayout from "../../layouts/UserLayout";

function Profile() {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // ==========================================
    // Fetch Profile
    // ==========================================

    const fetchProfile = async () => {
        try {
            setLoading(true);
            setError("");

            const token = localStorage.getItem("token");

            const response = await fetch(
                "http://127.0.0.1:8000/profile",
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.detail || "Failed to load profile"
                );
            }

            setProfile(data);
        } catch (err) {
            console.error(err);

            setError(
                err.message || "Unable to load profile."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    // ==========================================
    // Loading
    // ==========================================

    if (loading) {
        return (
            <UserLayout>
                <div className="profile-page">

                    <div className="profile-header">
                        <h1>Profile</h1>
                        <p>
                            Manage your account information.
                        </p>
                    </div>

                    <div className="profile-loading">
                        <div className="profile-spinner"></div>
                        <h3>Loading Profile...</h3>
                        <p>
                            Please wait while we load your account information.
                        </p>
                    </div>

                </div>

                <style>{`
                    .profile-loading {
                        background: #ffffff;
                        border-radius: 16px;
                        padding: 50px 30px;
                        margin-top: 30px;
                        text-align: center;
                        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
                    }

                    .profile-spinner {
                        width: 38px;
                        height: 38px;
                        border: 4px solid #e5e7eb;
                        border-top-color: #2563eb;
                        border-radius: 50%;
                        animation: profileSpin 0.8s linear infinite;
                        margin: 0 auto 18px;
                    }

                    .profile-loading h3 {
                        margin: 0;
                        color: #111827;
                    }

                    .profile-loading p {
                        margin-top: 8px;
                        color: #6b7280;
                    }

                    @keyframes profileSpin {
                        to {
                            transform: rotate(360deg);
                        }
                    }
                `}</style>
            </UserLayout>
        );
    }

    // ==========================================
    // Error
    // ==========================================

    if (error) {
        return (
            <UserLayout>
                <div className="profile-page">

                    <div className="profile-header">
                        <h1>Profile</h1>
                        <p>
                            Manage your account information.
                        </p>
                    </div>

                    <div className="profile-error">

                        <FaExclamationTriangle size={24} />

                        <div>
                            <h3>Unable to Load Profile</h3>
                            <p>{error}</p>
                        </div>

                    </div>

                    <button
                        onClick={fetchProfile}
                        className="profile-retry-button"
                    >
                        <FaRedo />
                        Try Again
                    </button>

                </div>

                <style>{`
                    .profile-error {
                        margin-top: 30px;
                        padding: 20px;
                        background: #fef2f2;
                        border: 1px solid #fecaca;
                        color: #b91c1c;
                        border-radius: 12px;
                        display: flex;
                        align-items: flex-start;
                        gap: 14px;
                    }

                    .profile-error h3 {
                        margin: 0;
                        font-size: 16px;
                    }

                    .profile-error p {
                        margin: 6px 0 0;
                        color: #dc2626;
                    }

                    .profile-retry-button {
                        margin-top: 15px;
                        border: none;
                        background: #2563eb;
                        color: white;
                        padding: 10px 16px;
                        border-radius: 8px;
                        cursor: pointer;
                        display: inline-flex;
                        align-items: center;
                        gap: 8px;
                        font-weight: 600;
                    }

                    .profile-retry-button:hover {
                        background: #1d4ed8;
                    }
                `}</style>
            </UserLayout>
        );
    }

    // ==========================================
    // Profile
    // ==========================================

    return (
        <UserLayout>
            <div className="profile-page">

                {/* Page Header */}
                <div className="profile-header">
                    <div>
                        <h1>Profile</h1>
                        <p>
                            Manage your account information.
                        </p>
                    </div>
                </div>

                {/* Profile Overview */}
                <div className="profile-overview">

                    <div className="profile-avatar">
                        <FaUserCircle size={58} />
                    </div>

                    <div>
                        <h2>
                            {profile.full_name || "User"}
                        </h2>

                        <p>
                            {profile.email || "Email not available"}
                        </p>

                        <span className="profile-role">
                            <FaShieldAlt size={12} />
                            {profile.role || "user"}
                        </span>
                    </div>

                </div>

                {/* Account Information */}
                <div className="profile-card">

                    <div className="profile-card-header">
                        <div className="profile-card-icon">
                            <FaUserCircle />
                        </div>

                        <div>
                            <h2>Account Information</h2>
                            <p>
                                Your registered account details
                            </p>
                        </div>
                    </div>

                    <div className="profile-details">

                        {/* Full Name */}
                        <div className="profile-detail">
                            <div className="detail-icon">
                                <FaUserCircle />
                            </div>

                            <div>
                                <span>Full Name</span>
                                <strong>
                                    {profile.full_name || "Not available"}
                                </strong>
                            </div>
                        </div>

                        {/* Email */}
                        <div className="profile-detail">
                            <div className="detail-icon">
                                <FaEnvelope />
                            </div>

                            <div>
                                <span>Email Address</span>
                                <strong>
                                    {profile.email || "Not available"}
                                </strong>
                            </div>
                        </div>

                        {/* User ID */}
                        <div className="profile-detail">
                            <div className="detail-icon">
                                <FaIdCard />
                            </div>

                            <div>
                                <span>User ID</span>
                                <strong className="user-id">
                                    {profile.user_id || "Not available"}
                                </strong>
                            </div>
                        </div>

                        {/* Role */}
                        <div className="profile-detail">
                            <div className="detail-icon">
                                <FaShieldAlt />
                            </div>

                            <div>
                                <span>Account Role</span>

                                <strong>
                                    <span className="role-badge">
                                        {profile.role || "user"}
                                    </span>
                                </strong>
                            </div>
                        </div>

                    </div>

                </div>

            </div>

            <style>{`
                .profile-page {
                    max-width: 1000px;
                    margin: 0 auto;
                }

                .profile-header h1 {
                    margin: 0;
                    color: #111827;
                    font-size: 30px;
                }

                .profile-header p {
                    margin: 8px 0 0;
                    color: #6b7280;
                    font-size: 15px;
                }

                .profile-overview {
                    margin-top: 28px;
                    background: linear-gradient(
                        135deg,
                        #2563eb,
                        #1d4ed8
                    );
                    color: white;
                    padding: 28px;
                    border-radius: 16px;
                    display: flex;
                    align-items: center;
                    gap: 20px;
                    box-shadow: 0 8px 24px rgba(37, 99, 235, 0.18);
                }

                .profile-avatar {
                    width: 82px;
                    height: 82px;
                    border-radius: 50%;
                    background: rgba(255, 255, 255, 0.16);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                }

                .profile-overview h2 {
                    margin: 0;
                    font-size: 24px;
                }

                .profile-overview p {
                    margin: 6px 0 12px;
                    opacity: 0.9;
                }

                .profile-role {
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    padding: 5px 10px;
                    border-radius: 20px;
                    background: rgba(255, 255, 255, 0.16);
                    font-size: 12px;
                    font-weight: 600;
                    text-transform: capitalize;
                }

                .profile-card {
                    margin-top: 24px;
                    background: white;
                    border-radius: 16px;
                    padding: 28px;
                    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
                }

                .profile-card-header {
                    display: flex;
                    align-items: center;
                    gap: 14px;
                    padding-bottom: 22px;
                    border-bottom: 1px solid #e5e7eb;
                }

                .profile-card-icon {
                    width: 42px;
                    height: 42px;
                    border-radius: 10px;
                    background: #eff6ff;
                    color: #2563eb;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 20px;
                }

                .profile-card-header h2 {
                    margin: 0;
                    color: #111827;
                    font-size: 19px;
                }

                .profile-card-header p {
                    margin: 4px 0 0;
                    color: #6b7280;
                    font-size: 13px;
                }

                .profile-details {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 18px;
                    margin-top: 24px;
                }

                .profile-detail {
                    display: flex;
                    align-items: center;
                    gap: 14px;
                    padding: 18px;
                    border: 1px solid #e5e7eb;
                    border-radius: 12px;
                    transition: all 0.2s ease;
                }

                .profile-detail:hover {
                    border-color: #bfdbfe;
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
                }

                .detail-icon {
                    width: 40px;
                    height: 40px;
                    border-radius: 9px;
                    background: #f3f4f6;
                    color: #4b5563;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                }

                .profile-detail div:last-child {
                    min-width: 0;
                }

                .profile-detail span:first-child {
                    display: block;
                    color: #6b7280;
                    font-size: 12px;
                    margin-bottom: 5px;
                }

                .profile-detail strong {
                    display: block;
                    color: #111827;
                    font-size: 14px;
                    overflow-wrap: anywhere;
                }

                .user-id {
                    font-family: monospace;
                    font-size: 12px !important;
                    color: #374151 !important;
                }

                .role-badge {
                    display: inline-block !important;
                    background: #dcfce7;
                    color: #166534 !important;
                    padding: 4px 10px;
                    border-radius: 20px;
                    font-size: 12px !important;
                    text-transform: capitalize;
                }

                @media (max-width: 700px) {
                    .profile-details {
                        grid-template-columns: 1fr;
                    }

                    .profile-overview {
                        padding: 22px;
                    }

                    .profile-avatar {
                        width: 65px;
                        height: 65px;
                    }

                    .profile-overview h2 {
                        font-size: 20px;
                    }
                }
            `}</style>
        </UserLayout>
    );
}

export default Profile;