const MEDIA_ROOT = 'https://media.githubusercontent.com/media/Shahzadkhanks19/rbserviceconnect/main/images'

const charityOneFiles = [
  'DSC00012.JPG',
  'DSC00037.JPG',
  'DSC00049.JPG',
  'DSC00057.JPG',
  'DSC00069.JPG',
  'DSC00079.JPG',
  'DSC00080.JPG',
  'DSC00095.JPG',
  'DSC00148.JPG',
  'DSC00171.JPG',
  'DSC00572.JPG',
  'DSC00855.JPG',
  'DSC00949.JPG',
  'DSC01084.JPG',
]

const charityTwoFiles = [
  'DSC00809.JPG',
  'DSC00868.JPG',
  'DSC00879.JPG',
  'DSC00883.JPG',
  'DSC00895.JPG',
  'DSC00901.JPG',
  'DSC00944.JPG',
  'DSC00947.JPG',
  'DSC00948.JPG',
  'DSC00951.JPG',
  'DSC00953.JPG',
  'DSC00973.JPG',
  'DSC00981.JPG',
  'DSC00988.JPG',
]

export const charityMedia = {
  hero: `${MEDIA_ROOT}/charity-2/DSC00947.JPG`,
  heroAlt: `${MEDIA_ROOT}/charity-1/DSC00057.JPG`,
  causes: [
    `${MEDIA_ROOT}/charity-1/DSC00012.JPG`,
    `${MEDIA_ROOT}/charity-1/DSC00069.JPG`,
    `${MEDIA_ROOT}/charity-1/DSC00148.JPG`,
    `${MEDIA_ROOT}/charity-2/DSC00868.JPG`,
    `${MEDIA_ROOT}/charity-2/DSC00944.JPG`,
    `${MEDIA_ROOT}/charity-2/DSC00973.JPG`,
  ],
  campaigns: [
    `${MEDIA_ROOT}/charity-2/DSC00809.JPG`,
    `${MEDIA_ROOT}/charity-2/DSC00883.JPG`,
    `${MEDIA_ROOT}/charity-2/DSC00901.JPG`,
    `${MEDIA_ROOT}/charity-1/DSC00080.JPG`,
  ],
  editorial: [
    `${MEDIA_ROOT}/charity-1/DSC00037.JPG`,
    `${MEDIA_ROOT}/charity-1/DSC00095.JPG`,
    `${MEDIA_ROOT}/charity-1/DSC00171.JPG`,
    `${MEDIA_ROOT}/charity-2/DSC00948.JPG`,
  ],
  galleryImages: [
    ...charityOneFiles.map(file => `${MEDIA_ROOT}/charity-1/${file}`),
    ...charityTwoFiles.map(file => `${MEDIA_ROOT}/charity-2/${file}`),
  ],
  galleryVideos: [
    `${MEDIA_ROOT}/C0045.MP4`,
  ],
}

export function charityFallback(collection, index = 0) {
  const items = charityMedia[collection] || charityMedia.editorial
  return items[index % items.length]
}
