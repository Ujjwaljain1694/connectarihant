const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const MtfBalance = sequelize.define('MtfBalance', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  client_code: {
    type: DataTypes.STRING
  },
  client_name: {
    type: DataTypes.STRING
  },
  balance: {
    type: DataTypes.DECIMAL(12, 2)
  }
}, {
  tableName: 'mtf_balance',
  timestamps: true // Enabled as per original request requiring createdAt
});

module.exports = MtfBalance;
