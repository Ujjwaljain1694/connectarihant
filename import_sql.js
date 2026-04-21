const fs = require('fs');
const mysql = require('mysql2/promise');
require('dotenv').config();

async function importSql() {
  const connection = await mysql.createConnection({
    host: 'interchange.proxy.rlwy.net',
    port: 18776,
    user: 'root',
    password: 'rAcWljyLIMQwcNAqxDIELyjmIFZdQDGP',
    database: 'railway',
    multipleStatements: true
  });

  try {
    console.log('Connected to Railway database.');
    
    const sqlFile = 'C:\\Users\\indian\\Downloads\\connect-backend\\connect (1).sql';
    let sql = fs.readFileSync(sqlFile, 'utf8');

    // Disable foreign key checks
    await connection.query('SET FOREIGN_KEY_CHECKS = 0;');
    console.log('Disabled foreign key checks.');

    // Drop all existing tables to ensure a clean slate
    const [tables] = await connection.query('SHOW TABLES');
    for (const table of tables) {
      const tableName = Object.values(table)[0];
      await connection.query(`DROP TABLE IF EXISTS \`${tableName}\`;`);
      console.log(`Dropped table: ${tableName}`);
    }

    console.log('Starting SQL execution...');
    
    // Execute the SQL. include setup at the start.
    await connection.query('SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO"; SET FOREIGN_KEY_CHECKS = 0;' + sql);
    
    console.log('Import completed successfully!');

    // Re-enable foreign key checks
    await connection.query('SET FOREIGN_KEY_CHECKS = 1;');
    console.log('Re-enabled foreign key checks.');

  } catch (error) {
    console.error('Error during import:', error);
  } finally {
    await connection.end();
  }
}

importSql();
