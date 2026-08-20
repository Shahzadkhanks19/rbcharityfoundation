export const causesSeed = [
  {
    name: 'Hunger & Food Support',
    slug: 'hunger-food-support',
    summary: 'Nutritious meals and essential food support for vulnerable communities.',
    description: 'Support programmes focused on food security, community meal drives and essential ration assistance for people and families facing immediate need.',
    focusAreas: ['Community meal drives', 'Essential ration support', 'Nutrition-focused assistance'],
    status: 'published'
  },
  {
    name: 'Education',
    slug: 'education',
    summary: 'Learning support, school resources and opportunities for children and young people.',
    description: 'Education initiatives can support learning materials, school access, mentoring and opportunities that help young people continue their education with dignity.',
    focusAreas: ['Learning materials', 'School support', 'Mentoring and opportunity'],
    status: 'published'
  },
  {
    name: 'Healthcare',
    slug: 'healthcare',
    summary: 'Medical assistance and healthcare support for people who need it most.',
    description: 'Healthcare support can help verified beneficiaries access treatment, diagnostics, medicines and essential care through transparent campaign-based assistance.',
    focusAreas: ['Medical assistance', 'Diagnostics and medicines', 'Verified treatment support'],
    status: 'published'
  },
  {
    name: 'Women Empowerment',
    slug: 'women-empowerment',
    summary: 'Helping women access skills, opportunities and pathways to greater independence.',
    description: 'Long-term support focused on practical skills, livelihood opportunities, education and pathways that strengthen financial and social independence.',
    focusAreas: ['Skill development', 'Livelihood support', 'Education and opportunity'],
    status: 'published'
  },
  {
    name: 'Emergency Relief',
    slug: 'emergency-relief',
    summary: 'Rapid support for families and communities during urgent situations.',
    description: 'Time-sensitive relief campaigns can mobilise food, medical help, essential supplies and recovery assistance during emergencies and disasters.',
    focusAreas: ['Rapid relief', 'Essential supplies', 'Recovery support'],
    status: 'published'
  },
  {
    name: 'Community Development',
    slug: 'community-development',
    summary: 'Long-term initiatives focused on dignity, opportunity and stronger communities.',
    description: 'Community programmes are designed around sustainable improvements, local partnerships and practical solutions that create durable social impact.',
    focusAreas: ['Local partnerships', 'Community infrastructure', 'Long-term development'],
    status: 'published'
  }
]

export const campaignsSeed = [
  {
    title: 'Community Meal Support',
    slug: 'community-meal-support',
    causeSlug: 'hunger-food-support',
    causeName: 'Hunger & Food Support',
    summary: 'A structured food-support campaign prepared for verified community meal distribution.',
    description: 'This campaign module demonstrates how RB Charity Foundation will publish verified fundraising goals, allocation plans, updates and documented outcomes for food-support initiatives.',
    goalAmount: 250000,
    raisedAmount: 0,
    status: 'active',
    featured: true,
    allocationPlan: ['Meal preparation and food supplies', 'Distribution logistics', 'Field documentation and reporting'],
    updates: []
  },
  {
    title: 'Learning Resources Programme',
    slug: 'learning-resources-programme',
    causeSlug: 'education',
    causeName: 'Education',
    summary: 'Support learning materials and educational resources through a transparent programme.',
    description: 'A campaign structure for verified education support, with beneficiary validation, allocation records and milestone updates before public fundraising is activated.',
    goalAmount: 300000,
    raisedAmount: 0,
    status: 'active',
    featured: true,
    allocationPlan: ['Learning material procurement', 'Verified beneficiary support', 'Programme documentation'],
    updates: []
  },
  {
    title: 'Verified Medical Assistance Fund',
    slug: 'verified-medical-assistance-fund',
    causeSlug: 'healthcare',
    causeName: 'Healthcare',
    summary: 'A campaign framework for verified medical and treatment assistance.',
    description: 'Medical support requests will be verified before publication. The platform is structured to display funding requirements, allocation details and outcome updates transparently.',
    goalAmount: 500000,
    raisedAmount: 0,
    status: 'active',
    featured: false,
    allocationPlan: ['Verified treatment expenses', 'Diagnostics or medicines', 'Campaign documentation'],
    updates: []
  }
]
