import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  IconButton,
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
  MenuItem,
  SelectChangeEvent
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Task, CreateTaskDTO } from '../types';
import { API_BASE_URL } from '../config';

const ITEMS_PER_PAGE = 5;

export default function TaskList() {
  const [open, setOpen] = useState(false);
  const [newTask, setNewTask] = useState<CreateTaskDTO>({ 
    title: '', 
    description: '',
    status: 'pending'
  });
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'pending' | 'in_progress' | 'completed'>('all');
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
      return response.data.data as Task[];
    }
  });

  const createTask = useMutation({
    mutationFn: async (task: CreateTaskDTO) => {
      const response = await axios.post(`${API_BASE_URL}/tasks`, task);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      setOpen(false);
      setNewTask({ title: '', description: '', status: 'pending' });
    },
    onError: (error: any) => {
      setError(error.response?.data?.message || 'Failed to create task');
    }
  });

  const deleteTask = useMutation({
    mutationFn: async (id: string) => {
      await axios.delete(`${API_BASE_URL}/tasks/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
    onError: (error: any) => {
      setError(error.response?.data?.message || 'Failed to delete task');
    }
  });

  const toggleTaskStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: 'pending' | 'in_progress' | 'completed' }) => {
      const response = await axios.put(`${API_BASE_URL}/tasks/${id}`, { status });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
    onError: (error: any) => {
      setError(error.response?.data?.message || 'Failed to update task');
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.title.trim()) {
      setError('Title is required');
      return;
    }
    createTask.mutate(newTask);
  };

  const handleFilterChange = (event: SelectChangeEvent) => {
    setFilter(event.target.value as 'all' | 'pending' | 'in_progress' | 'completed');
    setPage(1);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
    setPage(1);
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
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
          <Card key={task.id}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="h6">{task.title}</Typography>
                  <Typography color="textSecondary">{task.description}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    Created: {new Date(task.createdAt).toLocaleDateString()}
                  </Typography>
                </Box>
                <Box>
                  <Button
                    variant={task.status === 'completed' ? "contained" : "outlined"}
                    color={task.status === 'completed' ? "success" : "primary"}
                    onClick={() => toggleTaskStatus.mutate({ 
                      id: task.id, 
                      status: task.status === 'completed' ? 'pending' : 'completed' 
                    })}
                    sx={{ mr: 1 }}
                  >
                    {task.status === 'completed' ? 'Completed' : 'Mark Complete'}
                  </Button>
                  <IconButton
                    color="primary"
                    onClick={() => navigate(`/tasks/${task.id}/edit`)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => deleteTask.mutate(task.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>

      <Box display="flex" justifyContent="center" mt={3}>
        <Pagination
          count={Math.ceil((tasks?.length || 0) / ITEMS_PER_PAGE)}
          page={page}
          onChange={handlePageChange}
          color="primary"
        />
      </Box>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <form onSubmit={handleSubmit}>
          <DialogTitle>Add New Task</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Title"
              fullWidth
              value={newTask.title}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              required
            />
            <TextField
              margin="dense"
              label="Description"
              fullWidth
              multiline
              rows={4}
              value={newTask.description}
              onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
            />
            <FormControl fullWidth margin="dense">
              <InputLabel>Status</InputLabel>
              <Select
                value={newTask.status}
                label="Status"
                onChange={(e) => setNewTask({ ...newTask, status: e.target.value as 'pending' | 'in_progress' | 'completed' })}
              >
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="in_progress">In Progress</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained">Add Task</Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
} 