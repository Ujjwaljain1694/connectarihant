require('dotenv').config();
const { sequelize, Manager, Client, Holding, Position, OTP } = require('../models');

const seed = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ DB Connected. Starting seed...\n');

    // Disable foreign key checks
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 0;');
    console.log('🔄 Foreign key checks disabled.');

    // Drop all existing tables (including those not managed by Sequelize)
    const [tables] = await sequelize.query('SHOW TABLES');
    for (const table of tables) {
      const tableName = Object.values(table)[0];
      await sequelize.query(`DROP TABLE IF EXISTS \`${tableName}\`;`);
      console.log(`🗑️  Dropped table: ${tableName}`);
    }

    // Sync tables
    await sequelize.sync({ force: true });
    console.log('✅ Tables managed by models synchronized.\n');

    // Re-enable foreign key checks
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 1;');
    console.log('🔄 Foreign key checks re-enabled.');

    // ── Managers ───────────────────────────────────────────────────────────────
    await Manager.bulkCreate([
      { manager_id: 'BRAP21001', name: 'ACML - PANKAJ', phone: '9876543210', is_active: true },
      { manager_id: 'BRAP21002', name: 'ACML - DEMO',   phone: '9876500000', is_active: true },
    ]);
    console.log('✅ Managers seeded.');

    // ── Clients (matching screenshots exactly) ────────────────────────────────
    await Client.bulkCreate([
      { manager_id: 'BRAP21001', client_code: 'AP2100001', client_name: 'SURAJ SUNIL RAJOLE',        pan: 'ABCPR1234A', mobile: '9876543201', email: 'suraj.rajole@email.com',      status: 'Active',   app_login_count: 1 },
      { manager_id: 'BRAP21001', client_code: '295900016', client_name: 'RINAZ MUSHTAQUE SHAIKH',    pan: 'BCQRS5678B', mobile: '9876543202', email: 'rinaz.shaikh@email.com',     status: 'Active',   app_login_count: 1 },
      { manager_id: 'BRAP21001', client_code: '294900009', client_name: 'USMANGANI SALIM MURAD',     pan: 'CDRTU9012C', mobile: '9876543203', email: 'usmangani.murad@email.com',  status: 'Active',   app_login_count: 0 },
      { manager_id: 'BRAP21001', client_code: '293900005', client_name: 'SHACHI AMITKUMAR KHAMAR',   pan: 'DESVU3456D', mobile: '9876543204', email: 'shachi.khamar@email.com',    status: 'Active',   app_login_count: 1 },
      { manager_id: 'BRAP21001', client_code: '28890S022', client_name: 'CHAUDHARY SURESHBHAI A',    pan: 'EFTWX7890E', mobile: '9876543205', email: 'sureshbhai.a@email.com',     status: 'Active',   app_login_count: 0 },
      { manager_id: 'BRAP21001', client_code: '28640N021', client_name: 'NILESH DILIP JADHAV',       pan: 'FGUXY2345F', mobile: '9876543206', email: 'nilesh.jadhav@email.com',    status: 'Active',   app_login_count: 0 },
      { manager_id: 'BRAP21001', client_code: '28640A085', client_name: 'ANAND SUNIL RAJOLE',        pan: 'GHVYZ6789G', mobile: '9876543207', email: 'anand.rajole@email.com',     status: 'Active',   app_login_count: 1 },
      { manager_id: 'BRAP21001', client_code: '286400044', client_name: 'VINAY SHAH',                pan: 'HIWZA1234H', mobile: '9876543208', email: 'vinay.shah@email.com',       status: 'Active',   app_login_count: 0 },
      { manager_id: 'BRAP21001', client_code: '286400026', client_name: 'VIVEK SHAH',                pan: 'IJXAB5678I', mobile: '9876543209', email: 'vivek.shah@email.com',       status: 'Active',   app_login_count: 0 },
      { manager_id: 'BRAP21001', client_code: '286400023', client_name: 'DHRUVIK BHAVESHKUMAR SHAH', pan: 'JKYBC9012J', mobile: '9876543210', email: 'dhruvik.shah@email.com',     status: 'Active',   app_login_count: 0 },
      { manager_id: 'BRAP21001', client_code: '27630B001', client_name: 'BHAVESHKUMAR R SHAH',       pan: 'KLZCD3456K', mobile: '9876543211', email: 'bhavesh.shah@email.com',     status: 'Inactive', app_login_count: 0 },
    ]);
    console.log('✅ Clients seeded (11 total: 10 Active, 1 Inactive).');

    // ── Holdings (matching screenshot data) ───────────────────────────────────
    const today = new Date().toISOString().split('T')[0];
    await Holding.bulkCreate([
      // SURAJ SUNIL RAJOLE - AP2100001
      { client_code: 'AP2100001', script_code: '539217',       script_name: 'SRESTHA',                    isin: 'INE606K01049', pledge_poa: 0, free_poa: 252, mtf_qty: 0, net_qty: 252,  stock_value: 55.44,    close_rate: 0.22,   date: today },
      { client_code: 'AP2100001', script_code: '540614',       script_name: 'GGENG',                      isin: 'INE694X01030', pledge_poa: 0, free_poa: 18,  mtf_qty: 0, net_qty: 18,   stock_value: 7.74,     close_rate: 0.43,   date: today },
      { client_code: 'AP2100001', script_code: 'IN8817H01021', script_name: 'BURNPUR CEMENT LIMITED EQ LI', isin: 'IN8817H01021', pledge_poa: 0, free_poa: 1, mtf_qty: 0, net_qty: 1,  stock_value: 0,        close_rate: 0,      date: today },

      // RINAZ MUSHTAQUE SHAIKH - 295900016
      { client_code: '295900016', script_code: 'SIL0006',      script_name: 'SILVERBEES',                 isin: 'INF204KC1402', pledge_poa: 0, free_poa: 37,  mtf_qty: 0, net_qty: 37,   stock_value: 7990.15,  close_rate: 215.95, date: today },
      { client_code: '295900016', script_code: '531642',       script_name: 'MARICO',                     isin: 'INE196A01026', pledge_poa: 0, free_poa: 2,   mtf_qty: 0, net_qty: 2,    stock_value: 1522.70,  close_rate: 761.35, date: today },
      { client_code: '295900016', script_code: '513599',       script_name: 'HINDCOPPER',                 isin: 'INE531E01026', pledge_poa: 0, free_poa: 5,   mtf_qty: 0, net_qty: 5,    stock_value: 2475.75,  close_rate: 495.15, date: today },

      // USMANGANI SALIM MURAD - 294900009
      { client_code: '294900009', script_code: '532540',       script_name: 'TCS',                        isin: 'INE467B01029', pledge_poa: 0, free_poa: 10,  mtf_qty: 0, net_qty: 10,   stock_value: 35000.00, close_rate: 3500.00, date: today },
      { client_code: '294900009', script_code: '500325',       script_name: 'RELIANCE',                   isin: 'INE002A01018', pledge_poa: 0, free_poa: 5,   mtf_qty: 0, net_qty: 5,    stock_value: 12500.00, close_rate: 2500.00, date: today },

      // SHACHI AMITKUMAR KHAMAR - 293900005
      { client_code: '293900005', script_code: '526483',       script_name: 'INFY',                       isin: 'INE009A01021', pledge_poa: 0, free_poa: 20,  mtf_qty: 0, net_qty: 20,   stock_value: 28000.00, close_rate: 1400.00, date: today },
    ]);
    console.log('✅ Holdings seeded.');

    // ── Positions ─────────────────────────────────────────────────────────────
    await Position.bulkCreate([
      // Open Positions
      { client_code: 'AP2100001', position_type: 'Open',     script_name: 'NIFTY 24000 CE', script_code: 'NIFTY24000CE', exchange: 'NFO',  product: 'NRML', buy_qty: 50,  sell_qty: 0,  net_qty: 50,  buy_avg: 120.50, sell_avg: 0,      ltp: 145.00, value: 7250.00,  pnl: 1225.00,  date: today },
      { client_code: '295900016', position_type: 'Open',     script_name: 'BANKNIFTY FUT',  script_code: 'BNKFUT',       exchange: 'NFO',  product: 'MIS',  buy_qty: 25,  sell_qty: 0,  net_qty: 25,  buy_avg: 44500,  sell_avg: 0,      ltp: 44800,  value: 1120000,  pnl: 7500.00,  date: today },
      { client_code: '294900009', position_type: 'Open',     script_name: 'RELIANCE FUT',   script_code: 'RELFUT',       exchange: 'NFO',  product: 'NRML', buy_qty: 250, sell_qty: 0,  net_qty: 250, buy_avg: 2450,   sell_avg: 0,      ltp: 2500,   value: 625000,   pnl: 12500.00, date: today },

      // Global Positions
      { client_code: 'AP2100001', position_type: 'Global',   script_name: 'GGENG',          script_code: '540614',        exchange: 'BSE',  product: 'CNC',  buy_qty: 18,  sell_qty: 0,  net_qty: 18,  buy_avg: 0.38,   sell_avg: 0,      ltp: 0.43,   value: 7.74,     pnl: 0.90,     date: today },
      { client_code: '295900016', position_type: 'Global',   script_name: 'SILVERBEES',     script_code: 'SIL0006',       exchange: 'BSE',  product: 'CNC',  buy_qty: 37,  sell_qty: 0,  net_qty: 37,  buy_avg: 200.00, sell_avg: 0,      ltp: 215.95, value: 7990.15,  pnl: 590.15,   date: today },
      { client_code: '293900005', position_type: 'Global',   script_name: 'INFY',           script_code: '526483',        exchange: 'NSE',  product: 'CNC',  buy_qty: 20,  sell_qty: 0,  net_qty: 20,  buy_avg: 1350.00, sell_avg: 0,     ltp: 1400,   value: 28000,    pnl: 1000.00,  date: today },

      // FO Global Positions
      { client_code: 'AP2100001', position_type: 'FO_Global', script_name: 'NIFTY 24000 CE', script_code: 'NIFTY24000CE', exchange: 'NFO', product: 'NRML', buy_qty: 50,  sell_qty: 0,  net_qty: 50,  buy_avg: 120.50, sell_avg: 0,      ltp: 145.00, value: 7250.00,  pnl: 1225.00,  date: today },
      { client_code: '295900016', position_type: 'FO_Global', script_name: 'BANKNIFTY FUT',  script_code: 'BNKFUT',       exchange: 'NFO', product: 'MIS',  buy_qty: 25,  sell_qty: 0,  net_qty: 25,  buy_avg: 44500,  sell_avg: 0,      ltp: 44800,  value: 1120000,  pnl: 7500.00,  date: today },
    ]);
    console.log('✅ Positions seeded.\n');

    console.log('─────────────────────────────────────────────────');
    console.log('🌱 Seed completed successfully!');
    console.log('─────────────────────────────────────────────────');
    console.log('\n📋 Test Credentials:');
    console.log('   Manager ID : BRAP21001   (ACML - PANKAJ)');
    console.log('   Manager ID : BRAP21002   (ACML - DEMO)');
    console.log('\n📡 Steps to test:');
    console.log('   1. POST /api/auth/login         { "manager_id": "BRAP21001" }');
    console.log('   2. Check console for OTP (dev mode)');
    console.log('   3. POST /api/auth/verify-otp    { "manager_id": "BRAP21001", "otp": "<otp>" }');
    console.log('   4. Use returned JWT as: Authorization: Bearer <token>\n');

    process.exit(0);
  } catch (err) {
    console.error('❌ Seed failed:', err);
    process.exit(1);
  }
};

seed();
