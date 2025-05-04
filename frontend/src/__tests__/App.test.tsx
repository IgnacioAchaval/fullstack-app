import React from 'react';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from '../App';
import axios from 'axios';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, expect, it, beforeEach, jest } from '@jest/globals';
import type { Mocked } from 'jest-mock';
import { MemoryRouter } from 'react-router-dom';

jest.mock('axios');
const mockedAxios = axios as Mocked<typeof axios>;

describe('App Component', () => {
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

  it('renders task list and handles task operations', async () => {
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
    }).mockResolvedValueOnce({
      data: {
        data: [
          {
            id: '1',
            title: 'Test Task 1',
            description: 'Test Description 1',
            status: 'pending',
            createdAt: '2024-03-20T12:00:00Z',
            updatedAt: '2024-03-20T12:00:00Z'
          },
          {
            id: '2',
            title: 'New Task',
            description: 'New Description',
            status: 'pending',
            createdAt: '2024-03-20T12:00:00Z',
            updatedAt: '2024-03-20T12:00:00Z'
          }
        ]
      }
    }).mockResolvedValueOnce({
      data: {
        data: [
          {
            id: '2',
            title: 'New Task',
            description: 'New Description',
            status: 'pending',
            createdAt: '2024-03-20T12:00:00Z',
            updatedAt: '2024-03-20T12:00:00Z'
          }
        ]
      }
    });

    // Mock task creation
    mockedAxios.post.mockResolvedValueOnce({
      data: {
        data: {
          id: '2',
          title: 'New Task',
          description: 'New Description',
          status: 'pending',
          createdAt: '2024-03-20T12:00:00Z',
          updatedAt: '2024-03-20T12:00:00Z'
        }
      }
    });

    // Mock task deletion
    mockedAxios.delete.mockResolvedValueOnce({ data: { success: true } });

    renderWithProviders(<App />);

    // Check if task is rendered
    await waitFor(() => {
      const listItem = screen.getByRole('listitem');
      expect(within(listItem).getByText('Test Task 1')).toBeInTheDocument();
    }, { timeout: 10000 });

    // Navigate to new task form
    const addButton = screen.getByRole('button', { name: /add task/i });
    fireEvent.click(addButton);

    // Fill out the form
    await waitFor(() => {
      expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    }, { timeout: 10000 });

    const titleInput = screen.getByLabelText(/title/i);
    const descriptionInput = screen.getByLabelText(/description/i);
    const submitButton = screen.getByRole('button', { name: /save/i });

    fireEvent.change(titleInput, { target: { value: 'New Task' } });
    fireEvent.change(descriptionInput, { target: { value: 'New Description' } });
    fireEvent.click(submitButton);

    // Check if new task is added
    await waitFor(() => {
      const listItems = screen.getAllByRole('listitem');
      const newTaskItem = listItems.find(item => within(item).queryByText('New Task'));
      expect(newTaskItem).toBeInTheDocument();
    }, { timeout: 10000 });

    // Delete task
    await waitFor(() => {
      const taskItem = screen.getByText('Test Task 1').closest('li');
      const deleteButton = within(taskItem!).getByRole('button', { name: /delete/i });
      fireEvent.click(deleteButton);
    }, { timeout: 10000 });

    await waitFor(() => {
      expect(screen.queryByText('Test Task 1')).not.toBeInTheDocument();
    }, { timeout: 10000 });
  }, 30000); // Increase test timeout to 30 seconds
}); 