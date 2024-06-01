import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

const Dashboard = () => {
    const { currentUser } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        // Redirect to login if user is not authenticated
        if (!currentUser) {
            navigate('/login', { replace: true });
        }
    }, [currentUser, navigate]);

    if (!currentUser) {
        // If user is not authenticated, do not render the dashboard
        return null;
    }

    return (
        <div>
            <h1>Dashboard</h1>
            {/* Dashboard content */}
        </div>
    );
};

export default Dashboard;
