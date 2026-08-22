import express from 'express'
import mongoose from 'mongoose'
import Campaign from '../models/Campaign.js'
import { optimizedPublicImage } from '../utils/publicMedia.js'

const router = express.Router()

function optimizeCampaign(campaign, width) {
  if (!campaign) return campaign
  return { ...campaign, coverImage: optimizedPublicImage(campaign.coverImage, width) }
}

router.get('/', async (req, res) => {
  if (mongoose.connection.readyState !== 1) return res.json({ success: true, data: [] })

  try {
    const filter = { status: { $in: ['active', 'completed'] } }
    if (req.query.featured === 'true') filter.featured = true

    const campaigns = await Campaign.find(filter)
      .populate('cause', 'name slug')
      .sort({ featured: -1, createdAt: -1 })
      .lean()

    res.json({ success: true, data: campaigns.map(campaign => optimizeCampaign(campaign, 1100)) })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Unable to load campaigns.', error: error.message })
  }
})

router.get('/:slug', async (req, res) => {
  if (mongoose.connection.readyState !== 1) return res.status(404).json({ success: false, message: 'Campaign not found.' })

  try {
    const campaign = await Campaign.findOne({ slug: req.params.slug, status: { $in: ['active', 'completed'] } })
      .populate('cause', 'name slug')
      .lean()

    if (!campaign) return res.status(404).json({ success: false, message: 'Campaign not found.' })
    res.json({ success: true, data: optimizeCampaign(campaign, 1600) })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Unable to load campaign.', error: error.message })
  }
})

export default router
