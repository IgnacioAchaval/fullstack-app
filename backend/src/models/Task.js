const { DataTypes } = require('sequelize');

function defineTask(sequelize) {
  const Task = sequelize.define('Task', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('pending', 'in_progress', 'completed'),
      defaultValue: 'pending',
    },
    dueDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  }, {
    timestamps: true,
  });

  return Task;
}

module.exports = defineTask; 