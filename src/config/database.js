require('dotenv').config();
const { Sequelize } = require('sequelize');

const sequelize = process.env.DATABASE_URL
  ? new Sequelize(process.env.DATABASE_URL, {
      dialect: 'mysql',
      logging: process.env.NODE_ENV === 'development' ? console.log : false,
      pool: {
        max: 10,
        min: 0,
        acquire: 30000,
        idle: 10000,
      },
      define: {
        timestamps: true,
        underscored: false,
      },
    })
  : new Sequelize(
      process.env.MYSQLDATABASE || process.env.DB_NAME,
      process.env.MYSQLUSER || process.env.DB_USER,
      process.env.MYSQLPASSWORD || process.env.DB_PASSWORD,
      {
        host: process.env.MYSQLHOST || process.env.DB_HOST || 'localhost',
        port: process.env.MYSQLPORT || process.env.DB_PORT || 3306,
        dialect: 'mysql',
        logging: process.env.NODE_ENV === 'development' ? console.log : false,
        pool: {
          max: 10,
          min: 0,
          acquire: 30000,
          idle: 10000,
        },
        define: {
          timestamps: true,
          underscored: false,
        },
      }
    );

module.exports = sequelize;
