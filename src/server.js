require('dotenv').config();
const app = require('./app');
const { sequelize } = require('./models');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Test DB connection
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.');

    // Sync all models (alter:true is safe for dev; use migrations in production)
    await sequelize.sync();
    console.log('✅ Database models synchronized.');

    app.listen(PORT, () => {
      console.log('\n🚀 Connect Fintech API Server');
      console.log(`   Environment : ${process.env.NODE_ENV}`);
      console.log(`   Port        : ${PORT}`);
      console.log(`   Health      : http://localhost:${PORT}/health`);
      console.log(`   Base URL    : http://localhost:${PORT}/api\n`);
    });
  } catch (err) {
    console.error('❌ Failed to start server:', err);
    process.exit(1);
  }
};

startServer();
