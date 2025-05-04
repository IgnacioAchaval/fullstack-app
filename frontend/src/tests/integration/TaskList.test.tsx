import React from 'react';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import TaskList from '../../pages/TaskList';
import axios from 'axios';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, expect, it, beforeEach, jest } from '@jest/globals';
import type { Mocked } from 'jest-mock';
import { MemoryRouter } from 'react-router-dom';

jest.mock('axios');
const mockedAxios = axios as Mocked<typeof axios>;

describe('TaskList Integration', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
          cacheTime: 0,
          refetchOnWindowFocus: false,
        },
      },
    });
    jest.clearAllMocks();
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

  it('should render task list and handle task operations', async () => {
    // Mock initial tasks
    mockedAxios.get.mockResolvedValueOnce({
      data: {
        data: [
          {
            id: '1',
            title: 'Test Task 1',
            description: 'Test Description 1',
            status: 'pending',
            createdAt: '2024-03-20T12:00:00Z',
            updatedAt: '2024-03-20T12:00:00Z'
          }
        ]
      }
    });

    // Mock task status update
    mockedAxios.put.mockResolvedValueOnce({
      data: {
        data: {
          id: '1',
          title: 'Test Task 1',
          description: 'Test Description 1',
          status: 'completed',
          createdAt: '2024-03-20T12:00:00Z',
          updatedAt: '2024-03-20T12:00:00Z'
        }
      }
    });

    // Mock task deletion
    mockedAxios.delete.mockResolvedValueOnce({ data: { success: true } });

    // Mock task list after status update
    mockedAxios.get.mockResolvedValueOnce({
      data: {
        data: [
          {
            id: '1',
            title: 'Test Task 1',
            description: 'Test Description 1',
            status: 'completed',
            createdAt: '2024-03-20T12:00:00Z',
            updatedAt: '2024-03-20T12:00:00Z'
          }
        ]
      }
    });

    // Mock empty task list after deletion
    mockedAxios.get.mockResolvedValueOnce({
      data: {
        data: []
      }
    });

    renderWithProviders(<TaskList />);

    // Wait for loading to finish and check if task is rendered
    await waitFor(() => {
      const listItem = screen.getByRole('listitem');
      expect(within(listItem).getByText('Test Task 1')).toBeInTheDocument();
    }, { timeout: 10000 });

    // Toggle task status
    const toggleButton = screen.getByRole('button', { name: /toggle task status to completed/i });
    fireEvent.click(toggleButton);

    // Check if status is updated
    await waitFor(() => {
      const listItem = screen.getByRole('listitem');
      expect(within(listItem).getByText(/status: completed/i)).toBeInTheDocument();
    }, { timeout: 10000 });

    // Delete task
    const deleteButton = screen.getByRole('button', { name: /delete task test task 1/i });
    fireEvent.click(deleteButton);

    // Check if task is removed
    await waitFor(() => {
      expect(screen.queryByText('Test Task 1')).not.toBeInTheDocument();
    }, { timeout: 10000 });
  }, 30000); // Increase test timeout to 30 seconds
}); 