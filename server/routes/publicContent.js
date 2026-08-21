import express from 'express'
import FoundationSetting from '../models/FoundationSetting.js'
import GalleryItem from '../models/GalleryItem.js'
import Report from '../models/Report.js'
import SiteContent from '../models/SiteContent.js'
import Story from '../models/Story.js'

const router = express.Router()

router.get('/settings', async (_req, res) => {
  const items = await FoundationSetting.find().lean()
  const settings = Object.fromEntries(items.map(item => [item.key, item.value]))
  res.json({ success: true, settings })
})

router.get('/content', async (_req, res) => {
  const items = await SiteContent.find().lean()
  const content = Object.fromEntries(items.map(item => [item.key, item.value]))
  res.json({ success: true, content })
})

router.get('/gallery', async (_req, res) => {
  const items = await GalleryItem.find({ status: 'published' }).sort({ createdAt: -1 }).lean()
  res.json({ success: true, items })
})

router.get('/reports', async (_req, res) => {
  const items = await Report.find({ status: 'published' }).sort({ year: -1, createdAt: -1 }).lean()
  res.json({ success: true, items })
})

router.get('/stories', async (_req, res) => {
  const items = await Story.find({ status: 'published' }).sort({ publishedAt: -1, createdAt: -1 }).lean()
  res.json({ success: true, items })
})

router.get('/stories/:slug', async (req, res) => {
  const item = await Story.findOne({ slug: req.params.slug, status: 'published' }).lean()
  if (!item) return res.status(404).json({ success: false, message: 'Story not found.' })
  res.json({ success: true, item })
})

export default router
