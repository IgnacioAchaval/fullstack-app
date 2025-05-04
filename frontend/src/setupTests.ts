import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach } from '@jest/globals';
import { configure } from '@testing-library/react';

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Automatically cleanup after each test
afterEach(cleanup);

// Increase the default timeout and configure testing utilities
configure({ 
  asyncUtilTimeout: 10000,
  getElementError: (message: string | null, container: Element | null) => {
    const error = new Error(message || '');
    error.name = 'TestingLibraryElementError';
    return error;
  }
}); 