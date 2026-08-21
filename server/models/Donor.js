import mongoose from 'mongoose'

const donorSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, trim: true, lowercase: true, default: '' },
  phone: { type: String, trim: true, default: '' },
  status: { type: String, enum: ['active', 'blocked', 'deleted'], default: 'active' },
  totalDonated: { type: Number, min: 0, default: 0 },
  donationCount: { type: Number, min: 0, default: 0 },
  lastDonationAt: { type: Date, default: null }
}, { timestamps: true })

donorSchema.index({ email: 1 }, { unique: true, sparse: true })
donorSchema.index({ phone: 1 }, { sparse: true })
donorSchema.index({ status: 1, lastDonationAt: -1 })

export default mongoose.models.Donor || mongoose.model('Donor', donorSchema)
