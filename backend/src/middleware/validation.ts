import { Request, Response, NextFunction } from 'express';
import { ApiError } from './errorHandler.js';
import { CreateTaskDTO, UpdateTaskDTO } from '../types/index.js';

export const validateTask = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const { title, description } = req.body;

    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      throw new ApiError(400, 'Title is required and must be a non-empty string');
    }

    if (description !== undefined && (typeof description !== 'string' || description.trim().length === 0)) {
      throw new ApiError(400, 'Description must be a non-empty string if provided');
    }

    next();
  } catch (error) {
    next(error);
  }
};

export const validateId = (req: Request, res: Response, next: NextFunction): void => {
  const id = parseInt(req.params.id);
  if (isNaN(id) || id <= 0) {
    throw new ApiError(400, 'Invalid task ID');
  }
  next();
}; 