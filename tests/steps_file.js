// in this file you can append custom step methods to 'I' object
const { I } = inject();

// Wait for the application to be ready
I.waitForApp = async () => {
  I.amOnPage('/');
  I.waitForElement('.task-list', 10);
};

// Wait for services to be ready
I.waitForServices = async () => {
  const maxRetries = 15;
  const retryInterval = 2000; // 2 seconds

  for (let i = 0; i < maxRetries; i++) {
    try {
      // Try to access the main page
      await I.amOnPage('/');
      
      // Check if the page title is present
      const title = await I.grabTextFrom('h1');
      if (title.includes('Task Manager')) {
        // Additional check for the task list
        await I.waitForElement('table', 5);
        
        // Try to make an API call to verify backend is ready
        try {
          const response = await I.sendGetRequest('/api/tasks/health');
          if (response.status === 200) {
            console.log('Services are ready!');
            return true;
          }
        } catch (apiError) {
          console.log(`API check failed: ${apiError.message}`);
        }
      }
    } catch (error) {
      console.log(`Attempt ${i + 1}/${maxRetries} failed: ${error.message}`);
    }
    
    // Wait before next retry
    await new Promise(resolve => setTimeout(resolve, retryInterval));
  }

  throw new Error('Services not ready after maximum retries');
};

// Wait for the API to be ready
I.waitForAPI = async () => {
  const maxRetries = 15;
  const retryInterval = 2000; // 2 seconds

  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await I.sendGetRequest('/health');
      if (response.status === 200) {
        console.log('API is ready!');
        return true;
      }
    } catch (error) {
      console.log(`Attempt ${i + 1}/${maxRetries} failed: ${error.message}`);
    }
    
    // Wait before next retry
    await new Promise(resolve => setTimeout(resolve, retryInterval));
  }

  throw new Error('API not ready after maximum retries');
};

// Create a new task
I.createTask = async (title, description) => {
  await I.fillField('input[name="title"]', title);
  await I.fillField('textarea[name="description"]', description);
  await I.click('button[type="submit"]');
  await I.waitForElement('table', 5);
};

// Delete a task
I.deleteTask = async (title) => {
  await I.click(`//tr[contains(., '${title}')]//button[contains(@class, 'delete')]`);
  await I.wait(1);
};

// Toggle task completion status
I.toggleTaskStatus = async (title) => {
  await I.click(`//tr[contains(., '${title}')]//input[@type="checkbox"]`);
  await I.wait(1);
};

module.exports = function() {
  return actor({
    // Define custom steps here, use 'I' to access codeceptjs predefined methods
    createTask: async function(title, description, status = 'pending') {
      try {
        const response = await I.sendPostRequest('/api/tasks', {
          title,
          description,
          status
        });
        return response.data;
      } catch (error) {
        console.error('Error creating task:', error.message);
        throw error;
      }
    },

    getTask: async function(id) {
      try {
        const response = await I.sendGetRequest(`/api/tasks/${id}`);
        return response.data;
        } catch (error) {
        console.error('Error getting task:', error.message);
        throw error;
      }
    },

    updateTask: async function(id, data) {
      try {
        const response = await I.sendPutRequest(`/api/tasks/${id}`, data);
        return response.data;
      } catch (error) {
        console.error('Error updating task:', error.message);
        throw error;
      }
    },

    deleteTask: async function(id) {
      try {
        await I.sendDeleteRequest(`/api/tasks/${id}`);
      } catch (error) {
        console.error('Error deleting task:', error.message);
        throw error;
      }
    }
  });
}; 