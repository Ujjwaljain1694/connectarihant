const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ResearchCall = sequelize.define('ResearchCall', {
  call_type: DataTypes.STRING,
  segment: DataTypes.STRING,
  message: DataTypes.TEXT,
  call_date: DataTypes.DATE
}, {
  tableName: 'research_calls',
  timestamps: true
});

module.exports = ResearchCall;
