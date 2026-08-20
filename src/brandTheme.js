export const RB_CHARITY_LOGO = 'https://media.githubusercontent.com/media/Shahzadkhanks19/rbserviceconnect/main/images/Charity-Logo-sample-1%20(1).png'

const clamp = (value) => Math.max(0, Math.min(255, Math.round(value)))

const mix = (rgb, target, amount) => rgb.map((channel, index) => clamp(channel + (target[index] - channel) * amount))

const toCss = (rgb) => `rgb(${rgb[0]} ${rgb[1]} ${rgb[2]})`

const saturation = ([r, g, b]) => {
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  return max === 0 ? 0 : (max - min) / max
}

const brightness = ([r, g, b]) => (r * 299 + g * 587 + b * 114) / 1000

const distance = (a, b) => Math.sqrt(
  ((a[0] - b[0]) ** 2) +
  ((a[1] - b[1]) ** 2) +
  ((a[2] - b[2]) ** 2)
)

function getDominantColors(image) {
  const canvas = document.createElement('canvas')
  const size = 160
  canvas.width = size
  canvas.height = size
  const context = canvas.getContext('2d', { willReadFrequently: true })
  if (!context) return null

  context.drawImage(image, 0, 0, size, size)
  const { data } = context.getImageData(0, 0, size, size)
  const buckets = new Map()

  for (let index = 0; index < data.length; index += 16) {
    const alpha = data[index + 3]
    if (alpha < 180) continue

    const rgb = [data[index], data[index + 1], data[index + 2]]
    const light = brightness(rgb)
    if (light > 242 || light < 20 || saturation(rgb) < 0.18) continue

    const quantized = rgb.map((channel) => Math.round(channel / 24) * 24)
    const key = quantized.join(',')
    buckets.set(key, (buckets.get(key) || 0) + 1)
  }

  const ranked = [...buckets.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([key]) => key.split(',').map(Number))

  if (!ranked.length) return null

  const primary = ranked[0]
  const accent = ranked.find((candidate) => distance(primary, candidate) > 95) || ranked[1] || mix(primary, [255, 170, 60], 0.55)
  return { primary, accent }
}

export function applyLogoTheme() {
  if (typeof window === 'undefined') return

  const image = new Image()
  image.crossOrigin = 'anonymous'
  image.src = RB_CHARITY_LOGO

  image.onload = () => {
    try {
      const colors = getDominantColors(image)
      if (!colors) return

      const { primary, accent } = colors
      const root = document.documentElement

      root.style.setProperty('--brand-primary', toCss(primary))
      root.style.setProperty('--brand-primary-dark', toCss(mix(primary, [0, 0, 0], 0.56)))
      root.style.setProperty('--brand-primary-mid', toCss(mix(primary, [0, 0, 0], 0.18)))
      root.style.setProperty('--brand-primary-light', toCss(mix(primary, [255, 255, 255], 0.90)))
      root.style.setProperty('--brand-border', toCss(mix(primary, [255, 255, 255], 0.76)))
      root.style.setProperty('--brand-accent', toCss(accent))
      root.style.setProperty('--brand-accent-soft', toCss(mix(accent, [255, 255, 255], 0.82)))
      root.style.setProperty('--brand-page', toCss(mix(primary, [255, 255, 255], 0.965)))
      root.style.setProperty('--brand-ink', toCss(mix(primary, [0, 0, 0], 0.66)))
    } catch {
      // Keep the accessible fallback theme if the remote image cannot be sampled.
    }
  }
}
