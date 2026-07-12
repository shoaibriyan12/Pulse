import pg from 'pg'

const { Pool } = pg

// The database is hosted on the VM (not in Docker), so we connect over the
// network using DATABASE_URL, e.g.:
//   postgres://pulse_user:password@VM_IP_OR_HOSTNAME:5432/pulse_fitness
if (!process.env.DATABASE_URL) {
  console.error('FATAL: DATABASE_URL environment variable is not set.')
  process.exit(1)
}

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : undefined,
  max: 10,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 5_000,
})

pool.on('error', (err) => {
  console.error('Unexpected error on idle Postgres client', err)
})

export async function checkDbConnection(): Promise<boolean> {
  try {
    await pool.query('SELECT 1')
    return true
  } catch (err) {
    console.error('Database connection check failed:', err)
    return false
  }
}
