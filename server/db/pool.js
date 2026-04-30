require('dotenv').config();
const { Pool } = require('pg');

const config = {
  host: process.env.PGHOST,
  port: process.env.PGPORT,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
};

// ✍️ TODO 3: Create a separate config for production environments that use a connectionString
const prodConfig = {
  connectionString: process.env.PG_CONNECTION_STRING,
};

// ✍️ TODO 4: If PG_CONNECTION_STRING is available, use the prodConfig, otherwise use devConfig

const pool = new Pool(process.env.PG_CONNECTION_STRING ? prodConfig : config);

module.exports = pool;
