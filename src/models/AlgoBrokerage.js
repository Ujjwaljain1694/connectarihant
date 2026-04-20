const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const AlgoBrokerage = sequelize.define('AlgoBrokerage', {
  report_date: DataTypes.DATE,
  segment: DataTypes.STRING,
  exchange: DataTypes.STRING,
  total_trades: DataTypes.INTEGER,
  total_brokerage: DataTypes.DECIMAL
}, {
  tableName: 'algo_brokerage',
  timestamps: true
});

module.exports = AlgoBrokerage;
