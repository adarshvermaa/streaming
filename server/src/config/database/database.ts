import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { ENV } from '../env'; // Assuming your environment variables are here

// Create a PostgreSQL client using the pg library
const pool = new Pool({
  host: ENV.DB_HOST,
  database: ENV.DB_NAME,
  user: ENV.DB_USER,
  password: ENV.DB_PASS,
  port: ENV.DB_PORT,
  ssl: {
    rejectUnauthorized: false, // Adjust SSL options if necessary
  },
});

// Initialize Drizzle ORM with the PostgreSQL connection pool
const db = drizzle(pool);

async function testConnection() {
  try {
    // You can run a simple query to test the connection
    await db.execute('SELECT 1');
    console.log('Database connected successfully');
  } catch (error) {
    console.error('Database connection failed:', error);
  }
}

// Call the test function
testConnection();

export default db

