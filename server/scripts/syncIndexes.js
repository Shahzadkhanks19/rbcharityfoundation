import dotenv from 'dotenv'
import mongoose from 'mongoose'
import '../models/ActivityLog.js'
import '../models/AdminAccount.js'
import '../models/Campaign.js'
import '../models/Cause.js'
import '../models/ContactMessage.js'
import '../models/Donation.js'
import '../models/Donor.js'
import '../models/FoundationSetting.js'
import '../models/GalleryItem.js'
import '../models/Partner.js'
import '../models/Report.js'
import '../models/Story.js'
import '../models/Volunteer.js'

dotenv.config()

if (!process.env.MONGODB_URI) {
  console.error('MONGODB_URI is required to sync indexes.')
  process.exit(1)
}

try {
  await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 10000 })
  for (const model of Object.values(mongoose.models)) {
    const result = await model.syncIndexes()
    console.log(`${model.modelName}: indexes synced`, result)
  }
  await mongoose.connection.close()
  console.log('MongoDB index sync complete.')
} catch (error) {
  console.error('MongoDB index sync failed:', error)
  try { await mongoose.connection.close() } catch {}
  process.exit(1)
}
