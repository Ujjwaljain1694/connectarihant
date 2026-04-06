const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Holding = sequelize.define('Holding', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  client_code: {
    type: DataTypes.STRING(20),
    allowNull: false,
    references: {
      model: 'clients',
      key: 'client_code',
    },
  },
  script_code: {
    type: DataTypes.STRING(20),
    allowNull: true,
  },
  script_name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  isin: {
    type: DataTypes.STRING(20),
    allowNull: true,
  },
  pledge_poa: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 0,
  },
  free_poa: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 0,
  },
  mtf_qty: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 0,
  },
  net_qty: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 0,
  },
  stock_value: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 0,
  },
  close_rate: {
    type: DataTypes.DECIMAL(15, 4),
    defaultValue: 0,
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'holdings',
  indexes: [
    { fields: ['client_code'] },
    { fields: ['date'] },
  ],
});

module.exports = Holding;
