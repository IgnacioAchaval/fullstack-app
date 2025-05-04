const express = require('express');
const router = express.Router();
const { Task } = require('../models');
const { v4: uuidv4, validate: isUuid } = require('uuid');

// Middleware to validate UUID
const validateUuid = (req, res, next) => {
  if (!isUuid(req.params.id)) {
    return res.status(400).json({ error: 'Invalid UUID format' });
  }
  next();
};

// Get all tasks
router.get('/', async (req, res) => {
  try {
    const tasks = await Task.findAll();
    res.json({ data: tasks });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get a specific task
router.get('/:id', validateUuid, async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json({ data: task });
  } catch (error) {
    console.error('Error fetching task:', error);
    res.status(500).json({ error: error.message });
  }
});

// Create a new task
router.post('/', async (req, res) => {
  try {
    console.log('Creating task with data:', req.body);
    const task = await Task.create(req.body);
    console.log('Task created successfully:', task);
    res.status(201).json({ data: task });
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(400).json({ error: error.message });
  }
});

// Update a task
router.put('/:id', validateUuid, async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    await task.update(req.body);
    res.json({ data: task });
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(400).json({ error: error.message });
  }
});

// Delete a task
router.delete('/:id', validateUuid, async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    await task.destroy();
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; 