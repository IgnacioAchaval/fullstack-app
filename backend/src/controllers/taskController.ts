import { Request, Response, NextFunction } from 'express';
import { TaskService } from '../services/taskService';
import { CreateTaskDTO, UpdateTaskDTO } from '../models/Task';

const taskService = new TaskService();

export const taskController = {
  async getAllTasks(req: Request, res: Response, next: NextFunction) {
    try {
      const tasks = await taskService.getAllTasks();
      res.json(tasks);
    } catch (error) {
      next(error);
    }
  },

  async getTaskById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id);
      const task = await taskService.getTaskById(id);
      res.json(task);
    } catch (error) {
      next(error);
    }
  },

  async createTask(req: Request, res: Response, next: NextFunction) {
    try {
      const taskData: CreateTaskDTO = req.body;
      const task = await taskService.createTask(taskData);
      res.status(201).json(task);
    } catch (error) {
      next(error);
    }
  },

  async updateTask(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id);
      const taskData: UpdateTaskDTO = req.body;
      const task = await taskService.updateTask(id, taskData);
      res.json(task);
    } catch (error) {
      next(error);
    }
  },

  async deleteTask(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id);
      await taskService.deleteTask(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  },
}; 