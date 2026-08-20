import mongoose from 'mongoose'

const volunteerSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, trim: true, lowercase: true, default: '' },
  phone: { type: String, trim: true, default: '' },
  city: { type: String, trim: true, default: '' },
  skills: [{ type: String, trim: true }],
  availability: { type: String, default: '' },
  message: { type: String, default: '' },
  status: { type: String, enum: ['new', 'reviewing', 'approved', 'assigned', 'inactive'], default: 'new' }
}, { timestamps: true })

export default mongoose.models.Volunteer || mongoose.model('Volunteer', volunteerSchema)
