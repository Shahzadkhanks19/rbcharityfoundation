import mongoose from 'mongoose'

const reportSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  type: { type: String, trim: true, default: 'impact' },
  year: { type: Number, default: null },
  fileUrl: { type: String, trim: true, default: '' },
  summary: { type: String, default: '' },
  status: { type: String, enum: ['draft', 'published', 'archived'], default: 'draft' }
}, { timestamps: true })

reportSchema.index({ status: 1, year: -1 })

export default mongoose.models.Report || mongoose.model('Report', reportSchema)
