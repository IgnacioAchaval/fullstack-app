const { Sequelize } = require('sequelize');
const TaskModel = require('./Task');

const sequelize = new Sequelize(
  process.env.DB_NAME || 'taskmanager',
  process.env.DB_USER || 'postgres',
  process.env.DB_PASSWORD || 'postgres',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: false,
  }
);

const Task = TaskModel(sequelize);

module.exports = {
  sequelize,
  Task,
}; 