import mongoose from 'mongoose'

const contactMessageSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, trim: true, lowercase: true, default: '' },
  phone: { type: String, trim: true, default: '' },
  category: { type: String, enum: ['general', 'donation', 'volunteer', 'partnership', 'campaign', 'other'], default: 'general' },
  subject: { type: String, trim: true, default: '' },
  message: { type: String, required: true },
  status: { type: String, enum: ['new', 'read', 'replied', 'archived'], default: 'new' }
}, { timestamps: true })

export default mongoose.models.ContactMessage || mongoose.model('ContactMessage', contactMessageSchema)
