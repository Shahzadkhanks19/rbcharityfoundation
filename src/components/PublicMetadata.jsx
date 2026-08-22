import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const SITE_NAME = 'RB Charity Foundation'
const defaultDescription = 'RB Charity Foundation — transforming business success and public support into meaningful community impact.'

const metadata = {
  '/': ['Profits With Purpose', defaultDescription],
  '/about': ['About Us', 'Learn how RB Charity Foundation connects responsible business growth with transparent, community-led social impact.'],
  '/causes': ['Our Causes', 'Explore the verified social causes supported by RB Charity Foundation.'],
  '/campaigns': ['Campaigns', 'Explore active RB Charity Foundation campaigns and see verified fundraising progress.'],
  '/donate': ['Donate', 'Support verified RB Charity Foundation causes and campaigns through a secure donation flow.'],
  '/donate/success': ['Donation Received', 'Your contribution to RB Charity Foundation has been received successfully.'],
  '/volunteer': ['Volunteer', 'Apply to volunteer with RB Charity Foundation and contribute your time, skills and experience.'],
  '/partner': ['Partner With Us', 'Explore institutional and community partnership opportunities with RB Charity Foundation.'],
  '/contact': ['Contact Us', 'Contact RB Charity Foundation for enquiries, support and collaboration.'],
  '/impact': ['Our Impact', 'Explore verified impact metrics, community outcomes and field work from RB Charity Foundation.'],
  '/transparency': ['Transparency', 'Review RB Charity Foundation transparency practices, accountability model and public reporting.'],
  '/reports': ['Reports', 'Browse published RB Charity Foundation reports and public documents.'],
  '/stories': ['Stories of Change', 'Read stories documenting people, communities and impact supported by RB Charity Foundation.'],
  '/gallery': ['Gallery', 'Explore photographs and videos documenting RB Charity Foundation community initiatives.'],
  '/faq': ['Frequently Asked Questions', 'Find answers to common questions about RB Charity Foundation, donations and participation.'],
  '/privacy': ['Privacy Policy', 'Read the RB Charity Foundation privacy policy.'],
  '/terms': ['Terms & Conditions', 'Read the RB Charity Foundation terms and conditions.'],
  '/refund-policy': ['Refund Policy', 'Read the RB Charity Foundation donation refund and cancellation policy.'],
  '/404': ['Page Not Found', 'The page you requested could not be found.'],
  '/error': ['Something Went Wrong', 'An unexpected error occurred while loading RB Charity Foundation.'],
}

function resolveMetadata(pathname) {
  if (pathname.startsWith('/causes/')) return ['Cause Details', 'Learn more about this RB Charity Foundation cause and related community work.']
  if (pathname.startsWith('/campaigns/')) return ['Campaign Details', 'View campaign goals, verified fundraising progress and ways to support this RB Charity Foundation campaign.']
  if (pathname.startsWith('/stories/')) return ['Story of Change', 'Read this RB Charity Foundation field story and community impact update.']
  return metadata[pathname] || metadata['/']
}

export default function PublicMetadata() {
  const { pathname } = useLocation()

  useEffect(() => {
    if (pathname.startsWith('/admin')) {
      document.title = `Admin | ${SITE_NAME}`
      return
    }

    const [title, description] = resolveMetadata(pathname)
    document.title = `${title} | ${SITE_NAME}`

    let meta = document.querySelector('meta[name="description"]')
    if (!meta) {
      meta = document.createElement('meta')
      meta.setAttribute('name', 'description')
      document.head.appendChild(meta)
    }
    meta.setAttribute('content', description)
  }, [pathname])

  return null
}
