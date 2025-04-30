import { I } from 'codeceptjs';

Feature('Task Management');

Scenario('should create and retrieve a task', ({ I }) => {
  // Create a new task
  I.sendPostRequest('/api/tasks', {
    title: 'Test Task',
    description: 'This is a test task',
    status: 'pending'
  });

  // Verify the response
  I.seeResponseCodeIs(201);
  I.seeResponseContainsJson({
    title: 'Test Task',
    description: 'This is a test task',
    status: 'pending'
  });

  // Get all tasks
  I.sendGetRequest('/api/tasks');
  I.seeResponseCodeIs(200);
  I.seeResponseContainsJson([{
    title: 'Test Task',
    description: 'This is a test task',
    status: 'pending'
  }]);
});

Scenario('should update a task', ({ I }) => {
  // Create a task first
  I.sendPostRequest('/api/tasks', {
    title: 'Task to Update',
    description: 'This task will be updated',
    status: 'pending'
  });

  const taskId = I.grabDataFromResponseByJsonPath('$.id')[0];

  // Update the task
  I.sendPutRequest(`/api/tasks/${taskId}`, {
    title: 'Updated Task',
    status: 'completed'
  });

  // Verify the update
  I.seeResponseCodeIs(200);
  I.seeResponseContainsJson({
    title: 'Updated Task',
    status: 'completed'
  });
});

Scenario('should delete a task', ({ I }) => {
  // Create a task first
  I.sendPostRequest('/api/tasks', {
    title: 'Task to Delete',
    description: 'This task will be deleted',
    status: 'pending'
  });

  const taskId = I.grabDataFromResponseByJsonPath('$.id')[0];

  // Delete the task
  I.sendDeleteRequest(`/api/tasks/${taskId}`);
  I.seeResponseCodeIs(204);

  // Verify the task is deleted
  I.sendGetRequest(`/api/tasks/${taskId}`);
  I.seeResponseCodeIs(404);
}); 