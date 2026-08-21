import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import mongoose from 'mongoose'
import adminRoutes from './routes/admin.js'
import campaignRoutes from './routes/campaigns.js'
import causeRoutes from './routes/causes.js'
import contactRoutes from './routes/contact.js'
import donationRoutes from './routes/donations.js'
import donorAuthRoutes from './routes/donorAuth.js'
import partnerRoutes from './routes/partners.js'
import publicContentRoutes from './routes/publicContent.js'
import volunteerRoutes from './routes/volunteers.js'

dotenv.config()
const app = express()
const PORT = process.env.PORT || 5000
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }))
app.use(express.json({ limit: '1mb' }))
app.get('/api/health', (_req, res) => res.json({ success: true, service: 'RB Charity Foundation API' }))
app.use('/api/admin', adminRoutes)
app.use('/api/public', publicContentRoutes)
app.use('/api/causes', causeRoutes)
app.use('/api/campaigns', campaignRoutes)
app.use('/api/donations', donationRoutes)
app.use('/api/donor', donorAuthRoutes)
app.use('/api/volunteers', volunteerRoutes)
app.use('/api/partners', partnerRoutes)
app.use('/api/contact', contactRoutes)
app.use((error, _req, res, _next) => { console.error(error); res.status(500).json({ success: false, message: 'Something went wrong. Please try again.' }) })
async function startServer() {
  if (process.env.MONGODB_URI) { try { await mongoose.connect(process.env.MONGODB_URI); console.log('MongoDB connected') } catch (error) { console.error('MongoDB connection failed:', error.message) } }
  else console.warn('MONGODB_URI is not configured. API is running without a database connection.')
  app.listen(PORT, () => console.log(`RB Charity API running on port ${PORT}`))
}
startServer()
