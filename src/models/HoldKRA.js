const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const HoldKRA = sequelize.define('HoldKRA', {
  client_code: DataTypes.STRING,
  client_name: DataTypes.STRING,
  pan: DataTypes.STRING,
  branch_code: DataTypes.STRING,
  kra_name: DataTypes.STRING,
  kra_status: DataTypes.STRING,
  kra_hold_reason: DataTypes.STRING
}, {
  tableName: 'hold_kra_status',
  timestamps: true
});

module.exports = HoldKRA;