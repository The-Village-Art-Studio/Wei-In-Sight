import React from 'react';

const Dashboard = () => {
    return (
        <div>
            <div className="admin-page-header">
                <h1>Dashboard</h1>
                <p>Welcome to the Wei In Sight admin panel</p>
            </div>

            <div className="dashboard-stats">
                <div className="admin-card">
                    <h3>Quick Actions</h3>
                    <p style={{ color: 'var(--text-muted)', marginTop: '1rem' }}>
                        Use the sidebar navigation to manage different sections of your website.
                    </p>
                    <ul style={{ marginTop: '1rem', color: 'var(--text-color)', listStyle: 'none', lineHeight: '2' }}>
                        <li>🖼️ <strong>Gallery</strong> - Add/edit categories, series, and artworks</li>
                        <li>📅 <strong>Events</strong> - Manage upcoming shows and exhibitions</li>
                        <li>🛒 <strong>Shops</strong> - Update purchase links and platforms</li>
                        <li>👤 <strong>About</strong> - Edit your bio and exhibition history</li>
                        <li>🏠 <strong>Hero</strong> - Customize the homepage hero section</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
