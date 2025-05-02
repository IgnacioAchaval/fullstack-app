declare global {
  interface Window {
    ENV?: {
      VITE_API_URL?: string;
    };
  }
}

// Get API URL from environment variables or window.ENV (for tests) or use default
export const API_URL = 
  (typeof window !== 'undefined' && window.ENV?.VITE_API_URL) ||
  (typeof process !== 'undefined' && process.env.VITE_API_URL) ||
  'http://localhost:3001'; 