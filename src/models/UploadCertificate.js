const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const UploadCertificate = sequelize.define('UploadCertificate', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  file_name: {
    type: DataTypes.STRING(255)
  },
  file_url: {
    type: DataTypes.TEXT
  }
}, {
  tableName: 'upload_certificates',
  timestamps: true
});

module.exports = UploadCertificate;
