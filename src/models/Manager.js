const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Manager = sequelize.define('Manager', {
  manager_id: {
    type: DataTypes.STRING(9),
    primaryKey: true,
    allowNull: false,
    validate: {
      len: [9, 9],
      isAlphanumeric: true,
    },
    comment: 'Exactly 9 alphanumeric characters',
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  phone: {
    type: DataTypes.STRING(15),
    allowNull: true,
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, {
  tableName: 'managers',
});

module.exports = Manager;
