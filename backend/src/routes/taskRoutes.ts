import { Router } from 'express';
import { TaskController } from '../controllers/taskController';
import { validateTask } from '../middleware/validation';

const taskRouter = Router();
const taskController = new TaskController();

// Health check endpoint
taskRouter.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// GET /api/tasks - Get all tasks with optional filtering
taskRouter.get('/', taskController.getTasks);

// GET /api/tasks/:id - Get a specific task
taskRouter.get('/:id', taskController.getTaskById);

// POST /api/tasks - Create a new task
taskRouter.post('/', validateTask, taskController.createTask);

// PUT /api/tasks/:id - Update a task
taskRouter.put('/:id', validateTask, taskController.updateTask);

// DELETE /api/tasks/:id - Delete a task
taskRouter.delete('/:id', taskController.deleteTask);

export { taskRouter }; 