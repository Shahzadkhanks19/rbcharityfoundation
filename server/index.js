import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import rateLimit from 'express-rate-limit'
import helmet from 'helmet'
import mongoose from 'mongoose'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { adminBodyPolicy } from './middleware/adminBodyPolicy.js'
import { adminSessionMiddleware } from './middleware/adminSession.js'
import adminRoutes from './routes/admin.js'
import campaignRoutes from './routes/campaigns.js'
import causeRoutes from './routes/causes.js'
import contactRoutes from './routes/contact.js'
import donationRoutes from './routes/donations.js'
import mediaRoutes from './routes/media.js'
import partnerRoutes from './routes/partners.js'
import publicContentRoutes from './routes/publicContent.js'
import razorpayWebhookRoutes from './routes/razorpayWebhook.js'
import volunteerRoutes from './routes/volunteers.js'

dotenv.config()

const app = express()
const PORT = Number(process.env.PORT || 5000)
const isProduction = process.env.NODE_ENV === 'production'
const isVercel = Boolean(process.env.VERCEL)
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const distPath = path.resolve(__dirname, '../dist')

mongoose.set('autoIndex', !isProduction)

const requiredProductionEnv = [
  'MONGODB_URI',
  'JWT_SECRET',
  'ADMIN_EMAIL',
  'ADMIN_PASSWORD',
  'RAZORPAY_KEY_ID',
  'RAZORPAY_KEY_SECRET',
  'RAZORPAY_WEBHOOK_SECRET',
  'CLOUDINARY_CLOUD_NAME',
  'CLOUDINARY_API_KEY',
  'CLOUDINARY_API_SECRET',
]

function getRuntimeConfigError() {
  if (!isProduction) return ''
  const missing = requiredProductionEnv.filter((name) => !String(process.env[name] || '').trim())
  if (missing.length) return `Missing required production environment variables: ${missing.join(', ')}`
  if (String(process.env.JWT_SECRET).length < 32) return 'JWT_SECRET must be at least 32 characters in production.'
  return ''
}

let connectionPromise = null
async function ensureDatabaseConnection() {
  if (mongoose.connection.readyState === 1) return mongoose.connection
  if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI is not configured.')
  if (!connectionPromise) {
    connectionPromise = mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
      maxPoolSize: isVercel ? 5 : 10,
    }).catch((error) => {
      connectionPromise = null
      throw error
    })
  }
  await connectionPromise
  return mongoose.connection
}

app.disable('x-powered-by')
if (isProduction) app.set('trust proxy', 1)

app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}))

const allowedOrigins = String(process.env.CLIENT_URL || (isProduction ? '' : 'http://localhost:5173'))
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean)

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true)
    return callback(new Error('Origin is not allowed by CORS.'))
  },
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-razorpay-signature'],
  maxAge: 86400,
}))

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests. Please try again shortly.' },
})
const adminAuthLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { success: false, message: 'Too many authentication attempts. Please try again later.' },
})

app.use('/api', async (_req, res, next) => {
  const configError = getRuntimeConfigError()
  if (configError) {
    console.error(configError)
    return res.status(503).json({ success: false, message: 'Production configuration is incomplete.' })
  }
  try {
    await ensureDatabaseConnection()
    next()
  } catch (error) {
    console.error('MongoDB connection failed:', error.message)
    res.status(503).json({ success: false, message: 'Database is temporarily unavailable.' })
  }
})

app.use('/api', apiLimiter)
app.use('/api/admin/login', adminAuthLimiter)
app.use('/api/admin/forgot-password', adminAuthLimiter)
app.use('/api/admin/reset-password', adminAuthLimiter)

// Razorpay signature verification requires the untouched raw body, so mount this before express.json().
app.use('/api/donations/webhook', razorpayWebhookRoutes)
app.use(express.json({ limit: '1mb' }))

app.get('/api/health', (_req, res) => {
  const dbReady = mongoose.connection.readyState === 1
  res.status(dbReady ? 200 : 503).json({
    success: dbReady,
    service: 'RB Charity Foundation API',
    database: dbReady ? 'connected' : 'unavailable',
    runtime: isVercel ? 'vercel' : 'node',
  })
})

app.use('/api/admin/media', mediaRoutes)
app.use('/api/admin', adminSessionMiddleware, adminBodyPolicy, adminRoutes)
app.use('/api/public', publicContentRoutes)
app.use('/api/causes', causeRoutes)
app.use('/api/campaigns', campaignRoutes)
app.use('/api/donations', donationRoutes)
app.use('/api/volunteers', volunteerRoutes)
app.use('/api/partners', partnerRoutes)
app.use('/api/contact', contactRoutes)

app.use('/api', (_req, res) => res.status(404).json({ success: false, message: 'API route not found.' }))

if (isProduction && !isVercel) {
  app.use(express.static(distPath, {
    index: false,
    maxAge: '1y',
    immutable: true,
    setHeaders(res, filePath) {
      if (filePath.endsWith('index.html')) res.setHeader('Cache-Control', 'no-cache')
    },
  }))
  app.get('*splat', (_req, res) => res.sendFile(path.join(distPath, 'index.html')))
}

app.use((error, _req, res, _next) => {
  console.error(error)
  if (res.headersSent) return
  res.status(error?.message === 'Origin is not allowed by CORS.' ? 403 : 500).json({
    success: false,
    message: error?.message === 'Origin is not allowed by CORS.'
      ? 'Request origin is not allowed.'
      : 'Something went wrong. Please try again.',
  })
})

let server
async function startServer() {
  const configError = getRuntimeConfigError()
  if (configError) throw new Error(configError)

  if (process.env.MONGODB_URI) {
    await ensureDatabaseConnection()
    console.log('MongoDB connected')
  } else if (isProduction) {
    throw new Error('MONGODB_URI is required in production.')
  } else {
    console.warn('MONGODB_URI is not configured. API is running without a database connection.')
  }

  server = app.listen(PORT, () => console.log(`RB Charity API running on port ${PORT}`))
}

async function shutdown(signal) {
  console.log(`${signal} received. Shutting down gracefully...`)
  if (server) await new Promise((resolve) => server.close(resolve))
  if (mongoose.connection.readyState !== 0) await mongoose.connection.close()
  process.exit(0)
}

if (!isVercel) {
  process.on('SIGTERM', () => void shutdown('SIGTERM'))
  process.on('SIGINT', () => void shutdown('SIGINT'))
  process.on('unhandledRejection', (error) => {
    console.error('Unhandled promise rejection:', error)
    if (isProduction) process.exit(1)
  })
  process.on('uncaughtException', (error) => {
    console.error('Uncaught exception:', error)
    process.exit(1)
  })

  startServer().catch((error) => {
    console.error('Server startup failed:', error.message)
    process.exit(1)
  })
}

export default app
