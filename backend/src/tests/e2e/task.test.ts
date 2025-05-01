import request from 'supertest';
import { app } from '../../index';
import { pool } from '../../config/database';
import { Task } from '../../types';

describe('Task API Endpoints', () => {
  beforeEach(async () => {
    // Clear the tasks table before each test
    await pool.query('DELETE FROM tasks');
  });

  afterAll(async () => {
    // Close the database connection after all tests
    await pool.end();
  });

  describe('POST /api/tasks', () => {
    it('should create a new task', async () => {
      const taskData = {
        title: 'Test Task',
        description: 'Test Description'
      };

      const response = await request(app)
        .post('/api/tasks')
        .send(taskData)
        .expect(201);

      expect(response.body.status).toBe('success');
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data.title).toBe(taskData.title);
      expect(response.body.data.description).toBe(taskData.description);
      expect(response.body.data.completed).toBe(false);
    });

    it('should return 400 if title is missing', async () => {
      const response = await request(app)
        .post('/api/tasks')
        .send({ description: 'Test Description' })
        .expect(400);

      expect(response.body.status).toBe('error');
      expect(response.body.message).toContain('Title is required');
    });
  });

  describe('GET /api/tasks', () => {
    beforeEach(async () => {
      // Insert test tasks
      await pool.query(
        'INSERT INTO tasks (title, description, completed) VALUES ($1, $2, $3), ($4, $5, $6)',
        ['Task 1', 'Description 1', false, 'Task 2', 'Description 2', true]
      );
    });

    it('should return all tasks', async () => {
      const response = await request(app)
        .get('/api/tasks')
        .expect(200);

      expect(response.body.status).toBe('success');
      expect(response.body.data).toHaveLength(2);
      expect(response.body.data[0]).toHaveProperty('id');
      expect(response.body.data[0]).toHaveProperty('title');
      expect(response.body.data[0]).toHaveProperty('description');
      expect(response.body.data[0]).toHaveProperty('completed');
    });

    it('should filter tasks by completion status', async () => {
      const response = await request(app)
        .get('/api/tasks?completed=true')
        .expect(200);

      expect(response.body.status).toBe('success');
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].completed).toBe(true);
    });
  });

  describe('GET /api/tasks/:id', () => {
    let taskId: number;

    beforeEach(async () => {
      const result = await pool.query(
        'INSERT INTO tasks (title, description, completed) VALUES ($1, $2, $3) RETURNING id',
        ['Test Task', 'Test Description', false]
      );
      taskId = result.rows[0].id;
    });

    it('should return a task by id', async () => {
      const response = await request(app)
        .get(`/api/tasks/${taskId}`)
        .expect(200);

      expect(response.body.status).toBe('success');
      expect(response.body.data.id).toBe(taskId);
      expect(response.body.data.title).toBe('Test Task');
      expect(response.body.data.description).toBe('Test Description');
    });

    it('should return 404 if task is not found', async () => {
      const response = await request(app)
        .get('/api/tasks/999')
        .expect(404);

      expect(response.body.status).toBe('error');
      expect(response.body.message).toContain('Task not found');
    });
  });

  describe('PUT /api/tasks/:id', () => {
    let taskId: number;

    beforeEach(async () => {
      const result = await pool.query(
        'INSERT INTO tasks (title, description, completed) VALUES ($1, $2, $3) RETURNING id',
        ['Test Task', 'Test Description', false]
      );
      taskId = result.rows[0].id;
    });

    it('should update a task', async () => {
      const updateData = {
        title: 'Updated Task',
        description: 'Updated Description',
        completed: true
      };

      const response = await request(app)
        .put(`/api/tasks/${taskId}`)
        .send(updateData)
        .expect(200);

      expect(response.body.status).toBe('success');
      expect(response.body.data.title).toBe(updateData.title);
      expect(response.body.data.description).toBe(updateData.description);
      expect(response.body.data.completed).toBe(updateData.completed);
    });

    it('should return 404 if task is not found', async () => {
      const response = await request(app)
        .put('/api/tasks/999')
        .send({ title: 'Updated Task' })
        .expect(404);

      expect(response.body.status).toBe('error');
      expect(response.body.message).toContain('Task not found');
    });
  });

  describe('DELETE /api/tasks/:id', () => {
    let taskId: number;

    beforeEach(async () => {
      const result = await pool.query(
        'INSERT INTO tasks (title, description, completed) VALUES ($1, $2, $3) RETURNING id',
        ['Test Task', 'Test Description', false]
      );
      taskId = result.rows[0].id;
    });

    it('should delete a task', async () => {
      const response = await request(app)
        .delete(`/api/tasks/${taskId}`)
        .expect(204);

      // Verify task is deleted
      const getResponse = await request(app)
        .get(`/api/tasks/${taskId}`)
        .expect(404);

      expect(getResponse.body.status).toBe('error');
      expect(getResponse.body.message).toContain('Task not found');
    });

    it('should return 404 if task is not found', async () => {
      const response = await request(app)
        .delete('/api/tasks/999')
        .expect(404);

      expect(response.body.status).toBe('error');
      expect(response.body.message).toContain('Task not found');
    });
  });
}); 