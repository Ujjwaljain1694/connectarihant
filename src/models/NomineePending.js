const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const NomineePending = sequelize.define('NomineePending', {
  client_code: DataTypes.STRING,
  client_name: DataTypes.STRING,
  mobile: DataTypes.STRING,
  email: DataTypes.STRING
}, {
  tableName: 'nominee_pending',
  timestamps: true
});

module.exports = NomineePending;