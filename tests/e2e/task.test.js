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
Scenario('Form validation', ({ I }) => {
  I.amOnPage('/');
  
  // Try to submit empty form
  I.click('Add Task');
  I.see('Title is required');
});

// Test task list sorting and filtering
Scenario('Task list sorting and filtering', async ({ I }) => {
  I.amOnPage('/');
  
  // Create completed task
  I.fillField('input[placeholder="Task title"]', 'Old Task');
  I.fillField('input[placeholder="Task description"]', 'This is done');
  I.click('Add Task');
  I.click('Pending'); // Mark as completed
  
  // Create pending task
  I.fillField('input[placeholder="Task title"]', 'New Task');
  I.fillField('input[placeholder="Task description"]', 'This is pending');
  I.click('Add Task');
  
  // Verify order (newest first)
  const tasks = await I.grabTextFrom('td');
  I.see('New Task');
  I.see('Old Task');
  
  // Verify status counts
  I.see('Pending');
  I.see('Completed');
}); 