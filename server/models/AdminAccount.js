import mongoose from 'mongoose'

const adminAccountSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, trim: true, lowercase: true, index: true },
  passwordHash: { type: String, required: true },
  resetTokenHash: { type: String, default: '' },
  resetTokenExpiresAt: { type: Date, default: null },
  passwordChangedAt: { type: Date, default: null },
  lastLoginAt: { type: Date, default: null },
  status: { type: String, enum: ['active', 'disabled'], default: 'active' }
}, { timestamps: true })

export default mongoose.models.AdminAccount || mongoose.model('AdminAccount', adminAccountSchema)
