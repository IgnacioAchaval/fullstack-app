import { Request, Response, NextFunction } from 'express';
import { TaskService } from '../services/taskService.js';
import { CreateTaskDTO, UpdateTaskDTO, TaskQueryParams } from '../types/index.js';
import { ApiError } from '../middleware/errorHandler.js';

type ApiResponse<T> = {
  status: 'success' | 'error';
  data?: T;
  message?: string;
};

const taskService = TaskService.getInstance();

export class TaskController {
  createTask = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const taskData: CreateTaskDTO = {
        title: req.body.title,
        description: req.body.description,
        completed: req.body.completed
      };

      const task = await taskService.createTask(taskData);
      
      const response: ApiResponse<typeof task> = {
        status: 'success',
        data: task
      };

      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  };

  getTasks = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const queryParams: TaskQueryParams = {
        completed: req.query.completed === 'true' ? true : req.query.completed === 'false' ? false : undefined,
        search: req.query.search as string,
        page: req.query.page ? parseInt(req.query.page as string) : undefined,
        limit: req.query.limit ? parseInt(req.query.limit as string) : undefined
      };

      const tasks = await taskService.getTasks(queryParams);
      
      const response: ApiResponse<typeof tasks> = {
        status: 'success',
        data: tasks
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };

  getTaskById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        throw new ApiError(400, 'Invalid task ID');
      }

      const task = await taskService.getTaskById(id);
      
      const response: ApiResponse<typeof task> = {
        status: 'success',
        data: task
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };

  updateTask = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        throw new ApiError(400, 'Invalid task ID');
      }

      const taskData: UpdateTaskDTO = {
        title: req.body.title,
        description: req.body.description,
        completed: req.body.completed
      };

      const task = await taskService.updateTask(id, taskData);
      
      const response: ApiResponse<typeof task> = {
        status: 'success',
        data: task
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };

  deleteTask = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        throw new ApiError(400, 'Invalid task ID');
      }

      await taskService.deleteTask(id);
      
      const response: ApiResponse<null> = {
        status: 'success',
        message: 'Task deleted successfully'
      };

      res.status(204).json(response);
    } catch (error) {
      next(error);
    }
  };
} 