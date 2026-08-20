import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import HomePage from '../App'
import SiteLayout from '../components/SiteLayout'
import CampaignDetailsPage from '../pages/CampaignDetailsPage'
import CampaignsPage from '../pages/CampaignsPage'
import CauseDetailsPage from '../pages/CauseDetailsPage'
import CausesPage from '../pages/CausesPage'
import {
  GalleryPage,
  ImpactPage,
  ReportsPage,
  StoriesPage,
  StoryDetailsPage,
  TransparencyPage,
} from '../pages/ContentPages'
import DonatePage from '../pages/DonatePage'
import EngagementFormPage from '../pages/EngagementFormPage'
import ModulePage from '../pages/ModulePage'
import PortalPage from '../pages/PortalPage'
import { AboutPage, DonationSuccessPage, FAQPage, LegalPage } from '../pages/PublicInfoPages'

const donorRoutes = [
  ['/donor/login', 'Donor Login', 'Access your RB Charity Foundation donor account.', ['Email / mobile login', 'OTP or password', 'Forgot access']],
  ['/donor/register', 'Create Donor Account', 'Create an account to track contributions, receipts and campaign updates.', ['Personal details', 'Contact verification', 'Consent', 'Account creation']],
  ['/donor/dashboard', 'Donor Dashboard', 'Overview of your contributions and supported campaigns.', ['Contribution summary', 'Recent donations', 'Campaign updates', 'Receipts', 'Profile']],
  ['/donor/donations', 'My Donations', 'View your complete donation history.', ['Donation history', 'Filters', 'Status', 'Campaign', 'Receipt']],
  ['/donor/receipts', 'My Receipts', 'View and download donation receipts.', ['Receipt list', 'Donation ID', 'Download', 'Tax information']],
  ['/donor/campaigns', 'Supported Campaigns', 'Campaigns and causes you have supported.', ['Active campaigns', 'Completed campaigns', 'Latest updates', 'Contribution history']],
  ['/donor/profile', 'Donor Profile', 'Manage your donor contact and account information.', ['Personal information', 'Contact details', 'Preferences', 'Security']],
]

const adminRoutes = [
  ['/admin/login', 'Admin Login', 'Secure access for authorised foundation administrators.', ['Credentials', 'Security', 'Recovery']],
  ['/admin/dashboard', 'Admin Dashboard', 'Operational overview for RB Charity Foundation.', ['Donations', 'Campaigns', 'Volunteers', 'Partners', 'Messages', 'Recent activity']],
  ['/admin/campaigns', 'Campaign Management', 'Create, update, publish and close fundraising campaigns.', ['Campaign list', 'Create campaign', 'Funding goal', 'Updates', 'Status', 'Media']],
  ['/admin/causes', 'Cause Management', 'Manage foundation cause categories and content.', ['Cause list', 'Create cause', 'Content', 'Visibility', 'SEO']],
  ['/admin/donations', 'Donation Management', 'Review donation records, statuses, allocations and receipts.', ['Transactions', 'Donor', 'Campaign', 'Allocation', 'Receipt', 'Refund status']],
  ['/admin/donors', 'Donor Management', 'Manage donor records and engagement history.', ['Donor directory', 'Donation history', 'Contact', 'Status', 'Notes']],
  ['/admin/volunteers', 'Volunteer Management', 'Review volunteer registrations and assign opportunities.', ['Applications', 'Skills', 'Availability', 'Assignments', 'Status']],
  ['/admin/partners', 'Partner Management', 'Manage partnership and CSR enquiries.', ['Enquiries', 'Organisation', 'Contact', 'Proposal status', 'Notes']],
  ['/admin/stories', 'Stories & Updates', 'Publish beneficiary stories, campaign milestones and field updates.', ['Story list', 'Create story', 'Media', 'Campaign link', 'Publishing']],
  ['/admin/gallery', 'Gallery Management', 'Manage photos, videos and campaign galleries.', ['Media library', 'Albums', 'Campaign links', 'Captions', 'Visibility']],
  ['/admin/reports', 'Reports & Transparency', 'Manage public reports and transparency documents.', ['Reports', 'Documents', 'Financial summaries', 'Publishing', 'Downloads']],
  ['/admin/messages', 'Contact Messages', 'Review and respond to website enquiries.', ['Inbox', 'Category', 'Status', 'Response', 'Archive']],
  ['/admin/content', 'Website Content', 'Manage public website copy and homepage content.', ['Homepage', 'About', 'Impact', 'FAQs', 'Footer', 'SEO']],
  ['/admin/settings', 'Foundation Settings', 'Manage organisation, payment and platform settings.', ['Foundation details', 'Contact details', 'Payment gateway', 'Receipt settings', 'Social links', 'Security']],
  ['/admin/activity', 'Activity Log', 'Audit important administrative actions.', ['Admin actions', 'Content changes', 'Donation actions', 'Security events']],
]

function withPublicLayout(element) {
  return <SiteLayout>{element}</SiteLayout>
}

export default function PlatformRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={withPublicLayout(<AboutPage />)} />
        <Route path="/causes" element={withPublicLayout(<CausesPage />)} />
        <Route path="/causes/:slug" element={withPublicLayout(<CauseDetailsPage />)} />
        <Route path="/campaigns" element={withPublicLayout(<CampaignsPage />)} />
        <Route path="/campaigns/:slug" element={withPublicLayout(<CampaignDetailsPage />)} />
        <Route path="/donate" element={withPublicLayout(<DonatePage />)} />
        <Route path="/donate/success" element={withPublicLayout(<DonationSuccessPage />)} />
        <Route path="/volunteer" element={withPublicLayout(<EngagementFormPage type="volunteer" />)} />
        <Route path="/partner" element={withPublicLayout(<EngagementFormPage type="partner" />)} />
        <Route path="/contact" element={withPublicLayout(<EngagementFormPage type="contact" />)} />
        <Route path="/impact" element={withPublicLayout(<ImpactPage />)} />
        <Route path="/transparency" element={withPublicLayout(<TransparencyPage />)} />
        <Route path="/reports" element={withPublicLayout(<ReportsPage />)} />
        <Route path="/stories" element={withPublicLayout(<StoriesPage />)} />
        <Route path="/stories/:slug" element={withPublicLayout(<StoryDetailsPage />)} />
        <Route path="/gallery" element={withPublicLayout(<GalleryPage />)} />
        <Route path="/faq" element={withPublicLayout(<FAQPage />)} />
        <Route path="/privacy" element={withPublicLayout(<LegalPage type="privacy" />)} />
        <Route path="/terms" element={withPublicLayout(<LegalPage type="terms" />)} />
        <Route path="/refund-policy" element={withPublicLayout(<LegalPage type="refund" />)} />

        {donorRoutes.map(([path, title, description, modules]) => (
          <Route key={path} path={path} element={<PortalPage portal="Donor" title={title} description={description} modules={modules} />} />
        ))}

        {adminRoutes.map(([path, title, description, modules]) => (
          <Route key={path} path={path} element={<PortalPage portal="Admin" title={title} description={description} modules={modules} />} />
        ))}

        <Route path="/404" element={withPublicLayout(<ModulePage title="Page Not Found" description="The page you requested could not be found." modules={['Return home', 'Browse causes', 'View campaigns', 'Contact support']} />)} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
