// API configuration
export const API_BASE_URL = process.env.REACT_APP_API_URL || '';

// Pagination configuration
export const ITEMS_PER_PAGE = 10;

// Task status options
export const TASK_STATUS = {
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
};

// Task status labels
export const TASK_STATUS_LABELS = {
  [TASK_STATUS.PENDING]: 'Pending',
  [TASK_STATUS.IN_PROGRESS]: 'In Progress',
  [TASK_STATUS.COMPLETED]: 'Completed',
}; 