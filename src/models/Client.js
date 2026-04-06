const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Client = sequelize.define('Client', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  manager_id: {
    type: DataTypes.STRING(9),
    allowNull: false,
    references: {
      model: 'managers',
      key: 'manager_id',
    },
  },
  client_code: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true,
  },
  client_name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  pan: {
    type: DataTypes.STRING(10),
    allowNull: true,
  },
  mobile: {
    type: DataTypes.STRING(15),
    allowNull: true,
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('Active', 'Inactive', 'New'),
    defaultValue: 'New',
    allowNull: false,
  },
  app_login_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
}, {
  tableName: 'clients',
  indexes: [
    { fields: ['manager_id'] },
    { fields: ['status'] },
    { fields: ['client_code'] },
  ],
});

module.exports = Client;
