import { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import api from '../api/axios';

const COLORS = ['#667eea', '#764ba2', '#f093fb', '#4facfe'];

const AnalyticsPage = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await api.get('/analytics');
        setAnalytics(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
      <div style={{ fontSize: '18px', color: '#667eea' }}>Loading analytics...</div>
    </div>
  );

  if (!analytics) return (
    <div style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>
      No analytics data available yet.
    </div>
  );

  const { overview, tasksByPriority, tasksByCategory, dailyStats, productivity } = analytics;

  // Convert tasksByPriority to chart format
  const priorityData = Object.entries(tasksByPriority || {}).map(([name, value]) => ({
    name, value
  }));

  // Convert tasksByCategory to chart format
  const categoryData = Object.entries(tasksByCategory || {}).map(([name, value]) => ({
    name, value
  }));

  return (
    <div style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto' }}>
      <h1 style={{ margin: '0 0 2rem', color: '#1a1a2e' }}>📊 Productivity Analytics</h1>

      {/* Key Metrics */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        <div style={{
          background: 'white', borderRadius: '12px', padding: '1.5rem',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)', borderLeft: '4px solid #667eea'
        }}>
          <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '0.5rem' }}>Completion Rate</div>
          <div style={{ fontSize: '2.5rem', fontWeight: '700', color: '#667eea' }}>
            {overview.completionRate}%
          </div>
        </div>
        <div style={{
          background: 'white', borderRadius: '12px', padding: '1.5rem',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)', borderLeft: '4px solid #059669'
        }}>
          <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '0.5rem' }}>Avg Completion Time</div>
          <div style={{ fontSize: '2.5rem', fontWeight: '700', color: '#059669' }}>
            {overview.avgCompletionTime}h
          </div>
        </div>
        <div style={{
          background: 'white', borderRadius: '12px', padding: '1.5rem',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)', borderLeft: '4px solid #2563eb'
        }}>
          <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '0.5rem' }}>This Week</div>
          <div style={{ fontSize: '2.5rem', fontWeight: '700', color: '#2563eb' }}>
            {overview.completedThisWeek} tasks
          </div>
        </div>
        <div style={{
          background: 'white', borderRadius: '12px', padding: '1.5rem',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)', borderLeft: '4px solid #f59e0b'
        }}>
          <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '0.5rem' }}>Productivity Peak</div>
          <div style={{ fontSize: '2rem', fontWeight: '700', color: '#f59e0b' }}>
            {productivity.mostProductiveHour}:00
          </div>
          <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '0.5rem' }}>
            {productivity.insight}
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
        gap: '2rem',
        marginBottom: '2rem'
      }}>
        {/* Daily Stats */}
        <div style={{
          background: 'white', borderRadius: '12px', padding: '1.5rem',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
        }}>
          <h3 style={{ margin: '0 0 1rem', color: '#1a1a2e' }}>Tasks Completed (Last 7 Days)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dailyStats || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="completed" stroke="#667eea" strokeWidth={2} dot={{ fill: '#667eea' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Priority Distribution */}
        <div style={{
          background: 'white', borderRadius: '12px', padding: '1.5rem',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
        }}>
          <h3 style={{ margin: '0 0 1rem', color: '#1a1a2e' }}>Tasks by Priority</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={priorityData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {priorityData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Category Distribution */}
        <div style={{
          background: 'white', borderRadius: '12px', padding: '1.5rem',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
        }}>
          <h3 style={{ margin: '0 0 1rem', color: '#1a1a2e' }}>Tasks by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={categoryData}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={100} />
              <Tooltip />
              <Bar dataKey="value" fill="#667eea" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Status Overview */}
        <div style={{
          background: 'white', borderRadius: '12px', padding: '1.5rem',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
        }}>
          <h3 style={{ margin: '0 0 1rem', color: '#1a1a2e' }}>Task Status Overview</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={[
                { name: 'Completed', value: overview.completed },
                { name: 'In Progress', value: overview.inProgress },
                { name: 'Pending', value: overview.pending },
                { name: 'Overdue', value: overview.overdue }
              ]}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#764ba2" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Insights */}
      <div style={{
        background: 'white', borderRadius: '12px', padding: '1.5rem',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
      }}>
        <h3 style={{ margin: '0 0 1rem', color: '#1a1a2e' }}>🎯 Your Insights</h3>
        <div style={{ display: 'grid', gap: '0.75rem', color: '#6b7280' }}>
          <p>✨ <strong>{productivity.insight}</strong></p>
          <p>📈 Your completion rate is <strong>{overview.completionRate}%</strong></p>
          <p>⏱️ You complete tasks in an average of <strong>{overview.avgCompletionTime} hours</strong></p>
          <p>🎯 You have <strong>{overview.overdue}</strong> overdue tasks</p>
          <p>✅ You completed <strong>{overview.completedThisWeek}</strong> tasks this week</p>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;