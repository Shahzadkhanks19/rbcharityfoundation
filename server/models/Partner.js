import mongoose from 'mongoose'

const partnerSchema = new mongoose.Schema({
  organisation: { type: String, required: true, trim: true },
  contactName: { type: String, required: true, trim: true },
  email: { type: String, trim: true, lowercase: true, default: '' },
  phone: { type: String, trim: true, default: '' },
  type: { type: String, enum: ['corporate', 'ngo', 'institution', 'community', 'other'], default: 'other' },
  message: { type: String, default: '' },
  status: { type: String, enum: ['new', 'contacted', 'proposal', 'active', 'closed'], default: 'new' }
}, { timestamps: true })

export default mongoose.models.Partner || mongoose.model('Partner', partnerSchema)
