import { TaskService } from '../../services/taskService';
import { Pool } from 'pg';
import { AppError } from '../../middleware/errorHandler';

// Mock the pg Pool
jest.mock('pg', () => {
  const mPool = {
    query: jest.fn(),
  };
  return { Pool: jest.fn(() => mPool) };
});

describe('TaskService', () => {
  let taskService: TaskService;
  let mockPool: jest.Mocked<Pool>;

  beforeEach(() => {
    taskService = new TaskService();
    mockPool = new Pool() as jest.Mocked<Pool>;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllTasks', () => {
    it('should return all tasks', async () => {
      const mockTasks = [
        { id: 1, title: 'Task 1', description: 'Description 1', status: 'pending' },
        { id: 2, title: 'Task 2', description: 'Description 2', status: 'completed' },
      ];

      mockPool.query.mockResolvedValueOnce({ rows: mockTasks, rowCount: 2 } as any);

      const tasks = await taskService.getAllTasks();
      expect(tasks).toEqual(mockTasks);
      expect(mockPool.query).toHaveBeenCalledWith(
        'SELECT * FROM tasks ORDER BY created_at DESC'
      );
    });

    it('should throw an error when database query fails', async () => {
      mockPool.query.mockRejectedValueOnce(new Error('Database error'));

      await expect(taskService.getAllTasks()).rejects.toThrow(AppError);
      await expect(taskService.getAllTasks()).rejects.toThrow('Error fetching tasks');
    });
  });

  describe('getTaskById', () => {
    it('should return a task by id', async () => {
      const mockTask = {
        id: 1,
        title: 'Task 1',
        description: 'Description 1',
        status: 'pending',
      };

      mockPool.query.mockResolvedValueOnce({ rows: [mockTask], rowCount: 1 } as any);

      const task = await taskService.getTaskById(1);
      expect(task).toEqual(mockTask);
      expect(mockPool.query).toHaveBeenCalledWith(
        'SELECT * FROM tasks WHERE id = $1',
        [1]
      );
    });

    it('should throw an error when task is not found', async () => {
      mockPool.query.mockResolvedValueOnce({ rows: [], rowCount: 0 } as any);

      await expect(taskService.getTaskById(1)).rejects.toThrow(AppError);
      await expect(taskService.getTaskById(1)).rejects.toThrow('Task not found');
    });
  });
}); 