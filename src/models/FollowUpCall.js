const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const FollowUpCall = sequelize.define("FollowUpCall", {
  client_code: DataTypes.STRING,
  client_name: DataTypes.STRING,
  call_date: DataTypes.DATEONLY,
  message: DataTypes.TEXT,
  remark: DataTypes.STRING
}, {
  tableName: "followup_calls",
  timestamps: true
});

module.exports = FollowUpCall;
