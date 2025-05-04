const { Sequelize } = require('sequelize');
const TaskModel = require('./Task');

const sequelize = new Sequelize(
  process.env.POSTGRES_DB || 'taskmanager',
  process.env.POSTGRES_USER || 'postgres',
  process.env.POSTGRES_PASSWORD || 'postgres',
  {
    host: process.env.POSTGRES_HOST || 'localhost',
    port: process.env.POSTGRES_PORT || 5432,
    dialect: 'postgres',
    logging: false,
  }
);

const Task = TaskModel(sequelize);

module.exports = {
  sequelize,
  Task,
}; 