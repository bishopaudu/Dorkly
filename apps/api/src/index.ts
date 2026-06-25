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
import { generalLimiter, scanLimiter, syncLimiter, exportLimiter } from './middleware/rateLimit'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

app.use(helmet())
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }))
app.use(morgan('dev'))
app.use(express.json())
app.use(generalLimiter)

app.get('/health', (_req, res) => res.json({ status: 'ok', service: 'dorkly-api' }))
app.use('/api/dorks', dorksRouter)
app.use('/api/templates', templatesRouter)
app.use('/api/scanner', scanLimiter, scannerRouter)
app.use('/api/github', scanLimiter, githubRouter)
app.use('/api/ghdb/sync', syncLimiter)
app.use('/api/ghdb', ghdbRouter)
app.use('/api/export', exportLimiter, exportRouter)

app.listen(PORT, () => console.log(`Dorkly API running on http://localhost:${PORT}`))
