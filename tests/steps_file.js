// in this file you can append custom step methods to 'I' object
const { I } = inject();

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

// Custom step to wait for services to be ready
I.waitForServices = async function() {
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
}; 