import crypto from 'crypto'
import { Router } from 'express'
import Campaign from '../models/Campaign.js'
import Cause from '../models/Cause.js'
import Donation from '../models/Donation.js'
import Donor from '../models/Donor.js'

const router = Router()
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const phonePattern = /^[6-9]\d{9}$/
const normalizeEmail = value => String(value || '').trim().toLowerCase()
const paymentConfigured = () => Boolean(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET)
const authHeader = () => `Basic ${Buffer.from(`${process.env.RAZORPAY_KEY_ID}:${process.env.RAZORPAY_KEY_SECRET}`).toString('base64')}`

async function resolveDestination(destination, causeSlug, campaignSlug) {
  if (destination === 'cause') {
    const cause = await Cause.findOne({ slug: causeSlug, status: 'published' }).lean()
    if (!cause) throw new Error('The selected cause is not available.')
    return cause.name
  }
  if (destination === 'campaign') {
    const campaign = await Campaign.findOne({ slug: campaignSlug, status: 'active' }).lean()
    if (!campaign) throw new Error('The selected campaign is not available.')
    return campaign.title
  }
  return 'General Fund'
}

async function syncDonor(donation) {
  await Donor.findOneAndUpdate(
    { email: donation.email },
    {
      $set: { name: donation.donorName, phone: donation.phone, status: 'active', lastDonationAt: donation.paidAt || new Date() },
      $inc: { totalDonated: donation.amount, donationCount: 1 }
    },
    { upsert: true, setDefaultsOnInsert: true }
  )
}

async function syncCampaign(donation) {
  if (donation.destination === 'campaign' && donation.campaignSlug) {
    await Campaign.updateOne({ slug: donation.campaignSlug }, { $inc: { raisedAmount: donation.amount } })
  }
}

async function sendReceipt(donation) {
  if (!process.env.RESEND_API_KEY || !process.env.ADMIN_FROM_EMAIL) return false
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: process.env.ADMIN_FROM_EMAIL,
      to: [donation.email],
      subject: 'RB Charity Foundation donation acknowledgement',
      html: `<h2>Thank you for your contribution</h2><p>Dear ${donation.donorName},</p><p>We have received your contribution of <strong>₹${donation.amount.toLocaleString('en-IN')}</strong> towards <strong>${donation.cause}</strong>.</p><p>Payment reference: <strong>${donation.paymentId}</strong></p><p>Donation reference: <strong>${donation._id}</strong></p><p>This email is a payment acknowledgement. Any statutory tax-benefit wording should only be added after the foundation's applicable registration details are verified.</p>`
    })
  })
  return response.ok
}

router.get('/config', (_req, res) => res.json({ success: true, enabled: paymentConfigured(), keyId: paymentConfigured() ? process.env.RAZORPAY_KEY_ID : '' }))

router.post('/order', async (req, res) => {
  if (!Donation.db.readyState) return res.status(503).json({ success: false, message: 'Database not connected.' })
  if (!paymentConfigured()) return res.status(503).json({ success: false, message: 'Online donations are not enabled yet.' })
  const donorName = String(req.body.donorName || '').trim()
  const email = normalizeEmail(req.body.email)
  const phone = String(req.body.phone || '').trim()
  const amount = Number(req.body.amount)
  const destination = ['general', 'cause', 'campaign'].includes(req.body.destination) ? req.body.destination : 'general'
  const causeSlug = String(req.body.causeSlug || '').trim()
  const campaignSlug = String(req.body.campaignSlug || '').trim()
  if (donorName.length < 2) return res.status(400).json({ success: false, message: 'Please enter your full name.' })
  if (!emailPattern.test(email)) return res.status(400).json({ success: false, message: 'Please enter a valid email address.' })
  if (!phonePattern.test(phone)) return res.status(400).json({ success: false, message: 'Please enter a valid 10-digit Indian mobile number.' })
  if (!Number.isFinite(amount) || amount < 1 || amount > 10000000) return res.status(400).json({ success: false, message: 'Enter a valid donation amount.' })
  if (destination === 'cause' && !causeSlug) return res.status(400).json({ success: false, message: 'Please select a cause.' })
  if (destination === 'campaign' && !campaignSlug) return res.status(400).json({ success: false, message: 'Please select a campaign.' })
  let cause
  try { cause = await resolveDestination(destination, causeSlug, campaignSlug) }
  catch (error) { return res.status(400).json({ success: false, message: error.message }) }
  const receipt = `rbcf_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`
  const gatewayResponse = await fetch('https://api.razorpay.com/v1/orders', {
    method: 'POST',
    headers: { Authorization: authHeader(), 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount: Math.round(amount * 100), currency: 'INR', receipt, notes: { destination, causeSlug, campaignSlug } })
  })
  const gatewayOrder = await gatewayResponse.json()
  if (!gatewayResponse.ok) return res.status(502).json({ success: false, message: gatewayOrder?.error?.description || 'Unable to initialise payment.' })
  const donation = await Donation.create({ donorName, email, phone, amount, destination, cause, causeSlug, campaignSlug, orderId: gatewayOrder.id, status: 'pending' })
  res.status(201).json({ success: true, donationId: donation._id, orderId: gatewayOrder.id, amount: gatewayOrder.amount, currency: gatewayOrder.currency, keyId: process.env.RAZORPAY_KEY_ID, name: 'RB Charity Foundation', description: `Contribution to ${cause}` })
})

router.post('/verify', async (req, res) => {
  const donationId = String(req.body.donationId || '')
  const orderId = String(req.body.razorpay_order_id || '')
  const paymentId = String(req.body.razorpay_payment_id || '')
  const signature = String(req.body.razorpay_signature || '')

  const existing = await Donation.findOne({ _id: donationId, orderId })
  if (!existing) return res.status(404).json({ success: false, message: 'Donation record not found.' })
  if (existing.status === 'paid') return res.json({ success: true, donationId: existing._id, paymentId: existing.paymentId, amount: existing.amount, destination: existing.cause })

  const expected = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || '').update(`${orderId}|${paymentId}`).digest('hex')
  const provided = signature.padEnd(expected.length).slice(0, expected.length)
  if (!signature || !crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(provided))) {
    await Donation.updateOne(
      { _id: donationId, orderId, status: { $ne: 'paid' } },
      { $set: { status: 'failed', failureReason: 'Payment signature verification failed.' } }
    )
    return res.status(400).json({ success: false, message: 'Payment verification failed.' })
  }

  let donation
  try {
    donation = await Donation.findOneAndUpdate(
      { _id: donationId, orderId, status: { $ne: 'paid' } },
      {
        $set: {
          status: 'paid',
          paymentId,
          paymentSignature: signature,
          paidAt: new Date(),
          failureReason: ''
        }
      },
      { new: true, runValidators: true }
    )
  } catch (error) {
    if (error?.code === 11000) {
      return res.status(409).json({ success: false, message: 'This payment reference is already linked to another donation.' })
    }
    throw error
  }

  if (!donation) {
    const settled = await Donation.findOne({ _id: donationId, orderId })
    if (settled?.status === 'paid') return res.json({ success: true, donationId: settled._id, paymentId: settled.paymentId, amount: settled.amount, destination: settled.cause })
    return res.status(409).json({ success: false, message: 'Donation state changed while payment was being verified. Please check the payment status before retrying.' })
  }

  await Promise.all([syncDonor(donation), syncCampaign(donation)])
  try { await sendReceipt(donation) } catch (error) { console.error('Donation acknowledgement email failed:', error.message) }
  res.json({ success: true, donationId: donation._id, paymentId, amount: donation.amount, destination: donation.cause })
})

router.post('/failed', async (req, res) => {
  const donation = await Donation.findOne({ _id: req.body.donationId, orderId: req.body.orderId })
  if (donation && donation.status !== 'paid') {
    donation.status = 'failed'
    donation.failureReason = String(req.body.reason || 'Payment was not completed.').slice(0, 500)
    await donation.save()
  }
  res.json({ success: true })
})

export default router
