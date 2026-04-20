const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const MutualFund = sequelize.define('MutualFund', {
  commission_account: DataTypes.STRING,
  subbroker_name: DataTypes.STRING,
  brokerage_amount: DataTypes.DECIMAL,
  pass_on_percentage: DataTypes.DECIMAL,
  date: DataTypes.DATEONLY
}, {
  tableName: 'mutual_fund_reports',
  timestamps: true
});

module.exports = MutualFund;
