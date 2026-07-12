import { readFileSync, readdirSync } from 'fs'
import { fileURLToPath } from 'url'
import path from 'path'
import 'dotenv/config'
import { pool } from './db.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const migrationsDir = path.resolve(__dirname, '../migrations')

async function run() {
  const files = readdirSync(migrationsDir)
    .filter((f) => f.endsWith('.sql'))
    .sort()

  console.log(`Found ${files.length} migration file(s) in ${migrationsDir}`)

  for (const file of files) {
    const sql = readFileSync(path.join(migrationsDir, file), 'utf-8')
    console.log(`Applying ${file}...`)
    await pool.query(sql)
    console.log(`Applied ${file}`)
  }

  console.log('All migrations applied successfully.')
  await pool.end()
}

run().catch((err) => {
  console.error('Migration failed:', err)
  process.exit(1)
})
