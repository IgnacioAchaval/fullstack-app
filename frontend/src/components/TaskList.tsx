import React, { useEffect, useState } from 'react';
import { Task } from '../types';
import axios from 'axios';

export const TaskList: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get('/api/tasks');
      setTasks(response.data.data);
      setError(null);
    } catch (err) {
      setError('Error loading tasks');
    }
  };

  const toggleTaskCompletion = async (taskId: number, completed: boolean) => {
    try {
      const response = await axios.put(`/api/tasks/${taskId}`, { completed });
      setTasks(tasks.map(task => 
        task.id === taskId ? response.data.data : task
      ));
    } catch (err) {
      setError('Error updating task');
    }
  };

  const deleteTask = async (taskId: number) => {
    try {
      await axios.delete(`/api/tasks/${taskId}`);
      setTasks(tasks.filter(task => task.id !== taskId));
    } catch (err) {
      setError('Error deleting task');
    }
  };

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      {tasks.map(task => (
        <div key={task.id} style={{ marginBottom: '1rem' }}>
          <input
            type="checkbox"
            checked={task.completed}
            onChange={() => toggleTaskCompletion(task.id, !task.completed)}
          />
          <span style={{ marginLeft: '0.5rem' }}>{task.title}</span>
          <button
            onClick={() => deleteTask(task.id)}
            style={{ marginLeft: '0.5rem' }}
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}; 