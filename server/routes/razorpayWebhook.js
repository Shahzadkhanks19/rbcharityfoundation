import crypto from 'crypto'
import express from 'express'
import Campaign from '../models/Campaign.js'
import Donation from '../models/Donation.js'
import Donor from '../models/Donor.js'

const router = express.Router()

function safeEqual(expected, received) {
  const a = Buffer.from(String(expected || ''), 'utf8')
  const b = Buffer.from(String(received || ''), 'utf8')
  return a.length === b.length && crypto.timingSafeEqual(a, b)
}

async function syncDonor(donation) {
  await Donor.findOneAndUpdate(
    { email: donation.email },
    {
      $set: {
        name: donation.donorName,
        phone: donation.phone,
        status: 'active',
        lastDonationAt: donation.paidAt || new Date()
      },
      $inc: { totalDonated: donation.amount, donationCount: 1 }
    },
    { upsert: true, setDefaultsOnInsert: true }
  )
}

async function syncCampaign(donation) {
  if (donation.destination === 'campaign' && donation.campaignSlug) {
    await Campaign.updateOne(
      { slug: donation.campaignSlug },
      { $inc: { raisedAmount: donation.amount } }
    )
  }
}

async function sendReceipt(donation) {
  if (!process.env.RESEND_API_KEY || !process.env.ADMIN_FROM_EMAIL) return false
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      from: process.env.ADMIN_FROM_EMAIL,
      to: [donation.email],
      subject: 'RB Charity Foundation donation acknowledgement',
      html: `<h2>Thank you for your contribution</h2><p>Dear ${donation.donorName},</p><p>We have received your contribution of <strong>₹${donation.amount.toLocaleString('en-IN')}</strong> towards <strong>${donation.cause}</strong>.</p><p>Payment reference: <strong>${donation.paymentId}</strong></p><p>Donation reference: <strong>${donation._id}</strong></p><p>This email is a payment acknowledgement. Any statutory tax-benefit wording should only be added after the foundation's applicable registration details are verified.</p>`
    })
  })
  return response.ok
}

router.post('/', express.raw({ type: 'application/json', limit: '1mb' }), async (req, res) => {
  const webhookSecret = String(process.env.RAZORPAY_WEBHOOK_SECRET || '').trim()
  if (!webhookSecret) return res.status(503).json({ success: false, message: 'Razorpay webhook secret is not configured.' })

  const rawBody = Buffer.isBuffer(req.body) ? req.body : Buffer.from(req.body || '')
  const receivedSignature = req.get('x-razorpay-signature') || ''
  const expectedSignature = crypto.createHmac('sha256', webhookSecret).update(rawBody).digest('hex')

  if (!safeEqual(expectedSignature, receivedSignature)) {
    return res.status(401).json({ success: false, message: 'Invalid webhook signature.' })
  }

  let event
  try {
    event = JSON.parse(rawBody.toString('utf8'))
  } catch {
    return res.status(400).json({ success: false, message: 'Invalid webhook payload.' })
  }

  const eventName = String(event?.event || '')
  const payment = event?.payload?.payment?.entity || null

  if (eventName === 'payment.captured' && payment?.order_id && payment?.id) {
    const existing = await Donation.findOne({ orderId: payment.order_id }).lean()
    if (!existing) return res.json({ success: true, ignored: true })

    const expectedAmount = Math.round(Number(existing.amount || 0) * 100)
    if (payment.currency !== 'INR' || Number(payment.amount) !== expectedAmount) {
      console.error('Razorpay webhook amount/currency mismatch', { orderId: payment.order_id, paymentId: payment.id })
      return res.json({ success: true, ignored: true })
    }

    const paidAt = payment.created_at ? new Date(Number(payment.created_at) * 1000) : new Date()
    let donation
    try {
      donation = await Donation.findOneAndUpdate(
        { _id: existing._id, status: { $ne: 'paid' } },
        {
          $set: {
            status: 'paid',
            paymentId: payment.id,
            paymentSignature: receivedSignature,
            paidAt,
            failureReason: ''
          }
        },
        { new: true, runValidators: true }
      )
    } catch (error) {
      if (error?.code === 11000) {
        console.error('Duplicate Razorpay payment ID received by webhook', payment.id)
        return res.json({ success: true, ignored: true })
      }
      throw error
    }

    if (!donation) return res.json({ success: true, alreadyProcessed: true })

    await Promise.all([syncDonor(donation), syncCampaign(donation)])
    try { await sendReceipt(donation) } catch (error) { console.error('Webhook donation acknowledgement email failed:', error.message) }
    return res.json({ success: true, processed: true })
  }

  if (eventName === 'payment.failed' && payment?.order_id) {
    const failureReason = String(payment.error_description || payment.error_reason || 'Payment failed.').slice(0, 500)
    await Donation.findOneAndUpdate(
      { orderId: payment.order_id, status: { $ne: 'paid' } },
      { $set: { status: 'failed', failureReason } }
    )
    return res.json({ success: true, processed: true })
  }

  res.json({ success: true, ignored: true })
})

export default router
