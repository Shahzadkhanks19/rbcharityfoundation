import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import HomePage from '../App'
import SiteLayout from '../components/SiteLayout'
import { AdminDashboardPage, AdminForgotPasswordPage, AdminGuard, AdminLoginPage, AdminResetPasswordPage } from '../pages/AdminPages'
import AdminCmsPage from '../pages/AdminCmsPages'
import AdminDataPage from '../pages/AdminDataPages'
import AdminEngagementPage from '../pages/AdminEngagementPage'
import { AdminActivityPage, AdminSettingsPage } from '../pages/AdminSystemPages'
import CampaignDetailsPage from '../pages/CampaignDetailsPage'
import CampaignsPage from '../pages/CampaignsPage'
import CauseDetailsPage from '../pages/CauseDetailsPage'
import CausesPage from '../pages/CausesPage'
import { ImpactPage, TransparencyPage } from '../pages/ContentPages'
import DonatePage from '../pages/DonatePage'
import { DynamicGalleryPage, DynamicReportsPage } from '../pages/DynamicPublicPages'
import { DynamicStoriesPage, DynamicStoryDetailsPage } from '../pages/DynamicStoryPages'
import EngagementFormPage from '../pages/EngagementFormPage'
import { AboutPage, DonationSuccessPage, FAQPage, LegalPage } from '../pages/PublicInfoPages'
import { ErrorPage, NotFoundPage } from '../pages/SystemPages'

const withPublicLayout = element => <SiteLayout>{element}</SiteLayout>
const cmsResources = ['campaigns','causes','stories','gallery']
const detailedDataResources = ['donations','donors','reports']
const engagementResources = ['volunteers','partners','messages']

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
        <Route path="/reports" element={withPublicLayout(<DynamicReportsPage />)} />
        <Route path="/stories" element={withPublicLayout(<DynamicStoriesPage />)} />
        <Route path="/stories/:slug" element={withPublicLayout(<DynamicStoryDetailsPage />)} />
        <Route path="/gallery" element={withPublicLayout(<DynamicGalleryPage />)} />
        <Route path="/faq" element={withPublicLayout(<FAQPage />)} />
        <Route path="/privacy" element={withPublicLayout(<LegalPage type="privacy" />)} />
        <Route path="/terms" element={withPublicLayout(<LegalPage type="terms" />)} />
        <Route path="/refund-policy" element={withPublicLayout(<LegalPage type="refund" />)} />
        <Route path="/error" element={withPublicLayout(<ErrorPage />)} />

        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin/forgot-password" element={<AdminForgotPasswordPage />} />
        <Route path="/admin/reset-password" element={<AdminResetPasswordPage />} />
        <Route element={<AdminGuard />}>
          <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
          {cmsResources.map(resource => <Route key={resource} path={`/admin/${resource}`} element={<AdminCmsPage resource={resource} />} />)}
          {detailedDataResources.map(resource => <Route key={resource} path={`/admin/${resource}`} element={<AdminDataPage resource={resource} />} />)}
          {engagementResources.map(resource => <Route key={resource} path={`/admin/${resource}`} element={<AdminEngagementPage resource={resource} />} />)}
          <Route path="/admin/settings" element={<AdminSettingsPage />} />
          <Route path="/admin/activity" element={<AdminActivityPage />} />
        </Route>

        <Route path="/404" element={withPublicLayout(<NotFoundPage />)} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
