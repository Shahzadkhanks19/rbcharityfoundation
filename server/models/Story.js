import mongoose from 'mongoose'

const storySchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
  excerpt: { type: String, default: '' },
  content: { type: String, default: '' },
  coverImage: { type: String, default: '' },
  cause: { type: mongoose.Schema.Types.ObjectId, ref: 'Cause', default: null },
  campaign: { type: mongoose.Schema.Types.ObjectId, ref: 'Campaign', default: null },
  status: { type: String, enum: ['draft', 'published', 'archived'], default: 'draft' },
  publishedAt: { type: Date, default: null }
}, { timestamps: true })

export default mongoose.models.Story || mongoose.model('Story', storySchema)
