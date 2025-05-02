declare global {
  interface Window {
    ENV?: {
      VITE_API_URL?: string;
    };
  }
}

// Get API URL based on environment
const isDevelopment = process.env.NODE_ENV === 'development';
const isTest = process.env.NODE_ENV === 'test';

// In development and test, use absolute URLs
// In production, use relative URLs (which will be handled by nginx)
export const API_URL = isDevelopment || isTest
  ? (typeof window !== 'undefined' && window.ENV?.VITE_API_URL) ||
    (typeof process !== 'undefined' && process.env.VITE_API_URL) ||
    'http://localhost:3001'
  : ''; // Empty string means use relative URLs 