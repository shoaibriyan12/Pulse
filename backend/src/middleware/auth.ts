import type { NextFunction, Request, Response } from 'express'

// If API_KEY is set in the environment, every request must include it in
// the "x-api-key" header. If API_KEY is not set, auth is disabled — useful
// for local development, but you should set one before exposing the API
// publicly.
export function apiKeyAuth(req: Request, res: Response, next: NextFunction) {
  const expected = process.env.API_KEY
  if (!expected) return next()

  const provided = req.header('x-api-key')
  if (provided && provided === expected) return next()

  res.status(401).json({ error: 'Unauthorized' })
}
