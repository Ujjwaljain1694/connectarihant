const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ThirdParty = sequelize.define('ThirdParty', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  manager_id: {
    type: DataTypes.STRING(9),
    allowNull: false,
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  amount: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 0,
  },
}, {
  tableName: 'third_parties',
  timestamps: true,
});

module.exports = ThirdParty;
