/** @jsx React.createElement */
import * as React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Task } from '../components/Task';
import { MemoryRouter } from 'react-router-dom';
import { Task as TaskType } from '../types';

describe('Task Component', () => {
  const mockTask: TaskType = {
    id: '1',
    title: 'Test Task',
    description: 'Test Description',
    status: 'pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  const mockOnUpdate = jest.fn();
  const mockOnDelete = jest.fn();

  const renderWithRouter = (ui: React.ReactElement) => {
    return render(
      <MemoryRouter>
        {ui}
      </MemoryRouter>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders task details correctly', () => {
    renderWithRouter(
      <Task
        task={mockTask}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText('Test Task')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
    expect(screen.getByTestId('status-button-1')).toBeInTheDocument();
  });

  it('calls onUpdate when status is changed', () => {
    renderWithRouter(
      <Task
        task={mockTask}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
      />
    );

    const statusButton = screen.getByTestId('status-button-1');
    fireEvent.click(statusButton);

    expect(mockOnUpdate).toHaveBeenCalledWith({
      ...mockTask,
      status: 'completed'
    });
  });

  it('calls onDelete when delete button is clicked', () => {
    renderWithRouter(
      <Task
        task={mockTask}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
      />
    );

    const deleteButton = screen.getByTestId('delete-task-1');
    fireEvent.click(deleteButton);

    expect(mockOnDelete).toHaveBeenCalledWith('1');
  });

  it('renders completed task correctly', () => {
    const completedTask: TaskType = { ...mockTask, status: 'completed' };
    renderWithRouter(
      <Task
        task={completedTask}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByTestId(`status-button-${completedTask.id}`)).toHaveTextContent('completed');
  });
}); 