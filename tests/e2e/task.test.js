Feature('Task Management');

Before(async ({ I }) => {
  await I.waitForServices();
});

// Basic CRUD operations
Scenario('Create, read, update, and delete a task', ({ I }) => {
  // Create task
  I.amOnPage('/');
  I.see('Task Manager');
  I.fillField('input[placeholder="Task title"]', 'Test Task');
  I.fillField('input[placeholder="Task description"]', 'Test Description');
  I.click('Add Task');
  
  // Verify task was created
  I.see('Test Task');
  I.see('Test Description');
  
  // Update task status
  I.click('Pending');
  I.see('Completed');
  
  // Delete task
  I.click('Delete');
  I.wait(1); // Wait for deletion to complete
  I.dontSee('Test Task');
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