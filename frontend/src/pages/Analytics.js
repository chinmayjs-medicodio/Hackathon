import React, { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './Analytics.css';
import { getAnalytics } from '../services/api';
import BackButton from '../components/BackButton';
import { useToastContext } from '../context/ToastContext';

const Analytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7d');
  const toast = useToastContext();

  useEffect(() => {
    loadAnalytics();
  }, [timeRange]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const data = await getAnalytics(timeRange);
      setAnalytics(data);
    } catch (error) {
      console.error('Error loading analytics:', error);
      toast.error('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#6366f1', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444'];

  // Sample data structure
  const performanceData = analytics?.performance_over_time || [
    { date: 'Mon', views: 1200, engagement: 450, clicks: 320 },
    { date: 'Tue', views: 1900, engagement: 680, clicks: 510 },
    { date: 'Wed', views: 3000, engagement: 920, clicks: 720 },
    { date: 'Thu', views: 2780, engagement: 850, clicks: 680 },
    { date: 'Fri', views: 3890, engagement: 1200, clicks: 950 },
    { date: 'Sat', views: 2390, engagement: 750, clicks: 590 },
    { date: 'Sun', views: 3490, engagement: 1100, clicks: 890 }
  ];

  const platformData = analytics?.platform_performance || [
    { name: 'LinkedIn', value: 35, posts: 120 },
    { name: 'Twitter', value: 25, posts: 85 },
    { name: 'Instagram', value: 20, posts: 95 },
    { name: 'Facebook', value: 15, posts: 70 },
    { name: 'Reddit', value: 12, posts: 65 },
    { name: 'Email', value: 5, posts: 30 }
  ];

  const campaignData = analytics?.campaign_performance || [
    { name: 'Campaign A', impressions: 45000, clicks: 3200, conversions: 450 },
    { name: 'Campaign B', impressions: 38000, clicks: 2800, conversions: 380 },
    { name: 'Campaign C', impressions: 52000, clicks: 4100, conversions: 520 }
  ];

  if (loading) {
    return (
      <div className="analytics-page">
        <div className="container-wide">
          <div className="loading">Loading analytics...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="analytics-page">
      <div className="container-wide">
        <BackButton />
        <div className="analytics-header">
          <h1>Analytics & Performance</h1>
          <div className="header-controls">
            <select 
              value={timeRange} 
              onChange={(e) => setTimeRange(e.target.value)}
              className="time-range-select"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
            </select>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="metrics-grid">
          <div className="metric-card">
            <div className="metric-label">Total Impressions</div>
            <div className="metric-value">245.8K</div>
            <div className="metric-change positive">+12.5%</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Total Engagement</div>
            <div className="metric-value">18.2K</div>
            <div className="metric-change positive">+8.3%</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Click-Through Rate</div>
            <div className="metric-value">4.2%</div>
            <div className="metric-change positive">+0.5%</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Conversion Rate</div>
            <div className="metric-value">2.8%</div>
            <div className="metric-change positive">+0.3%</div>
          </div>
        </div>

        {/* Performance Over Time */}
        <div className="chart-card">
          <h2>Performance Over Time</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="views" stroke="#6366f1" name="Views" />
              <Line type="monotone" dataKey="engagement" stroke="#10b981" name="Engagement" />
              <Line type="monotone" dataKey="clicks" stroke="#f59e0b" name="Clicks" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="charts-row">
          {/* Platform Performance */}
          <div className="chart-card">
            <h2>Platform Performance</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={platformData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {platformData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Campaign Performance */}
          <div className="chart-card">
            <h2>Campaign Performance</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={campaignData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="impressions" fill="#6366f1" name="Impressions" />
                <Bar dataKey="clicks" fill="#10b981" name="Clicks" />
                <Bar dataKey="conversions" fill="#f59e0b" name="Conversions" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
