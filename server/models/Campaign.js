import mongoose from 'mongoose'

const campaignSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
  cause: { type: mongoose.Schema.Types.ObjectId, ref: 'Cause', default: null },
  summary: { type: String, default: '' },
  description: { type: String, default: '' },
  goalAmount: { type: Number, min: 0, default: 0 },
  raisedAmount: { type: Number, min: 0, default: 0 },
  coverImage: { type: String, default: '' },
  startsAt: { type: Date, default: null },
  endsAt: { type: Date, default: null },
  status: { type: String, enum: ['draft', 'active', 'completed', 'paused', 'archived'], default: 'draft' },
  featured: { type: Boolean, default: false }
}, { timestamps: true })

export default mongoose.models.Campaign || mongoose.model('Campaign', campaignSchema)
