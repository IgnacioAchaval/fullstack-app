// frontend/src/__tests__/App.test.jsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import App from '../App.jsx';

// Mock axios
jest.mock('axios');

// Set test environment
window.__TEST__ = true;

// Mock environment variables
jest.mock('../App.jsx', () => {
  const originalModule = jest.requireActual('../App.jsx');
  return {
    __esModule: true,
    ...originalModule,
    default: originalModule.default
  };
});

describe('App Component', () => {
  beforeEach(() => {
    // Mock axios.get to return a list of users
    axios.get.mockResolvedValue({
      data: [
        { name: 'John Doe', email: 'john@example.com' },
        { name: 'Jane Smith', email: 'jane@example.com' }
      ]
    });

    // Mock axios.post to return success
    axios.post.mockResolvedValue({ data: { message: 'Usuario agregado' } });
  });

  it('renders the app title', () => {
    render(<App />);
    expect(screen.getByText('Usuarios')).toBeInTheDocument();
  });

  it('displays the list of users', async () => {
    render(<App />);
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    });
  });

  it('adds a new user', async () => {
  render(<App />);
    
    // Fill in the form
    fireEvent.change(screen.getByPlaceholderText('Nombre'), {
      target: { value: 'New User' }
    });
    fireEvent.change(screen.getByPlaceholderText('Email'), {
      target: { value: 'new@example.com' }
    });

    // Click the add button
    fireEvent.click(screen.getByText('Agregar'));

    // Verify the new user was added
    await waitFor(() => {
      expect(screen.getByText('New User')).toBeInTheDocument();
      expect(screen.getByText('new@example.com')).toBeInTheDocument();
    });
  });
});

// you can also test the addUser flow by mocking axios.post