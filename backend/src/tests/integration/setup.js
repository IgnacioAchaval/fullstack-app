const { sequelize } = require('../../models');
const { beforeAll, afterAll, beforeEach } = require('@jest/globals');

// Clean up function
async function cleanup() {
  try {
    await sequelize.query('TRUNCATE TABLE tasks CASCADE');
  } catch (error) {
    console.error('Error cleaning up test data:', error);
  }
}

// Setup before all tests
beforeAll(async () => {
  // Connect to database and create tables
  await sequelize.authenticate();
  await sequelize.sync({ force: true });
});

// Setup before each test
beforeEach(async () => {
  await cleanup();
});

// Teardown after all tests
afterAll(async () => {
  await cleanup();
  await sequelize.close();
}); 