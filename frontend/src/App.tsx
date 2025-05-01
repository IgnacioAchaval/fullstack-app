import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Task } from './types';

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState({ title: '', description: '' });

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/tasks');
      setTasks(response.data.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const addTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.title.trim()) return;

    try {
      const response = await axios.post('http://localhost:3001/api/tasks', newTask);
      setTasks([response.data.data, ...tasks]);
      setNewTask({ title: '', description: '' });
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const deleteTask = async (id: number) => {
    try {
      await axios.delete(`http://localhost:3001/api/tasks/${id}`);
      setTasks(tasks.filter(task => task.id !== id));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h1>Task Manager</h1>
      
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
            <tr key={task.id}>
              <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>{task.title}</td>
              <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>{task.description}</td>
              <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                {task.completed ? 'Completed' : 'Pending'}
              </td>
              <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                {new Date(task.created_at).toLocaleDateString()}
              </td>
              <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                <button
                  onClick={() => deleteTask(task.id)}
                  style={{ padding: '4px 8px', color: 'red' }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App; 