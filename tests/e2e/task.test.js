Feature('Task Management');

Before(async ({ I }) => {
  // Wait for both services to be ready
  await I.waitForServices();
});

Scenario('Create and delete a task', async ({ I }) => {
  const taskTitle = `Test Task ${Date.now()}`;
  
  // Create task
  I.fillField('input[placeholder="Task title"]', taskTitle);
  I.fillField('input[placeholder="Task description"]', 'Test Description');
  I.click('Add Task');
  
  // Verify task was created
  I.see(taskTitle);
  I.see('Test Description');
  
  // Delete task
  I.click(`//td[contains(text(), '${taskTitle}')]/..//button[contains(text(), 'Delete')]`);
  I.dontSee(taskTitle);
});

Scenario('Toggle task status', async ({ I }) => {
  const taskTitle = `Toggle Task ${Date.now()}`;
  
  // Create task
  I.fillField('input[placeholder="Task title"]', taskTitle);
  I.fillField('input[placeholder="Task description"]', 'Toggle Test');
  I.click('Add Task');
  
  // Verify initial status
  I.see('Pending');
  
  // Toggle status
  I.click(`//td[contains(text(), '${taskTitle}')]/..//button[contains(text(), 'Pending')]`);
  I.see('Completed');
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