const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Certificate = sequelize.define('Certificate', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  certificate_name: {
    type: DataTypes.STRING(255)
  },
  certificate_file_url: {
    type: DataTypes.TEXT
  },
  issue_date: {
    type: DataTypes.DATEONLY
  },
  expiry_date: {
    type: DataTypes.DATEONLY
  }
}, {
  tableName: 'certificates',
  timestamps: true // enabled since you are querying createdAt
});

module.exports = Certificate;
