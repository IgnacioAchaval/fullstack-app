// in this file you can append custom step methods to 'I' object
const { I } = inject();

// Wait for the application to be ready
I.waitForApp = async () => {
  I.amOnPage('/');
  I.waitForElement('.task-list', 10);
};

// Wait for services to be ready
I.waitForServices = async function() {
  const maxRetries = 10;
  const retryInterval = 2000;

  for (let i = 0; i < maxRetries; i++) {
    try {
      await I.amOnPage('/');
      await I.waitForElement('h1', 5);
      const title = await I.grabTextFrom('h1');
      if (title.includes('Task Manager')) {
        console.log('Services are ready!');
        return;
      }
    } catch (error) {
      console.log(`Attempt ${i + 1} failed: ${error.message}`);
    }
    console.log(`Waiting ${retryInterval}ms before next attempt...`);
    await I.wait(retryInterval);
  }
  throw new Error('Services not ready after maximum retries');
};

// Create a new task
I.createTask = async function(title, description) {
  I.fillField('input[name="title"]', title);
  I.fillField('textarea[name="description"]', description);
  I.click('button[type="submit"]');
  I.waitForElement('.task-item', 5);
};

// Delete a task
I.deleteTask = async function(title) {
  I.click(`//div[contains(@class, 'task-item')][.//h3[contains(text(), '${title}')]]//button[contains(text(), 'Delete')]`);
  I.wait(1);
};

// Toggle task status
I.toggleTaskStatus = async function(title) {
  I.click(`//div[contains(@class, 'task-item')][.//h3[contains(text(), '${title}')]]//button[contains(text(), 'Toggle')]`);
  I.wait(1);
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