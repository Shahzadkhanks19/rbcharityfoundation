import mongoose from 'mongoose'

const donationSchema = new mongoose.Schema(
  {
    donorName: { type: String, trim: true, required: true },
    email: { type: String, trim: true, lowercase: true, required: true },
    phone: { type: String, trim: true, required: true },
    amount: { type: Number, required: true, min: 1 },
    destination: { type: String, enum: ['general', 'cause', 'campaign'], default: 'general' },
    cause: { type: String, default: 'General Fund' },
    causeSlug: { type: String, trim: true, default: '' },
    campaignSlug: { type: String, trim: true, default: '' },
    paymentId: { type: String, default: null },
    status: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' }
  },
  { timestamps: true }
)

export default mongoose.models.Donation || mongoose.model('Donation', donationSchema)
