const MEDIA_ROOT = 'https://media.githubusercontent.com/media/Shahzadkhanks19/rbserviceconnect/main/images'

const charityOneFiles = [
  'DSC00012.JPG','DSC00037.JPG','DSC00049.JPG','DSC00057.JPG','DSC00069.JPG','DSC00079.JPG','DSC00080.JPG','DSC00095.JPG','DSC00148.JPG','DSC00171.JPG','DSC00572.JPG','DSC00855.JPG','DSC00949.JPG','DSC01084.JPG',
]

const charityTwoFiles = [
  'DSC00809.JPG','DSC00868.JPG','DSC00879.JPG','DSC00883.JPG','DSC00895.JPG','DSC00901.JPG','DSC00944.JPG','DSC00947.JPG','DSC00948.JPG','DSC00951.JPG','DSC00953.JPG','DSC00973.JPG','DSC00981.JPG','DSC00988.JPG',
]

function source(path) {
  return `${MEDIA_ROOT}/${path}`
}

function optimized(path, width = 1200) {
  return `/api/image?src=${encodeURIComponent(source(path))}&w=${width}`
}

export const charityMedia = {
  hero: optimized('charity-2/DSC00947.JPG', 1800),
  heroAlt: optimized('charity-1/DSC00057.JPG', 1600),
  causes: [
    optimized('charity-1/DSC00012.JPG', 900),
    optimized('charity-1/DSC00069.JPG', 900),
    optimized('charity-1/DSC00148.JPG', 900),
    optimized('charity-2/DSC00868.JPG', 900),
    optimized('charity-2/DSC00944.JPG', 900),
    optimized('charity-2/DSC00973.JPG', 900),
  ],
  campaigns: [
    optimized('charity-2/DSC00809.JPG', 1100),
    optimized('charity-2/DSC00883.JPG', 1100),
    optimized('charity-2/DSC00901.JPG', 1100),
    optimized('charity-1/DSC00080.JPG', 1100),
  ],
  editorial: [
    optimized('charity-1/DSC00037.JPG', 1000),
    optimized('charity-1/DSC00095.JPG', 1000),
    optimized('charity-1/DSC00171.JPG', 1200),
    optimized('charity-2/DSC00948.JPG', 1000),
  ],
  galleryImages: [
    ...charityOneFiles.map(file => optimized(`charity-1/${file}`, 960)),
    ...charityTwoFiles.map(file => optimized(`charity-2/${file}`, 960)),
  ],
  galleryVideos: [source('C0045.MP4')],
}

export function charityFallback(collection, index = 0) {
  const items = charityMedia[collection] || charityMedia.editorial
  return items[index % items.length]
}
