import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import express from 'express'
import jwt from 'jsonwebtoken'
import Donation from '../models/Donation.js'
import Donor from '../models/Donor.js'
import { requireDonor } from '../middleware/donorAuth.js'

const router = express.Router()
const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const normalizeEmail=value=>String(value||'').trim().toLowerCase()
const hashResetToken=token=>crypto.createHash('sha256').update(token).digest('hex')
const sign = id => {
  if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET is not configured.')
  return jwt.sign({ sub: id.toString(), role: 'donor' }, process.env.JWT_SECRET, { expiresIn: '7d' })
}
const publicDonor = donor => ({ id: donor._id, name: donor.name, email: donor.email, phone: donor.phone, preferences: donor.preferences, createdAt: donor.createdAt })

async function sendResetEmail(email, resetUrl) {
  if (!process.env.RESEND_API_KEY || !process.env.ADMIN_FROM_EMAIL) return false
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: process.env.ADMIN_FROM_EMAIL,
      to: [email],
      subject: 'RB Charity Foundation donor password reset',
      html: `<p>A password reset was requested for your RB Charity Foundation donor account.</p><p><a href="${resetUrl}">Reset donor password</a></p><p>This link expires in 30 minutes. If you did not request this, you can ignore this email.</p>`
    })
  })
  return response.ok
}

router.post('/register', async (req, res) => {
  if (!process.env.MONGODB_URI) return res.status(503).json({ success: false, message: 'Database is not connected.' })
  if (!process.env.JWT_SECRET) return res.status(503).json({ success: false, message: 'JWT_SECRET is not configured on the server.' })
  const name = String(req.body.name || '').trim()
  const email = normalizeEmail(req.body.email)
  const phone = String(req.body.phone || '').trim()
  const password = String(req.body.password || '')
  if (name.length < 2 || !emailRx.test(email) || password.length < 8) return res.status(400).json({ success: false, message: 'Enter a valid name, email and a password of at least 8 characters.' })
  const existing = await Donor.findOne({ email })
  if (existing) return res.status(409).json({ success: false, message: 'An account already exists with this email.' })
  const donor = await Donor.create({ name, email, phone, passwordHash: await bcrypt.hash(password, 12) })
  res.status(201).json({ success: true, token: sign(donor._id), donor: publicDonor(donor) })
})

router.post('/login', async (req, res) => {
  if (!process.env.JWT_SECRET) return res.status(503).json({ success: false, message: 'JWT_SECRET is not configured on the server.' })
  const email = normalizeEmail(req.body.email)
  const password = String(req.body.password || '')
  const donor = await Donor.findOne({ email })
  if (!donor || donor.status !== 'active' || !await bcrypt.compare(password, donor.passwordHash)) return res.status(401).json({ success: false, message: 'Incorrect email or password.' })
  res.json({ success: true, token: sign(donor._id), donor: publicDonor(donor) })
})

router.post('/forgot-password', async (req, res) => {
  const email = normalizeEmail(req.body.email)
  const donor = await Donor.findOne({ email, status: 'active' })
  let resetUrl = ''
  if (donor) {
    const rawToken = crypto.randomBytes(32).toString('hex')
    donor.resetTokenHash = hashResetToken(rawToken)
    donor.resetTokenExpiresAt = new Date(Date.now() + 30 * 60 * 1000)
    await donor.save()
    const clientUrl = (process.env.CLIENT_URL || 'http://localhost:5173').replace(/\/$/, '')
    resetUrl = `${clientUrl}/donor/reset-password?token=${encodeURIComponent(rawToken)}&email=${encodeURIComponent(donor.email)}`
    try { await sendResetEmail(donor.email, resetUrl) } catch (error) { console.error('Donor reset email failed:', error.message) }
  }
  const payload = { success: true, message: 'If that donor email exists, a password reset link has been prepared.' }
  if (process.env.NODE_ENV !== 'production' && resetUrl) payload.devResetUrl = resetUrl
  res.json(payload)
})

router.post('/reset-password', async (req, res) => {
  const email = normalizeEmail(req.body.email)
  const token = String(req.body.token || '')
  const password = String(req.body.password || '')
  if (password.length < 8) return res.status(400).json({ success: false, message: 'New password must be at least 8 characters.' })
  const donor = await Donor.findOne({ email, resetTokenHash: hashResetToken(token), resetTokenExpiresAt: { $gt: new Date() }, status: 'active' })
  if (!donor) return res.status(400).json({ success: false, message: 'This reset link is invalid or has expired.' })
  donor.passwordHash = await bcrypt.hash(password, 12)
  donor.passwordChangedAt = new Date()
  donor.resetTokenHash = ''
  donor.resetTokenExpiresAt = null
  await donor.save()
  res.json({ success: true, message: 'Password reset successfully. You can now sign in.' })
})

router.get('/me', requireDonor, (req, res) => res.json({ success: true, donor: publicDonor(req.donor) }))

router.patch('/me', requireDonor, async (req, res) => {
  const name = String(req.body.name || req.donor.name).trim()
  const phone = String(req.body.phone ?? req.donor.phone ?? '').trim()
  const donor = await Donor.findByIdAndUpdate(req.donor._id, { name, phone }, { new: true, runValidators: true })
  res.json({ success: true, donor: publicDonor(donor) })
})

router.post('/change-password', requireDonor, async (req, res) => {
  const currentPassword = String(req.body.currentPassword || '')
  const newPassword = String(req.body.newPassword || '')
  if (newPassword.length < 8) return res.status(400).json({ success: false, message: 'New password must be at least 8 characters.' })
  const donor = await Donor.findById(req.donor._id)
  if (!donor || !await bcrypt.compare(currentPassword, donor.passwordHash)) return res.status(400).json({ success: false, message: 'Current password is incorrect.' })
  if (await bcrypt.compare(newPassword, donor.passwordHash)) return res.status(400).json({ success: false, message: 'Choose a password different from the current password.' })
  donor.passwordHash = await bcrypt.hash(newPassword, 12)
  donor.passwordChangedAt = new Date()
  await donor.save()
  res.json({ success: true, message: 'Password changed successfully.' })
})

router.get('/donations', requireDonor, async (req, res) => {
  const donations = await Donation.find({ email: req.donor.email }).sort({ createdAt: -1 }).lean()
  res.json({ success: true, donations })
})

router.get('/dashboard', requireDonor, async (req, res) => {
  const donations = await Donation.find({ email: req.donor.email }).sort({ createdAt: -1 }).lean()
  const paid = donations.filter(item => item.status === 'paid')
  res.json({ success: true, summary: { totalContributed: paid.reduce((sum,item)=>sum+item.amount,0), totalDonations: donations.length, paidDonations: paid.length, campaignsSupported: new Set(paid.map(item=>item.campaignSlug).filter(Boolean)).size }, recent: donations.slice(0,5) })
})

export default router
