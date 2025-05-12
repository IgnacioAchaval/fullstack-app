import React, { act } from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from '../../App';
import axios from 'axios';
import { MemoryRouter } from 'react-router-dom';

// Mock axios to intercept HTTP calls and return predefined responses
jest.mock('axios');

// Configure React Router future flags for testing
const router = {
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true
  }
};

describe('App Component', () => {
  // Sample mock tasks for testing
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

  // Helper function to render the App component wrapped in MemoryRouter
  const renderWithRouter = (ui) => {
    return render(
      <MemoryRouter future={router.future}>
        {ui}
      </MemoryRouter>
    );
  };

  // Setup mock responses for axios before each test
  beforeEach(() => {
    axios.get.mockResolvedValue({ data: { data: mockTasks } });
    axios.post.mockResolvedValue({
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
    axios.delete.mockResolvedValue({ data: { data: [] } });
  });

  // Clear all mocks after each test to avoid interference
  afterEach(() => {
    jest.clearAllMocks();
  });

  // Test that the initial task list is rendered correctly
  it('renders initial task list', async () => {
    await act(async () => {
      renderWithRouter(<App />);
    });

    await waitFor(() => {
      expect(screen.getByText('Test Task 1')).toBeInTheDocument();
    });
  });

  // Test adding a new task
  it('adds a new task', async () => {
    await act(async () => {
      renderWithRouter(<App />);
    });

    await waitFor(() => {
      expect(screen.getByText('Test Task 1')).toBeInTheDocument();
    });

    await act(async () => {
      fireEvent.click(screen.getByText('Add Task'));
    });

    await act(async () => {
      fireEvent.change(screen.getByLabelText('Title'), { target: { value: 'New Task' } });
      fireEvent.change(screen.getByLabelText('Description'), { target: { value: 'New Description' } });
      fireEvent.click(screen.getByText('Save'));
    });

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith('/api/tasks', {
        title: 'New Task',
        description: 'New Description',
        status: 'pending'
      });
    });
  });

  // Test deleting a task
  it('deletes a task', async () => {
    await act(async () => {
      renderWithRouter(<App />);
    });

    await waitFor(() => {
      expect(screen.getByText('Test Task 1')).toBeInTheDocument();
    });

    await act(async () => {
      fireEvent.click(screen.getByText('Delete'));
    });

    await waitFor(() => {
      expect(axios.delete).toHaveBeenCalledWith('/api/tasks/1');
    });
  });
}); 