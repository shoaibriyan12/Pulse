import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import { entriesRouter } from './routes/entries.js'
import { settingsRouter } from './routes/settings.js'
import { integrationsRouter } from './routes/integrations.js'
import { apiKeyAuth } from './middleware/auth.js'
import { checkDbConnection } from './db.js'

const app = express()
const PORT = Number(process.env.PORT) || 4000
const CORS_ORIGIN = process.env.CORS_ORIGIN || '*'

app.use(helmet())
app.use(cors({ origin: CORS_ORIGIN }))
app.use(express.json())

// Health check does not require auth — useful for Docker healthchecks / load balancers.
app.get('/api/health', async (_req, res) => {
  const dbOk = await checkDbConnection()
  res.status(dbOk ? 200 : 503).json({ status: dbOk ? 'ok' : 'degraded', db: dbOk })
})

app.use('/api/entries', apiKeyAuth, entriesRouter)
app.use('/api/settings', apiKeyAuth, settingsRouter)
app.use('/api/integrations', apiKeyAuth, integrationsRouter)

app.use((_req, res) => {
  res.status(404).json({ error: 'Not found' })
})

app.listen(PORT, () => {
  console.log(`Pulse backend listening on port ${PORT}`)
})
