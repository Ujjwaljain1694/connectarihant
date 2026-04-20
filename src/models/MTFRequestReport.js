const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const MTFRequestReport = sequelize.define('MTFRequestReport', {
  client_code: DataTypes.STRING,
  client_name: DataTypes.STRING,
  request_date: DataTypes.DATEONLY,
  status: DataTypes.STRING,
  amount: DataTypes.DECIMAL
}, {
  tableName: 'mtf_request_report',
  timestamps: true
});

module.exports = MTFRequestReport;
