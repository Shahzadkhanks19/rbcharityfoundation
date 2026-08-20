import mongoose from 'mongoose'

const activityLogSchema = new mongoose.Schema({
  actor: { type: String, trim: true, default: 'admin' },
  action: { type: String, required: true, trim: true },
  resource: { type: String, trim: true, default: '' },
  resourceId: { type: String, trim: true, default: '' },
  details: { type: String, default: '' }
}, { timestamps: true })

export default mongoose.models.ActivityLog || mongoose.model('ActivityLog', activityLogSchema)
