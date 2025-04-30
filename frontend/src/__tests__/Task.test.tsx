/** @jsx React.createElement */
import * as React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Task } from '../components/Task';

describe('Task Component', () => {
  const mockTask = {
    id: 1,
    title: 'Test Task',
    description: 'Test Description',
    completed: false,
    created_at: new Date(),
    updated_at: new Date()
  };

  const mockOnUpdate = jest.fn();
  const mockOnDelete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders task details correctly', () => {
    render(
      <Task
        task={mockTask}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText(mockTask.title)).toBeInTheDocument();
    expect(screen.getByText(mockTask.description)).toBeInTheDocument();
    expect(screen.getByRole('checkbox')).not.toBeChecked();
  });

  it('calls onUpdate when checkbox is clicked', () => {
    render(
      <Task
        task={mockTask}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
      />
    );

    fireEvent.click(screen.getByRole('checkbox'));

    expect(mockOnUpdate).toHaveBeenCalledWith({
      ...mockTask,
      completed: true
    });
  });

  it('calls onDelete when delete button is clicked', () => {
    render(
      <Task
        task={mockTask}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /delete/i }));

    expect(mockOnDelete).toHaveBeenCalledWith(mockTask.id);
  });

  it('renders completed task with checked checkbox', () => {
    const completedTask = { ...mockTask, completed: true };
    render(
      <Task
        task={completedTask}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByRole('checkbox')).toBeChecked();
  });
}); 