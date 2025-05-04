import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from '../App';
import axios from 'axios';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, expect, it, beforeEach, jest } from '@jest/globals';
import type { Mocked } from 'jest-mock';

jest.mock('axios');
const mockedAxios = axios as Mocked<typeof axios>;

describe('App Component', () => {
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
        {ui}
      </QueryClientProvider>
    );
  };

  it('renders task list', async () => {
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

    renderWithProviders(<App />);
    
    await waitFor(() => {
      expect(screen.getByText('Task Manager')).toBeInTheDocument();
      expect(screen.getByText('Test Task 1')).toBeInTheDocument();
    }, { timeout: 10000 });
  });

  it('adds a new task when form is submitted', async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: {
        data: []
      }
    });
    mockedAxios.post.mockResolvedValueOnce({
      data: {
        data: {
          id: '1',
          title: 'New Task',
          description: 'New Description',
          status: 'pending',
          createdAt: '2024-03-20T12:00:00Z',
          updatedAt: '2024-03-20T12:00:00Z'
        }
      }
    });

    renderWithProviders(<App />);

    const addButton = screen.getByRole('button', { name: /add task/i });
    fireEvent.click(addButton);

    const titleInput = screen.getByLabelText(/title/i);
    const descriptionInput = screen.getByLabelText(/description/i);

    fireEvent.change(titleInput, { target: { value: 'New Task' } });
    fireEvent.change(descriptionInput, { target: { value: 'New Description' } });

    const saveButton = screen.getByRole('button', { name: /save/i });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText(/New Task/i)).toBeInTheDocument();
    }, { timeout: 10000 });
  }, 15000);

  it('deletes a task when delete button is clicked', async () => {
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
    mockedAxios.delete.mockResolvedValueOnce({ data: { success: true } });

    renderWithProviders(<App />);
    
    await waitFor(() => {
      expect(screen.getByText('Test Task 1')).toBeInTheDocument();
    }, { timeout: 10000 });

    const deleteButton = screen.getByRole('button', { name: /delete/i });
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(screen.queryByText('Test Task 1')).not.toBeInTheDocument();
    }, { timeout: 10000 });
  });
}); 