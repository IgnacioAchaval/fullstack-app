import React from 'react';
import { Task as TaskType } from '../types';
import { Box, Card, CardContent, Typography, Button, IconButton } from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';

interface TaskProps {
  task: TaskType;
  onUpdate: (task: TaskType) => void;
  onDelete: (id: string) => void;
}

export const Task: React.FC<TaskProps> = ({ task, onUpdate, onDelete }) => {
  const handleStatusToggle = () => {
    onUpdate({
      ...task,
      status: task.status === 'completed' ? 'pending' : 'completed'
    });
  };

  return (
    <Card>
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
              onClick={handleStatusToggle}
              data-testid={`status-button-${task.id}`}
            >
              {task.status}
            </Button>
            <IconButton
              onClick={() => onDelete(task.id)}
              data-testid={`delete-task-${task.id}`}
              aria-label={`Delete ${task.title}`}
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}; 