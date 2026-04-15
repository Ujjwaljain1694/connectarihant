const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const BranchPerformance = sequelize.define('BranchPerformance', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  manager_id: {
    type: DataTypes.STRING
  },
  branch_code: {
    type: DataTypes.STRING
  },
  branch_name: {
    type: DataTypes.STRING
  },
  gross_revenue: {
    type: DataTypes.DECIMAL(15,2)
  },
  total_clients: {
    type: DataTypes.INTEGER
  },
  active_clients: {
    type: DataTypes.INTEGER
  },
  mobile_app_download: {
    type: DataTypes.INTEGER
  },
  mf_aum: {
    type: DataTypes.STRING
  },
  mf_sip: {
    type: DataTypes.STRING
  },
  no_of_sip: {
    type: DataTypes.INTEGER
  },
  pms_aum: {
    type: DataTypes.STRING
  },
  wealth_basket: {
    type: DataTypes.STRING
  },
  pre_ipo_deals: {
    type: DataTypes.STRING
  },
  branch_brokerage: {
    type: DataTypes.STRING
  },
  remark: {
    type: DataTypes.STRING
  },
  date: {
    type: DataTypes.DATE
  }
}, {
  tableName: 'branch_performance',
  timestamps: true
});

module.exports = BranchPerformance;