import mongoose from 'mongoose'

const siteContentSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true, trim: true },
  title: { type: String, trim: true, default: '' },
  value: { type: String, default: '' },
  group: { type: String, trim: true, default: 'general' }
}, { timestamps: true })

export default mongoose.models.SiteContent || mongoose.model('SiteContent', siteContentSchema)
