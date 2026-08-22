import express from 'express'
import mongoose from 'mongoose'
import Cause from '../models/Cause.js'
import { optimizedPublicImage } from '../utils/publicMedia.js'

const router = express.Router()

function optimizeCause(cause, width) {
  if (!cause) return cause
  return { ...cause, image: optimizedPublicImage(cause.image, width) }
}

router.get('/', async (_req, res) => {
  if (mongoose.connection.readyState !== 1) return res.json({ success: true, data: [] })

  try {
    const causes = await Cause.find({ status: 'published' }).sort({ order: 1, createdAt: -1 }).lean()
    res.json({ success: true, data: causes.map(cause => optimizeCause(cause, 900)) })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Unable to load causes.', error: error.message })
  }
})

router.get('/:slug', async (req, res) => {
  if (mongoose.connection.readyState !== 1) return res.status(404).json({ success: false, message: 'Cause not found.' })

  try {
    const cause = await Cause.findOne({ slug: req.params.slug, status: 'published' }).lean()
    if (!cause) return res.status(404).json({ success: false, message: 'Cause not found.' })
    res.json({ success: true, data: optimizeCause(cause, 1600) })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Unable to load cause.', error: error.message })
  }
})

export default router
