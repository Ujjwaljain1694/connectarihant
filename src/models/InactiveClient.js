const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const InactiveClient = sequelize.define("InactiveClient", {
  client_code: DataTypes.STRING,
  client_name: DataTypes.STRING,
  mobile: DataTypes.STRING,
  email: DataTypes.STRING,
  pan_number: DataTypes.STRING,
  whatsapp: DataTypes.BOOLEAN,
  remark: DataTypes.STRING,
  mobile_app: DataTypes.STRING,
  sip: DataTypes.STRING
}, {
  tableName: "inactive_clients",
  timestamps: true
});

module.exports = InactiveClient;
