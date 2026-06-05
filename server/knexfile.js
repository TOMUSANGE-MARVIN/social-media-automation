// Used by the knex CLI: npx knex --knexfile server/knexfile.js migrate:latest
import 'dotenv/config';

export default {
  client: 'mysql2',
  connection: {
    host:     process.env.DB_HOST     || '127.0.0.1',
    port:     parseInt(process.env.DB_PORT  || '3306'),
    user:     process.env.DB_USER     || 'postify',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME     || 'postify',
  },
  migrations: {
    directory: './server/migrations',
    extension: 'js',
  },
};
