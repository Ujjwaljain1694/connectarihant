const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const SamparkReport = sequelize.define('SamparkReport', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  manager_id: {
    type: DataTypes.STRING
  },
  client_code: {
    type: DataTypes.STRING
  },
  client_name: {
    type: DataTypes.STRING
  },
  call_type: {
    type: DataTypes.STRING
  },
  call_status: {
    type: DataTypes.STRING
  },
  remarks: {
    type: DataTypes.TEXT
  },
  call_date: {
    type: DataTypes.DATE
  }
}, {
  tableName: 'sampark_reports',
  timestamps: true
});

module.exports = SamparkReport;