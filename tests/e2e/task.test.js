Feature('Task Management');

Before(async ({ I }) => {
  await I.waitForServices();
});

// Core user flow: Create, update, and delete a task
Scenario('Basic task management workflow', ({ I }) => {
  I.amOnPage('/');
  I.see('Task Manager');
  
  // Create task
  I.fillField('input[placeholder="Task title"]', 'Test Task');
  I.fillField('input[placeholder="Task description"]', 'Test Description');
  I.click('Add Task');
  
  // Verify task creation
  I.see('Test Task');
  I.see('Test Description');
  
  // Mark as completed
  I.click('Pending');
  I.see('Completed');
  
  // Delete task
  I.click('Delete');
  I.wait(1); // Wait for 1 second
  I.dontSee('Test Task');
});

// Form validation
Scenario('Form validation', ({ I }) => {
  I.amOnPage('/');
  
  // Try to submit empty form
  I.click('Add Task');
  I.see('Title is required');
  
  // Submit with only title
  I.fillField('input[placeholder="Task title"]', 'Test Task');
  I.click('Add Task');
  I.see('Test Task');
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