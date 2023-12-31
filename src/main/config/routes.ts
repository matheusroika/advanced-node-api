import { Router } from 'express'
import type { Express } from 'express'
import { readdirSync } from 'fs'
import path from 'path'

export const setupRoutes = (app: Express): void => {
  const router = Router()
  readdirSync(path.join(__dirname, '../routes'))
    .filter(file => !file.endsWith('.map'))
    .forEach(async file => {
      (await import(`../routes/${file}`)).default(router)
    })
  app.use('/api', router)
}
