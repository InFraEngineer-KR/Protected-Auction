require('dotenv').config(); // .env 파일의 변수들을 로드합니다.
const { Pool } = require('pg');

// process.env를 사용하여 보안성과 유지보수성을 높입니다.
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT, 10) || 5432
});

module.exports = pool;
