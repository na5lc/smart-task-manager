import { useState } from 'react';

const TaskForm = ({ onSubmit, onClose }) => {
  const [form, setForm] = useState({
    title: '',
    description: '',
    priority: 'Medium',
    category: 'General',
    dueDate: '',
    tags: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const taskData = {
      ...form,
      tags: form.tags ? form.tags.split(',').map(t => t.trim()) : []
    };
    await onSubmit(taskData);
    setLoading(false);
    onClose();
  };

  const inputStyle = {
    width: '100%', padding: '0.75rem',
    border: '1px solid #ddd', borderRadius: '8px',
    fontSize: '16px', boxSizing: 'border-box'
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.5)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        background: 'white', borderRadius: '16px', padding: '2rem',
        width: '100%', maxWidth: '500px', maxHeight: '90vh',
        overflowY: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <h2 style={{ margin: 0, color: '#1a1a2e' }}>Create New Task</h2>
          <button onClick={onClose} style={{
            background: 'none', border: 'none',
            fontSize: '24px', cursor: 'pointer', color: '#6b7280'
          }}>×</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Title *</label>
            <input type="text" name="title" value={form.title} onChange={handleChange} required style={inputStyle} placeholder="e.g. Complete assignment urgently" />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} rows={3} style={{ ...inputStyle, resize: 'vertical' }} placeholder="Optional details..." />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Priority</label>
              <select name="priority" value={form.priority} onChange={handleChange} style={inputStyle}>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Category</label>
              <select name="category" value={form.category} onChange={handleChange} style={inputStyle}>
                <option value="General">General</option>
                <option value="Assignment">Assignment</option>
                <option value="Exam">Exam</option>
                <option value="Project">Project</option>
                <option value="Work">Work</option>
                <option value="Personal">Personal</option>
                <option value="Hobby">Hobby</option>
              </select>
            </div>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Due Date</label>
            <input type="date" name="dueDate" value={form.dueDate} onChange={handleChange} style={inputStyle} />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Tags (comma separated)</label>
            <input type="text" name="tags" value={form.tags} onChange={handleChange} style={inputStyle} placeholder="e.g. react, mongodb, urgent" />
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <button type="button" onClick={onClose} style={{
              flex: 1, padding: '0.875rem', background: '#f3f4f6',
              color: '#374151', border: 'none', borderRadius: '8px',
              fontSize: '16px', cursor: 'pointer'
            }}>Cancel</button>
            <button type="submit" disabled={loading} style={{
              flex: 1, padding: '0.875rem',
              background: loading ? '#9ca3af' : '#667eea',
              color: 'white', border: 'none', borderRadius: '8px',
              fontSize: '16px', fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}>{loading ? 'Creating...' : '🤖 Create with AI'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;