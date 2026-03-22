// Run: node migrate-settings.js
require("dotenv").config({ path: ".env.local" });
const mysql = require("mysql2/promise");

async function migrate() {
  const conn = await mysql.createConnection({
    host: process.env.DATABASE_HOST,
    port: Number(process.env.DATABASE_PORT) || 3306,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
  });

  await conn.execute(`
    CREATE TABLE IF NOT EXISTS site_settings (
      id INT AUTO_INCREMENT PRIMARY KEY,
      setting_key VARCHAR(255) NOT NULL UNIQUE,
      setting_value TEXT NOT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `);

  await conn.execute(`
    INSERT IGNORE INTO site_settings (setting_key, setting_value)
    VALUES ('video_enabled', 'true')
  `);

  console.log("site_settings table created with default video_enabled=true");
  await conn.end();
}

migrate().catch(console.error);
