const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const BondOffer = sequelize.define('BondOffer', {
  security_name: DataTypes.STRING,
  isin: DataTypes.STRING,
  ip_frequency: DataTypes.STRING,
  price: DataTypes.FLOAT,
  ytm: DataTypes.FLOAT,
  face_value: DataTypes.INTEGER,
  type: DataTypes.STRING,
  ratings: DataTypes.STRING
}, {
  tableName: 'bond_offer_data',
  timestamps: true
});

module.exports = BondOffer;
