import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import axios from 'axios';

// Use relative URL since we're using nginx proxy
axios.defaults.baseURL = '';

function App() {
  const [tasks, setTasks] = useState([]);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState(null);
  const [currentTask, setCurrentTask] = useState({
    title: '',
    description: '',
    status: 'pending',
  });

  useEffect(() => {
    console.log('App mounted');
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      console.log('Fetching tasks...');
      const response = await axios.get('/api/tasks');
      console.log('Tasks response:', response.data);
      const tasksData = response.data?.data || response.data || [];
      setTasks(Array.isArray(tasksData) ? tasksData : []);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setError(error.message);
      setTasks([]);
    }
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setCurrentTask({
      title: '',
      description: '',
      status: 'pending',
    });
  };

  const handleSubmit = async () => {
    try {
      if (!currentTask.title.trim()) {
        setError('Title is required');
        return;
      }
      console.log('Submitting task:', currentTask);
      const response = await axios.post('/api/tasks', currentTask);
      console.log('Task created:', response.data);
      handleClose();
      fetchTasks();
    } catch (error) {
      console.error('Error creating task:', error);
      setError(error.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      console.log('Deleting task:', id);
      await axios.delete('/api/tasks/' + id);
      fetchTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
      setError(error.message);
    }
  };

  if (error) {
    return (
      <Container maxWidth="md">
        <Box sx={{ my: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom color="error">
            Error: {error}
          </Typography>
          <Button variant="contained" onClick={() => setError(null)} sx={{ mt: 2 }}>
            Dismiss Error
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Task Manager
        </Typography>
        <Button variant="contained" onClick={handleOpen} sx={{ mb: 2 }}>
          Add Task
        </Button>
        <List>
          {Array.isArray(tasks) && tasks.length > 0 ? (
            tasks.map((task) => (
              <ListItem
                key={task.id}
                secondaryAction={
                  <Button
                    color="error"
                    onClick={() => handleDelete(task.id)}
                  >
                    Delete
                  </Button>
                }
              >
                <ListItemText
                  primary={task.title}
                  secondary={
                    <>
                      {task.description}
                      <br />
                      Status: {task.status}
                    </>
                  }
                />
              </ListItem>
            ))
          ) : (
            <Typography>No tasks available</Typography>
          )}
        </List>
      </Box>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add New Task</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Title"
            fullWidth
            value={currentTask.title}
            onChange={(e) =>
              setCurrentTask({ ...currentTask, title: e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="Description"
            fullWidth
            multiline
            rows={4}
            value={currentTask.description}
            onChange={(e) =>
              setCurrentTask({ ...currentTask, description: e.target.value })
            }
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Status</InputLabel>
            <Select
              value={currentTask.status}
              label="Status"
              onChange={(e) =>
                setCurrentTask({ ...currentTask, status: e.target.value })
              }
            >
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="in_progress">In Progress</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default App; 