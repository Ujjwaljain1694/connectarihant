const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const MarketingMaterial = sequelize.define("MarketingMaterial", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  category: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  file_name: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  create_date: {
    type: DataTypes.DATEONLY
  }
}, {
  tableName: "marketing_material",
  timestamps: false
});

module.exports = MarketingMaterial;
