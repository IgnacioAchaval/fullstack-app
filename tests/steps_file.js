// in this file you can append custom step methods to 'I' object
const { I } = inject();

// Wait for the application to be ready
I.waitForApp = async () => {
  I.amOnPage('/');
  I.waitForElement('.task-list', 10);
};

// Wait for services to be ready
I.waitForServices = async function() {
  const maxRetries = 30;
  const retryInterval = 1000; // 1 second

  for (let i = 0; i < maxRetries; i++) {
    try {
      // Check frontend
      await I.amOnPage('/');
      await I.see('Task Manager');
      
      // If we get here, both services are ready
      return;
    } catch (error) {
      if (i === maxRetries - 1) {
        throw new Error('Services not ready after maximum retries');
      }
      await new Promise(resolve => setTimeout(resolve, retryInterval));
    }
  }
};

// Create a new task
I.createTask = async function(title, description) {
  I.fillField('input[name="title"]', title);
  I.fillField('textarea[name="description"]', description);
  I.click('button[type="submit"]');
};

// Delete a task
I.deleteTask = async function(title) {
  I.click(`//div[contains(@class, 'task-item')][.//h3[contains(text(), '${title}')]]//button[contains(@class, 'delete')]`);
};

// Toggle task status
I.toggleTaskStatus = async function(title) {
  I.click(`//div[contains(@class, 'task-item')][.//h3[contains(text(), '${title}')]]//button[contains(@class, 'toggle')]`);
};

module.exports = function() {
  return actor({
    // Define custom steps here, use 'I' to access codeceptjs predefined methods
    // Example:
    // async clickTaskStatus(taskTitle) {
    //   I.click(`//tr[contains(., '${taskTitle}')]//button[contains(text(), 'Pending')]`);
    // }
    async waitForServices() {
      const maxRetries = 10;
      const retryDelay = 2000;

      for (let i = 0; i < maxRetries; i++) {
        try {
          // Check frontend
          await I.amOnPage('/');
          await I.see('Task Manager');

          // Check backend health
          const response = await I.sendGetRequest('/health');
          if (response.status === 200) {
            return true;
          }
        } catch (error) {
          if (i === maxRetries - 1) {
            throw new Error('Services not ready after maximum retries');
          }
          await new Promise(resolve => setTimeout(resolve, retryDelay));
        }
      }
    }
  });
}; 