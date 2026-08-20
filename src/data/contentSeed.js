import { LEGACY_IMAGE_BASE } from '../components/SiteLayout'

export const legacyCharityImages = [
  'DSC00592.JPG','DSC00661.JPG','DSC00888.JPG','DSC00902.JPG','DSC01084.JPG','DSC01089.JPG','DSC01114.JPG','DSC01126.JPG'
].map((name)=>`${LEGACY_IMAGE_BASE}${name}`)

export const impactMetrics = [
  { label: 'Active cause areas', value: '6', note: 'Food, education, healthcare, women, relief and community development' },
  { label: 'Public campaign model', value: '100%', note: 'Campaigns are structured around goals, allocations and updates' },
  { label: 'Reporting stages', value: '4', note: 'Funds received, allocated, work completed and impact documented' },
  { label: 'Donation visibility', value: 'Traceable', note: 'Designed for clear campaign-linked records and receipts' },
]

export const transparencySteps = [
  ['01','Contribution received','Every foundation or public contribution is recorded with its intended destination.'],
  ['02','Allocation approved','Funds are mapped to an approved cause, campaign or verified requirement.'],
  ['03','Work documented','Field work, procurement and programme milestones are documented.'],
  ['04','Outcome published','Updates, stories and reports communicate the resulting social impact.'],
]

export const reportsSeed = [
  { title:'Foundation Overview', type:'Organisation document', year:'2026', status:'Planned', description:'Foundation purpose, operating model, governance and programme structure.' },
  { title:'Impact Report', type:'Impact report', year:'2026', status:'Planned', description:'Cause-wise activities, campaign outcomes and documented impact.' },
  { title:'Annual Transparency Summary', type:'Transparency report', year:'2026', status:'Planned', description:'Public summary of contributions, allocations and programme reporting.' },
]

export const storiesSeed = [
  { slug:'community-meals-in-action', title:'Community meals in action', category:'Hunger & Food Support', excerpt:'A field-story format for documenting meal distribution, volunteers and community participation.', image:legacyCharityImages[0], content:['Every initiative should be documented beyond a fundraising number. This story format is designed to capture the people, preparation and field work behind a community meal programme.','Once real campaign data is approved, this page can publish verified dates, locations, beneficiary counts, photographs and allocation details.'] },
  { slug:'learning-support-on-ground', title:'Learning support on the ground', category:'Education', excerpt:'How education campaigns can translate contributions into practical learning resources and opportunity.', image:legacyCharityImages[2], content:['Education support is most useful when the need, beneficiaries and resources are clearly documented.','The story module connects field updates with the relevant cause and campaign so donors can follow the work over time.'] },
  { slug:'people-behind-the-mission', title:'The people behind the mission', category:'Volunteering', excerpt:'Recognising volunteers, local partners and teams who help foundation initiatives reach communities.', image:legacyCharityImages[5], content:['The foundation platform is designed to recognise participation as well as financial support.','Volunteer and partnership stories can document collaboration, field responsibilities and community outcomes.'] },
]

export const gallerySeed = legacyCharityImages.map((image,index)=>({
  image,
  title:['Field initiative','Community participation','Foundation activity','Volunteer support','Programme work','Community outreach','On-ground support','Impact documentation'][index],
  category:index%3===0?'Community':index%3===1?'Field Work':'Volunteers'
}))
