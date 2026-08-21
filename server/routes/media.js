import crypto from 'crypto'
import { Router } from 'express'
import { requireAdmin } from '../middleware/adminAuth.js'

const router = Router()
const folder = 'rb-charity-foundation'

router.use(requireAdmin)

router.post('/signature', (_req, res) => {
  const cloudName = String(process.env.CLOUDINARY_CLOUD_NAME || '').trim()
  const apiKey = String(process.env.CLOUDINARY_API_KEY || '').trim()
  const apiSecret = String(process.env.CLOUDINARY_API_SECRET || '').trim()

  if (!cloudName || !apiKey || !apiSecret) {
    return res.status(503).json({
      success: false,
      message: 'Cloudinary media uploads are not configured on the server.'
    })
  }

  const timestamp = Math.floor(Date.now() / 1000)
  const signaturePayload = `folder=${folder}&timestamp=${timestamp}${apiSecret}`
  const signature = crypto.createHash('sha1').update(signaturePayload).digest('hex')

  res.json({
    success: true,
    cloudName,
    apiKey,
    timestamp,
    signature,
    folder,
    uploadUrl: `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`
  })
})

export default router
