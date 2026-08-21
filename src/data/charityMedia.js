const MEDIA_ROOT = 'https://media.githubusercontent.com/media/Shahzadkhanks19/rbserviceconnect/main/images'

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
}

export function charityFallback(collection, index = 0) {
  const items = charityMedia[collection] || charityMedia.editorial
  return items[index % items.length]
}
