const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ContestData = sequelize.define('ContestData', {
  branch_code: DataTypes.STRING,
  client_code: DataTypes.STRING,
  name: DataTypes.STRING,
  email: DataTypes.STRING,
  mobile_number: DataTypes.STRING
}, {
  tableName: 'contest_data',
  timestamps: true
});

module.exports = ContestData;
