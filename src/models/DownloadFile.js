const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const DownloadFile = sequelize.define("DownloadFile", {
  category: {
    type: DataTypes.STRING
  },
  subcategory: {
    type: DataTypes.STRING
  },
  file_name: {
    type: DataTypes.STRING
  },
  file_url: {
    type: DataTypes.TEXT
  }
}, {
  tableName: "download_files",
  timestamps: false // ❗ important
});

module.exports = DownloadFile;
