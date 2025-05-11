const axios = require('axios');

async function waitForBackend(maxAttempts = 30, interval = 1000, backendUrl = 'http://localhost:3000') {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      await axios.get(`${backendUrl}/health`);
      console.log('Backend is ready!');
      return true;
    } catch (error) {
      if (attempt === maxAttempts) {
        console.error('Backend failed to start after maximum attempts');
        throw error;
      }
      console.log(`Waiting for backend to start... Attempt ${attempt}/${maxAttempts}`);
      await new Promise(resolve => setTimeout(resolve, interval));
    }
  }
}

module.exports = waitForBackend; 