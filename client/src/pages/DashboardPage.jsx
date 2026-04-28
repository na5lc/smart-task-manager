import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const DashboardPage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentTasks, setRecentTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [analyticsRes, tasksRes] = await Promise.all([
          api.get('/analytics'),
          api.get('/tasks')
        ]);
        setStats(analyticsRes.data.overview);
        setRecentTasks(tasksRes.data.tasks.slice(0, 5));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
      <div style={{ fontSize: '18px', color: '#667eea' }}>Loading dashboard...</div>
    </div>
  );

  const statCards = [
    { label: 'Total Tasks', value: stats?.total || 0, color: '#667eea', icon: '📋' },
    { label: 'Completed', value: stats?.completed || 0, color: '#059669', icon: '✅' },
    { label: 'In Progress', value: stats?.inProgress || 0, color: '#2563eb', icon: '🔄' },
    { label: 'Overdue', value: stats?.overdue || 0, color: '#dc2626', icon: '⚠️' },
  ];

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ margin: 0, color: '#1a1a2e', fontSize: '28px' }}>
          Welcome back, {user?.name}! 👋
        </h1>
        <p style={{ color: '#6b7280', marginTop: '0.5rem' }}>
          Here's your productivity overview
        </p>
      </div>

      {/* Stat Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        {statCards.map((card) => (
          <div key={card.label} style={{
            background: 'white',
            borderRadius: '12px',
            padding: '1.5rem',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            borderLeft: `4px solid ${card.color}`
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{card.icon}</div>
            <div style={{ fontSize: '2rem', fontWeight: '700', color: card.color }}>
              {card.value}
            </div>
            <div style={{ color: '#6b7280', fontSize: '14px' }}>{card.label}</div>
          </div>
        ))}
      </div>

      {/* Completion Rate */}
      <div style={{
        background: 'white',
        borderRadius: '12px',
        padding: '1.5rem',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        marginBottom: '2rem'
      }}>
        <h3 style={{ margin: '0 0 1rem', color: '#1a1a2e' }}>Completion Rate</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            flex: 1, height: '12px',
            background: '#f3f4f6', borderRadius: '6px', overflow: 'hidden'
          }}>
            <div style={{
              height: '100%',
              width: `${stats?.completionRate || 0}%`,
              background: 'linear-gradient(135deg, #667eea, #764ba2)',
              borderRadius: '6px',
              transition: 'width 1s ease'
            }} />
          </div>
          <span style={{ fontWeight: '700', color: '#667eea', minWidth: '48px' }}>
            {stats?.completionRate || 0}%
          </span>
        </div>
        <p style={{ color: '#6b7280', fontSize: '14px', marginTop: '0.5rem' }}>
          {stats?.completedThisWeek || 0} tasks completed this week
        </p>
      </div>

      {/* Recent Tasks */}
      <div style={{
        background: 'white',
        borderRadius: '12px',
        padding: '1.5rem',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3 style={{ margin: 0, color: '#1a1a2e' }}>Recent Tasks</h3>
          <Link to="/tasks" style={{ color: '#667eea', textDecoration: 'none', fontSize: '14px' }}>
            View all →
          </Link>
        </div>

        {recentTasks.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#9ca3af' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📝</div>
            <p>No tasks yet. <Link to="/tasks" style={{ color: '#667eea' }}>Create your first task!</Link></p>
          </div>
        ) : (
          recentTasks.map(task => (
            <div key={task._id} style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '0.75rem 0',
              borderBottom: '1px solid #f3f4f6'
            }}>
              <div>
                <span style={{
                  fontWeight: '500',
                  color: task.status === 'completed' ? '#9ca3af' : '#1a1a2e',
                  textDecoration: task.status === 'completed' ? 'line-through' : 'none'
                }}>
                  {task.title}
                </span>
                <span style={{
                  marginLeft: '0.5rem',
                  fontSize: '12px',
                  color: '#9ca3af'
                }}>
                  {task.category}
                </span>
              </div>
              <span style={{
                padding: '2px 10px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: '600',
                background: task.priority === 'High' ? '#fee2e2' :
                  task.priority === 'Medium' ? '#fef3c7' : '#d1fae5',
                color: task.priority === 'High' ? '#dc2626' :
                  task.priority === 'Medium' ? '#d97706' : '#059669'
              }}>
                {task.priority}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DashboardPage;