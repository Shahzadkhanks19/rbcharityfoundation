import mongoose from 'mongoose'

const donorSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, trim: true, lowercase: true, default: '' },
  phone: { type: String, trim: true, default: '' },
  passwordHash: { type: String, default: '' },
  emailVerified: { type: Boolean, default: false },
  phoneVerified: { type: Boolean, default: false },
  status: { type: String, enum: ['active', 'blocked', 'deleted'], default: 'active' },
  preferences: {
    campaignUpdates: { type: Boolean, default: true },
    foundationUpdates: { type: Boolean, default: true }
  }
}, { timestamps: true })

donorSchema.index({ email: 1 }, { unique: true, sparse: true })
donorSchema.index({ phone: 1 }, { unique: true, sparse: true })

export default mongoose.models.Donor || mongoose.model('Donor', donorSchema)
