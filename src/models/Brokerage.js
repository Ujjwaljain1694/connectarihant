const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Brokerage = sequelize.define('Brokerage', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  client_code: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  type: {
    type: DataTypes.ENUM('CAPITAL', 'DERIVATIVE', 'COMMODITY'),
    allowNull: false,
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  turnover: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 0,
  },
  brokerage: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 0,
  },
}, {
  tableName: 'brokerages',
  timestamps: true,
});

module.exports = Brokerage;
