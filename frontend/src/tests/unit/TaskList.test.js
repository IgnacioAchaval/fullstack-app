import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import TaskList from '../../components/TaskList';
import axios from 'axios';

// Mock axios
jest.mock('axios');

describe('TaskList Component', () => {
  const mockTasks = [
    {
      id: '1',
      title: 'Test Task 1',
      description: 'Test Description 1',
      status: 'pending',
      createdAt: '2024-03-20T12:00:00Z',
      updatedAt: '2024-03-20T12:00:00Z'
    }
  ];

  beforeEach(() => {
    axios.get.mockResolvedValue({ data: { data: mockTasks } });
    axios.delete.mockResolvedValue({ data: { data: [] } });
    axios.put.mockResolvedValue({ 
      data: { 
        data: { ...mockTasks[0], status: 'completed' } 
      } 
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders task list', async () => {
    render(<TaskList />);
    await waitFor(() => {
      expect(screen.getByText('Test Task 1')).toBeInTheDocument();
    });
  });

  it('handles task deletion', async () => {
    render(<TaskList />);
    await waitFor(() => {
      expect(screen.getByText('Test Task 1')).toBeInTheDocument();
    });

    const deleteButton = screen.getByLabelText('Delete task Test Task 1');
    fireEvent.click(deleteButton);
    await waitFor(() => {
      expect(axios.delete).toHaveBeenCalledWith('/api/tasks/1');
    });
  });

  it('handles status updates', async () => {
    render(<TaskList />);
    await waitFor(() => {
      expect(screen.getByText('Test Task 1')).toBeInTheDocument();
    });

    const statusButton = screen.getByLabelText('Toggle task status to completed');
    fireEvent.click(statusButton);
    await waitFor(() => {
      expect(axios.put).toHaveBeenCalledWith('/api/tasks/1', { status: 'completed' });
    });
  });

  it('displays error message when fetch fails', async () => {
    axios.get.mockRejectedValue(new Error('Failed to fetch'));
    render(<TaskList />);
    await waitFor(() => {
      expect(screen.getByText('Error loading tasks')).toBeInTheDocument();
    });
  });
}); 