import React from 'react';
import { ListItem, ListItemText, ListItemSecondaryAction, Button, IconButton } from '@mui/material';
import { Task as TaskType } from '../types';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';

interface TaskProps {
  task: TaskType;
  onDelete: (id: string) => void;
  onStatusUpdate: (taskId: string, newStatus: 'pending' | 'completed') => Promise<void>;
}

export const Task: React.FC<TaskProps> = ({ task, onDelete, onStatusUpdate }) => {
  const handleStatusToggle = async () => {
    const newStatus = task.status === 'pending' ? 'completed' as const : 'pending' as const;
    await onStatusUpdate(task.id, newStatus);
  };

  return (
    <ListItem>
      <IconButton
        edge="start"
        onClick={handleStatusToggle}
        aria-label={`Toggle task status to ${task.status === 'pending' ? 'completed' : 'pending'}`}
      >
        {task.status === 'completed' ? <CheckCircleIcon color="success" /> : <RadioButtonUncheckedIcon />}
      </IconButton>
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
      <ListItemSecondaryAction>
        <IconButton
          edge="end"
          onClick={() => onDelete(task.id)}
          aria-label={`Delete task ${task.title}`}
          color="error"
        >
          <DeleteIcon />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  );
}; 