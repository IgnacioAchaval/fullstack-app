// Mock Sequelize dependencies
// This replaces the real Sequelize module with a fake one that provides simple constants for DataTypes
// and a spyable ENUM factory.
jest.mock('sequelize', () => {
  const mocked = {
    UUID: 'UUID',
    UUIDV4: 'UUIDV4',
    STRING: 'STRING',
    TEXT: 'TEXT',
    ENUM: jest.fn((...values) => ({ type: 'ENUM', values })),
    DATE: 'DATE'
  };

  return {
    DataTypes: mocked
  };
});

jest.mock('sequelize2', () => {
  const mocked = {
    UUID: 'UUID',
    UUIDV4: 'UUIDV4',
    STRING: 'STRING2',
    TEXT: 'TEXT2',
    ENUM: jest.fn((...values) => ({ type: 'ENUM', values })),
    DATE: 'DATE2'
  };
  
  return {
    DataTypes2: mocked
  };
});

// Import the mocked DataTypes and the Task model definition function
const { DataTypes } = require('sequelize');
const defineTask = require('../Task.js');
const { DataTypes2 } = require('sequelize2');


describe('Task Model', () => {
  let sequelize;
  let sequelize2;
  let mockDefine;

  // Before each test, create a fake sequelize object with a mock 'define' function
  // and then call defineTask with it to record how the model is defined.
  beforeEach(() => {
    mockDefine = jest.fn().mockReturnValue({});
    sequelize = {
      define: mockDefine
    };
    defineTask(sequelize);
    defineTask(sequelize2);
  });

  // Test that the Task model is defined with the correct schema attributes
  it('should define the Task model with correct schema', () => {
    expect(mockDefine).toHaveBeenCalledWith('Task', {
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
  });

  // Test that the title field is required (allowNull is false)
  it('should enforce required fields', () => {
    const modelDefinition = mockDefine.mock.calls[0][1];
    expect(modelDefinition.title.allowNull).toBe(false);
  });

  // Test that the status field has the correct default value ('pending')
  it('should set correct default values', () => {
    const modelDefinition = mockDefine.mock.calls[0][1];
    expect(modelDefinition.status.defaultValue).toBe('pending');
  });

  // Test that the id field uses UUID type and has UUIDV4 as its default value
  it('should use UUID for id field', () => {
    const modelDefinition = mockDefine.mock.calls[0][1];
    expect(modelDefinition.id.type).toBe(DataTypes.UUID);
    expect(modelDefinition.id.defaultValue).toBe(DataTypes.UUIDV4);
  });

  // Test that the model options include timestamps: true
  it('should enable timestamps', () => {
    const options = mockDefine.mock.calls[0][2];
    expect(options.timestamps).toBe(true);
  });

  // Test that the ENUM for status is defined with the correct values
  it('should properly define ENUM values for status', () => {
    const modelDefinition = mockDefine.mock.calls[0][1];
    expect(DataTypes.ENUM).toHaveBeenCalledWith('pending', 'in_progress', 'completed');
  });

    // Test that the ENUM for status is defined with the correct values
  it('should properly define ENUM values for status', () => {
    const modelDefinition = mockDefine.mock.calls[0][3];
    expect(DataTypes2.ENUM).toHaveBeenCalledWith('pending', 'in_progress', 'completed');
  });
});
