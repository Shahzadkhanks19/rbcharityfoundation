import express from 'express'
import Campaign from '../models/Campaign.js'
import Cause from '../models/Cause.js'
import Donation from '../models/Donation.js'
import Donor from '../models/Donor.js'
import FoundationSetting from '../models/FoundationSetting.js'
import GalleryItem from '../models/GalleryItem.js'
import Report from '../models/Report.js'
import Story from '../models/Story.js'
import Volunteer from '../models/Volunteer.js'

const router = express.Router()

router.get('/settings', async (_req, res) => {
  const items = await FoundationSetting.find().lean()
  const settings = Object.fromEntries(items.map(item => [item.key, item.value]))
  res.json({ success: true, settings })
})

router.get('/impact-summary', async (_req, res) => {
  const [paidSummary, donors, causes, campaigns, volunteers] = await Promise.all([
    Donation.aggregate([
      { $match: { status: 'paid' } },
      { $group: { _id: null, totalRaised: { $sum: '$amount' }, donations: { $sum: 1 } } },
    ]),
    Donor.countDocuments({ status: { $ne: 'deleted' } }),
    Cause.countDocuments({ status: 'published' }),
    Campaign.countDocuments({ status: { $in: ['active', 'completed'] } }),
    Volunteer.countDocuments({ status: { $in: ['approved', 'assigned'] } }),
  ])
  const paid = paidSummary[0] || { totalRaised: 0, donations: 0 }
  res.json({
    success: true,
    summary: {
      totalRaised: paid.totalRaised,
      donations: paid.donations,
      donors,
      causes,
      campaigns,
      volunteers,
    },
  })
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
