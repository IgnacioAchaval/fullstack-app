import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { List, Typography, Box } from '@mui/material';
import TaskComponent from './Task';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState(null);

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

  const handleDelete = async (taskId) => {
    try {
      await axios.delete(`/api/tasks/${taskId}`);
      setTasks(tasks.filter(task => task.id !== taskId));
      setError(null);
    } catch (err) {
      setError('Error deleting task');
    }
  };

  const handleStatusUpdate = async (taskId, newStatus) => {
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

export default TaskList; 