import 'dotenv/config'
import { charityMedia } from '../../src/data/charityMedia.js'

const baseUrl = String(process.env.CMS_BASE_URL || 'http://localhost:5000').replace(/\/$/, '')
const email = String(process.env.ADMIN_EMAIL || '').trim()
const password = String(process.env.ADMIN_PASSWORD || '')

if (!email || !password) {
  console.error('ADMIN_EMAIL and ADMIN_PASSWORD are required.')
  process.exit(1)
}

async function login() {
  const response = await fetch(`${baseUrl}/api/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  const data = await response.json().catch(() => ({}))
  if (!response.ok || !data.success) throw new Error(data.message || 'Admin login failed.')
  const cookie = response.headers.getSetCookie?.()[0] || response.headers.get('set-cookie') || ''
  if (!cookie) throw new Error('Admin login succeeded but no session cookie was returned.')
  return cookie.split(';')[0]
}

async function request(cookie, path, options = {}) {
  const response = await fetch(`${baseUrl}/api/admin${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Cookie: cookie,
      ...(options.headers || {}),
    },
  })
  const data = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(data.message || `${options.method || 'GET'} ${path} failed.`)
  return data
}

const causeDrafts = [
  {
    name: 'Education & Learning', slug: 'education-learning', order: 1, status: 'published',
    summary: 'Helping children and young people access learning opportunities, school essentials and supportive environments.',
    description: 'Education can change the direction of an entire family. This cause supports practical learning needs, school participation, educational materials and community-led opportunities that help children continue learning with dignity.',
    image: charityMedia.causes[0],
  },
  {
    name: 'Food & Nutrition', slug: 'food-nutrition', order: 2, status: 'published',
    summary: 'Supporting food access, nutrition drives and community meals for people facing immediate need.',
    description: 'Food support is often the first step toward stability. Through verified community initiatives, this cause focuses on nutritious meals, essential food support and dignified outreach for families and individuals in need.',
    image: charityMedia.causes[1],
  },
  {
    name: 'Healthcare & Wellbeing', slug: 'healthcare-wellbeing', order: 3, status: 'published',
    summary: 'Connecting vulnerable communities with health awareness, basic care support and wellbeing initiatives.',
    description: 'Good health should not depend on circumstance. This cause supports awareness, basic healthcare access, preventive wellbeing initiatives and practical assistance around verified community needs.',
    image: charityMedia.causes[2],
  },
  {
    name: 'Community Welfare', slug: 'community-welfare', order: 4, status: 'published',
    summary: 'Responding to local needs through practical, respectful and community-led support.',
    description: 'Every neighbourhood faces different challenges. Community Welfare brings together flexible initiatives that respond to verified local needs while keeping dignity, accountability and long-term usefulness at the centre.',
    image: charityMedia.causes[3],
  },
  {
    name: 'Livelihoods & Dignity', slug: 'livelihoods-dignity', order: 5, status: 'published',
    summary: 'Helping people move toward greater independence through skills, essentials and livelihood support.',
    description: 'Sustainable support should create room for independence. This cause focuses on practical livelihood assistance, skill-building opportunities and essential support that helps people regain stability and confidence.',
    image: charityMedia.causes[4],
  },
]

const campaignDrafts = [
  { title: 'Back to School Essentials Drive', slug: 'back-to-school-essentials', causeSlug: 'education-learning', goalAmount: 150000, coverImage: charityMedia.campaigns[0], featured: true, summary: 'School kits, learning essentials and practical support for children preparing for a new academic term.', description: 'This campaign brings together verified support for school-going children who need notebooks, bags, stationery and other everyday learning essentials. Contributions help the foundation coordinate procurement and distribution through community partners.' },
  { title: 'Community Meal Support', slug: 'community-meal-support', causeSlug: 'food-nutrition', goalAmount: 100000, coverImage: charityMedia.campaigns[1], featured: false, summary: 'Supporting nutritious community meals with dignity and careful local coordination.', description: 'The Community Meal Support campaign helps organise meal outreach for people and families facing immediate food insecurity. The focus is on respectful distribution, practical coordination and transparent reporting.' },
  { title: 'Healthy Families Outreach', slug: 'healthy-families-outreach', causeSlug: 'healthcare-wellbeing', goalAmount: 200000, coverImage: charityMedia.campaigns[2], featured: false, summary: 'Health awareness and basic wellbeing support for families in underserved communities.', description: 'This initiative supports community-level wellbeing outreach, awareness activities and verified basic-care needs. Field updates and reports can be published as activities are completed.' },
  { title: 'Dignity Essentials Initiative', slug: 'dignity-essentials-initiative', causeSlug: 'community-welfare', goalAmount: 125000, coverImage: charityMedia.campaigns[3], featured: false, summary: 'Essential support packages designed around verified household and community needs.', description: 'The Dignity Essentials Initiative responds to practical needs with carefully assembled support packages and accountable distribution through trusted local coordination.' },
  { title: 'Skills for Self-Reliance', slug: 'skills-for-self-reliance', causeSlug: 'livelihoods-dignity', goalAmount: 250000, coverImage: charityMedia.editorial[3], featured: false, summary: 'Helping people build practical skills and move toward more stable livelihoods.', description: 'This campaign focuses on verified opportunities that can help participants develop practical skills, access essential tools or take the next step toward sustainable income and independence.' },
]

const storyDrafts = [
  { title: 'A School Bag Can Carry More Than Books', slug: 'school-bag-more-than-books', coverImage: charityMedia.editorial[0], excerpt: 'How small educational essentials can remove everyday barriers and help a child return to class with confidence.', content: 'A school bag, notebooks and basic stationery may look simple, but for a family managing competing essentials they can become a real barrier to regular attendance. Through education-focused outreach, RB Charity Foundation works to identify practical needs and support children in a way that protects dignity. The goal is not a one-day photo opportunity; it is one useful step that makes participation in school easier.' },
  { title: 'Serving Meals With Dignity', slug: 'serving-meals-with-dignity', coverImage: charityMedia.editorial[1], excerpt: 'Community food outreach works best when respect and coordination matter as much as the meal itself.', content: 'Food support is most meaningful when people are treated with dignity. Community meal initiatives are planned around local need, responsible distribution and the simple principle that support should never make a person feel smaller. Every verified activity can later be reflected through stories, gallery evidence and reporting.' },
  { title: 'Why Local Partnerships Matter', slug: 'why-local-partnerships-matter', coverImage: charityMedia.editorial[2], excerpt: 'Trusted local knowledge helps charitable resources reach the right people more effectively.', content: 'Community partners understand context that cannot always be seen from a spreadsheet. By working with credible local organisations, volunteers and community leaders, the foundation can verify needs, coordinate responsibly and improve follow-up after an initiative is completed.' },
  { title: 'From Support to Self-Reliance', slug: 'support-to-self-reliance', coverImage: charityMedia.causes[4], excerpt: 'The strongest form of support can be the one that helps someone need less support tomorrow.', content: 'Livelihood-focused charitable work is about more than temporary relief. Skills, practical tools, mentorship and access can help create a path toward greater stability. RB Charity Foundation aims to support initiatives that respect personal agency and encourage long-term independence.' },
  { title: 'Transparency Is Part of the Work', slug: 'transparency-part-of-the-work', coverImage: charityMedia.causes[5], excerpt: 'Trust grows when donors can see how campaigns, verified payments and reporting connect.', content: 'Transparency should not be a separate marketing exercise. It should be built into how charitable work is recorded. Campaign totals are tied to verified successful donations, while published stories, gallery media and reports can provide context around the outcomes that follow.' },
  { title: 'Small Actions, Shared Responsibility', slug: 'small-actions-shared-responsibility', coverImage: charityMedia.campaigns[0], excerpt: 'Business-backed giving and public participation can work together to create a stronger culture of responsibility.', content: 'RB Charity Foundation connects the charitable commitment of the wider RB ecosystem with participation from individuals and partners. The model is simple: create clear ways to contribute, keep the process accountable and focus attention on useful, verified social initiatives.' },
]

async function ensureResource(cookie, resource, items, key = 'slug') {
  const existing = await request(cookie, `/${resource}`)
  const byKey = new Map((existing.items || []).map(item => [String(item[key] || ''), item]))
  const output = []
  for (const item of items) {
    const current = byKey.get(String(item[key] || ''))
    if (current) {
      output.push(current)
      console.log(`✓ ${resource}: ${item[key]} already exists`)
      continue
    }
    const created = await request(cookie, `/${resource}`, { method: 'POST', body: JSON.stringify(item) })
    output.push(created.item)
    console.log(`+ ${resource}: ${item[key]}`)
  }
  return output
}

async function main() {
  console.log(`Importing preview CMS content through ${baseUrl}/api/admin ...`)
  const cookie = await login()
  const causes = await ensureResource(cookie, 'causes', causeDrafts)
  const causeIds = new Map(causes.map(cause => [cause.slug, cause._id]))
  const campaigns = campaignDrafts.map(({ causeSlug, ...campaign }) => ({ ...campaign, cause: causeIds.get(causeSlug), status: 'active' }))
  await ensureResource(cookie, 'campaigns', campaigns)
  const stories = storyDrafts.map(story => ({ ...story, publishedAt: new Date().toISOString(), status: 'published' }))
  await ensureResource(cookie, 'stories', stories)
  console.log('Preview CMS content is ready. No frontend fallback or seed module was created.')
}

main().catch(error => {
  console.error(error.message)
  process.exit(1)
})
