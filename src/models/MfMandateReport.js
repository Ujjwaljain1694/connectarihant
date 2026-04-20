const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const MfMandateReport = sequelize.define('MfMandateReport', {
  client_code: DataTypes.STRING,
  client_name: DataTypes.STRING,
  mandate_code: DataTypes.STRING,
  amount: DataTypes.FLOAT,
  mandate_type: DataTypes.STRING,
  status: DataTypes.STRING,
  mandate_date: DataTypes.DATEONLY
}, {
  tableName: 'mf_mandate_report',
  timestamps: true
});

module.exports = MfMandateReport;
