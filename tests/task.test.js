const waitForBackend = require('./helpers/waitForBackend');

Feature('Task API Integration Tests');

Before(async () => {
  await waitForBackend();
});

Scenario('Create, read, update and delete a task', async ({ I }) => {
  // Create a task
  const taskData = {
    title: 'Test Task',
    description: 'This is a test task',
    status: 'pending'
  };

  const response = await I.sendPostRequest('/api/tasks', taskData);
  I.seeResponseCodeIs(201);
  const taskId = response.data.id;

  // Read the task
  const getResponse = await I.sendGetRequest(`/api/tasks/${taskId}`);
  I.seeResponseCodeIs(200);
  I.seeResponseContainsJson({
    data: {
      title: taskData.title,
      description: taskData.description,
      status: taskData.status
    }
  });
  
  // Update the task
  const updateData = {
    title: 'Updated Test Task',
    description: 'This is an updated test task',
    status: 'completed'
  };

  const updateResponse = await I.sendPutRequest(`/api/tasks/${taskId}`, updateData);
  I.seeResponseCodeIs(200);
  I.seeResponseContainsJson({
    data: {
      title: updateData.title,
      description: updateData.description,
      status: updateData.status
    }
  });
  
  // Delete the task
  const deleteResponse = await I.sendDeleteRequest(`/api/tasks/${taskId}`);
  I.seeResponseCodeIs(204);

  // Verify task is deleted
  const getDeletedResponse = await I.sendGetRequest(`/api/tasks/${taskId}`);
  I.seeResponseCodeIs(404);
}); 