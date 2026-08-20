import mongoose from 'mongoose'

const foundationSettingSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true, trim: true },
  value: { type: mongoose.Schema.Types.Mixed, default: '' },
  group: { type: String, trim: true, default: 'general' }
}, { timestamps: true })

export default mongoose.models.FoundationSetting || mongoose.model('FoundationSetting', foundationSettingSchema)
