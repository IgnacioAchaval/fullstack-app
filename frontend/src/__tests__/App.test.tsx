import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import App from '../App';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
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
      {ui}
    </QueryClientProvider>
  );
};

describe('App Component', () => {
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

  it('renders task list', async () => {
    renderWithProviders(<App />);
    
    await waitFor(() => {
      expect(screen.getByText('Tasks')).toBeInTheDocument();
      expect(screen.getByText('Add Task')).toBeInTheDocument();
    });
  });

  it('displays tasks in the list', async () => {
    renderWithProviders(<App />);
    
    await waitFor(() => {
      expect(screen.getByText('Test Task 1')).toBeInTheDocument();
      expect(screen.getByText('Test Description 1')).toBeInTheDocument();
      expect(screen.getByText('Test Task 2')).toBeInTheDocument();
      expect(screen.getByText('Test Description 2')).toBeInTheDocument();
    });
  });

  it('adds a new task when form is submitted', async () => {
    renderWithProviders(<App />);
    
    // Click add task button
    fireEvent.click(screen.getByText('Add Task'));

    // Wait for dialog to appear
    await waitFor(() => {
      expect(screen.getByText('Create New Task')).toBeInTheDocument();
    });

    // Fill in the form
    const titleInput = screen.getByRole('textbox', { name: /title/i });
    const descriptionInput = screen.getByRole('textbox', { name: /description/i });
    
    fireEvent.change(titleInput, { target: { value: 'New Task' } });
    fireEvent.change(descriptionInput, { target: { value: 'New Description' } });
    
    // Submit the form
    fireEvent.click(screen.getByText('Save'));

    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalledWith(
        expect.stringContaining('/tasks'),
        expect.objectContaining({
          title: 'New Task',
          description: 'New Description'
        })
      );
    });
  });

  it('deletes a task when delete button is clicked', async () => {
    renderWithProviders(<App />);
    
    await waitFor(() => {
      expect(screen.getByText('Test Task 1')).toBeInTheDocument();
    });

    const deleteButton = screen.getByTestId('delete-task-1');
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(mockedAxios.delete).toHaveBeenCalledWith(
        expect.stringContaining('/tasks/1')
      );
    });
  });

  it('shows correct status for tasks', async () => {
    renderWithProviders(<App />);
    
    await waitFor(() => {
      expect(screen.getByText('pending')).toBeInTheDocument();
      expect(screen.getByText('completed')).toBeInTheDocument();
    });
  });
}); 