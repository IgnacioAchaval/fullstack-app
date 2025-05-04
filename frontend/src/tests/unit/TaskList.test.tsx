import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import TaskList from '../../pages/TaskList';
import axios from 'axios';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, expect, it, beforeEach, jest } from '@jest/globals';
import type { Mocked } from 'jest-mock';

jest.mock('axios');
const mockedAxios = axios as Mocked<typeof axios>;

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

describe('TaskList Component', () => {
  const mockTasks = [
    {
      id: '1',
      title: 'Test Task 1',
      description: 'Test Description 1',
      status: 'pending',
      dueDate: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: '2',
      title: 'Test Task 2',
      description: 'Test Description 2',
      status: 'completed',
      dueDate: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];

  beforeEach(() => {
    mockedAxios.get.mockResolvedValue({ data: { data: mockTasks } });
  });

  it('renders task list correctly', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <TaskList />
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Test Task 1')).toBeInTheDocument();
      expect(screen.getByText('Test Task 2')).toBeInTheDocument();
    });
  });

  it('handles task status toggle', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <TaskList />
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Test Task 1')).toBeInTheDocument();
    });

    const statusButton = screen.getByText('Pending');
    mockedAxios.put.mockResolvedValueOnce({ 
      data: { data: { ...mockTasks[0], status: 'completed' } } 
    });
    
    fireEvent.click(statusButton);
    
    await waitFor(() => {
      expect(screen.getByText('Completed')).toBeInTheDocument();
    });
  });

  it('handles task deletion', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <TaskList />
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Test Task 1')).toBeInTheDocument();
    });

    const deleteButton = screen.getAllByTestId('DeleteIcon')[0];
    mockedAxios.delete.mockResolvedValueOnce({ data: { data: null } });
    
    fireEvent.click(deleteButton);
    
    await waitFor(() => {
      expect(screen.queryByText('Test Task 1')).not.toBeInTheDocument();
    });
  });

  it('displays error message when API call fails', async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error('API Error'));

    render(
      <QueryClientProvider client={queryClient}>
        <TaskList />
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Failed to fetch tasks. Please try again later.')).toBeInTheDocument();
    });
  });
}); 