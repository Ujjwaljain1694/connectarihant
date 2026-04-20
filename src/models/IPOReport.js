const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const IPOReport = sequelize.define('IPOReport', {
  client_code: DataTypes.STRING,
  client_name: DataTypes.STRING,
  symbol: DataTypes.STRING,
  application_no: DataTypes.STRING,
  quantity: DataTypes.INTEGER,
  price: DataTypes.DECIMAL,
  amount: DataTypes.DECIMAL,
  status: DataTypes.STRING,
  application_date: DataTypes.DATEONLY
}, {
  tableName: 'ipo_report',
  timestamps: true
});

module.exports = IPOReport;
