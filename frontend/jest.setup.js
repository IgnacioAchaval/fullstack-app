import '@testing-library/jest-dom';

// Mock Vite's import.meta.env
Object.defineProperty(global, 'import', {
  value: {
    meta: {
      env: {
        VITE_BASE_URL: 'http://localhost:5000'
      }
    }
  },
  writable: true
}); 