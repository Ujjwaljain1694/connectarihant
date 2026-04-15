const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Modification = sequelize.define('Modification', {
  client_code: DataTypes.STRING,
  client_name: DataTypes.STRING,
  pan: DataTypes.STRING,
  date: DataTypes.DATEONLY,
  branch_code: DataTypes.STRING,
  request_type: DataTypes.STRING,
  status: DataTypes.STRING,
  remark: DataTypes.STRING
}, {
  tableName: 'modification_status',
  timestamps: true
});

module.exports = Modification;