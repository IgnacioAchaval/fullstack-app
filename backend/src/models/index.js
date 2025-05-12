const { Sequelize } = require('sequelize');
const Task = require('./Task');

// Support both POSTGRES_ and DB_ environment variables
const dbConfig = {
  // TESTS PASSING VERSION
  host: process.env.POSTGRES_HOST || process.env.DB_HOST || 'localhost',
  // TESTS BREAKING VERSION - Invalid host that will cause connection failure
  // host: 'invalid-host',
  port: process.env.POSTGRES_PORT || process.env.DB_PORT || 5432,
  database: process.env.POSTGRES_DB || process.env.DB_NAME || 'taskmanager',
  username: process.env.POSTGRES_USER || process.env.DB_USER || 'postgres',
  password: process.env.POSTGRES_PASSWORD || process.env.DB_PASSWORD || 'postgres',
  dialect: 'postgres',
  logging: false
};

const sequelize = new Sequelize(dbConfig);

// Initialize models
const models = {
  Task: Task(sequelize)
};

// Export models and sequelize instance
module.exports = {
  sequelize,
  ...models
}; 