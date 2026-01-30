import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Dashboard.css';
import { getDashboardStats } from '../services/api';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalClients: 0,
    pendingContent: 0,
    approvedContent: 0,
    activeCampaigns: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const data = await getDashboardStats();
      setStats(data);
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    { icon: '➕', label: 'Onboard Client', path: '/onboard', color: 'primary' },
    { icon: '📝', label: 'Review Content', path: '/content', color: 'warning' },
    { icon: '📊', label: 'View Analytics', path: '/analytics', color: 'success' },
    { icon: '🎯', label: 'Manage Campaigns', path: '/campaigns', color: 'secondary' }
  ];

  return (
    <div className="dashboard-page">
      <div className="container-wide">
        <div className="dashboard-header">
          <h1>Dashboard</h1>
          <p>Welcome back! Here's what's happening with your marketing automation.</p>
        </div>

        {loading ? (
          <div className="loading">Loading dashboard...</div>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">👥</div>
                <div className="stat-info">
                  <div className="stat-value">{stats.totalClients}</div>
                  <div className="stat-label">Total Clients</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">⏳</div>
                <div className="stat-info">
                  <div className="stat-value">{stats.pendingContent}</div>
                  <div className="stat-label">Pending Content</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">✅</div>
                <div className="stat-info">
                  <div className="stat-value">{stats.approvedContent}</div>
                  <div className="stat-label">Approved Content</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">🎯</div>
                <div className="stat-info">
                  <div className="stat-value">{stats.activeCampaigns}</div>
                  <div className="stat-label">Active Campaigns</div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="quick-actions-section">
              <h2>Quick Actions</h2>
              <div className="quick-actions-grid">
                {quickActions.map((action, index) => (
                  <Link 
                    key={index} 
                    to={action.path}
                    className={`quick-action-card ${action.color}`}
                  >
                    <div className="quick-action-icon">{action.icon}</div>
                    <div className="quick-action-label">{action.label}</div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="recent-activity-section">
              <h2>Recent Activity</h2>
              <div className="activity-list">
                <div className="activity-item">
                  <div className="activity-icon">✅</div>
                  <div className="activity-content">
                    <div className="activity-title">Content approved for LinkedIn</div>
                    <div className="activity-time">2 hours ago</div>
                  </div>
                </div>
                <div className="activity-item">
                  <div className="activity-icon">📝</div>
                  <div className="activity-content">
                    <div className="activity-title">New content generated for Client ABC</div>
                    <div className="activity-time">5 hours ago</div>
                  </div>
                </div>
                <div className="activity-item">
                  <div className="activity-icon">🚀</div>
                  <div className="activity-content">
                    <div className="activity-title">Campaign launched successfully</div>
                    <div className="activity-time">1 day ago</div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
