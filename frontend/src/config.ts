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

// Log environment information for debugging
console.log('Environment:', {
  NODE_ENV: process.env.NODE_ENV,
  isDevelopment,
  isTest,
  windowENV: typeof window !== 'undefined' ? window.ENV : 'undefined',
  processENV: typeof process !== 'undefined' ? process.env.VITE_API_URL : 'undefined'
});

// In development and test, use absolute URLs
// In production, use relative URLs (which will be handled by nginx)
export const API_URL = isDevelopment || isTest
  ? (typeof window !== 'undefined' && window.ENV?.VITE_API_URL) ||
    (typeof process !== 'undefined' && process.env.VITE_API_URL) ||
    'http://localhost:3001/api'
  : '/api'; // Use /api prefix in production

// Log the final API URL for debugging
console.log('API_URL:', API_URL); 