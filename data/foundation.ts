export type Cause = {
  title: string;
  description: string;
  icon: string;
};

export const causes: Cause[] = [
  { title: "Food & Hunger Relief", description: "Support nutritious meals and essential food assistance for communities in need.", icon: "🍲" },
  { title: "Education", description: "Help children and young adults access learning resources, fees, mentoring and opportunity.", icon: "📚" },
  { title: "Healthcare", description: "Support verified medical needs, preventive care and access to essential treatment.", icon: "❤" },
  { title: "Women Empowerment", description: "Back skills, livelihood support and opportunities that strengthen independence.", icon: "✦" },
  { title: "Community Development", description: "Fund practical interventions that improve everyday life at the community level.", icon: "🏘" },
  { title: "Emergency Relief", description: "Mobilise support quickly for verified disasters, crises and urgent local needs.", icon: "🤝" },
];

export const impactPlaceholders = [
  { value: "—", label: "People Supported" },
  { value: "—", label: "Meals Distributed" },
  { value: "—", label: "Campaigns Completed" },
  { value: "—", label: "Volunteer Hours" },
];
