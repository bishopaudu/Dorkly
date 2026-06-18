import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import dotenv from 'dotenv'
import { dorksRouter } from './routes/dorks'
import { templatesRouter } from './routes/templates'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

app.use(helmet())
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }))
app.use(morgan('dev'))
app.use(express.json())

app.get('/health', (_req, res) => res.json({ status: 'ok', service: 'dorkly-api' }))
app.use('/api/dorks', dorksRouter)
app.use('/api/templates', templatesRouter)

app.listen(PORT, () => console.log(`Dorkly API running on http://localhost:${PORT}`))
