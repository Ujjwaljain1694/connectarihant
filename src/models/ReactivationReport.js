const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ReactivationReport = sequelize.define('ReactivationReport', {
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
  status: {
    type: DataTypes.STRING
  },
  trade_status: {
    type: DataTypes.STRING
  },
  last_traded_date: {
    type: DataTypes.DATE
  },
  last_login_date: {
    type: DataTypes.DATE
  },
  date: {
    type: DataTypes.DATE
  }
}, {
  tableName: 'reactivation_reports',
  timestamps: true
});

module.exports = ReactivationReport;