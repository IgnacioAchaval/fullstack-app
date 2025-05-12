import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import TaskComponent from '../../components/Task';

describe('Task Component', () => {
  const mockTask = {
    id: '1',
    title: 'Test Task',
    description: 'Test Description',
    status: 'pending',
    createdAt: '2024-03-20T12:00:00Z',
    updatedAt: '2024-03-20T12:00:00Z'
  };

  const mockOnDelete = jest.fn();
  const mockOnStatusUpdate = jest.fn();

  beforeEach(() => {
    mockOnDelete.mockClear();
    mockOnStatusUpdate.mockClear();
  });

  it('renders task details', () => {
    render(
      <TaskComponent
        task={mockTask}
        onDelete={mockOnDelete}
        onStatusUpdate={mockOnStatusUpdate}
      />
    );

    expect(screen.getByText('Test Task')).toBeInTheDocument();
    expect(screen.getByText(/Test Description/)).toBeInTheDocument();
    expect(screen.getByText(/Status: pending/)).toBeInTheDocument();
  });

  it('calls onDelete when delete button is clicked', () => {
    render(
      <TaskComponent
        task={mockTask}
        onDelete={mockOnDelete}
        onStatusUpdate={mockOnStatusUpdate}
      />
    );

    const deleteButton = screen.getByLabelText('Delete task Test Task');
    fireEvent.click(deleteButton);
    expect(mockOnDelete).toHaveBeenCalledWith('1');
  });

  it('calls onStatusUpdate when status is changed', () => {
    render(
      <TaskComponent
        task={mockTask}
        onDelete={mockOnDelete}
        onStatusUpdate={mockOnStatusUpdate}
      />
    );

    const statusButton = screen.getByLabelText('Toggle task status to completed');
    fireEvent.click(statusButton);
    expect(mockOnStatusUpdate).toHaveBeenCalledWith('1', 'completed');
  });
}); 