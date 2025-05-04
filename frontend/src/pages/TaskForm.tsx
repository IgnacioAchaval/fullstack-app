import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Box,
  Button,
  TextField,
  Typography,
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import axios from 'axios';
import { Task, CreateTaskDTO, UpdateTaskDTO } from '../types';
import { API_BASE_URL } from '../config';

export default function TaskForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<CreateTaskDTO>({
    title: '',
    description: '',
    status: 'pending'
  });

  const { data: task, isLoading } = useQuery<Task>({
    queryKey: ['task', id],
    queryFn: async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/tasks/${id}`);
        return response.data.data as Task;
      } catch (error: any) {
        setError(error.response?.data?.message || 'Failed to fetch task');
        throw error;
      }
    },
    enabled: !!id
  });

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description || '',
        status: task.status
      });
    }
  }, [task]);

  const createTask = useMutation<unknown, Error, CreateTaskDTO>({
    mutationFn: async (data) => {
      const response = await axios.post(`${API_BASE_URL}/tasks`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      navigate('/');
    },
    onError: (error: any) => {
      setError(error.response?.data?.message || 'Failed to create task');
    }
  });

  const updateTask = useMutation<unknown, Error, UpdateTaskDTO>({
    mutationFn: async (data) => {
      const response = await axios.put(`${API_BASE_URL}/tasks/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      navigate('/');
    },
    onError: (error: any) => {
      setError(error.response?.data?.message || 'Failed to update task');
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setError('Title is required');
      return;
    }
    if (id) {
      updateTask.mutate(formData);
    } else {
      createTask.mutate(formData);
    }
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box component="form" onSubmit={handleSubmit} maxWidth="600px" mx="auto">
      <Typography variant="h4" gutterBottom>
        {id ? 'Edit Task' : 'Create Task'}
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <TextField
        fullWidth
        label="Title"
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        required
        margin="normal"
      />

      <TextField
        fullWidth
        label="Description"
        value={formData.description}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        multiline
        rows={4}
        margin="normal"
      />

      <FormControl fullWidth margin="normal">
        <InputLabel>Status</InputLabel>
        <Select
          value={formData.status}
          label="Status"
          onChange={(e) => setFormData({ ...formData, status: e.target.value as 'pending' | 'in_progress' | 'completed' })}
        >
          <MenuItem value="pending">Pending</MenuItem>
          <MenuItem value="in_progress">In Progress</MenuItem>
          <MenuItem value="completed">Completed</MenuItem>
        </Select>
      </FormControl>

      <Box mt={2}>
        <Button
          type="button"
          onClick={() => navigate('/')}
          sx={{ mr: 1 }}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="contained"
          color="primary"
        >
          {id ? 'Update' : 'Create'}
        </Button>
      </Box>
    </Box>
  );
} 