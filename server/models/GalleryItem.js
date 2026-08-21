import mongoose from 'mongoose'

const galleryItemSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  mediaType: { type: String, enum: ['image', 'video'], default: 'image' },
  mediaUrl: { type: String, trim: true, default: '' },
  image: { type: String, trim: true, default: '' },
  category: { type: String, trim: true, default: 'general' },
  caption: { type: String, default: '' },
  status: { type: String, enum: ['draft', 'published', 'archived'], default: 'draft' },
  order: { type: Number, default: 0 }
}, { timestamps: true })

export default mongoose.models.GalleryItem || mongoose.model('GalleryItem', galleryItemSchema)
