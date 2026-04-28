const priorityColors = {
  High: { bg: '#fee2e2', color: '#dc2626', border: '#fca5a5' },
  Medium: { bg: '#fef3c7', color: '#d97706', border: '#fcd34d' },
  Low: { bg: '#d1fae5', color: '#059669', border: '#6ee7b7' }
};

const statusColors = {
  pending: { bg: '#f3f4f6', color: '#6b7280' },
  'in-progress': { bg: '#dbeafe', color: '#2563eb' },
  completed: { bg: '#d1fae5', color: '#059669' }
};

const TaskCard = ({ task, onUpdate, onDelete }) => {
  const priority = priorityColors[task.priority] || priorityColors.Medium;
  const status = statusColors[task.status] || statusColors.pending;

  const formatDate = (date) => {
    if (!date) return 'No due date';
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric'
    });
  };

  const isOverdue = task.dueDate &&
    new Date(task.dueDate) < new Date() &&
    task.status !== 'completed';

  return (
    <div style={{
      background: 'white',
      borderRadius: '12px',
      padding: '1.25rem',
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
      border: `1px solid ${isOverdue ? '#fca5a5' : '#e5e7eb'}`,
      transition: 'transform 0.2s, box-shadow 0.2s'
    }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.12)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
        <h3 style={{
          margin: 0,
          fontSize: '16px',
          fontWeight: '600',
          color: task.status === 'completed' ? '#9ca3af' : '#1a1a2e',
          textDecoration: task.status === 'completed' ? 'line-through' : 'none',
          flex: 1,
          marginRight: '1rem'
        }}>
          {task.title}
        </h3>
        <span style={{
          background: priority.bg,
          color: priority.color,
          border: `1px solid ${priority.border}`,
          padding: '2px 10px',
          borderRadius: '20px',
          fontSize: '12px',
          fontWeight: '600',
          whiteSpace: 'nowrap'
        }}>
          {task.priority}
        </span>
      </div>

      {task.description && (
        <p style={{ color: '#6b7280', fontSize: '14px', margin: '0 0 0.75rem', lineHeight: '1.5' }}>
          {task.description}
        </p>
      )}

      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
        <span style={{
          background: '#f3f4f6',
          color: '#4b5563',
          padding: '2px 8px',
          borderRadius: '6px',
          fontSize: '12px'
        }}>
          {task.category}
        </span>
        {task.tags?.map(tag => (
          <span key={tag} style={{
            background: '#ede9fe',
            color: '#7c3aed',
            padding: '2px 8px',
            borderRadius: '6px',
            fon