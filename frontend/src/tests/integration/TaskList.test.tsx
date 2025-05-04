import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { TaskList } from '../../components/TaskList';
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

    // Mock task update
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

    renderWithProviders(<TaskList />);

    // Check if task is rendered
    await waitFor(() => {
      expect(screen.getByText('Test Task 1')).toBeInTheDocument();
    }, { timeout: 10000 });

    // Toggle task status
    const statusButton = screen.getByRole('button', { name: /toggle task status to completed/i });
    fireEvent.click(statusButton);

    await waitFor(() => {
      expect(screen.getByText(/Status: completed/)).toBeInTheDocument();
    }, { timeout: 10000 });

    // Delete task
    const deleteButton = screen.getByRole('button', { name: /delete task test task 1/i });
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(screen.queryByText('Test Task 1')).not.toBeInTheDocument();
    }, { timeout: 10000 });
  }, 15000);
}); 