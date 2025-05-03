import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Task } from './types';
import { API_URL } from './config';

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState({ title: '', description: '' });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingTaskIds, setDeletingTaskIds] = useState<number[]>([]);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setError(null);
      setIsLoading(true);
      console.log('Fetching tasks from:', `${API_URL}/tasks`);
      const response = await axios.get(`${API_URL}/tasks`);
      console.log('Tasks response:', response.data);
      setTasks(response.data.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      if (axios.isAxiosError(error)) {
        console.error('Axios error details:', {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          config: {
            url: error.config?.url,
            method: error.config?.method,
            headers: error.config?.headers
          }
        });
        setError(`Failed to fetch tasks: ${error.response?.statusText || error.message}`);
      } else {
        setError('Failed to fetch tasks. Please try again later.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const addTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.title.trim()) {
      setError('Title is required');
      return;
    }

    try {
      setError(null);
      console.log('Adding task:', newTask);
      const response = await axios.post(`${API_URL}/tasks`, newTask);
      console.log('Add task response:', response.data);
      setTasks([response.data.data, ...tasks]);
      setNewTask({ title: '', description: '' });
    } catch (error) {
      console.error('Error adding task:', error);
      if (axios.isAxiosError(error)) {
        setError(`Failed to add task: ${error.response?.statusText || error.message}`);
      } else {
        setError('Failed to add task. Please try again later.');
      }
    }
  };

  const toggleTaskStatus = async (task: Task) => {
    try {
      setError(null);
      console.log('Toggling task status:', task.id);
      const response = await axios.put(`${API_URL}/tasks/${task.id}`, {
        ...task,
        completed: !task.completed
      });
      console.log('Toggle status response:', response.data);
      setTasks(tasks.map(t => t.id === task.id ? response.data.data : t));
    } catch (error) {
      console.error('Error toggling task status:', error);
      if (axios.isAxiosError(error)) {
        setError(`Failed to update task: ${error.response?.statusText || error.message}`);
      } else {
        setError('Failed to update task. Please try again later.');
      }
    }
  };

  const deleteTask = async (id: number) => {
    try {
      setError(null);
      console.log('Deleting task:', id);
      setTasks(tasks.filter(task => task.id !== id));
      await axios.delete(`${API_URL}/tasks/${id}`);
    } catch (error) {
      console.error('Error deleting task:', error);
      if (axios.isAxiosError(error)) {
        setError(`Failed to delete task: ${error.response?.statusText || error.message}`);
        await fetchTasks();
      } else {
        setError('Failed to delete task. Please try again later.');
        await fetchTasks();
      }
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h1>Task Manager</h1>
      
      {error && (
        <div style={{ 
          padding: '10px', 
          marginBottom: '20px', 
          backgroundColor: '#ffebee', 
          color: '#c62828',
          borderRadius: '4px'
        }}>
          {error}
        </div>
      )}

      <form onSubmit={addTask} style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
          <input
            type="text"
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            placeholder="Task title"
            style={{ padding: '8px', flex: 1 }}
          />
          <input
            type="text"
            value={newTask.description}
            onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
            placeholder="Task description"
            style={{ padding: '8px', flex: 1 }}
          />
          <button type="submit" style={{ padding: '8px 16px' }}>
            Add Task
          </button>
        </div>
      </form>

      {isLoading ? (
        <div>Loading tasks...</div>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', padding: '8px', borderBottom: '2px solid #ddd' }}>Title</th>
              <th style={{ textAlign: 'left', padding: '8px', borderBottom: '2px solid #ddd' }}>Description</th>
              <th style={{ textAlign: 'left', padding: '8px', borderBottom: '2px solid #ddd' }}>Status</th>
              <th style={{ textAlign: 'left', padding: '8px', borderBottom: '2px solid #ddd' }}>Created At</th>
              <th style={{ textAlign: 'left', padding: '8px', borderBottom: '2px solid #ddd' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map(task => (
              <tr key={task.id} style={{ opacity: deletingTaskIds.includes(task.id) ? 0.5 : 1 }}>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>{task.title}</td>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>{task.description}</td>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                  <button
                    onClick={() => toggleTaskStatus(task)}
                    style={{
                      padding: '4px 8px',
                      backgroundColor: task.completed ? '#4caf50' : '#ff9800',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                  {task.completed ? 'Completed' : 'Pending'}
                  </button>
                </td>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                  {new Date(task.created_at).toLocaleDateString()}
                </td>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                  <button
                    onClick={() => deleteTask(task.id)}
                    style={{ padding: '4px 8px', color: 'red' }}
                    disabled={deletingTaskIds.includes(task.id)}
                  >
                    {deletingTaskIds.includes(task.id) ? 'Deleting...' : 'Delete'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default App; 