Feature('Task Management');

Scenario('Create and manage tasks', ({ I }) => {
  I.amOnPage('/');
  
  // Create a new task
  I.click('Add Task');
  I.fillField('Title', 'Test Task');
  I.fillField('Description', 'This is a test task');
  I.selectOption('Status', 'pending');
  I.click('Save');
  
  // Verify task was created
  I.see('Test Task');
  I.see('This is a test task');
  I.see('pending');
  
  // Edit the task
  I.click('Edit');
  I.fillField('Title', 'Updated Test Task');
  I.selectOption('Status', 'completed');
  I.click('Save');
  
  // Verify task was updated
  I.see('Updated Test Task');
  I.see('completed');
  
  // Delete the task
  I.click('Delete');
  I.dontSee('Updated Test Task');
}); 