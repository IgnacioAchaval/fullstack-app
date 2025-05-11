import React from 'react';
import { ListItem, ListItemText, ListItemSecondaryAction, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';

const Task = ({ task, onDelete, onStatusUpdate }) => {
  const handleStatusToggle = async () => {
    const newStatus = task.status === 'pending' ? 'completed' : 'pending';
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

export default Task; 