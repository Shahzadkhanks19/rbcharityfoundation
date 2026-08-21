import mongoose from 'mongoose'

const causeSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
  summary: { type: String, default: '' },
  description: { type: String, default: '' },
  image: { type: String, default: '' },
  status: { type: String, enum: ['draft', 'published', 'archived'], default: 'draft' },
  order: { type: Number, default: 0 }
}, { timestamps: true })

causeSchema.index({ status: 1, order: 1 })

export default mongoose.models.Cause || mongoose.model('Cause', causeSchema)
