import { Router } from 'express';
import { TaskController } from '../controllers/taskController';
import { validateTask } from '../middleware/validation';

const router = Router();
const taskController = new TaskController();

// GET /api/tasks - Get all tasks with optional filtering
router.get('/', taskController.getTasks);

// GET /api/tasks/:id - Get a specific task
router.get('/:id', taskController.getTaskById);

// POST /api/tasks - Create a new task
router.post('/', validateTask, taskController.createTask);

// PUT /api/tasks/:id - Update a task
router.put('/:id', validateTask, taskController.updateTask);

// DELETE /api/tasks/:id - Delete a task
router.delete('/:id', taskController.deleteTask);

export { router as taskRoutes }; 