const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ComplianceCircular = sequelize.define('ComplianceCircular', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  compliance_type: DataTypes.STRING,
  file_name: DataTypes.STRING,
  file_url: DataTypes.STRING,
  date: DataTypes.DATE
}, {
  tableName: 'compliance_circular',
  timestamps: true
});

module.exports = ComplianceCircular;