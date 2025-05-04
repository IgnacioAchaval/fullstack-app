import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { TaskList } from '../../components/TaskList';
import axios from 'axios';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, beforeEach, jest } from '@jest/globals';
import type { Mocked } from 'jest-mock';

jest.mock('axios');
const mockedAxios = axios as Mocked<typeof axios>;

describe('TaskList Component', () => {
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

    renderWithProviders(<TaskList />);
    
    await waitFor(() => {
      expect(screen.getByText('Test Task 1')).toBeInTheDocument();
      expect(screen.getByText(/Test Description 1/)).toBeInTheDocument();
      expect(screen.getByText(/pending/i)).toBeInTheDocument();
    }, { timeout: 10000 });
  });

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

    renderWithProviders(<TaskList />);
    
    await waitFor(() => {
      expect(screen.getByText('Test Task 1')).toBeInTheDocument();
    }, { timeout: 10000 });

    const deleteButton = screen.getByRole('button', { name: /delete/i });
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(screen.queryByText('Test Task 1')).not.toBeInTheDocument();
    }, { timeout: 10000 });
  });

  it('updates task status when status is changed', async () => {
    console.log('Starting status update test');
    mockedAxios.get
      .mockResolvedValueOnce({
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
      })
      .mockResolvedValueOnce({
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

    renderWithProviders(<TaskList />);
    
    console.log('Waiting for initial task to render');
    await waitFor(() => {
      expect(screen.getByText('Test Task 1')).toBeInTheDocument();
    }, { timeout: 10000 });

    console.log('Looking for status toggle button');
    const statusButton = screen.getByRole('button', { name: /toggle task status to completed/i });
    console.log('Found status button, clicking it');
    fireEvent.click(statusButton);

    console.log('Waiting for status update to be reflected');
    await waitFor(() => {
      const statusText = screen.getByText(/Status: completed/i);
      console.log('Found status text:', statusText.textContent);
      expect(statusText).toBeInTheDocument();
    }, { timeout: 10000 });
  }, 15000);
}); 