const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const KRAStatus = sequelize.define('KRAStatus', {
  client_code: DataTypes.STRING,
  client_name: DataTypes.STRING,
  pan: DataTypes.STRING,
  kra_response: DataTypes.STRING,
  ucc_response: DataTypes.STRING
}, {
  tableName: 'kra_status',
  timestamps: true
});

module.exports = KRAStatus;