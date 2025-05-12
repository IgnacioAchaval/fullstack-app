import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from '../../App';
import { MemoryRouter } from 'react-router-dom';

// Configure React Router future flags
const router = {
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true
  }
};

describe('App Component', () => {
  const renderWithRouter = (ui) => {
    return render(
      <MemoryRouter future={router.future}>
        {ui}
      </MemoryRouter>
    );
  };

  it('renders the task manager title', () => {
    renderWithRouter(<App />);
    expect(screen.getByText('Task Manager')).toBeInTheDocument();
  });

  it('renders the TaskList component', () => {
    renderWithRouter(<App />);
    // TaskList will be rendered inside the Container
    expect(screen.getByRole('main')).toBeInTheDocument();
  });
}); 