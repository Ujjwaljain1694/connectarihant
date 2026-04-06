const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Position = sequelize.define('Position', {
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
  position_type: {
    type: DataTypes.ENUM('Open', 'Global', 'FO_Global'),
    allowNull: false,
  },
  script_name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  script_code: {
    type: DataTypes.STRING(20),
    allowNull: true,
  },
  exchange: {
    type: DataTypes.STRING(10),
    allowNull: true,
  },
  product: {
    type: DataTypes.STRING(20),
    allowNull: true,
  },
  buy_qty: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 0,
  },
  sell_qty: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 0,
  },
  net_qty: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 0,
  },
  buy_avg: {
    type: DataTypes.DECIMAL(15, 4),
    defaultValue: 0,
  },
  sell_avg: {
    type: DataTypes.DECIMAL(15, 4),
    defaultValue: 0,
  },
  ltp: {
    type: DataTypes.DECIMAL(15, 4),
    defaultValue: 0,
    comment: 'Last Traded Price',
  },
  value: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 0,
  },
  pnl: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 0,
    comment: 'Profit and Loss',
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'positions',
  indexes: [
    { fields: ['client_code'] },
    { fields: ['position_type'] },
    { fields: ['date'] },
  ],
});

module.exports = Position;
