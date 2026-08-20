import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import mongoose from 'mongoose'
import campaignRoutes from './routes/campaigns.js'
import causeRoutes from './routes/causes.js'
import donationRoutes from './routes/donations.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }))
app.use(express.json())

app.get('/api/health', (_req, res) => {
  res.json({ success: true, service: 'RB Charity Foundation API' })
})

app.use('/api/causes', causeRoutes)
app.use('/api/campaigns', campaignRoutes)
app.use('/api/donations', donationRoutes)

async function startServer() {
  if (process.env.MONGODB_URI) {
    try {
      await mongoose.connect(process.env.MONGODB_URI)
      console.log('MongoDB connected')
    } catch (error) {
      console.error('MongoDB connection failed:', error.message)
    }
  } else {
    console.warn('MONGODB_URI is not configured. API is running without a database connection.')
  }

  app.listen(PORT, () => console.log(`RB Charity API running on port ${PORT}`))
}

startServer()
