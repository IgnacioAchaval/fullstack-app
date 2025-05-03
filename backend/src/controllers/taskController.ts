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
      const taskData: CreateTaskDTO = req.body;
      
      // Validate required fields
      if (!taskData.title) {
        throw new ApiError(400, 'Title is required');
      }

      const task = await this.taskService.createTask(taskData);
      
      const response: ApiResponse<typeof task> = {
        status: 'success',
        data: task,
        message: 'Task created successfully'
      };

      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  };

  getTasks = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const queryParams: TaskQueryParams = {
        completed: req.query.completed === 'true' ? true : 
                  req.query.completed === 'false' ? false : undefined,
        search: req.query.search as string,
        page: req.query.page ? parseInt(req.query.page as string) : undefined,
        limit: req.query.limit ? parseInt(req.query.limit as string) : undefined
      };

      const tasks = await this.taskService.getTasks(queryParams);
      
      const response: ApiResponse<typeof tasks> = {
        status: 'success',
        data: tasks,
        message: 'Tasks retrieved successfully'
      };

      res.json(response);
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
        status: 'success',
        data: task,
        message: 'Task retrieved successfully'
      };

      res.json(response);
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

      const taskData: UpdateTaskDTO = req.body;
      if (Object.keys(taskData).length === 0) {
        throw new ApiError(400, 'No update data provided');
      }

      const task = await this.taskService.updateTask(id, taskData);
      
      const response: ApiResponse<typeof task> = {
        status: 'success',
        data: task,
        message: 'Task updated successfully'
      };

      res.json(response);
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
        status: 'success',
        message: 'Task deleted successfully'
      };

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
} 