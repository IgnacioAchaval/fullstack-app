/** @jsx React.createElement */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Task } from '../components/Task';
import { MemoryRouter } from 'react-router-dom';
import { Task as TaskType } from '../types';
import { describe, expect, it } from '@jest/globals';

describe('Task Component', () => {
  const renderWithRouter = (ui: React.ReactElement) => {
    return render(
      <MemoryRouter>
        {ui}
      </MemoryRouter>
    );
  };

  const mockTask: TaskType = {
    id: '1',
    title: 'Test Task',
    description: 'Test Description',
    status: 'pending',
    createdAt: '2024-03-20T12:00:00Z',
    updatedAt: '2024-03-20T12:00:00Z'
  };

  it('renders task details correctly', () => {
    const handleDelete = jest.fn();
    const handleStatusUpdate = jest.fn();

    renderWithRouter(
      <Task
        task={mockTask}
        onDelete={handleDelete}
        onStatusUpdate={handleStatusUpdate}
      />
    );

    expect(screen.getByText('Test Task')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
    expect(screen.getByText(/Status: pending/i)).toBeInTheDocument();
  });

  it('calls onStatusUpdate when status is toggled', () => {
    const handleDelete = jest.fn();
    const handleStatusUpdate = jest.fn();

    renderWithRouter(
      <Task
        task={mockTask}
        onDelete={handleDelete}
        onStatusUpdate={handleStatusUpdate}
      />
    );

    const statusButton = screen.getByRole('button', { name: /toggle task status to completed/i });
    fireEvent.click(statusButton);

    expect(handleStatusUpdate).toHaveBeenCalledWith({
      ...mockTask,
      status: 'completed'
    });
  });

  it('calls onDelete when delete button is clicked', () => {
    const handleDelete = jest.fn();
    const handleStatusUpdate = jest.fn();

    renderWithRouter(
      <Task
        task={mockTask}
        onDelete={handleDelete}
        onStatusUpdate={handleStatusUpdate}
      />
    );

    const deleteButton = screen.getByRole('button', { name: /delete task test task/i });
    fireEvent.click(deleteButton);

    expect(handleDelete).toHaveBeenCalledWith('1');
  });

  it('renders completed task correctly', () => {
    const handleDelete = jest.fn();
    const handleStatusUpdate = jest.fn();
    const completedTask = { ...mockTask, status: 'completed' as const };

    renderWithRouter(
      <Task
        task={completedTask}
        onDelete={handleDelete}
        onStatusUpdate={handleStatusUpdate}
      />
    );

    expect(screen.getByText(/Status: completed/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /toggle task status to pending/i })).toBeInTheDocument();
  });
}); 