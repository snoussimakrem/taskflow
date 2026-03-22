import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

interface Task {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  created_at: string;
}

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDesc, setNewTaskDesc] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch tasks from API
  const fetchTasks = async () => {
    try {
      // Using relative URL - nginx will proxy to backend
      const response = await axios.get('/api/tasks');
      setTasks(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch tasks');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Create new task
  const createTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    try {
      const response = await axios.post('/api/tasks', {
        title: newTaskTitle,
        description: newTaskDesc
      });
      setTasks([response.data, ...tasks]);
      setNewTaskTitle('');
      setNewTaskDesc('');
    } catch (err) {
      console.error('Error creating task:', err);
      alert('Failed to create task');
    }
  };

  // Toggle task completion
  const toggleTask = async (task: Task) => {
    try {
      const response = await axios.put(`/api/tasks/${task.id}`, {
        ...task,
        completed: !task.completed
      });
      setTasks(tasks.map(t => t.id === task.id ? response.data : t));
    } catch (err) {
      console.error('Error updating task:', err);
      alert('Failed to update task');
    }
  };

  // Delete task
  const deleteTask = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    
    try {
      await axios.delete(`/api/tasks/${id}`);
      setTasks(tasks.filter(t => t.id !== id));
    } catch (err) {
      console.error('Error deleting task:', err);
      alert('Failed to delete task');
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>📝 TaskFlow</h1>
        <p>Your Personal Task Management System</p>

        {/* Add Task Form */}
        <form onSubmit={createTask} style={{ marginTop: '2rem', width: '100%', maxWidth: '500px' }}>
          <div>
            <input
              type="text"
              placeholder="Task title..."
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              style={{ 
                padding: '12px', 
                width: '100%', 
                fontSize: '16px',
                borderRadius: '4px',
                border: '1px solid #61dafb',
                backgroundColor: '#fff',
                boxSizing: 'border-box'
              }}
              required
            />
          </div>
          <div style={{ marginTop: '10px' }}>
            <input
              type="text"
              placeholder="Description (optional)"
              value={newTaskDesc}
              onChange={(e) => setNewTaskDesc(e.target.value)}
              style={{ 
                padding: '12px', 
                width: '100%', 
                fontSize: '16px',
                borderRadius: '4px',
                border: '1px solid #ccc',
                boxSizing: 'border-box'
              }}
            />
          </div>
          <button 
            type="submit" 
            style={{ 
              padding: '12px 24px', 
              marginTop: '10px',
              fontSize: '16px',
              backgroundColor: '#61dafb',
              color: '#282c34',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            ➕ Add Task
          </button>
        </form>

        {/* Tasks List */}
        {loading ? (
          <p>Loading tasks...</p>
        ) : error ? (
          <p style={{ color: 'red' }}>❌ {error}</p>
        ) : (
          <div style={{ marginTop: '2rem', width: '100%', maxWidth: '600px' }}>
            <h3>Your Tasks ({tasks.length})</h3>
            {tasks.length === 0 ? (
              <p>✨ No tasks yet. Add your first task above!</p>
            ) : (
              tasks.map(task => (
                <div
                  key={task.id}
                  style={{
                    border: '1px solid #61dafb',
                    borderRadius: '8px',
                    padding: '1rem',
                    marginBottom: '1rem',
                    textAlign: 'left',
                    backgroundColor: 'rgba(97, 218, 251, 0.1)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ 
                        margin: 0, 
                        textDecoration: task.completed ? 'line-through' : 'none',
                        color: task.completed ? '#888' : '#fff'
                      }}>
                        {task.title}
                      </h3>
                      {task.description && (
                        <p style={{ margin: '0.5rem 0 0 0', color: '#ccc' }}>
                          {task.description}
                        </p>
                      )}
                      <small style={{ color: '#888', display: 'block', marginTop: '0.5rem' }}>
                        📅 Created: {new Date(task.created_at).toLocaleDateString()}
                      </small>
                    </div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button
                        onClick={() => toggleTask(task)}
                        style={{
                          padding: '8px 12px',
                          backgroundColor: task.completed ? '#28a745' : '#ffc107',
                          color: '#fff',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '14px'
                        }}
                      >
                        {task.completed ? '✓ Done' : '○ Pending'}
                      </button>
                      <button
                        onClick={() => deleteTask(task.id)}
                        style={{
                          padding: '8px 12px',
                          backgroundColor: '#dc3545',
                          color: '#fff',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '14px'
                        }}
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </header>
    </div>
  );
}

export default App;