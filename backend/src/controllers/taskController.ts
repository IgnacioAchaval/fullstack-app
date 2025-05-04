import { Request, Response, NextFunction } from 'express';
import { TaskService } from '../services/taskService';
import { CreateTaskDTO, UpdateTaskDTO, TaskQueryParams, ApiResponse } from '../types';
import { ApiError } from '../middleware/errorHandler';

export class TaskController {
  private taskService: TaskService;

  constructor() {
    this.taskService = TaskService.getInstance();
  }

  createTask = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const taskData: CreateTaskDTO = {
        title: req.body.title,
        description: req.body.description || null,
        completed: req.body.completed || false
      };

      const task = await this.taskService.createTask(taskData);
      
      const response: ApiResponse<typeof task> = {
        success: true,
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

      const tasks = await this.taskService.getTasks(queryParams);
      
      const response: ApiResponse<typeof tasks> = {
        success: true,
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

      const task = await this.taskService.getTaskById(id);
      
      const response: ApiResponse<typeof task> = {
        success: true,
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

      const task = await this.taskService.updateTask(id, taskData);
      
      const response: ApiResponse<typeof task> = {
        success: true,
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

      await this.taskService.deleteTask(id);
      
      const response: ApiResponse<null> = {
        success: true,
        message: 'Task deleted successfully'
      };

      res.status(204).json(response);
    } catch (error) {
      next(error);
    }
  };
} 