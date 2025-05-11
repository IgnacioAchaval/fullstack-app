import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Box,
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Alert,
  Pagination,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import Task from '../components/Task';

const ITEMS_PER_PAGE = 5;

export default function TaskList() {
  const [open, setOpen] = useState(false);
  const [newTask, setNewTask] = useState({ 
    title: '', 
    description: '',
    status: 'pending'
  });
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: tasks, isLoading, error: fetchError } = useQuery({
    queryKey: ['tasks', page, search, filter],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: ITEMS_PER_PAGE.toString(),
        ...(search && { search }),
        ...(filter !== 'all' && { status: filter })
      });
      const response = await axios.get(`${API_BASE_URL}/tasks?${params}`);
      return response.data.data;
    }
  });

  const createTask = useMutation({
    mutationFn: async (task) => {
      const response = await axios.post(`${API_BASE_URL}/tasks`, task);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      setOpen(false);
      setNewTask({ title: '', description: '', status: 'pending' });
    },
    onError: (error) => {
      setError(error.response?.data?.message || 'Failed to create task');
    }
  });

  const deleteTask = useMutation({
    mutationFn: async (id) => {
      await axios.delete(`${API_BASE_URL}/tasks/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
    onError: (error) => {
      setError(error.response?.data?.message || 'Failed to delete task');
    }
  });

  const updateTask = useMutation({
    mutationFn: async ({ id, status }) => {
      const response = await axios.put(`${API_BASE_URL}/tasks/${id}`, { status });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
    onError: (error) => {
      setError(error.response?.data?.message || 'Failed to update task');
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newTask.title.trim()) {
      setError('Title is required');
      return;
    }
    createTask.mutate(newTask);
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
    setPage(1);
  };

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
    setPage(1);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleDelete = (id) => {
    deleteTask.mutate(id);
  };

  const handleStatusUpdate = async (taskId, newStatus) => {
    await updateTask.mutateAsync({ id: taskId, status: newStatus });
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (fetchError) {
    return (
      <Alert severity="error">
        Failed to fetch tasks. Please try again later.
      </Alert>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Tasks</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpen(true)}
        >
          Add Task
        </Button>
      </Box>

      <Box display="flex" gap={2} mb={3}>
        <TextField
          label="Search tasks"
          variant="outlined"
          size="small"
          value={search}
          onChange={handleSearchChange}
          sx={{ flexGrow: 1 }}
        />
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Filter</InputLabel>
          <Select
            value={filter}
            label="Filter"
            onChange={handleFilterChange}
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="completed">Completed</MenuItem>
            <MenuItem value="in_progress">In Progress</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box display="grid" gap={2}>
        {tasks?.map((task) => (
          <Task
            key={task.id}
            task={task}
            onStatusUpdate={handleStatusUpdate}
            onDelete={handleDelete}
          />
        ))}
      </Box>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <form onSubmit={handleSubmit}>
          <DialogTitle>Create New Task</DialogTitle>
          <DialogContent>
            <Box display="grid" gap={2} pt={1}>
              <TextField
                label="Title"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                fullWidth
                required
              />
              <TextField
                label="Description"
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                fullWidth
                multiline
                rows={3}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained">Save</Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
} 