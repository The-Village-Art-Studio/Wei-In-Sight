import React from 'react';
import { Navigate, Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Admin.css';

const Admin = () => {
    const { user, loading, signOut } = useAuth();
    const navigate = useNavigate();

    const handleSignOut = async () => {
        await signOut();
        navigate('/admin/login');
    };

    if (loading) {
        return (
            <div className="admin-loading">
                <div className="loading-spinner"></div>
                <p>Loading...</p>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/admin/login" replace />;
    }

    return (
        <div className="admin-layout">
            <aside className="admin-sidebar">
                <div className="admin-sidebar-header">
                    <h2>WEI IN SIGHT</h2>
                    <span>Admin Panel</span>
                </div>

                <nav className="admin-nav">
                    <NavLink to="/admin" end className={({ isActive }) => isActive ? 'active' : ''}>
                        📊 Dashboard
                    </NavLink>
                    <NavLink to="/admin/hero" className={({ isActive }) => isActive ? 'active' : ''}>
                        🏠 Hero Section
                    </NavLink>
                    <NavLink to="/admin/about" className={({ isActive }) => isActive ? 'active' : ''}>
                        👤 About
                    </NavLink>
                    <NavLink to="/admin/gallery" className={({ isActive }) => isActive ? 'active' : ''}>
                        🖼️ Gallery
                    </NavLink>
                    <NavLink to="/admin/events" className={({ isActive }) => isActive ? 'active' : ''}>
                        📅 Events
                    </NavLink>
                    <NavLink to="/admin/shops" className={({ isActive }) => isActive ? 'active' : ''}>
                        🛒 Shops
                    </NavLink>
                    <NavLink to="/admin/seo" className={({ isActive }) => isActive ? 'active' : ''}>
                        🔍 SEO
                    </NavLink>
                </nav>

                <div className="admin-sidebar-footer">
                    <p className="admin-user">{user.email}</p>
                    <button onClick={handleSignOut} className="signout-button">
                        Sign Out
                    </button>
                </div>
            </aside>

            <main className="admin-main">
                <Outlet />
            </main>
        </div>
    );
};

export default Admin;
