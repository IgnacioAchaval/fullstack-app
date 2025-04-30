import React from 'react';
import { Task as TaskType } from '../types';

interface TaskProps {
  task: TaskType;
  onUpdate: (task: TaskType) => void;
  onDelete: (id: number) => void;
}

export const Task: React.FC<TaskProps> = ({ task, onUpdate, onDelete }) => {
  const handleToggleComplete = () => {
    onUpdate({
      ...task,
      completed: !task.completed
    });
  };

  const handleDelete = () => {
    onDelete(task.id);
  };

  return (
    <div className="task">
      <div className="task-content">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={handleToggleComplete}
          aria-label={`Mark ${task.title} as ${task.completed ? 'incomplete' : 'complete'}`}
        />
        <div className="task-text">
          <h3>{task.title}</h3>
          <p>{task.description}</p>
        </div>
      </div>
      <button
        onClick={handleDelete}
        className="delete-button"
        aria-label={`Delete ${task.title}`}
      >
        Delete
      </button>
    </div>
  );
}; 