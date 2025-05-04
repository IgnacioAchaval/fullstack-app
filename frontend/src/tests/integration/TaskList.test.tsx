import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import TaskList from '../../pages/TaskList';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

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

describe('TaskList Integration', () => {
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
    // Mock successful API responses
    mockedAxios.get.mockResolvedValue({ data: { data: mockTasks } });
    mockedAxios.post.mockResolvedValue({ data: { data: mockTasks[0] } });
    mockedAxios.delete.mockResolvedValue({ data: {} });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render task list and handle task operations', async () => {
    renderWithProviders(<TaskList />);
    
    await waitFor(() => {
      expect(screen.getByText('Tasks')).toBeInTheDocument();
      expect(screen.getByText('Add Task')).toBeInTheDocument();
    });

    // Verify tasks are displayed
    expect(screen.getByText('Test Task 1')).toBeInTheDocument();
    expect(screen.getByText('Test Description 1')).toBeInTheDocument();
    expect(screen.getByText('Test Task 2')).toBeInTheDocument();
    expect(screen.getByText('Test Description 2')).toBeInTheDocument();
  });

  it('should handle API errors gracefully', async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error('API Error'));

    renderWithProviders(<TaskList />);
    
    await waitFor(() => {
      expect(screen.getByText('Failed to fetch tasks. Please try again later.')).toBeInTheDocument();
    });
  });
}); 