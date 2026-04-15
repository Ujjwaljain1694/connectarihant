const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const PhysicalAccount = sequelize.define('PhysicalAccount', {
  client_code: DataTypes.STRING,
  client_name: DataTypes.STRING,
  pan: DataTypes.STRING,
  date: DataTypes.DATEONLY,
  branch_code: DataTypes.STRING,
  request_type: DataTypes.STRING,
  status: DataTypes.STRING,
  remark: DataTypes.STRING,
  remark2: DataTypes.STRING,
  remark3: DataTypes.STRING
}, {
  tableName: 'physical_account',
  timestamps: true
});

module.exports = PhysicalAccount;