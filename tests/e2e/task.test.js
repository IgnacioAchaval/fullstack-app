Feature('Task Management');

Before(async ({ I }) => {
  // Wait for both services to be ready
  await I.waitForServices();
});

Scenario('Create and delete a task', async ({ I }) => {
  const taskTitle = `Test Task ${Date.now()}`;
  const taskDescription = 'Test Description';

  // Create task
  await I.createTask(taskTitle, taskDescription);
  I.see(taskTitle);
  I.see(taskDescription);

  // Delete task
  await I.deleteTask(taskTitle);
  I.dontSee(taskTitle);
});

Scenario('Toggle task completion status', async ({ I }) => {
  const taskTitle = `Test Task ${Date.now()}`;
  const taskDescription = 'Test Description';

  // Create task
  await I.createTask(taskTitle, taskDescription);
  I.see(taskTitle);
  I.see('Pending');

  // Toggle to completed
  await I.toggleTaskStatus(taskTitle);
  I.see('Completed');

  // Toggle back to pending
  await I.toggleTaskStatus(taskTitle);
  I.see('Pending');
});

// Basic form validation
Scenario('Form validation', async ({ I }) => {
  I.amOnPage('/');
  
  // Try to submit empty form
  I.click('button[type="submit"]');
  I.see('Title is required');
  
  // Try to submit with only title
  I.fillField('input[name="title"]', 'Test Title');
  I.click('button[type="submit"]');
  I.see('Description is required');
});

// Test task list sorting and filtering
Scenario('Task list sorting and filtering', async ({ I }) => {
  I.amOnPage('/');
  
  // Create completed task
  await I.createTask('Old Task', 'This is done');
  await I.toggleTaskStatus('Old Task');
  
  // Create pending task
  await I.createTask('New Task', 'This is pending');
  
  // Verify order (newest first)
  I.see('New Task');
  I.see('Old Task');
  
  // Verify status counts
  I.see('Pending');
  I.see('Completed');
}); 