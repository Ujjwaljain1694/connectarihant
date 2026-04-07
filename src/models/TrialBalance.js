const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const TrialBalance = sequelize.define("TrialBalance", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  client_code: {
    type: DataTypes.STRING,
    allowNull: false
  },
  open_debit: DataTypes.DECIMAL(15, 2),
  open_credit: DataTypes.DECIMAL(15, 2),
  net_debit: DataTypes.DECIMAL(15, 2),
  net_credit: DataTypes.DECIMAL(15, 2)
}, {
  tableName: "trial_balances",
  timestamps: true
});

module.exports = TrialBalance;