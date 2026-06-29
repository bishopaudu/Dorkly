import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import dotenv from 'dotenv'
import { dorksRouter } from './routes/dorks'
import { templatesRouter } from './routes/templates'
import { scannerRouter } from './routes/scanner'
import { githubRouter } from './routes/github'
import { ghdbRouter } from './routes/ghdb'
import { exportRouter } from './routes/export'
import { crtshRouter } from './routes/crtsh'
import { generalLimiter, scanLimiter, syncLimiter, exportLimiter } from './middleware/rateLimit'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

const allowedOrigins = [
  process.env.CLIENT_URL,
  'http://localhost:5173',
  'http://localhost:4173',
].filter(Boolean) as string[]

app.use(helmet())
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.some(o => origin.startsWith(o))) {
      callback(null, true)
    } else {
      callback(new Error(`CORS: origin ${origin} not allowed`))
    }
  },
  credentials: true,
}))
app.use(morgan('dev'))
app.use(express.json())
app.use(generalLimiter)

app.get('/health', (_req, res) => res.json({ status: 'ok', service: 'dorkly-api', env: process.env.NODE_ENV }))
app.use('/api/dorks', dorksRouter)
app.use('/api/templates', templatesRouter)
app.use('/api/scanner', scanLimiter, scannerRouter)
app.use('/api/github', scanLimiter, githubRouter)
app.use('/api/ghdb/sync', syncLimiter)
app.use('/api/ghdb', ghdbRouter)
app.use('/api/export', exportLimiter, exportRouter)
app.use('/api/crtsh', scanLimiter, crtshRouter)

app.listen(PORT, () => console.log(`Dorkly API running on port ${PORT} [${process.env.NODE_ENV}]`))
