import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
 
// Automatically cleanup after each test
afterEach(cleanup); 

// Set up test environment variables
window.ENV = {
  VITE_API_URL: 'http://localhost:3001'
}; 