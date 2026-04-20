const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const DPSlip = sequelize.define('DPSlip', {
  client_code: DataTypes.STRING,
  client_name: DataTypes.STRING,
  file_name: DataTypes.STRING,
  file_url: DataTypes.STRING,
  from_date: DataTypes.DATEONLY,
  to_date: DataTypes.DATEONLY
}, {
  tableName: 'dp_slip',
  timestamps: true
});

module.exports = DPSlip;
