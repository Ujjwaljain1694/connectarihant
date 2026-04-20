const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Payout = sequelize.define("Payout", {
  client_code: DataTypes.STRING,
  client_name: DataTypes.STRING,
  ledger_balance: DataTypes.DECIMAL,
  available_balance: DataTypes.DECIMAL,
  margin_balance: DataTypes.DECIMAL
}, {
  tableName: "payout",
  timestamps: true
});

module.exports = Payout;
