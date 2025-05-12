const waitForBackend = require('./helpers/waitForBackend');

Feature('Task API Integration Tests');

Before(async ({ I }) => {
  const backendUrl = process.env.APP_URL || 'http://localhost:3000';
  console.log('Testing against backend URL:', backendUrl);
  await waitForBackend(30, 1000, backendUrl);
});

Scenario('Create, read, update and delete a task', async ({ I }) => {
  // Create a task
  const taskData = {
    title: 'Test Task',
    description: 'This is a test task',
    status: 'pending'
  };

  console.log('Sending POST request with data:', taskData);
  const response = await I.sendPostRequest('/api/tasks', taskData);
  I.seeResponseCodeIs(201);
  const taskId = response.data.id;
  console.log('Created task with ID:', taskId);

  // Read the task
  console.log('Sending GET request for task:', taskId);
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

  console.log('Sending PUT request to update task:', taskId);
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
  console.log('Sending DELETE request for task:', taskId);
  const deleteResponse = await I.sendDeleteRequest(`/api/tasks/${taskId}`);
  I.seeResponseCodeIs(204);

  // Verify task is deleted
  console.log('Verifying task is deleted:', taskId);
  const getDeletedResponse = await I.sendGetRequest(`/api/tasks/${taskId}`);
  I.seeResponseCodeIs(404);
}); 