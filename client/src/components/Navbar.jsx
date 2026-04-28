import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '0 2rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      height: '64px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.2)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
        <h2 style={{ color: 'white', margin: 0, fontSize: '18px', fontWeight: '700' }}>
          Smart Task Manager
        </h2>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link to="/" style={{
            color: isActive('/') ? 'white' : 'rgba(255,255,255,0.7)',
            textDecoration: 'none',
            fontWeight: isActive('/') ? '600' : '400',
            borderBottom: isActive('/') ? '2px solid white' : 'none',
            paddingBottom: '2px'
          }}>
            Dashboard
          </Link>
          <Link to="/tasks" style={{
            color: isActive('/tasks') ? 'white' : 'rgba(255,255,255,0.7)',
            textDecoration: 'none',
            fontWeight: isActive('/tasks') ? '600' : '400',
            borderBottom: isActive('/tasks') ? '2px solid white' : 'none',
            paddingBottom: '2px'
          }}>
            Tasks
          </Link>
          <Link to="/analytics" style={{
            color: isActive('/analytics') ? 'white' : 'rgba(255,255,255,0.7)',
            textDecoration: 'none',
            fontWeight: isActive('/analytics') ? '600' : '400',
            borderBottom: isActive('/analytics') ? '2px solid white' : 'none',
            paddingBottom: '2px'
          }}>
            Analytics
          </Link>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <span style={{ color: 'rgba(255,255,255,0.9)', fontSize: '14px' }}>
          👋 {user?.name}
        </span>
        <button
          onClick={handleLogout}
          style={{
            background: 'rgba(255,255,255,0.2)',
            color: 'white',
            border: '1px solid rgba(255,255,255,0.4)',
            padding: '0.4rem 1rem',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;