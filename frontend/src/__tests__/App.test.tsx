import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import App from '../App';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('App Component', () => {
  const mockTasks = [
    {
      id: 1,
      title: 'Test Task 1',
      description: 'Test Description 1',
      completed: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 2,
      title: 'Test Task 2',
      description: 'Test Description 2',
      completed: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
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

  it('renders task table with correct headers', async () => {
    render(<App />);
    
    await waitFor(() => {
      expect(screen.getByText('Title')).toBeInTheDocument();
      expect(screen.getByText('Description')).toBeInTheDocument();
      expect(screen.getByText('Status')).toBeInTheDocument();
      expect(screen.getByText('Created At')).toBeInTheDocument();
      expect(screen.getByText('Actions')).toBeInTheDocument();
    });
  });

  it('displays tasks in the table', async () => {
    render(<App />);
    
    await waitFor(() => {
      expect(screen.getByText('Test Task 1')).toBeInTheDocument();
      expect(screen.getByText('Test Description 1')).toBeInTheDocument();
      expect(screen.getByText('Test Task 2')).toBeInTheDocument();
      expect(screen.getByText('Test Description 2')).toBeInTheDocument();
    });
  });

  it('adds a new task when form is submitted', async () => {
    render(<App />);
    
    const titleInput = screen.getByPlaceholderText('Task title');
    const descriptionInput = screen.getByPlaceholderText('Task description');
    const addButton = screen.getByText('Add Task');

    fireEvent.change(titleInput, { target: { value: 'New Task' } });
    fireEvent.change(descriptionInput, { target: { value: 'New Description' } });
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalledWith(
        'http://localhost:3001/tasks',
        { title: 'New Task', description: 'New Description' }
      );
    });
  });

  it('deletes a task when delete button is clicked', async () => {
    render(<App />);
    
    await waitFor(() => {
      const deleteButtons = screen.getAllByText('Delete');
      fireEvent.click(deleteButtons[0]);
    });

    await waitFor(() => {
      expect(mockedAxios.delete).toHaveBeenCalledWith(
        'http://localhost:3001/tasks/1'
      );
    });
  });

  it('shows correct status for completed and pending tasks', async () => {
    render(<App />);
    
    await waitFor(() => {
      expect(screen.getByText('Pending')).toBeInTheDocument();
      expect(screen.getByText('Completed')).toBeInTheDocument();
    });
  });
}); 