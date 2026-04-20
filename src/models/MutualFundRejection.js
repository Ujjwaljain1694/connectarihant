const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const MutualFundRejection = sequelize.define('MutualFundRejection', {
  client_code: DataTypes.STRING,
  client_name: DataTypes.STRING,
  amount: DataTypes.FLOAT,
  buy_sell: DataTypes.STRING,
  dp_transfer: DataTypes.STRING,
  dp_folio_no: DataTypes.STRING,
  euin: DataTypes.STRING,
  order_no: DataTypes.STRING,
  order_remark: DataTypes.STRING,
  order_type: DataTypes.STRING,
  scheme_name: DataTypes.STRING,
  sip_type: DataTypes.STRING,
  sip_date: DataTypes.DATEONLY,
  sip_regn_date: DataTypes.DATEONLY,
  units: DataTypes.FLOAT
}, {
  tableName: 'mutual_fund_rejection',
  timestamps: true
});

module.exports = MutualFundRejection;
