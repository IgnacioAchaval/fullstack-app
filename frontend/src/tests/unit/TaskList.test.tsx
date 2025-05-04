import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import TaskList from '../../pages/TaskList';
import axios from 'axios';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, expect, it, beforeEach, jest } from '@jest/globals';
import type { Mocked } from 'jest-mock';
import { MemoryRouter } from 'react-router-dom';

jest.mock('axios');
const mockedAxios = axios as Mocked<typeof axios>;

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        {ui}
      </MemoryRouter>
    </QueryClientProvider>
  );
};

describe('TaskList Component', () => {
  const mockTasks = [
    {
      id: '1',
      title: 'Test Task 1',
      description: 'Test Description 1',
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: '2',
      title: 'Test Task 2',
      description: 'Test Description 2',
      status: 'completed',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];

  beforeEach(() => {
    mockedAxios.get.mockResolvedValue({ data: { data: mockTasks } });
  });

  it('renders task list correctly', async () => {
    renderWithProviders(<TaskList />);

    await waitFor(() => {
      expect(screen.getByText('Tasks')).toBeInTheDocument();
      expect(screen.getByText('Add Task')).toBeInTheDocument();
    });

    expect(screen.getByText('Test Task 1')).toBeInTheDocument();
    expect(screen.getByText('Test Task 2')).toBeInTheDocument();
  });

  it('handles task status update', async () => {
    renderWithProviders(<TaskList />);

    await waitFor(() => {
      expect(screen.getByText('Test Task 1')).toBeInTheDocument();
    });

    const statusButton = screen.getByTestId('status-button-1');
    mockedAxios.put.mockResolvedValueOnce({ 
      data: { data: { ...mockTasks[0], status: 'completed' } } 
    });
    
    fireEvent.click(statusButton);
    
    await waitFor(() => {
      expect(mockedAxios.put).toHaveBeenCalledWith(
        expect.stringContaining('/tasks/1'),
        expect.objectContaining({ status: 'completed' })
      );
    });
  });

  it('handles task deletion', async () => {
    renderWithProviders(<TaskList />);

    await waitFor(() => {
      expect(screen.getByText('Test Task 1')).toBeInTheDocument();
    });

    const deleteButton = screen.getByTestId('delete-task-1');
    mockedAxios.delete.mockResolvedValueOnce({ data: { data: null } });
    
    fireEvent.click(deleteButton);
    
    await waitFor(() => {
      expect(mockedAxios.delete).toHaveBeenCalledWith(
        expect.stringContaining('/tasks/1')
      );
    });
  });

  it('displays error message when API call fails', async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error('API Error'));

    renderWithProviders(<TaskList />);

    await waitFor(() => {
      expect(screen.getByText('Failed to fetch tasks. Please try again later.')).toBeInTheDocument();
    });
  });
}); 