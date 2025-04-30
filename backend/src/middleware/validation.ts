import { Request, Response, NextFunction } from 'express';
import { ApiError } from './errorHandler';
import { CreateTaskDTO, UpdateTaskDTO } from '../types';

export const validateTask = (req: Request, res: Response, next: NextFunction): void => {
  const taskData: CreateTaskDTO | UpdateTaskDTO = req.body;

  // Validate title if present
  if ('title' in taskData) {
    if (!taskData.title || typeof taskData.title !== 'string') {
      throw new ApiError(400, 'Title must be a non-empty string');
    }
    if (taskData.title.length > 100) {
      throw new ApiError(400, 'Title must be less than 100 characters');
    }
  }

  // Validate description if present
  if ('description' in taskData && taskData.description !== undefined) {
    if (typeof taskData.description !== 'string') {
      throw new ApiError(400, 'Description must be a string');
    }
    if (taskData.description.length > 500) {
      throw new ApiError(400, 'Description must be less than 500 characters');
    }
  }

  // Validate completed status if present
  if ('completed' in taskData && taskData.completed !== undefined) {
    if (typeof taskData.completed !== 'boolean') {
      throw new ApiError(400, 'Completed status must be a boolean');
    }
  }

  next();
};

export const validateId = (req: Request, res: Response, next: NextFunction): void => {
  const id = parseInt(req.params.id);
  if (isNaN(id) || id <= 0) {
    throw new ApiError(400, 'Invalid task ID');
  }
  next();
}; 