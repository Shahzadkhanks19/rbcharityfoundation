import mongoose from 'mongoose'

const donationSchema = new mongoose.Schema(
  {
    donorName: { type: String, trim: true },
    email: { type: String, trim: true, lowercase: true },
    phone: { type: String, trim: true },
    amount: { type: Number, required: true, min: 1 },
    cause: { type: String, default: 'General Fund' },
    paymentId: { type: String, default: null },
    status: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' }
  },
  { timestamps: true }
)

export default mongoose.models.Donation || mongoose.model('Donation', donationSchema)
