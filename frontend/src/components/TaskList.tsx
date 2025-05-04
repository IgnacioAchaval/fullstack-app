import React, { useEffect, useState } from 'react';
import { Task } from '../types';
import axios from 'axios';
import { List, Typography, Box } from '@mui/material';
import { Task as TaskComponent } from './Task';

export const TaskList: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get('/api/tasks');
      setTasks(response.data.data || []);
      setError(null);
    } catch (err) {
      setError('Error loading tasks');
      setTasks([]);
    }
  };

  const handleDelete = async (taskId: string) => {
    try {
      await axios.delete(`/api/tasks/${taskId}`);
      setTasks(tasks.filter(task => task.id !== taskId));
      setError(null);
    } catch (err) {
      setError('Error deleting task');
    }
  };

  const handleStatusUpdate = async (taskId: string, newStatus: 'pending' | 'completed') => {
    try {
      const response = await axios.put(`/api/tasks/${taskId}`, { status: newStatus });
      setTasks(tasks.map(task => 
        task.id === taskId ? response.data.data : task
      ));
      setError(null);
    } catch (err) {
      setError('Error updating task');
    }
  };

  if (error) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2 }}>
      <List>
        {tasks.map(task => (
          <TaskComponent
            key={task.id}
            task={task}
            onDelete={handleDelete}
            onStatusUpdate={handleStatusUpdate}
          />
        ))}
      </List>
    </Box>
  );
}; 