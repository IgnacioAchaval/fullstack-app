import React, { act } from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from '../../App';
import axios from 'axios';
import { MemoryRouter } from 'react-router-dom';

// Mock axios
jest.mock('axios');

// Configure React Router future flags
const router = {
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true
  }
};

describe('App Component', () => {
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

  const renderWithRouter = (ui) => {
    return render(
      <MemoryRouter future={router.future}>
        {ui}
      </MemoryRouter>
    );
  };

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

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders initial task list', async () => {
    await act(async () => {
      renderWithRouter(<App />);
    });

    await waitFor(() => {
      expect(screen.getByText('Test Task 1')).toBeInTheDocument();
    });
  });

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